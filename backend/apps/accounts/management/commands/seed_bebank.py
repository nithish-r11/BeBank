from datetime import date, timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from apps.accounts.models import User, AuditLog
from apps.banking.models import BankAccount, Beneficiary, Transaction, FixedDeposit, BillPayment
from apps.cards.models import BankCard
from apps.loans.models import LoanApplication
from apps.support.models import ServiceRequest


class Command(BaseCommand):
    help = 'Seeds BeBank with realistic Indian digital banking customers, accounts, transactions, cards, deposits, loans, and admin data.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Seeding BeBank Digital Banking Platform database...'))

        # 1. Create Bank Administrator
        admin_user, _ = User.objects.update_or_create(
            email='murugananthan@bebank.in',
            defaults={
                'customer_id': 'BEB9990001',
                'full_name': 'Murugananthan',
                'phone_number': '+91 98401 00001',
                'role': 'ADMIN',
                'kyc_status': 'VERIFIED',
                'pan_number': 'AAAPB9901K',
                'aadhaar_masked': 'XXXX-XXXX-1001',
                'address': 'BeBank Corporate Towers, Anna Salai',
                'city': 'Chennai',
                'state': 'Tamil Nadu',
                'pincode': '600002',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password('Admin@BeBank2026')
        admin_user.set_mpin('3006')
        admin_user.save()

        # 2. Create Primary Demo Customer: Manojkumar
        arjun, _ = User.objects.update_or_create(
            email='manojkumar@bebank.in',
            defaults={
                'customer_id': 'BEB1002045',
                'full_name': 'Manojkumar',
                'phone_number': '+91 98405 67890',
                'role': 'CUSTOMER',
                'kyc_status': 'VERIFIED',
                'pan_number': 'BGLPM4521C',
                'aadhaar_masked': 'XXXX-XXXX-8421',
                'date_of_birth': date(1992, 6, 15),
                'address': '42, Residency Road, T. Nagar',
                'city': 'Chennai',
                'state': 'Tamil Nadu',
                'pincode': '600017',
                'two_factor_enabled': True,
            }
        )
        arjun.set_password('BeBank@2026')
        arjun.set_mpin('0710')
        arjun.save()

        # 3. Create Second Demo Customer: Priya Sharma
        priya, _ = User.objects.update_or_create(
            email='priya.sharma@bebank.in',
            defaults={
                'customer_id': 'BEB1002046',
                'full_name': 'Priya Sharma',
                'phone_number': '+91 98412 33445',
                'role': 'CUSTOMER',
                'kyc_status': 'VERIFIED',
                'pan_number': 'CHJPS8812N',
                'aadhaar_masked': 'XXXX-XXXX-3319',
                'date_of_birth': date(1995, 11, 22),
                'address': '18, Besant Avenue, Adyar',
                'city': 'Chennai',
                'state': 'Tamil Nadu',
                'pincode': '600020',
                'two_factor_enabled': True,
            }
        )
        priya.set_password('BeBank@2026')
        priya.set_mpin('5678')
        priya.save()

        # 4. Create Third Demo Customer (Pending KYC for Admin Portal testing): Karthik Sundaram
        karthik, _ = User.objects.update_or_create(
            email='karthik.s@bebank.in',
            defaults={
                'customer_id': 'BEB1002047',
                'full_name': 'Karthik Sundaram',
                'phone_number': '+91 94441 77889',
                'role': 'CUSTOMER',
                'kyc_status': 'PENDING',
                'pan_number': 'DKSPS4410P',
                'aadhaar_masked': 'XXXX-XXXX-9012',
                'address': '12, OMR IT Expressway, Sholinganallur',
                'city': 'Chennai',
                'state': 'Tamil Nadu',
                'pincode': '600119',
            }
        )
        karthik.set_password('BeBank@2026')
        karthik.set_mpin('1111')
        karthik.save()

        # 5. Bank Accounts for Arjun, Priya, Karthik
        arjun_savings, _ = BankAccount.objects.update_or_create(
            account_number='202600104582',
            defaults={
                'user': arjun,
                'account_type': 'SAVINGS',
                'ifsc_code': 'BEBK0000101',
                'branch_name': 'Chennai Anna Salai Main Branch',
                'balance': Decimal('485620.50'),
                'daily_transfer_limit': Decimal('500000.00'),
                'nominee_name': 'Meera Mehta',
                'status': 'ACTIVE',
            }
        )

        arjun_current, _ = BankAccount.objects.update_or_create(
            account_number='202600908114',
            defaults={
                'user': arjun,
                'account_type': 'CURRENT',
                'ifsc_code': 'BEBK0000101',
                'branch_name': 'Chennai Anna Salai Main Branch',
                'balance': Decimal('1240000.00'),
                'daily_transfer_limit': Decimal('1500000.00'),
                'nominee_name': 'Meera Mehta',
                'status': 'ACTIVE',
            }
        )

        priya_savings, _ = BankAccount.objects.update_or_create(
            account_number='202600108921',
            defaults={
                'user': priya,
                'account_type': 'SAVINGS',
                'ifsc_code': 'BEBK0000102',
                'branch_name': 'Chennai Adyar Branch',
                'balance': Decimal('215400.00'),
                'daily_transfer_limit': Decimal('200000.00'),
                'nominee_name': 'Rohan Sharma',
                'status': 'ACTIVE',
            }
        )

        karthik_savings, _ = BankAccount.objects.update_or_create(
            account_number='202600109934',
            defaults={
                'user': karthik,
                'account_type': 'SAVINGS',
                'ifsc_code': 'BEBK0000103',
                'branch_name': 'Chennai OMR IT Corridor Branch',
                'balance': Decimal('64000.00'),
                'daily_transfer_limit': Decimal('100000.00'),
                'status': 'ACTIVE',
            }
        )

        # 6. Beneficiaries for Arjun
        beneficiaries_data = [
            ('Priya Sharma', 'Priya (BeBank)', '202600108921', 'BeBank', 'BEBK0000102', 'priya@bebank', True),
            ('Vikram Nair', 'Vikram Landlord', '501002938475', 'HDFC Bank', 'HDFC0000142', 'vikram.nair@okhdfcbank', True),
            ('Ananya Krishnan', 'Ananya Sister', '309485716253', 'BeBank', 'IDIB000C032', 'ananya@indianbank', True),
            ('CloudNine Tech Pvt Ltd', 'Vendor Payroll', '918273645501', 'ICICI Bank', 'ICIC0000009', 'billing@icici', False),
        ]
        for b_name, nick, acc, bank, ifsc, upi, fav in beneficiaries_data:
            Beneficiary.objects.update_or_create(
                user=arjun,
                account_number=acc,
                defaults={
                    'name': b_name,
                    'nickname': nick,
                    'bank_name': bank,
                    'ifsc_code': ifsc,
                    'upi_id': upi,
                    'is_favorite': fav,
                    'is_verified': True,
                }
            )

        # 7. Seed Transactions
        if Transaction.objects.count() == 0:
            tx_seed = [
                ('TXN20261101001', arjun_savings, 'CREDIT', 'NEFT', 'SALARY', Decimal('165000.00'), Decimal('512120.50'), 'Zoho Corporation Pvt Ltd', '889011223344', 'HDFC0000012', 'Monthly Salary Credit - Oct/Nov', 'COMPLETED'),
                ('TXN20261103002', arjun_savings, 'DEBIT', 'IMPS', 'TRANSFER', Decimal('22000.00'), Decimal('490120.50'), 'Vikram Nair', '501002938475', 'HDFC0000142', 'Monthly Apartment Rent - T. Nagar', 'COMPLETED'),
                ('TXN20261105003', arjun_savings, 'DEBIT', 'BILL_PAY', 'UTILITIES', Decimal('3450.00'), Decimal('486670.50'), 'TANGEDCO Electricity Board', '09214005812', 'BBPS0000001', 'Bi-Monthly Electricity Bill Payment', 'COMPLETED'),
                ('TXN20261108004', arjun_savings, 'DEBIT', 'UPI', 'FOOD', Decimal('1050.00'), Decimal('485620.50'), 'Saravana Bhavan Anna Salai', 'sbhavan@upi', 'IDIB000C001', 'Family Dinner via UPI Scan & Pay', 'COMPLETED'),
                ('TXN20261110005', arjun_current, 'CREDIT', 'RTGS', 'TRANSFER', Decimal('640000.00'), Decimal('1240000.00'), 'Apex Global Solutions LLP', '400911228877', 'SBIN0000800', 'Enterprise Milestone Invoice #INV-204', 'FLAGGED'),
                ('TXN20261111006', priya_savings, 'CREDIT', 'IMPS', 'TRANSFER', Decimal('45000.00'), Decimal('215400.00'), 'Manojkumar', '202600104582', 'BEBK0000101', 'Project Design Consultation Retainer', 'COMPLETED'),
            ]
            for ref, acct, ttype, chan, cat, amt, bal_after, cname, cacc, cifsc, desc, st in tx_seed:
                Transaction.objects.create(
                    reference_id=ref,
                    account=acct,
                    transaction_type=ttype,
                    channel=chan,
                    category=cat,
                    amount=amt,
                    balance_after=bal_after,
                    counterparty_name=cname,
                    counterparty_account=cacc,
                    counterparty_ifsc=cifsc,
                    description=desc,
                    status=st,
                )

        # 8. Cards for Arjun
        BankCard.objects.update_or_create(
            user=arjun,
            card_number_masked='4532 •••• •••• 8821',
            defaults={
                'linked_account': arjun_savings,
                'card_type': 'DEBIT_PLATINUM',
                'network': 'VISA',
                'cardholder_name': 'MANOJKUMAR',
                'expiry_month': 11,
                'expiry_year': 2030,
                'status': 'ACTIVE',
                'domestic_enabled': True,
                'international_enabled': False,
                'contactless_enabled': True,
                'online_tx_enabled': True,
                'atm_enabled': True,
                'daily_atm_limit': Decimal('75000.00'),
                'daily_pos_limit': Decimal('200000.00'),
                'reward_points': 4820,
            }
        )

        BankCard.objects.update_or_create(
            user=arjun,
            card_number_masked='5419 •••• •••• 3094',
            defaults={
                'linked_account': arjun_savings,
                'card_type': 'CREDIT_EMERALD',
                'network': 'MASTERCARD',
                'cardholder_name': 'MANOJKUMAR',
                'expiry_month': 8,
                'expiry_year': 2029,
                'status': 'ACTIVE',
                'domestic_enabled': True,
                'international_enabled': True,
                'contactless_enabled': True,
                'online_tx_enabled': True,
                'atm_enabled': False,
                'daily_atm_limit': Decimal('25000.00'),
                'daily_pos_limit': Decimal('350000.00'),
                'credit_limit': Decimal('500000.00'),
                'available_credit': Decimal('442500.00'),
                'reward_points': 12650,
            }
        )

        # 9. Fixed Deposits for Arjun
        FixedDeposit.objects.update_or_create(
            deposit_number='FD2026008812',
            defaults={
                'user': arjun,
                'source_account': arjun_savings,
                'deposit_type': 'FD',
                'principal_amount': Decimal('250000.00'),
                'interest_rate': Decimal('7.25'),
                'tenure_months': 12,
                'maturity_amount': Decimal('268125.00'),
                'maturity_date': date.today() + timedelta(days=285),
                'auto_renew': True,
                'status': 'ACTIVE',
            }
        )

        FixedDeposit.objects.update_or_create(
            deposit_number='RD2026004419',
            defaults={
                'user': arjun,
                'source_account': arjun_savings,
                'deposit_type': 'RD',
                'principal_amount': Decimal('60000.00'),
                'interest_rate': Decimal('7.00'),
                'tenure_months': 24,
                'maturity_amount': Decimal('68400.00'),
                'maturity_date': date.today() + timedelta(days=540),
                'auto_renew': False,
                'status': 'ACTIVE',
            }
        )

        # 10. Loans for Arjun & Priya
        LoanApplication.objects.update_or_create(
            loan_number='LN2026001920',
            defaults={
                'user': arjun,
                'disbursal_account': arjun_savings,
                'loan_type': 'VEHICLE',
                'principal_amount': Decimal('850000.00'),
                'interest_rate': Decimal('9.15'),
                'tenure_months': 48,
                'emi_amount': Decimal('21214.00'),
                'total_payable': Decimal('1018272.00'),
                'outstanding_balance': Decimal('742100.00'),
                'purpose': 'Purchase of Tata Nexon EV Empowered+ LR',
                'monthly_income': Decimal('165000.00'),
                'employment_type': 'Salaried',
                'status': 'ACTIVE',
                'admin_remarks': 'Pre-approved Green EV Loan disbursed.',
            }
        )

        LoanApplication.objects.update_or_create(
            loan_number='LN2026005541',
            defaults={
                'user': priya,
                'disbursal_account': priya_savings,
                'loan_type': 'PERSONAL',
                'principal_amount': Decimal('300000.00'),
                'interest_rate': Decimal('10.75'),
                'tenure_months': 24,
                'emi_amount': Decimal('13948.00'),
                'total_payable': Decimal('334752.00'),
                'outstanding_balance': Decimal('334752.00'),
                'purpose': 'Home Studio Upgrade & MacBook Pro Workstation',
                'monthly_income': Decimal('110000.00'),
                'employment_type': 'Self-Employed Professional',
                'status': 'PENDING_APPROVAL',
                'admin_remarks': 'Awaiting final credit underwriting approval.',
            }
        )

        # 11. Support Service Requests
        ServiceRequest.objects.update_or_create(
            ticket_number='SR20261001',
            defaults={
                'user': arjun,
                'request_type': 'CHEQUE_BOOK',
                'subject': 'Request 25-leaf Personalized Cheque Book for Current Account',
                'description': 'Please dispatch a 25-leaf personalized cheque book for my Current Account 202600908114 to my registered T. Nagar address.',
                'priority': 'MEDIUM',
                'status': 'IN_PROGRESS',
                'admin_response': 'Cheque book printing initiated via Chennai Security Press. Dispatch tracking ID will be shared within 24 hours.',
            }
        )

        ServiceRequest.objects.update_or_create(
            ticket_number='SR20261002',
            defaults={
                'user': karthik,
                'request_type': 'KYC_UPDATE',
                'subject': 'Expedite Video KYC Verification for Account Activation',
                'description': 'I have uploaded my PAN and Aadhaar XML. Kindly verify my KYC so I can increase my daily IMPS limit.',
                'priority': 'HIGH',
                'status': 'OPEN',
                'admin_response': '',
            }
        )

        # 12. Audit Logs
        if AuditLog.objects.count() == 0:
            AuditLog.objects.create(
                user=admin_user,
                action='ADMIN_ACTION',
                description='System initialized with BeBank Demo Banking Dataset',
                ip_address='127.0.0.1',
                status='SUCCESS',
            )
            AuditLog.objects.create(
                user=arjun,
                action='LOGIN',
                description='Customer logged in via BeBank Web Portal',
                ip_address='127.0.0.1',
                status='SUCCESS',
            )

        self.stdout.write(self.style.SUCCESS('BeBank demo database seeded successfully!'))
