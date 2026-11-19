from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, AuditLog


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'customer_id', 'email', 'full_name', 'phone_number',
            'role', 'kyc_status', 'pan_number', 'aadhaar_masked',
            'date_of_birth', 'address', 'city', 'state', 'pincode',
            'two_factor_enabled', 'is_locked', 'last_login_ip', 'created_at'
        ]
        read_only_fields = ['id', 'customer_id', 'email', 'role', 'kyc_status', 'is_locked', 'created_at']


class RegisterCustomerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    mpin = serializers.CharField(write_only=True, min_length=4, max_length=6, default='1234')
    initial_deposit = serializers.DecimalField(max_digits=14, decimal_places=2, required=False, default=25000.00)

    class Meta:
        model = User
        fields = [
            'email', 'full_name', 'phone_number', 'password', 'mpin',
            'pan_number', 'aadhaar_masked', 'address', 'city', 'state', 'pincode',
            'initial_deposit'
        ]

    def create(self, validated_data):
        mpin = validated_data.pop('mpin', '1234')
        initial_deposit = validated_data.pop('initial_deposit', 25000.00)
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        user.set_mpin(mpin)
        user.save()

        # Automatically open a Primary BeBank-style Savings Account & Platinum Debit Card
        from apps.banking.models import BankAccount, Transaction
        from apps.cards.models import BankCard
        import random

        acct_num = '2026' + ''.join(random.choices('0123456789', k=8))
        while BankAccount.objects.filter(account_number=acct_num).exists():
            acct_num = '2026' + ''.join(random.choices('0123456789', k=8))

        account = BankAccount.objects.create(
            user=user,
            account_number=acct_num,
            account_type='SAVINGS',
            ifsc_code='BEBK0000101',
            branch_name=f"{user.city or 'Chennai'} Main Branch",
            balance=initial_deposit,
            daily_transfer_limit=200000.00,
        )

        Transaction.objects.create(
            account=account,
            transaction_type='CREDIT',
            channel='INTERNAL',
            category='DEPOSIT',
            amount=initial_deposit,
            balance_after=initial_deposit,
            counterparty_name='BeBank Welcome Onboarding Credit (Demo)',
            counterparty_account='BEBANK-TREASURY',
            counterparty_ifsc='BEBK0000001',
            description='Welcome Demo Opening Balance Credit',
            status='COMPLETED',
        )

        last4 = ''.join(random.choices('0123456789', k=4))
        BankCard.objects.create(
            user=user,
            linked_account=account,
            card_number_masked=f"4532 •••• •••• {last4}",
            card_type='DEBIT_PLATINUM',
            network='VISA',
            cardholder_name=user.full_name.upper(),
            expiry_month=11,
            expiry_year=2030,
        )
        return user


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(help_text="Email address or Customer ID (e.g. BEB1002045)")
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get('identifier', '').strip()
        password = attrs.get('password', '')

        user_obj = User.objects.filter(email__iexact=identifier).first()
        if not user_obj:
            user_obj = User.objects.filter(customer_id__iexact=identifier).first()

        if not user_obj:
            raise serializers.ValidationError("Invalid Customer ID / Email or Password.")

        if user_obj.is_locked:
            raise serializers.ValidationError("Your account has been locked for security. Please contact BeBank Admin.")

        user = authenticate(username=user_obj.email, password=password)
        if not user:
            user_obj.failed_login_attempts += 1
            if user_obj.failed_login_attempts >= 5:
                user_obj.is_locked = True
            user_obj.save(update_fields=['failed_login_attempts', 'is_locked'])
            raise serializers.ValidationError("Invalid Customer ID / Email or Password.")

        user.failed_login_attempts = 0
        user.save(update_fields=['failed_login_attempts'])
        attrs['user'] = user
        return attrs


class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    customer_id = serializers.CharField(source='user.customer_id', read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_name', 'customer_id', 'action',
            'description', 'ip_address', 'status', 'metadata', 'created_at'
        ]
