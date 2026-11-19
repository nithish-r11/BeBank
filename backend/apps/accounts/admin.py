from django.contrib import admin
from .models import User, AuditLog

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('customer_id', 'full_name', 'email', 'role', 'kyc_status', 'is_locked', 'created_at')
    search_fields = ('customer_id', 'full_name', 'email', 'phone_number')
    list_filter = ('role', 'kyc_status', 'is_locked')

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('action', 'user', 'ip_address', 'status', 'created_at')
    list_filter = ('action', 'status')
