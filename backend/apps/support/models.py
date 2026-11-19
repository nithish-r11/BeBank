import random
import string
from django.db import models
from django.conf import settings


def generate_ticket_number():
    return 'SR' + ''.join(random.choices(string.digits, k=8))


class ServiceRequest(models.Model):
    REQUEST_TYPES = (
        ('CHEQUE_BOOK', 'New Cheque Book Request (25 Leaves)'),
        ('STOP_PAYMENT', 'Stop Cheque Payment Instruction'),
        ('KYC_UPDATE', 'Re-KYC / PAN / Address Update'),
        ('DISPUTE_TRANSACTION', 'Transaction Dispute / Chargeback'),
        ('ACCOUNT_STATEMENT', 'Certified Physical Account Statement'),
        ('GENERAL_INQUIRY', 'General Banking Assistance'),
    )
    PRIORITY_CHOICES = (
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    )
    STATUS_CHOICES = (
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESOLVED', 'Resolved'),
        ('CLOSED', 'Closed'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='service_requests')
    ticket_number = models.CharField(max_length=20, unique=True, default=generate_ticket_number)
    request_type = models.CharField(max_length=30, choices=REQUEST_TYPES, default='GENERAL_INQUIRY')
    subject = models.CharField(max_length=180)
    description = models.TextField()
    priority = models.CharField(max_length=15, choices=PRIORITY_CHOICES, default='MEDIUM')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    admin_response = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
