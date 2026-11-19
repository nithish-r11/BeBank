from django.urls import path
from .views import (
    AdminDashboardSummaryView, AdminCustomerListView, AdminCustomerActionView,
    AdminTransactionListView, AdminTransactionFlagView, AdminLoanListView,
    AdminLoanReviewView, AdminSupportListView, AdminSupportResolveView,
    AdminAuditLogListView
)

urlpatterns = [
    path('summary/', AdminDashboardSummaryView.as_view(), name='admin-summary'),
    path('customers/', AdminCustomerListView.as_view(), name='admin-customers'),
    path('customers/<int:pk>/action/', AdminCustomerActionView.as_view(), name='admin-customer-action'),
    path('transactions/', AdminTransactionListView.as_view(), name='admin-transactions'),
    path('transactions/<int:pk>/flag/', AdminTransactionFlagView.as_view(), name='admin-transaction-flag'),
    path('loans/', AdminLoanListView.as_view(), name='admin-loans'),
    path('loans/<int:pk>/review/', AdminLoanReviewView.as_view(), name='admin-loan-review'),
    path('support/', AdminSupportListView.as_view(), name='admin-support'),
    path('support/<int:pk>/resolve/', AdminSupportResolveView.as_view(), name='admin-support-resolve'),
    path('audit-logs/', AdminAuditLogListView.as_view(), name='admin-audit-logs'),
]
