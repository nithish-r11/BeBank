import random
import string
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.contrib.auth.hashers import make_password, check_password


def generate_customer_id():
    return 'BEB' + ''.join(random.choices(string.digits, k=7))


class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError('Email address is required')
        email = self.normalize_email(email)
        if not extra_fields.get('customer_id'):
            cid = generate_customer_id()
            while self.model.objects.filter(customer_id=cid).exists():
                cid = generate_customer_id()
            extra_fields['customer_id'] = cid
        user = self.model(email=email, full_name=full_name, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        if not user.mpin_hash:
            user.set_mpin('0710')
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')
        extra_fields.setdefault('kyc_status', 'VERIFIED')
        return self.create_user(email, full_name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('CUSTOMER', 'Customer'),
        ('ADMIN', 'Bank Administrator'),
    )
    KYC_CHOICES = (
        ('PENDING', 'Pending Verification'),
        ('VERIFIED', 'KYC Verified'),
        ('REJECTED', 'KYC Rejected'),
    )

    customer_id = models.CharField(max_length=16, unique=True, default=generate_customer_id, db_index=True)
    email = models.EmailField(unique=True, db_index=True)
    full_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20, blank=True, default='+91 98400 12345')
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='CUSTOMER')
    kyc_status = models.CharField(max_length=15, choices=KYC_CHOICES, default='VERIFIED')
    pan_number = models.CharField(max_length=15, blank=True, default='ABCDE1234F')
    aadhaar_masked = models.CharField(max_length=20, blank=True, default='XXXX-XXXX-4589')
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True, default='Anna Salai, Chennai')
    city = models.CharField(max_length=80, blank=True, default='Chennai')
    state = models.CharField(max_length=80, blank=True, default='Tamil Nadu')
    pincode = models.CharField(max_length=12, blank=True, default='600002')
    mpin_hash = models.CharField(max_length=128, blank=True)
    two_factor_enabled = models.BooleanField(default=True)
    is_locked = models.BooleanField(default=False)
    failed_login_attempts = models.PositiveSmallIntegerField(default=0)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} ({self.customer_id})"

    def set_mpin(self, raw_mpin: str):
        self.mpin_hash = make_password(str(raw_mpin))

    def check_mpin(self, raw_mpin: str) -> bool:
        if not self.mpin_hash:
            return False
        return check_password(str(raw_mpin), self.mpin_hash)


class AuditLog(models.Model):
    ACTION_CHOICES = (
        ('LOGIN', 'User Login'),
        ('LOGOUT', 'User Logout'),
        ('TRANSFER', 'Fund Transfer'),
        ('BILL_PAY', 'Bill Payment'),
        ('CARD_CONTROL', 'Card Control Update'),
        ('FD_CREATED', 'Fixed/Recurring Deposit Created'),
        ('LOAN_APPLIED', 'Loan Application Submitted'),
        ('PIN_CHANGE', 'Password / MPIN Changed'),
        ('KYC_UPDATE', 'KYC Status Updated'),
        ('ADMIN_ACTION', 'Administrator Action'),
    )

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    action = models.CharField(max_length=30, choices=ACTION_CHOICES)
    description = models.TextField()
    ip_address = models.CharField(max_length=45, default='127.0.0.1')
    status = models.CharField(max_length=20, default='SUCCESS')
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.action}] {self.user} - {self.created_at:%Y-%m-%d %H:%M}"
