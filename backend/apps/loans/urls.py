from django.urls import path
from .views import LoanListCreateView

urlpatterns = [
    path('', LoanListCreateView.as_view(), name='loans-list-create'),
]
