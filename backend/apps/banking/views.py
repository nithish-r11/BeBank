import random
import string
from datetime import date, timedelta
from decimal import Decimal
from django.db import transaction as db_transaction
from django.db.models import Sum
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.accounts.models import AuditLog
from apps.accounts.views import get_client_ip
from .models import BankAccount, Beneficiary, Transaction, FixedDeposit, BillPayment, generate_reference_id
from .serializers import (
    BankAccountSerializer, BeneficiarySerializer, TransactionSerializer,
    FundTransferRequestSerializer, FixedDepositSerializer, BillPaymentSerializer
)


class CustomerDashboardOverviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        accounts = BankAccount.objects.filter(user=user)
        total_balance = accounts.aggregate(total=Sum('balance'))['total'] or Decimal('0.00')
        deposits = FixedDeposit.objects.filter(user=user, status='ACTIVE')
        total_deposits = deposits.aggregate(total=Sum('principal_amount'))['total'] or Decimal('0.00')
        recent_txs = Transaction.objects.filter(account__user=user).select_related('account')[:10]
        beneficiaries = Beneficiary.objects.filter(user=user)[:6]

        return Response({
            'total_balance': total_balance,
            'total_deposits': total_deposits,
            'accounts': BankAccountSerializer(accounts, many=True).data,
            'recent_transactions': TransactionSerializer(recent_txs, many=True).data,
            'quick_beneficiaries': BeneficiarySerializer(beneficiaries, many=True).data,
            'deposits_count': deposits.count(),
        })


class BankAccountListView(generics.ListAPIView):
    serializer_class = BankAccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BankAccount.objects.filter(user=self.request.user)


class UpdateAccountLimitView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        account = BankAccount.objects.filter(pk=pk, user=request.user).first()
        if not account:
            return Response({'detail': 'Account not found.'}, status=status.HTTP_404_NOT_FOUND)
        new_limit = Decimal(str(request.data.get('daily_transfer_limit', account.daily_transfer_limit)))
        if new_limit < Decimal('5000') or new_limit > Decimal('2000000'):
            return Response({'detail': 'Daily transfer limit must be between INR 5,000 and INR 20,00,000.'}, status=status.HTTP_400_BAD_REQUEST)
        account.daily_transfer_limit = new_limit
        account.save(update_fields=['daily_transfer_limit'])
        return Response(BankAccountSerializer(account).data)


class BeneficiaryListCreateView(generics.ListCreateAPIView):
    serializer_class = BeneficiarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Beneficiary.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, is_verified=True)


class BeneficiaryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BeneficiarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Beneficiary.objects.filter(user=self.request.user)


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Transaction.objects.filter(account__user=self.request.user).select_related('account')
        account_id = self.request.query_params.get('account_id')
        tx_type = self.request.query_params.get('transaction_type')
        channel = self.request.query_params.get('channel')
        search = self.request.query_params.get('search')

        if account_id:
            qs = qs.filter(account_id=account_id)
        if tx_type in ('CREDIT', 'DEBIT'):
            qs = qs.filter(transaction_type=tx_type)
        if channel:
            qs = qs.filter(channel=channel)
        if search:
            qs = qs.filter(counterparty_name__icontains=search) | qs.filter(reference_id__icontains=search) | qs.filter(description__icontains=search)
        return qs[:100]


