import random
import string
from decimal import Decimal
from django.db import models
from django.conf import settings


def generate_reference_id(prefix='TXN'):
    return f"{prefix}{''.join(random.choices(string.digits, k=11))}"


class BankAccount(models.Model):
    ACCOUNT_TYPES = (
        ('SAVINGS', 'BeBank Smart Savings Account'),
        ('CURRENT', 'Corporate Current Account'),
        ('SALARY', 'Privilege Salary Account'),
    )
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('FROZEN', 'Frozen'),
        ('CLOSED', 'Closed'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='accounts')
    account_number = models.CharField(max_length=20, unique=True, db_index=True)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES, default='SAVINGS')
    ifsc_code = models.CharField(max_length=15, default='BEBK0000101')
    branch_name = models.CharField(max_length=120, default='Chennai Anna Salai Main Branch')
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    currency = models.CharField(max_length=5, default='INR')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='ACTIVE')
    daily_transfer_limit = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('200000.00'))
    nominee_name = models.CharField(max_length=120, blank=True, default='Meera Mehta')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.account_number} ({self.get_account_type_display()}) - INR {self.balance}"


class Beneficiary(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='beneficiaries')
    name = models.CharField(max_length=120)
    nickname = models.CharField(max_length=60, blank=True)
    account_number = models.CharField(max_length=24)
    bank_name = models.CharField(max_length=100, default='BeBank')
    ifsc_code = models.CharField(max_length=15, default='BEBK0000101')
    upi_id = models.CharField(max_length=80, blank=True)
    daily_limit = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('100000.00'))
    is_favorite = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_favorite', 'name']

    def __str__(self):
        return f"{self.name} ({self.bank_name} - {self.account_number})"


class Transaction(models.Model):
    TYPE_CHOICES = (
        ('CREDIT', 'Credit'),
        ('DEBIT', 'Debit'),
    )
    CHANNEL_CHOICES = (
        ('IMPS', 'IMPS Instant Transfer'),
        ('NEFT', 'NEFT National Transfer'),
        ('RTGS', 'RTGS High-Value Transfer'),
        ('UPI', 'UPI Instant Pay'),
        ('INTERNAL', 'BeBank Internal Transfer'),
        ('BILL_PAY', 'BBPS Utility Bill Payment'),
        ('FD_BOOKING', 'Fixed/Recurring Deposit Booking'),
        ('LOAN_DISBURSAL', 'Loan Disbursal Credit'),
    )
    CATEGORY_CHOICES = (
        ('TRANSFER', 'Fund Transfer'),
        ('UTILITIES', 'Bills & Utilities'),
        ('SALARY', 'Salary & Income'),
        ('SHOPPING', 'Shopping & Retail'),
        ('DEPOSIT', 'Term Deposit'),
        ('FOOD', 'Dining & Groceries'),
        ('HEALTH', 'Healthcare & Insurance'),
    )
    STATUS_CHOICES = (
        ('COMPLETED', 'Completed'),
        ('PENDING', 'Pending'),
        ('FAILED', 'Failed'),
        ('FLAGGED', 'Flagged for Review'),
    )

    reference_id = models.CharField(max_length=25, unique=True, default=generate_reference_id, db_index=True)
    account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default='IMPS')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='TRANSFER')
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    balance_after = models.DecimalField(max_digits=15, decimal_places=2)
    counterparty_name = models.CharField(max_length=140)
    counterparty_account = models.CharField(max_length=40, blank=True)
    counterparty_ifsc = models.CharField(max_length=20, blank=True)
    description = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='COMPLETED')
    is_demo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at', '-id']

    def __str__(self):
        return f"{self.reference_id} | {self.transaction_type} INR {self.amount}"


class FixedDeposit(models.Model):
    DEPOSIT_TYPES = (
        ('FD', 'Fixed Deposit (Term Deposit)'),
        ('RD', 'Recurring Deposit (Monthly)'),
    )
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('MATURED', 'Matured'),
        ('PREMATURE_CLOSED', 'Prematurely Closed'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='deposits')
    source_account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='deposits')
    deposit_number = models.CharField(max_length=24, unique=True)
    deposit_type = models.CharField(max_length=10, choices=DEPOSIT_TYPES, default='FD')
    principal_amount = models.DecimalField(max_digits=14, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('7.25'))
    tenure_months = models.PositiveIntegerField(default=12)
    maturity_amount = models.DecimalField(max_digits=15, decimal_places=2)
    maturity_date = models.DateField()
    auto_renew = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class BillPayment(models.Model):
    BILLER_CATEGORIES = (
        ('ELECTRICITY', 'Electricity Board (TANGEDCO / BESCOM)'),
        ('MOBILE_POSTPAID', 'Mobile Postpaid / Prepaid Recharge'),
        ('BROADBAND', 'Fiber Broadband & Landline'),
        ('WATER', 'Metro Water & Sewage Tax'),
        ('FASTAG', 'NHAI FASTag Recharge'),
        ('DTH', 'DTH Television Recharge'),
        ('INSURANCE', 'Life & Health Insurance Premium'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bill_payments')
    account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='bill_payments')
    biller_category = models.CharField(max_length=25, choices=BILLER_CATEGORIES)
    biller_name = models.CharField(max_length=120)
    consumer_number = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    reference_id = models.CharField(max_length=25, unique=True)
    auto_pay = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
