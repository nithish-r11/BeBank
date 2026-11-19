from rest_framework import serializers
from .models import BankAccount, Beneficiary, Transaction, FixedDeposit, BillPayment


class BankAccountSerializer(serializers.ModelSerializer):
    account_type_display = serializers.CharField(source='get_account_type_display', read_only=True)

    class Meta:
        model = BankAccount
        fields = [
            'id', 'account_number', 'account_type', 'account_type_display',
            'ifsc_code', 'branch_name', 'balance', 'currency', 'status',
            'daily_transfer_limit', 'nominee_name', 'created_at'
        ]
        read_only_fields = ['id', 'account_number', 'ifsc_code', 'balance', 'status', 'created_at']


class BeneficiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficiary
        fields = [
            'id', 'name', 'nickname', 'account_number', 'bank_name',
            'ifsc_code', 'upi_id', 'daily_limit', 'is_favorite',
            'is_verified', 'created_at'
        ]
        read_only_fields = ['id', 'is_verified', 'created_at']


class TransactionSerializer(serializers.ModelSerializer):
    account_number = serializers.CharField(source='account.account_number', read_only=True)
    customer_name = serializers.CharField(source='account.user.full_name', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'reference_id', 'account', 'account_number', 'customer_name',
            'transaction_type', 'channel', 'category', 'amount', 'balance_after',
            'counterparty_name', 'counterparty_account', 'counterparty_ifsc',
            'description', 'status', 'is_demo', 'created_at'
        ]


class FundTransferRequestSerializer(serializers.Serializer):
    source_account_id = serializers.IntegerField()
    recipient_name = serializers.CharField(max_length=140)
    recipient_account = serializers.CharField(max_length=40)
    recipient_ifsc = serializers.CharField(max_length=20, required=False, allow_blank=True, default='BEBK0000101')
    channel = serializers.ChoiceField(choices=['IMPS', 'NEFT', 'RTGS', 'UPI', 'INTERNAL'], default='IMPS')
    category = serializers.ChoiceField(
        choices=['TRANSFER', 'UTILITIES', 'SHOPPING', 'FOOD', 'HEALTH'],
        default='TRANSFER',
        required=False
    )
    amount = serializers.DecimalField(max_digits=14, decimal_places=2)
    description = serializers.CharField(max_length=255, required=False, allow_blank=True, default='Fund Transfer')
    mpin = serializers.CharField(max_length=6)


class FixedDepositSerializer(serializers.ModelSerializer):
    source_account_number = serializers.CharField(source='source_account.account_number', read_only=True)

    class Meta:
        model = FixedDeposit
        fields = [
            'id', 'source_account', 'source_account_number', 'deposit_number',
            'deposit_type', 'principal_amount', 'interest_rate', 'tenure_months',
            'maturity_amount', 'maturity_date', 'auto_renew', 'status', 'created_at'
        ]
        read_only_fields = [
            'id', 'deposit_number', 'interest_rate', 'maturity_amount',
            'maturity_date', 'status', 'created_at'
        ]


class BillPaymentSerializer(serializers.ModelSerializer):
    account_number = serializers.CharField(source='account.account_number', read_only=True)

    class Meta:
        model = BillPayment
        fields = [
            'id', 'account', 'account_number', 'biller_category', 'biller_name',
            'consumer_number', 'amount', 'reference_id', 'auto_pay', 'created_at'
        ]
        read_only_fields = ['id', 'reference_id', 'created_at']