class FundTransferView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = FundTransferRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = request.user

        # 1. Verify 4-digit MPIN
        if not user.check_mpin(data['mpin']):
            AuditLog.objects.create(
                user=user,
                action='TRANSFER',
                description=f"Failed transfer attempt of INR {data['amount']}: Invalid MPIN",
                ip_address=get_client_ip(request),
                status='FAILED',
            )
            return Response({'detail': 'Invalid 4-digit Transaction MPIN. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)

        amount = data['amount']
        if amount <= Decimal('0.00'):
            return Response({'detail': 'Transfer amount must be greater than zero.'}, status=status.HTTP_400_BAD_REQUEST)

        with db_transaction.atomic():
            source_account = BankAccount.objects.select_for_update().filter(
                id=data['source_account_id'], user=user
            ).first()

            if not source_account:
                return Response({'detail': 'Source bank account not found.'}, status=status.HTTP_404_NOT_FOUND)

            if source_account.status != 'ACTIVE':
                return Response(
                    {'detail': f'Source account is currently {source_account.status}. Transfers are disabled.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if amount > source_account.daily_transfer_limit:
                return Response(
                    {'detail': f'Amount exceeds your daily transfer limit of INR {source_account.daily_transfer_limit:,.2f}.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if source_account.balance < amount:
                return Response(
                    {'detail': 'Insufficient account balance to complete this transfer.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Deduct from source account
            source_account.balance -= amount
            source_account.save(update_fields=['balance'])

            ref_id = generate_reference_id('TXN')
            tx_status = 'FLAGGED' if amount >= Decimal('500000.00') else 'COMPLETED'

            debit_tx = Transaction.objects.create(
                reference_id=ref_id,
                account=source_account,
                transaction_type='DEBIT',
                channel=data['channel'],
                category=data.get('category', 'TRANSFER'),
                amount=amount,
                balance_after=source_account.balance,
                counterparty_name=data['recipient_name'],
                counterparty_account=data['recipient_account'],
                counterparty_ifsc=data.get('recipient_ifsc', 'BEBK0000101'),
                description=data.get('description') or f"{data['channel']} Transfer to {data['recipient_name']}",
                status=tx_status,
                is_demo=True,
            )

            # If recipient account is another internal BeBank account, credit it automatically
            dest_account = BankAccount.objects.select_for_update().filter(
                account_number=data['recipient_account']
            ).exclude(id=source_account.id).first()

            if dest_account and dest_account.status == 'ACTIVE':
                dest_account.balance += amount
                dest_account.save(update_fields=['balance'])
                Transaction.objects.create(
                    reference_id=generate_reference_id('CR'),
                    account=dest_account,
                    transaction_type='CREDIT',
                    channel=data['channel'],
                    category='TRANSFER',
                    amount=amount,
                    balance_after=dest_account.balance,
                    counterparty_name=user.full_name,
                    counterparty_account=source_account.account_number,
                    counterparty_ifsc=source_account.ifsc_code,
                    description=f"Received via {data['channel']} from {user.full_name} (Ref: {ref_id})",
                    status='COMPLETED',
                    is_demo=True,
                )

            AuditLog.objects.create(
                user=user,
                action='TRANSFER',
                description=f"Transferred INR {amount:,.2f} to {data['recipient_name']} ({data['recipient_account']}) via {data['channel']} [Ref: {ref_id}]",
                ip_address=get_client_ip(request),
                status='SUCCESS',
                metadata={'reference_id': ref_id, 'amount': str(amount), 'channel': data['channel']},
            )

        return Response({
            'detail': 'Demo Fund Transfer Completed Successfully!',
            'transaction': TransactionSerializer(debit_tx).data,
            'updated_balance': source_account.balance,
        }, status=status.HTTP_201_CREATED)


class FixedDepositListCreateView(generics.ListCreateAPIView):
    serializer_class = FixedDepositSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FixedDeposit.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        source_account_id = request.data.get('source_account')
        deposit_type = request.data.get('deposit_type', 'FD')
        principal = Decimal(str(request.data.get('principal_amount', '0')))
        tenure_months = int(request.data.get('tenure_months', 12))
        auto_renew = bool(request.data.get('auto_renew', True))

        if principal < Decimal('1000.00'):
            return Response({'detail': 'Minimum deposit amount is INR 1,000.'}, status=status.HTTP_400_BAD_REQUEST)

        # Tiered BeBank interest rate schedule
        if tenure_months < 6:
            rate = Decimal('6.25')
        elif tenure_months < 12:
            rate = Decimal('6.80')
        elif tenure_months <= 24:
            rate = Decimal('7.25')
        else:
            rate = Decimal('7.40')

        with db_transaction.atomic():
            account = BankAccount.objects.select_for_update().filter(id=source_account_id, user=user).first()
            if not account:
                return Response({'detail': 'Source account not found.'}, status=status.HTTP_404_NOT_FOUND)
            if account.balance < principal:
                return Response({'detail': 'Insufficient balance in selected account to book deposit.'}, status=status.HTTP_400_BAD_REQUEST)

            account.balance -= principal
            account.save(update_fields=['balance'])

            # Compound interest calculation (quarterly compounding approximation)
            years = Decimal(str(tenure_months)) / Decimal('12.0')
            interest_earned = (principal * rate * years) / Decimal('100.0')
            maturity_amount = (principal + interest_earned).quantize(Decimal('0.01'))
            maturity_date = date.today() + timedelta(days=30 * tenure_months)
            dep_num = 'FD' + ''.join(random.choices(string.digits, k=10))

            fd = FixedDeposit.objects.create(
                user=user,
                source_account=account,
                deposit_number=dep_num,
                deposit_type=deposit_type,
                principal_amount=principal,
                interest_rate=rate,
                tenure_months=tenure_months,
                maturity_amount=maturity_amount,
                maturity_date=maturity_date,
                auto_renew=auto_renew,
                status='ACTIVE',
            )

            Transaction.objects.create(
                reference_id=generate_reference_id('FD'),
                account=account,
                transaction_type='DEBIT',
                channel='FD_BOOKING',
                category='DEPOSIT',
                amount=principal,
                balance_after=account.balance,
                counterparty_name=f"BeBank {deposit_type} #{dep_num}",
                counterparty_account=dep_num,
                counterparty_ifsc=account.ifsc_code,
                description=f"Opened {deposit_type} for {tenure_months} months @ {rate}% p.a.",
                status='COMPLETED',
            )

            AuditLog.objects.create(
                user=user,
                action='FD_CREATED',
                description=f"Opened {deposit_type} #{dep_num} of INR {principal:,.2f} @ {rate}% p.a.",
                ip_address=get_client_ip(request),
                status='SUCCESS',
            )

        return Response(FixedDepositSerializer(fd).data, status=status.HTTP_201_CREATED)


class BillPaymentListCreateView(generics.ListCreateAPIView):
    serializer_class = BillPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BillPayment.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        account_id = request.data.get('account')
        biller_category = request.data.get('biller_category', 'ELECTRICITY')
        biller_name = request.data.get('biller_name', 'TANGEDCO Electricity')
        consumer_number = request.data.get('consumer_number', '')
        amount = Decimal(str(request.data.get('amount', '0')))
        mpin = str(request.data.get('mpin', '')).strip()

        if not user.check_mpin(mpin):
            return Response({'detail': 'Invalid 4-digit Transaction MPIN.'}, status=status.HTTP_400_BAD_REQUEST)

        if amount <= Decimal('0'):
            return Response({'detail': 'Bill amount must be greater than zero.'}, status=status.HTTP_400_BAD_REQUEST)

        with db_transaction.atomic():
            account = BankAccount.objects.select_for_update().filter(id=account_id, user=user).first()
            if not account:
                return Response({'detail': 'Account not found.'}, status=status.HTTP_404_NOT_FOUND)
            if account.balance < amount:
                return Response({'detail': 'Insufficient balance for bill payment.'}, status=status.HTTP_400_BAD_REQUEST)

            account.balance -= amount
            account.save(update_fields=['balance'])

            ref_id = generate_reference_id('BBPS')
            bill = BillPayment.objects.create(
                user=user,
                account=account,
                biller_category=biller_category,
                biller_name=biller_name,
                consumer_number=consumer_number,
                amount=amount,
                reference_id=ref_id,
                auto_pay=bool(request.data.get('auto_pay', False)),
            )

            Transaction.objects.create(
                reference_id=ref_id,
                account=account,
                transaction_type='DEBIT',
                channel='BILL_PAY',
                category='UTILITIES',
                amount=amount,
                balance_after=account.balance,
                counterparty_name=biller_name,
                counterparty_account=consumer_number,
                counterparty_ifsc='BBPS0000001',
                description=f"Bill Pay: {biller_name} (Consumer #{consumer_number})",
                status='COMPLETED',
            )

            AuditLog.objects.create(
                user=user,
                action='BILL_PAY',
                description=f"Paid INR {amount:,.2f} to {biller_name} ({consumer_number})",
                ip_address=get_client_ip(request),
                status='SUCCESS',
            )

        return Response(BillPaymentSerializer(bill).data, status=status.HTTP_201_CREATED)
