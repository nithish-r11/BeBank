from django.urls import path
from .views import CardListView, CardControlUpdateView

urlpatterns = [
    path('', CardListView.as_view(), name='cards-list'),
    path('<int:pk>/controls/', CardControlUpdateView.as_view(), name='cards-controls'),
]
