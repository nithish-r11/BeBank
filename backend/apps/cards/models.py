from decimal import Decimal
from django.db import models
from django.conf import settings
from apps.banking.models import BankAccount


class BankCard(models.Model):
    CARD_TYPES = (
        ('DEBIT_PLATINUM', 'BeBank Platinum Visa Debit Card'),
        ('DEBIT_CLASSIC', 'BeBank RuPay Classic Debit Card'),
        ('CREDIT_EMERALD', 'BeBank Emerald Rewards Credit Card'),
    )
    NETWORK_CHOICES = (
        ('VISA', 'Visa'),
        ('RUPAY', 'RuPay'),
        ('MASTERCARD', 'Mastercard'),
    )
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('BLOCKED', 'Temporarily Blocked'),
        ('EXPIRED', 'Expired'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cards')
    linked_account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='cards')
    card_number_masked = models.CharField(max_length=25)
    card_type = models.CharField(max_length=25, choices=CARD_TYPES, default='DEBIT_PLATINUM')
    network = models.CharField(max_length=15, choices=NETWORK_CHOICES, default='VISA')
    cardholder_name = models.CharField(max_length=120)
    expiry_month = models.PositiveSmallIntegerField(default=11)
    expiry_year = models.PositiveSmallIntegerField(default=2030)
    cvv_masked = models.CharField(max_length=5, default='•••')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='ACTIVE')

    # Granular BeBank Card Security Controls
    domestic_enabled = models.BooleanField(default=True)
    international_enabled = models.BooleanField(default=False)
    contactless_enabled = models.BooleanField(default=True)
    online_tx_enabled = models.BooleanField(default=True)
    atm_enabled = models.BooleanField(default=True)

    daily_atm_limit = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('50000.00'))
    daily_pos_limit = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('150000.00'))
    credit_limit = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    available_credit = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    reward_points = models.PositiveIntegerField(default=1450)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.get_card_type_display()} ({self.card_number_masked})"
