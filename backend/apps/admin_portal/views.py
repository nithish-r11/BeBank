from decimal import Decimal
from django.utils import timezone
from django.db import transaction as db_transaction
from django.db.models import Sum, Count
from rest_framework import permissions, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.accounts.models import User, AuditLog
from apps.accounts.serializers import UserProfileSerializer, AuditLogSerializer
from apps.accounts.views import get_client_ip
from apps.banking.models import BankAccount, Transaction, FixedDeposit, generate_reference_id
from apps.banking.serializers import BankAccountSerializer, TransactionSerializer
from apps.loans.models import LoanApplication
from apps.loans.views import LoanApplicationSerializer
from apps.support.models import ServiceRequest
from apps.support.views import ServiceRequestSerializer


class IsBankAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'ADMIN')


class AdminDashboardSummaryView(APIView):
    permission_classes = [IsBankAdmin]

    def get(self, request):
        total_customers = User.objects.filter(role='CUSTOMER').count()
        pending_kyc = User.objects.filter(role='CUSTOMER', kyc_status='PENDING').count()
        total_accounts = BankAccount.objects.count()
        total_deposits_aum = BankAccount.objects.aggregate(s=Sum('balance'))['s'] or Decimal('0.00')
        total_term_deposits = FixedDeposit.objects.filter(status='ACTIVE').aggregate(s=Sum('principal_amount'))['s'] or Decimal('0.00')
        total_transactions = Transaction.objects.count()
        flagged_transactions = Transaction.objects.filter(status='FLAGGED').count()
        pending_loans = LoanApplication.objects.filter(status='PENDING_APPROVAL').count()
        open_tickets = ServiceRequest.objects.filter(status__in=['OPEN', 'IN_PROGRESS']).count()

        channel_breakdown = list(
            Transaction.objects.values('channel').annotate(count=Count('id'), volume=Sum('amount')).order_by('-volume')
        )

        return Response({
            'kpis': {
                'total_customers': total_customers,
                'pending_kyc': pending_kyc,
                'total_accounts': total_accounts,
                'total_deposits_aum': total_deposits_aum,
                'total_term_deposits': total_term_deposits,
                'total_transactions': total_transactions,
                'flagged_transactions': flagged_transactions,
                'pending_loans': pending_loans,
                'open_tickets': open_tickets,
            },
            'channel_breakdown': channel_breakdown,
            'recent_transactions': TransactionSerializer(Transaction.objects.select_related('account', 'account__user')[:12], many=True).data,
            'recent_audit_logs': AuditLogSerializer(AuditLog.objects.select_related('user')[:12], many=True).data,
        })


class AdminCustomerListView(APIView):
    permission_classes = [IsBankAdmin]

    def get(self, request):
        customers = User.objects.filter(role='CUSTOMER').prefetch_related('accounts')
        results = []
        for c in customers:
            profile = UserProfileSerializer(c).data
            profile['accounts'] = BankAccountSerializer(c.accounts.all(), many=True).data
            results.append(profile)
        return Response(results)


class AdminCustomerActionView(APIView):
    permission_classes = [IsBankAdmin]

    def patch(self, request, pk):
        customer = User.objects.filter(pk=pk, role='CUSTOMER').first()
        if not customer:
            return Response({'detail': 'Customer not found.'}, status=status.HTTP_404_NOT_FOUND)

        action_type = request.data.get('action_type')
        if action_type == 'UPDATE_KYC':
            new_kyc = request.data.get('kyc_status', 'VERIFIED')
            customer.kyc_status = new_kyc
            customer.save(update_fields=['kyc_status'])
            desc = f"Admin updated KYC status for {customer.full_name} ({customer.customer_id}) to {new_kyc}"
        elif action_type == 'TOGGLE_LOCK':
            customer.is_locked = not customer.is_locked
            if not customer.is_locked:
                customer.failed_login_attempts = 0
            customer.save(update_fields=['is_locked', 'failed_login_attempts'])
            desc = f"Admin {'locked' if customer.is_locked else 'unlocked'} customer {customer.customer_id}"
        elif action_type == 'TOGGLE_ACCOUNT_STATUS':
            account_id = request.data.get('account_id')
            acct = BankAccount.objects.filter(id=account_id, user=customer).first()
            if not acct:
                return Response({'detail': 'Bank account not found.'}, status=status.HTTP_404_NOT_FOUND)
            acct.status = 'FROZEN' if acct.status == 'ACTIVE' else 'ACTIVE'
            acct.save(update_fields=['status'])
            desc = f"Admin changed account {acct.account_number} status to {acct.status}"
        elif action_type == 'DEMO_TOPUP':
            account_id = request.data.get('account_id')
            amount = Decimal(str(request.data.get('amount', '10000')))
            acct = BankAccount.objects.filter(id=account_id, user=customer).first()
            if not acct:
                return Response({'detail': 'Bank account not found.'}, status=status.HTTP_404_NOT_FOUND)
            acct.balance += amount
            acct.save(update_fields=['balance'])
            Transaction.objects.create(
                reference_id=generate_reference_id('ADM'),
                account=acct,
                transaction_type='CREDIT',
                channel='INTERNAL',
                category='DEPOSIT',
                amount=amount,
                balance_after=acct.balance,
                counterparty_name='BeBank Treasury Demo Credit',
                counterparty_account='BEBANK-TREASURY',
                counterparty_ifsc='BEBK0000001',
                description=f"Admin Demo Balance Top-Up by {request.user.full_name}",
                status='COMPLETED',
                is_demo=True,
            )
            desc = f"Admin credited demo INR {amount:,.2f} to account {acct.account_number}"
        else:
            return Response({'detail': 'Unsupported admin action.'}, status=status.HTTP_400_BAD_REQUEST)

        AuditLog.objects.create(
            user=request.user,
            action='ADMIN_ACTION',
            description=desc,
            ip_address=get_client_ip(request),
            status='SUCCESS',
        )
        profile = UserProfileSerializer(customer).data
        profile['accounts'] = BankAccountSerializer(customer.accounts.all(), many=True).data
        return Response({'detail': desc, 'customer': profile})


class AdminTransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsBankAdmin]

    def get_queryset(self):
        qs = Transaction.objects.select_related('account', 'account__user').all()
        status_filter = self.request.query_params.get('status')
        channel_filter = self.request.query_params.get('channel')
        if status_filter:
            qs = qs.filter(status=status_filter)
        if channel_filter:
            qs = qs.filter(channel=channel_filter)
        return qs[:150]


class AdminTransactionFlagView(APIView):
    permission_classes = [IsBankAdmin]

    def patch(self, request, pk):
        tx = Transaction.objects.filter(pk=pk).first()
        if not tx:
            return Response({'detail': 'Transaction not found.'}, status=status.HTTP_404_NOT_FOUND)
        new_status = request.data.get('status', 'COMPLETED')
        tx.status = new_status
        tx.save(update_fields=['status'])

        AuditLog.objects.create(
            user=request.user,
            action='ADMIN_ACTION',
            description=f"Admin marked transaction {tx.reference_id} as {new_status}",
            ip_address=get_client_ip(request),
            status='SUCCESS',
        )
        return Response(TransactionSerializer(tx).data)


class AdminLoanListView(generics.ListAPIView):
    serializer_class = LoanApplicationSerializer
    permission_classes = [IsBankAdmin]
    queryset = LoanApplication.objects.select_related('user', 'disbursal_account').all()


class AdminLoanReviewView(APIView):
    permission_classes = [IsBankAdmin]

    def patch(self, request, pk):
        with db_transaction.atomic():
            loan = LoanApplication.objects.select_for_update().filter(pk=pk).first()
            if not loan:
                return Response({'detail': 'Loan application not found.'}, status=status.HTTP_404_NOT_FOUND)

            decision = request.data.get('status')  # 'APPROVED' or 'REJECTED'
            remarks = request.data.get('admin_remarks', 'Reviewed by BeBank Credit Committee')

            if decision not in ('APPROVED', 'REJECTED'):
                return Response({'detail': 'Invalid decision status.'}, status=status.HTTP_400_BAD_REQUEST)

            was_already_approved = loan.status in ('APPROVED', 'ACTIVE')
            loan.status = decision
            loan.admin_remarks = remarks
            loan.reviewed_at = timezone.now()
            loan.save()

            # If newly approved, disburse demo loan amount directly to customer's bank account
            if decision == 'APPROVED' and not was_already_approved:
                acct = BankAccount.objects.select_for_update().get(id=loan.disbursal_account_id)
                acct.balance += loan.principal_amount
                acct.save(update_fields=['balance'])

                Transaction.objects.create(
                    reference_id=generate_reference_id('LNCR'),
                    account=acct,
                    transaction_type='CREDIT',
                    channel='LOAN_DISBURSAL',
                    category='DEPOSIT',
                    amount=loan.principal_amount,
                    balance_after=acct.balance,
                    counterparty_name=f"BeBank Loan Disbursal ({loan.loan_number})",
                    counterparty_account=loan.loan_number,
                    counterparty_ifsc=acct.ifsc_code,
                    description=f"{loan.get_loan_type_display()} Disbursal Approved by Admin",
                    status='COMPLETED',
                    is_demo=True,
                )

            AuditLog.objects.create(
                user=request.user,
                action='ADMIN_ACTION',
                description=f"Admin {decision.lower()} loan #{loan.loan_number} (INR {loan.principal_amount:,.2f}) for {loan.user.full_name}",
                ip_address=get_client_ip(request),
                status='SUCCESS',
            )

        return Response(LoanApplicationSerializer(loan).data)


class AdminSupportListView(generics.ListAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsBankAdmin]
    queryset = ServiceRequest.objects.select_related('user').all()


class AdminSupportResolveView(APIView):
    permission_classes = [IsBankAdmin]

    def patch(self, request, pk):
        ticket = ServiceRequest.objects.filter(pk=pk).first()
        if not ticket:
            return Response({'detail': 'Service request not found.'}, status=status.HTTP_404_NOT_FOUND)

        ticket.status = request.data.get('status', 'RESOLVED')
        ticket.admin_response = request.data.get('admin_response', 'Resolved by BeBank Customer Operations Desk.')
        ticket.save(update_fields=['status', 'admin_response', 'updated_at'])

        AuditLog.objects.create(
            user=request.user,
            action='ADMIN_ACTION',
            description=f"Admin updated service ticket #{ticket.ticket_number} to {ticket.status}",
            ip_address=get_client_ip(request),
            status='SUCCESS',
        )
        return Response(ServiceRequestSerializer(ticket).data)


class AdminAuditLogListView(generics.ListAPIView):
    serializer_class = AuditLogSerializer
    permission_classes = [IsBankAdmin]
    queryset = AuditLog.objects.select_related('user').all()[:200]
