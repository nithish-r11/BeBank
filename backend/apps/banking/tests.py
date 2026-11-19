from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient
from apps.accounts.models import User
from apps.banking.models import BankAccount


class BeBankEndToEndAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.customer = User.objects.create_user(
            email='test.customer@bebank.in',
            full_name='Test Customer',
            password='SecurePassword@123',
            customer_id='BEB7770001',
            role='CUSTOMER',
        )
        self.customer.set_mpin('4321')
        self.customer.save()

        self.account = BankAccount.objects.create(
            user=self.customer,
            account_number='202677700001',
            account_type='SAVINGS',
            balance=Decimal('100000.00'),
            daily_transfer_limit=Decimal('50000.00'),
        )

        self.admin = User.objects.create_superuser(
            email='test.murugananthan@bebank.in',
            full_name='Test Admin',
            password='AdminPassword@123',
            customer_id='BEB9997777',
        )

    def test_health_check_and_login(self):
        res = self.client.get('/api/health/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['bank_name'], 'BeBank')

        login_res = self.client.post('/api/auth/login/', {
            'identifier': 'BEB7770001',
            'password': 'SecurePassword@123'
        })
        self.assertEqual(login_res.status_code, 200)
        self.assertIn('access', login_res.data)

    def test_atomic_fund_transfer_and_mpin_guard(self):
        self.client.force_authenticate(user=self.customer)

        # Wrong MPIN should be rejected
        bad_res = self.client.post('/api/banking/transfer/', {
            'source_account_id': self.account.id,
            'recipient_name': 'Ravi Kumar',
            'recipient_account': '501009988776',
            'recipient_ifsc': 'HDFC0000001',
            'channel': 'IMPS',
            'amount': '5000.00',
            'mpin': '0000',
        })
        self.assertEqual(bad_res.status_code, 400)

        # Valid MPIN should succeed and deduct balance atomically
        ok_res = self.client.post('/api/banking/transfer/', {
            'source_account_id': self.account.id,
            'recipient_name': 'Ravi Kumar',
            'recipient_account': '501009988776',
            'recipient_ifsc': 'HDFC0000001',
            'channel': 'IMPS',
            'amount': '5000.00',
            'mpin': '4321',
        })
        self.assertEqual(ok_res.status_code, 201)
        self.account.refresh_from_db()
        self.assertEqual(self.account.balance, Decimal('95000.00'))

    def test_admin_portal_rbac_protection(self):
        # Customer cannot access Admin Portal summary
        self.client.force_authenticate(user=self.customer)
        forbidden = self.client.get('/api/admin-portal/summary/')
        self.assertEqual(forbidden.status_code, 403)

        # Admin can access Admin Portal summary
        self.client.force_authenticate(user=self.admin)
        allowed = self.client.get('/api/admin-portal/summary/')
        self.assertEqual(allowed.status_code, 200)
        self.assertIn('kpis', allowed.data)
