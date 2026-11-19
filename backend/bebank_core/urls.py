from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({
        'status': 'healthy',
        'bank_name': 'BeBank',
        'tagline': 'Your Trusting for Tomorrow',
        'demo_banking_mode': settings.DEMO_BANKING_MODE,
        'api_version': '1.0.0',
        'theme': {
            'navy_blue': '#173B73',
            'emerald_green': '#079669',
            'white': '#FFFFFF',
        }
    })


urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/health/', health_check, name='api-health'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/banking/', include('apps.banking.urls')),
    path('api/cards/', include('apps.cards.urls')),
    path('api/loans/', include('apps.loans.urls')),
    path('api/support/', include('apps.support.urls')),
    path('api/admin-portal/', include('apps.admin_portal.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
