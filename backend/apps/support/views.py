from rest_framework import serializers, generics, permissions
from .models import ServiceRequest


class ServiceRequestSerializer(serializers.ModelSerializer):
    request_type_display = serializers.CharField(source='get_request_type_display', read_only=True)
    customer_name = serializers.CharField(source='user.full_name', read_only=True)
    customer_id = serializers.CharField(source='user.customer_id', read_only=True)

    class Meta:
        model = ServiceRequest
        fields = [
            'id', 'user', 'customer_name', 'customer_id', 'ticket_number',
            'request_type', 'request_type_display', 'subject', 'description',
            'priority', 'status', 'admin_response', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'ticket_number', 'status', 'admin_response', 'created_at', 'updated_at']


class ServiceRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ServiceRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
