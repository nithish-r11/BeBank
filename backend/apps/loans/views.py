import random
import string
from decimal import Decimal
from rest_framework import serializers, generics, permissions, status
from rest_framework.response import Response
from apps.accounts.models import AuditLog
from apps.accounts.views import get_client_ip
from apps.banking.models import BankAccount
from .models import LoanApplication


def calculate_emi(principal: Decimal, annual_rate: Decimal, tenure_months: int):
    r = float(annual_rate) / (12.0 * 100.0)
    p = float(principal)
    n = int(tenure_months)
    if r == 0:
        emi = p / n
    else:
        emi = p * r * ((1 + r) ** n) / (((1 + r) ** n) - 1)
    total_payable = emi * n
    return Decimal(str(round(emi, 2))), Decimal(str(round(total_payable, 2)))


class LoanApplicationSerializer(serializers.ModelSerializer):
    loan_type_display = serializers.CharField(source='get_loan_type_display', read_only=True)
    customer_name = serializers.CharField(source='user.full_name', read_only=True)
    customer_id = serializers.CharField(source='user.customer_id', read_only=True)
    account_number = serializers.CharField(source='disbursal_account.account_number', read_only=True)

    class Meta:
        model = LoanApplication
        fields = [
            'id', 'user', 'customer_name', 'customer_id', 'disbursal_account',
            'account_number', 'loan_number', 'loan_type', 'loan_type_display',
            'principal_amount', 'interest_rate', 'tenure_months', 'emi_amount',
            'total_payable', 'outstanding_balance', 'purpose', 'monthly_income',
            'employment_type', 'status', 'admin_remarks', 'applied_at', 'reviewed_at'
        ]
        read_only_fields = [
            'id', 'user', 'loan_number', 'interest_rate', 'emi_amount',
            'total_payable', 'outstanding_balance', 'status', 'admin_remarks',
            'applied_at', 'reviewed_at'
        ]


class LoanListCreateView(generics.ListCreateAPIView):
    serializer_class = LoanApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LoanApplication.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        disbursal_account_id = request.data.get('disbursal_account')
        loan_type = request.data.get('loan_type', 'PERSONAL')
        principal = Decimal(str(request.data.get('principal_amount', '100000')))
        tenure_months = int(request.data.get('tenure_months', 24))
        purpose = request.data.get('purpose', 'Personal financial requirement')
        monthly_income = Decimal(str(request.data.get('monthly_income', '85000')))
        employment_type = request.data.get('employment_type', 'Salaried')

        account = BankAccount.objects.filter(id=disbursal_account_id, user=user).first()
        if not account:
            account = BankAccount.objects.filter(user=user).first()
        if not account:
            return Response({'detail': 'No valid bank account found for loan disbursal.'}, status=status.HTTP_400_BAD_REQUEST)

        rate_map = {
            'HOME': Decimal('8.65'),
            'VEHICLE': Decimal('9.15'),
            'EDUCATION': Decimal('8.90'),
            'BUSINESS': Decimal('11.25'),
            'PERSONAL': Decimal('10.75'),
        }
        rate = rate_map.get(loan_type, Decimal('10.75'))
        emi, total_payable = calculate_emi(principal, rate, tenure_months)
        loan_num = 'LN' + ''.join(random.choices(string.digits, k=10))

        loan = LoanApplication.objects.create(
            user=user,
            disbursal_account=account,
            loan_number=loan_num,
            loan_type=loan_type,
            principal_amount=principal,
            interest_rate=rate,
            tenure_months=tenure_months,
            emi_amount=emi,
            total_payable=total_payable,
            outstanding_balance=total_payable,
            purpose=purpose,
            monthly_income=monthly_income,
            employment_type=employment_type,
            status='PENDING_APPROVAL',
        )

        AuditLog.objects.create(
            user=user,
            action='LOAN_APPLIED',
            description=f"Submitted {loan.get_loan_type_display()} application #{loan_num} for INR {principal:,.2f}",
            ip_address=get_client_ip(request),
            status='SUCCESS',
        )
        return Response(LoanApplicationSerializer(loan).data, status=status.HTTP_201_CREATED)
