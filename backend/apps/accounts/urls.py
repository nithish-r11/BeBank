from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView, RegisterView, ProfileView,
    ChangeMpinView, ChangePasswordView, CustomerAuditLogListView
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='auth-login'),
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('profile/', ProfileView.as_view(), name='auth-profile'),
    path('change-mpin/', ChangeMpinView.as_view(), name='auth-change-mpin'),
    path('change-password/', ChangePasswordView.as_view(), name='auth-change-password'),
    path('audit-logs/', CustomerAuditLogListView.as_view(), name='auth-audit-logs'),
]
