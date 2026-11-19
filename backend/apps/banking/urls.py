from django.urls import path
from .views import (
    CustomerDashboardOverviewView, BankAccountListView, UpdateAccountLimitView,
    BeneficiaryListCreateView, BeneficiaryDetailView, TransactionListView,
    FundTransferView, FixedDepositListCreateView, BillPaymentListCreateView
)

urlpatterns = [
    path('dashboard/', CustomerDashboardOverviewView.as_view(), name='banking-dashboard'),
    path('accounts/', BankAccountListView.as_view(), name='banking-accounts'),
    path('accounts/<int:pk>/limit/', UpdateAccountLimitView.as_view(), name='banking-account-limit'),
    path('beneficiaries/', BeneficiaryListCreateView.as_view(), name='banking-beneficiaries'),
    path('beneficiaries/<int:pk>/', BeneficiaryDetailView.as_view(), name='banking-beneficiary-detail'),
    path('transactions/', TransactionListView.as_view(), name='banking-transactions'),
    path('transfer/', FundTransferView.as_view(), name='banking-transfer'),
    path('deposits/', FixedDepositListCreateView.as_view(), name='banking-deposits'),
    path('bills/', BillPaymentListCreateView.as_view(), name='banking-bills'),
]
