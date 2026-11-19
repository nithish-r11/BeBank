from django.urls import path
from .views import ServiceRequestListCreateView

urlpatterns = [
    path('', ServiceRequestListCreateView.as_view(), name='support-list-create'),
]
