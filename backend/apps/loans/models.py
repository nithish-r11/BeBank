from decimal import Decimal
from django.db import models
from django.conf import settings
from apps.banking.models import BankAccount


class LoanApplication(models.Model):
    LOAN_TYPES = (
        ('PERSONAL', 'Instant Personal Loan'),
        ('HOME', 'BeBank Dream Home Loan'),
        ('VEHICLE', 'Green EV & Car Loan'),
        ('EDUCATION', 'Global Scholar Education Loan'),
        ('BUSINESS', 'MSME Business Growth Loan'),
    )
    STATUS_CHOICES = (
        ('PENDING_APPROVAL', 'Pending Underwriting Review'),
        ('APPROVED', 'Approved & Disbursed'),
        ('ACTIVE', 'Active Repayment'),
        ('REJECTED', 'Declined'),
        ('CLOSED', 'Closed / Repaid'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='loans')
    disbursal_account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='loans')
    loan_number = models.CharField(max_length=24, unique=True)
    loan_type = models.CharField(max_length=20, choices=LOAN_TYPES, default='PERSONAL')
    principal_amount = models.DecimalField(max_digits=14, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('10.50'))
    tenure_months = models.PositiveIntegerField(default=36)
    emi_amount = models.DecimalField(max_digits=12, decimal_places=2)
    total_payable = models.DecimalField(max_digits=15, decimal_places=2)
    outstanding_balance = models.DecimalField(max_digits=15, decimal_places=2)
    purpose = models.CharField(max_length=255)
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('85000.00'))
    employment_type = models.CharField(max_length=50, default='Salaried')
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='PENDING_APPROVAL')
    admin_remarks = models.TextField(blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-applied_at']
