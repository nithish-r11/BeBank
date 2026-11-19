# BeBank – Complete Digital Banking Platform
**"Your Trusting for Tomorrow"**

BeBank is a modern, secure, full-stack Digital Banking Web Application built with a clean, intuitive digital banking user experience. It includes both a **Customer Digital Banking Portal** and a **Bank Administrator Portal**, built with **Advanced Python Django REST Framework** on the backend and **React + Tailwind CSS** on the frontend.

---

## Brand Identity & Theme
- **Logo**: Official uploaded BeBank Logo (`/frontend/public/assets/bebank-logo.png` & `/frontend/public/assets/bebank-icon.png`)
- **Primary Navy Blue**: `#173B73`
- **Primary Emerald Green**: `#079669`
- **Clean Surface White**: `#FFFFFF`

---

## Designed for Google Antigravity on Windows PC
This project includes dedicated configuration files (`ANTIGRAVITY.md`, `.antigravity/rules.md`, `.antigravity/workflow.json`, `.vscode/tasks.json`, and Windows batch/PowerShell scripts in `/scripts`) so that **Google Antigravity AI** can automatically inspect, install, configure, migrate, seed, launch, test, and deploy the entire platform for you.

### Quick Prompt to Give Google Antigravity:
> *"Please read `ANTIGRAVITY.md`, set up the BeBank backend and frontend on my Windows PC, run migrations and seed data, start both servers, and open BeBank in my browser. Ask for my permission whenever software installation or sensitive configuration is required."*

---

## Default Demo Accounts (Pre-Seeded)
| Portal | User Name | Email / Customer ID | Password | 4-Digit MPIN |
| :--- | :--- | :--- | :--- | :--- |
| **Customer Portal** | Manojkumar | `manojkumar@bebank.in` (`BEB1002045`) | `BeBank@2026` | `1234` |
| **Customer Portal** | Priya Sharma | `priya.sharma@bebank.in` (`BEB1002046`) | `BeBank@2026` | `5678` |
| **Admin Portal** | Murugananthan (Chief Manager) | `murugananthan@bebank.in` (`BEB9990001`) | `Admin@BeBank2026` | `9999` |

---

## Complete Feature Matrix

### 1. Customer Portal (BeBank-Inspired UX)
- **Smart Overview Dashboard**: Quick Balance toggle, Savings & Current account summary cards, 1-click Quick Actions (Send Money, Scan/UPI Pay, Open FD, Pay Bills, Manage Cards, Statement), recent transactions, spending breakdown, and personalized security alerts.
- **My Accounts & Passbook Statement**: Detailed account info (Account No, IFSC `BEBK0000101`, Branch, Daily Limit), filterable transaction ledger by date/type/channel, instant CSV download, and printable official bank statement view.
- **Fund Transfer Center (IMPS / NEFT / RTGS / UPI / Self Transfer)**:
  - Atomic ledger transfers with 4-digit **MPIN verification**.
  - Beneficiary management (add, verify, mark favorite, set custom limit).
  - Instant transaction receipt generation with reference number.
- **Cards Control Center (Debit & Credit Cards)**:
  - Visual interactive BeBank Platinum Debit & Emerald Credit cards.
  - Instant BeBank-style toggle switches for **Domestic**, **International**, **Contactless (NFC)**, **Online E-Commerce**, and **ATM Withdrawals**.
  - Real-time daily ATM & POS spending limit sliders, one-click Card Block/Unblock, and Card PIN generation.
- **Fixed & Recurring Deposits (FD / RD)**:
  - Interactive maturity & interest rate calculator (up to 7.40% p.a.).
  - Instant paperless FD/RD booking debited directly from Savings Account.
- **Loans & EMI Center**:
  - Interactive EMI Calculator (Personal, Home, Vehicle, Education Loans).
  - Instant online loan application + real-time application status tracking.
- **Bill Pay & Recharge (BBPS Demo)**:
  - Instant bill payment for Electricity, Mobile, Broadband, Water, FASTag, DTH, and Insurance with receipt tracking.
- **Service Requests & Helpdesk**:
  - Apply for Cheque Book, Stop Payment, KYC Update, or raise a Transaction Dispute ticket.
- **Security & Profile Center**:
  - Change Password, update 4-digit Transaction MPIN, toggle 2-Factor Authentication, view KYC details, and inspect personal Security & Login Audit Logs.

### 2. Bank Administrator Portal
- **Executive Banking Command Center**: Real-time KPIs (Total Deposits AUM, Active Customers, Today's Transaction Volume, Pending KYC & Loan Queues, Flagged Compliance Alerts).
- **Customer & KYC Management**: Search customers by CIF/email, approve/reject KYC verification, freeze/unfreeze bank accounts, lock/unlock user logins, and issue demo balance credits/debits for testing.
- **Transaction Monitoring & Compliance**: Inspect all bank-wide transactions across IMPS/NEFT/RTGS/UPI, filter by status/channel, and flag/clear high-value or suspicious transfers.
- **Loan Underwriting & Disbursal Desk**: Review pending customer loan applications, add underwriting remarks, and approve & automatically disburse loan principal directly into the customer's bank account.
- **Customer Support Ticket Desk**: View open service requests, write official bank responses, and mark tickets resolved.
- **System Security Audit Logs**: Immutable chronological trail of all logins, transfers, card controls, and admin actions with IP addresses.

---

## Regulatory & Compliance Notice
BeBank is configured in **Demo Banking Mode (`DEMO_BANKING_MODE=True`)**. All account balances, fund transfers, card numbers, deposits, and loans operate on simulated demo ledgers. Real-money banking operations require appropriate central bank licensing (e.g., RBI authorization) and licensed banking partner integrations.
