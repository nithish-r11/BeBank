from rest_framework import serializers, generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.accounts.models import AuditLog
from apps.accounts.views import get_client_ip
from .models import BankCard


class BankCardSerializer(serializers.ModelSerializer):
    card_type_display = serializers.CharField(source='get_card_type_display', read_only=True)
    account_number = serializers.CharField(source='linked_account.account_number', read_only=True)

    class Meta:
        model = BankCard
        fields = [
            'id', 'linked_account', 'account_number', 'card_number_masked',
            'card_type', 'card_type_display', 'network', 'cardholder_name',
            'expiry_month', 'expiry_year', 'cvv_masked', 'status',
            'domestic_enabled', 'international_enabled', 'contactless_enabled',
            'online_tx_enabled', 'atm_enabled', 'daily_atm_limit', 'daily_pos_limit',
            'credit_limit', 'available_credit', 'reward_points', 'created_at'
        ]
        read_only_fields = [
            'id', 'linked_account', 'card_number_masked', 'card_type',
            'network', 'cardholder_name', 'expiry_month', 'expiry_year',
            'reward_points', 'created_at'
        ]


class CardListView(generics.ListAPIView):
    serializer_class = BankCardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BankCard.objects.filter(user=self.request.user)


class CardControlUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        card = BankCard.objects.filter(pk=pk, user=request.user).first()
        if not card:
            return Response({'detail': 'Card not found.'}, status=status.HTTP_404_NOT_FOUND)

        editable_fields = [
            'status', 'domestic_enabled', 'international_enabled',
            'contactless_enabled', 'online_tx_enabled', 'atm_enabled',
            'daily_atm_limit', 'daily_pos_limit'
        ]
        for field in editable_fields:
            if field in request.data:
                setattr(card, field, request.data[field])
        card.save()

        AuditLog.objects.create(
            user=request.user,
            action='CARD_CONTROL',
            description=f"Updated controls/limits for card {card.card_number_masked} (Status: {card.status})",
            ip_address=get_client_ip(request),
            status='SUCCESS',
        )
        return Response(BankCardSerializer(card).data)
