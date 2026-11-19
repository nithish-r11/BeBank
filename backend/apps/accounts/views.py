from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, AuditLog
from .serializers import (
    UserProfileSerializer, RegisterCustomerSerializer,
    LoginSerializer, AuditLogSerializer
)


def get_client_ip(request):
    x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded:
        return x_forwarded.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '127.0.0.1')


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        ip = get_client_ip(request)
        user.last_login_ip = ip
        user.save(update_fields=['last_login_ip'])

        AuditLog.objects.create(
            user=user,
            action='LOGIN',
            description=f"Successful login via web portal ({user.role})",
            ip_address=ip,
            status='SUCCESS',
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserProfileSerializer(user).data,
        })


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterCustomerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        ip = get_client_ip(request)

        AuditLog.objects.create(
            user=user,
            action='LOGIN',
            description=f"New customer digital onboarding completed ({user.customer_id})",
            ip_address=ip,
            status='SUCCESS',
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserProfileSerializer(user).data,
        }, status=status.HTTP_201_CREATED)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangeMpinView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        current_mpin = str(request.data.get('current_mpin', '')).strip()
        new_mpin = str(request.data.get('new_mpin', '')).strip()

        if len(new_mpin) != 4 or not new_mpin.isdigit():
            return Response(
                {'detail': 'New MPIN must be an exact 4-digit numeric PIN.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        if not user.check_mpin(current_mpin):
            return Response(
                {'detail': 'Current MPIN is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_mpin(new_mpin)
        user.save(update_fields=['mpin_hash'])

        AuditLog.objects.create(
            user=user,
            action='PIN_CHANGE',
            description='Customer updated 4-digit Transaction MPIN',
            ip_address=get_client_ip(request),
            status='SUCCESS',
        )
        return Response({'detail': '4-digit Transaction MPIN updated successfully.'})


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        current_password = request.data.get('current_password', '')
        new_password = request.data.get('new_password', '')

        user = request.user
        if not user.check_password(current_password):
            return Response({'detail': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
        if len(new_password) < 8:
            return Response({'detail': 'New password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        AuditLog.objects.create(
            user=user,
            action='PIN_CHANGE',
            description='Account login password changed',
            ip_address=get_client_ip(request),
            status='SUCCESS',
        )
        return Response({'detail': 'Login password updated successfully.'})


class CustomerAuditLogListView(generics.ListAPIView):
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AuditLog.objects.filter(user=self.request.user)[:50]
