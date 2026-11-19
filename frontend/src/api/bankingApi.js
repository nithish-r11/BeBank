/**
 * BeBank Unified Banking API Client
 * Connects automatically to the Django REST Backend (http://127.0.0.1:8000/api)
 * and includes a complete, stateful local ledger engine so all portals, transfers,
 * card controls, deposits, loans, and admin actions work seamlessly both with
 * the live Django server and in standalone preview mode.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const STORAGE_KEY = 'bebank_stateful_ledger_v2';

const INITIAL_SEED_STATE = {
  users: [
    {
      id: 1,
      customer_id: 'BEB1002045',
      email: 'manojkumar@bebank.in',
      password: 'BeBank@2026',
      mpin: '0710',
      full_name: 'Manojkumar',
      phone_number: '+91 98405 67890',
      role: 'CUSTOMER',
      kyc_status: 'VERIFIED',
      pan_number: 'BGLPM4521C',
      aadhaar_masked: 'XXXX-XXXX-8421',
      address: '42, Residency Road, T. Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600017',
      two_factor_enabled: true,
      is_locked: false,
      last_login_ip: '127.0.0.1',
      created_at: '2026-01-15T09:30:00Z',
    },
    {
      id: 2,
      customer_id: 'BEB1002046',
      email: 'priya.sharma@bebank.in',
      password: 'BeBank@2026',
      mpin: '5678',
      full_name: 'Priya Sharma',
      phone_number: '+91 98412 33445',
      role: 'CUSTOMER',
      kyc_status: 'VERIFIED',
      pan_number: 'CHJPS8812N',
      aadhaar_masked: 'XXXX-XXXX-3319',
      address: '18, Besant Avenue, Adyar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600020',
      two_factor_enabled: true,
      is_locked: false,
      last_login_ip: '127.0.0.1',
      created_at: '2026-02-10T11:15:00Z',
    },
    {
      id: 3,
      customer_id: 'BEB1002047',
      email: 'karthik.s@bebank.in',
      password: 'BeBank@2026',
      mpin: '1111',
      full_name: 'Karthik Sundaram',
      phone_number: '+91 94441 77889',
      role: 'CUSTOMER',
      kyc_status: 'PENDING',
      pan_number: 'DKSPS4410P',
      aadhaar_masked: 'XXXX-XXXX-9012',
      address: '12, OMR IT Expressway, Sholinganallur',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600119',
      two_factor_enabled: false,
      is_locked: false,
      last_login_ip: '127.0.0.1',
      created_at: '2026-10-05T14:20:00Z',
    },
    {
      id: 99,
      customer_id: 'BEB9990001',
      email: 'murugananthan@bebank.in',
      password: 'Admin@BeBank2026',
      mpin: '3006',
      full_name: 'Murugananthan',
      phone_number: '+91 98401 00001',
      role: 'ADMIN',
      kyc_status: 'VERIFIED',
      pan_number: 'AAAPB9901K',
      aadhaar_masked: 'XXXX-XXXX-1001',
      address: 'BeBank Corporate Towers, Anna Salai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600002',
      two_factor_enabled: true,
      is_locked: false,
      last_login_ip: '127.0.0.1',
      created_at: '2026-01-01T08:00:00Z',
    },
  ],
  accounts: [
    {
      id: 101,
      user_id: 1,
      account_number: '202600104582',
      account_type: 'SAVINGS',
      account_type_display: 'BeBank Smart Savings Account',
      ifsc_code: 'BEBK0000101',
      branch_name: 'Chennai Anna Salai Main Branch',
      balance: 485620.50,
      currency: 'INR',
      status: 'ACTIVE',
      daily_transfer_limit: 500000.00,
      nominee_name: 'Meera Mehta',
      created_at: '2026-01-15T09:35:00Z',
    },
    {
      id: 102,
      user_id: 1,
      account_number: '202600908114',
      account_type: 'CURRENT',
      account_type_display: 'Corporate Current Account',
      ifsc_code: 'BEBK0000101',
      branch_name: 'Chennai Anna Salai Main Branch',
      balance: 1240000.00,
      currency: 'INR',
      status: 'ACTIVE',
      daily_transfer_limit: 1500000.00,
      nominee_name: 'Meera Mehta',
      created_at: '2026-03-01T10:00:00Z',
    },
    {
      id: 103,
      user_id: 2,
      account_number: '202600108921',
      account_type: 'SAVINGS',
      account_type_display: 'BeBank Smart Savings Account',
      ifsc_code: 'BEBK0000102',
      branch_name: 'Chennai Adyar Branch',
      balance: 215400.00,
      currency: 'INR',
      status: 'ACTIVE',
      daily_transfer_limit: 200000.00,
      nominee_name: 'Rohan Sharma',
      created_at: '2026-02-10T11:20:00Z',
    },
    {
      id: 104,
      user_id: 3,
      account_number: '202600109934',
      account_type: 'SAVINGS',
      account_type_display: 'BeBank Smart Savings Account',
      ifsc_code: 'BEBK0000103',
      branch_name: 'Chennai OMR IT Corridor Branch',
      balance: 64000.00,
      currency: 'INR',
      status: 'ACTIVE',
      daily_transfer_limit: 100000.00,
      nominee_name: 'Lakshmi Sundaram',
      created_at: '2026-10-05T14:25:00Z',
    },
  ],
  beneficiaries: [
    {
      id: 201,
      user_id: 1,
      name: 'Priya Sharma',
      nickname: 'Priya (BeBank)',
      account_number: '202600108921',
      bank_name: 'BeBank',
      ifsc_code: 'BEBK0000102',
      upi_id: 'priya@bebank',
      daily_limit: 200000,
      is_favorite: true,
      is_verified: true,
    },
    {
      id: 202,
      user_id: 1,
      name: 'Vikram Nair',
      nickname: 'Vikram Landlord',
      account_number: '501002938475',
      bank_name: 'HDFC Bank',
      ifsc_code: 'HDFC0000142',
      upi_id: 'vikram.nair@okhdfcbank',
      daily_limit: 100000,
      is_favorite: true,
      is_verified: true,
    },
    {
      id: 203,
      user_id: 1,
      name: 'Ananya Krishnan',
      nickname: 'Ananya Sister',
      account_number: '309485716253',
      bank_name: 'BeBank',
      ifsc_code: 'IDIB000C032',
      upi_id: 'ananya@indianbank',
      daily_limit: 100000,
      is_favorite: true,
      is_verified: true,
    },
    {
      id: 204,
      user_id: 1,
      name: 'CloudNine Tech Pvt Ltd',
      nickname: 'Vendor Payroll',
      account_number: '918273645501',
      bank_name: 'ICICI Bank',
      ifsc_code: 'ICIC0000009',
      upi_id: 'billing@icici',
      daily_limit: 500000,
      is_favorite: false,
      is_verified: true,
    },
  ],
  transactions: [
    {
      id: 301,
      reference_id: 'TXN20261112001',
      account: 101,
      account_number: '202600104582',
      customer_name: 'Manojkumar',
      transaction_type: 'CREDIT',
      channel: 'NEFT',
      category: 'SALARY',
      amount: 165000.00,
      balance_after: 512120.50,
      counterparty_name: 'Zoho Corporation Pvt Ltd',
      counterparty_account: '889011223344',
      counterparty_ifsc: 'HDFC0000012',
      description: 'Monthly Salary Credit - November',
      status: 'COMPLETED',
      is_demo: true,
      created_at: '2026-11-01T10:15:00Z',
    },
    {
      id: 302,
      reference_id: 'TXN20261112002',
      account: 101,
      account_number: '202600104582',
      customer_name: 'Manojkumar',
      transaction_type: 'DEBIT',
      channel: 'IMPS',
      category: 'TRANSFER',
      amount: 22000.00,
      balance_after: 490120.50,
      counterparty_name: 'Vikram Nair',
      counterparty_account: '501002938475',
      counterparty_ifsc: 'HDFC0000142',
      description: 'Monthly Apartment Rent - T. Nagar',
      status: 'COMPLETED',
      is_demo: true,
      created_at: '2026-11-03T14:20:00Z',
    },
    {
      id: 303,
      reference_id: 'TXN20261112003',
      account: 101,
      account_number: '202600104582',
      customer_name: 'Manojkumar',
      transaction_type: 'DEBIT',
      channel: 'BILL_PAY',
      category: 'UTILITIES',
      amount: 3450.00,
      balance_after: 486670.50,
      counterparty_name: 'TANGEDCO Electricity Board',
      counterparty_account: '09214005812',
      counterparty_ifsc: 'BBPS0000001',
      description: 'Bi-Monthly Electricity Bill Payment',
      status: 'COMPLETED',
      is_demo: true,
      created_at: '2026-11-05T18:05:00Z',
    },
    {
      id: 304,
      reference_id: 'TXN20261112004',
      account: 101,
      account_number: '202600104582',
      customer_name: 'Manojkumar',
      transaction_type: 'DEBIT',
      channel: 'UPI',
      category: 'FOOD',
      amount: 1050.00,
      balance_after: 485620.50,
      counterparty_name: 'Saravana Bhavan Anna Salai',
      counterparty_account: 'sbhavan@upi',
      counterparty_ifsc: 'IDIB000C001',
      description: 'Family Dinner via UPI Scan & Pay',
      status: 'COMPLETED',
      is_demo: true,
      created_at: '2026-11-08T20:40:00Z',
    },
    {
      id: 305,
      reference_id: 'TXN20261112005',
      account: 102,
      account_number: '202600908114',
      customer_name: 'Manojkumar',
      transaction_type: 'CREDIT',
      channel: 'RTGS',
      category: 'TRANSFER',
      amount: 640000.00,
      balance_after: 1240000.00,
      counterparty_name: 'Apex Global Solutions LLP',
      counterparty_account: '400911228877',
      counterparty_ifsc: 'SBIN0000800',
      description: 'Enterprise Milestone Invoice #INV-204',
      status: 'FLAGGED',
      is_demo: true,
      created_at: '2026-11-10T11:30:00Z',
    },
    {
      id: 306,
      reference_id: 'TXN20261112006',
      account: 103,
      account_number: '202600108921',
      customer_name: 'Priya Sharma',
      transaction_type: 'CREDIT',
      channel: 'IMPS',
      category: 'TRANSFER',
      amount: 45000.00,
      balance_after: 215400.00,
      counterparty_name: 'Manojkumar',
      counterparty_account: '202600104582',
      counterparty_ifsc: 'BEBK0000101',
      description: 'UI/UX Consultation Retainer',
      status: 'COMPLETED',
      is_demo: true,
      created_at: '2026-11-11T16:10:00Z',
    },
  ],
  cards: [
    {
      id: 401,
      user_id: 1,
      linked_account: 101,
      account_number: '202600104582',
      card_number_masked: '4532 •••• •••• 8821',
      card_type: 'DEBIT_PLATINUM',
      card_type_display: 'BeBank Platinum Visa Debit Card',
      network: 'VISA',
      cardholder_name: 'MANOJKUMAR',
      expiry_month: 11,
      expiry_year: 2030,
      cvv_masked: '•••',
      status: 'ACTIVE',
      domestic_enabled: true,
      international_enabled: false,
      contactless_enabled: true,
      online_tx_enabled: true,
      atm_enabled: true,
      daily_atm_limit: 75000,
      daily_pos_limit: 200000,
      credit_limit: null,
      available_credit: null,
      reward_points: 4820,
    },
    {
      id: 402,
      user_id: 1,
      linked_account: 101,
      account_number: '202600104582',
      card_number_masked: '5419 •••• •••• 3094',
      card_type: 'CREDIT_EMERALD',
      card_type_display: 'BeBank Emerald Rewards Credit Card',
      network: 'MASTERCARD',
      cardholder_name: 'MANOJKUMAR',
      expiry_month: 8,
      expiry_year: 2029,
      cvv_masked: '•••',
      status: 'ACTIVE',
      domestic_enabled: true,
      international_enabled: true,
      contactless_enabled: true,
      online_tx_enabled: true,
      atm_enabled: false,
      daily_atm_limit: 25000,
      daily_pos_limit: 350000,
      credit_limit: 500000,
      available_credit: 442500,
      reward_points: 12650,
    },
  ],
  deposits: [
    {
      id: 501,
      user_id: 1,
      source_account: 101,
      source_account_number: '202600104582',
      deposit_number: 'FD2026008812',
      deposit_type: 'FD',
      principal_amount: 250000,
      interest_rate: 7.25,
      tenure_months: 12,
      maturity_amount: 268125,
      maturity_date: '2027-08-25',
      auto_renew: true,
      status: 'ACTIVE',
      created_at: '2026-08-25T10:00:00Z',
    },
    {
      id: 502,
      user_id: 1,
      source_account: 101,
      source_account_number: '202600104582',
      deposit_number: 'RD2026004419',
      deposit_type: 'RD',
      principal_amount: 60000,
      interest_rate: 7.00,
      tenure_months: 24,
      maturity_amount: 68400,
      maturity_date: '2028-05-10',
      auto_renew: false,
      status: 'ACTIVE',
      created_at: '2026-05-10T10:00:00Z',
    },
  ],
  loans: [
    {
      id: 601,
      user_id: 1,
      customer_name: 'Manojkumar',
      customer_id: 'BEB1002045',
      disbursal_account: 101,
      account_number: '202600104582',
      loan_number: 'LN2026001920',
      loan_type: 'VEHICLE',
      loan_type_display: 'Green EV & Car Loan',
      principal_amount: 850000,
      interest_rate: 9.15,
      tenure_months: 48,
      emi_amount: 21214,
      total_payable: 1018272,
      outstanding_balance: 742100,
      purpose: 'Purchase of Tata Nexon EV Empowered+ LR',
      monthly_income: 165000,
      employment_type: 'Salaried',
      status: 'ACTIVE',
      admin_remarks: 'Pre-approved Green EV Loan disbursed.',
      applied_at: '2026-06-15T11:00:00Z',
    },
    {
      id: 602,
      user_id: 2,
      customer_name: 'Priya Sharma',
      customer_id: 'BEB1002046',
      disbursal_account: 103,
      account_number: '202600108921',
      loan_number: 'LN2026005541',
      loan_type: 'PERSONAL',
      loan_type_display: 'Instant Personal Loan',
      principal_amount: 300000,
      interest_rate: 10.75,
      tenure_months: 24,
      emi_amount: 13948,
      total_payable: 334752,
      outstanding_balance: 334752,
      purpose: 'Design Studio Workstation & Equipment Upgrade',
      monthly_income: 110000,
      employment_type: 'Self-Employed Professional',
      status: 'PENDING_APPROVAL',
      admin_remarks: 'Awaiting final credit underwriting review.',
      applied_at: '2026-11-12T15:30:00Z',
    },
  ],
  bills: [
    {
      id: 701,
      user_id: 1,
      account: 101,
      account_number: '202600104582',
      biller_category: 'ELECTRICITY',
      biller_name: 'TANGEDCO Electricity Board',
      consumer_number: '09214005812',
      amount: 3450,
      reference_id: 'BBPS20261105003',
      auto_pay: true,
      created_at: '2026-11-05T18:05:00Z',
    },
  ],
  support_tickets: [
    {
      id: 801,
      user_id: 1,
      customer_name: 'Manojkumar',
      customer_id: 'BEB1002045',
      ticket_number: 'SR20261001',
      request_type: 'CHEQUE_BOOK',
      request_type_display: 'New Cheque Book Request (25 Leaves)',
      subject: 'Request 25-leaf Personalized Cheque Book for Current Account',
      description: 'Please dispatch a 25-leaf personalized cheque book for my Current Account 202600908114 to my registered T. Nagar address.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      admin_response: 'Cheque book printing initiated via Chennai Security Press. Dispatch tracking ID will be shared within 24 hours.',
      created_at: '2026-11-09T11:20:00Z',
    },
    {
      id: 802,
      user_id: 3,
      customer_name: 'Karthik Sundaram',
      customer_id: 'BEB1002047',
      ticket_number: 'SR20261002',
      request_type: 'KYC_UPDATE',
      request_type_display: 'Re-KYC / PAN / Address Update',
      subject: 'Expedite Video KYC Verification for Account Activation',
      description: 'I have uploaded my PAN and Aadhaar XML. Kindly verify my KYC so I can increase my daily IMPS limit.',
      priority: 'HIGH',
      status: 'OPEN',
      admin_response: '',
      created_at: '2026-11-12T09:45:00Z',
    },
  ],
  audit_logs: [
    {
      id: 901,
      user_id: 99,
      user_name: 'Murugananthan',
      customer_id: 'BEB9990001',
      action: 'ADMIN_ACTION',
      description: 'System initialized with BeBank Demo Banking Dataset',
      ip_address: '127.0.0.1',
      status: 'SUCCESS',
      created_at: '2026-11-01T08:00:00Z',
    },
    {
      id: 902,
      user_id: 1,
      user_name: 'Manojkumar',
      customer_id: 'BEB1002045',
      action: 'LOGIN',
      description: 'Successful login via BeBank Web Portal (CUSTOMER)',
      ip_address: '127.0.0.1',
      status: 'SUCCESS',
      created_at: '2026-11-13T09:15:00Z',
    },
  ],
};

function getLocalState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_STATE));
      return JSON.parse(JSON.stringify(INITIAL_SEED_STATE));
    }
    return JSON.parse(raw);
  } catch {
    return JSON.parse(JSON.stringify(INITIAL_SEED_STATE));
  }
}

function saveLocalState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not persist state to localStorage:', e);
  }
}

export function resetDemoDatabase() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_STATE));
  return JSON.parse(JSON.stringify(INITIAL_SEED_STATE));
}

async function tryBackendFetch(endpoint, options = {}, isRetry = false) {
  let token = localStorage.getItem('bebank_access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    // JWT Refresh Interceptor: If 401 Unauthorized and refresh token exists, renew access token and retry
    if (res.status === 401 && !isRetry && endpoint !== '/auth/login/' && endpoint !== '/auth/refresh/') {
      const refreshToken = localStorage.getItem('bebank_refresh_token');
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_BASE}/auth/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
          });
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            if (refreshData.access) {
              localStorage.setItem('bebank_access_token', refreshData.access);
              if (refreshData.refresh) {
                localStorage.setItem('bebank_refresh_token', refreshData.refresh);
              }
              return await tryBackendFetch(endpoint, options, true);
            }
          }
        } catch {
          // Token refresh failed; proceed with standard 401 handling
        }
      }
    }

    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data, live: true };
  } catch {
    clearTimeout(timeout);
    return { ok: false, live: false };
  }
}

export const bankingApi = {
  async checkHealth() {
    const res = await tryBackendFetch('/health/');
    if (res.live && res.ok) {
      return { liveBackend: true, ...res.data };
    }
    return {
      liveBackend: false,
      status: 'healthy',
      bank_name: 'BeBank',
      demo_banking_mode: true,
    };
  },

  async login(identifier, password) {
    const res = await tryBackendFetch('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    if (res.live) {
      if (!res.ok) {
        throw new Error(res.data?.detail || res.data?.non_field_errors?.[0] || 'Invalid credentials');
      }
      localStorage.setItem('bebank_access_token', res.data.access);
      return { ...res.data, liveBackend: true };
    }

    // Local stateful fallback
    const state = getLocalState();
    const cleanId = identifier.trim().toLowerCase();
    const user = state.users.find(
      (u) => u.email.toLowerCase() === cleanId || u.customer_id.toLowerCase() === cleanId
    );
    if (!user || user.password !== password) {
      throw new Error('Invalid Customer ID / Email or Password.');
    }
    if (user.is_locked) {
      throw new Error('Your account is locked for security. Please contact BeBank Administrator.');
    }
    state.audit_logs.unshift({
      id: Date.now(),
      user_id: user.id,
      user_name: user.full_name,
      customer_id: user.customer_id,
      action: 'LOGIN',
      description: `Successful login via Web Portal (${user.role})`,
      ip_address: '127.0.0.1',
      status: 'SUCCESS',
      created_at: new Date().toISOString(),
    });
    saveLocalState(state);
    return { access: 'demo-jwt-token', user, liveBackend: false };
  },

  async registerCustomer(payload) {
    const res = await tryBackendFetch('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.live) {
      if (!res.ok) {
        const firstErr = Object.values(res.data || {})[0];
        throw new Error(Array.isArray(firstErr) ? firstErr[0] : 'Registration failed');
      }
      localStorage.setItem('bebank_access_token', res.data.access);
      return { ...res.data, liveBackend: true };
    }

    const state = getLocalState();
    if (state.users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const newUserId = Date.now();
    const cid = 'BEB' + Math.floor(1000000 + Math.random() * 9000000);
    const acctNum = '2026' + Math.floor(10000000 + Math.random() * 90000000);
    const deposit = Number(payload.initial_deposit || 25000);

    const newUser = {
      id: newUserId,
      customer_id: cid,
      email: payload.email,
      password: payload.password,
      mpin: payload.mpin || '1234',
      full_name: payload.full_name,
      phone_number: payload.phone_number || '+91 98400 00000',
      role: 'CUSTOMER',
      kyc_status: 'VERIFIED',
      pan_number: payload.pan_number || 'ABCDE1234F',
      aadhaar_masked: 'XXXX-XXXX-6789',
      address: payload.address || 'Anna Salai, Chennai',
      city: payload.city || 'Chennai',
      state: payload.state || 'Tamil Nadu',
      pincode: payload.pincode || '600002',
      two_factor_enabled: true,
      is_locked: false,
      created_at: new Date().toISOString(),
    };
    state.users.push(newUser);

    const newAcct = {
      id: newUserId + 1,
      user_id: newUserId,
      account_number: acctNum,
      account_type: 'SAVINGS',
      account_type_display: 'BeBank Smart Savings Account',
      ifsc_code: 'BEBK0000101',
      branch_name: `${newUser.city} Main Branch`,
      balance: deposit,
      currency: 'INR',
      status: 'ACTIVE',
      daily_transfer_limit: 200000,
      nominee_name: 'Registered Nominee',
      created_at: new Date().toISOString(),
    };
    state.accounts.push(newAcct);

    state.transactions.unshift({
      id: Date.now() + 2,
      reference_id: 'TXN' + Math.floor(10000000000 + Math.random() * 89999999999),
      account: newAcct.id,
      account_number: acctNum,
      customer_name: newUser.full_name,
      transaction_type: 'CREDIT',
      channel: 'INTERNAL',
      category: 'DEPOSIT',
      amount: deposit,
      balance_after: deposit,
      counterparty_name: 'BeBank Welcome Onboarding Credit (Demo)',
      counterparty_account: 'BEBANK-TREASURY',
      counterparty_ifsc: 'BEBK0000001',
      description: 'Welcome Demo Opening Balance Credit',
      status: 'COMPLETED',
      is_demo: true,
      created_at: new Date().toISOString(),
    });

    state.cards.push({
      id: Date.now() + 3,
      user_id: newUserId,
      linked_account: newAcct.id,
      account_number: acctNum,
      card_number_masked: `4532 •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      card_type: 'DEBIT_PLATINUM',
      card_type_display: 'BeBank Platinum Visa Debit Card',
      network: 'VISA',
      cardholder_name: newUser.full_name.toUpperCase(),
      expiry_month: 11,
      expiry_year: 2030,
      cvv_masked: '•••',
      status: 'ACTIVE',
      domestic_enabled: true,
      international_enabled: false,
      contactless_enabled: true,
      online_tx_enabled: true,
      atm_enabled: true,
      daily_atm_limit: 50000,
      daily_pos_limit: 150000,
      reward_points: 500,
    });

    saveLocalState(state);
    return { access: 'demo-jwt-token', user: newUser, liveBackend: false };
  },

  async getCustomerDashboard(userId) {
    const res = await tryBackendFetch('/banking/dashboard/');
    if (res.live && res.ok) return res.data;

    const state = getLocalState();
    const accounts = state.accounts.filter((a) => a.user_id === userId);
    const acctIds = accounts.map((a) => a.id);
    const total_balance = accounts.reduce((s, a) => s + Number(a.balance), 0);
    const deposits = state.deposits.filter((d) => d.user_id === userId && d.status === 'ACTIVE');
    const total_deposits = deposits.reduce((s, d) => s + Number(d.principal_amount), 0);
    const recent_transactions = state.transactions.filter((t) => acctIds.includes(t.account)).slice(0, 10);
    const quick_beneficiaries = state.beneficiaries.filter((b) => b.user_id === userId);

    return {
      total_balance,
      total_deposits,
      accounts,
      recent_transactions,
      quick_beneficiaries,
      deposits_count: deposits.length,
    };
  },

  async getAccounts(userId) {
    const res = await tryBackendFetch('/banking/accounts/');
    if (res.live && res.ok) return res.data;
    const state = getLocalState();
    return state.accounts.filter((a) => a.user_id === userId);
  },

  async updateAccountLimit(userId, accountId, daily_transfer_limit) {
    const res = await tryBackendFetch(`/banking/accounts/${accountId}/limit/`, {
      method: 'PATCH',
      body: JSON.stringify({ daily_transfer_limit }),
    });
    if (res.live && res.ok) return res.data;

    const state = getLocalState();
    const acct = state.accounts.find((a) => a.id === Number(accountId) && a.user_id === userId);
    if (!acct) throw new Error('Account not found');
    acct.daily_transfer_limit = Number(daily_transfer_limit);
    saveLocalState(state);
    return acct;
  },

  async getTransactions(userId, filters = {}) {
    const params = new URLSearchParams();
    if (filters.account_id) params.set('account_id', filters.account_id);
    if (filters.transaction_type) params.set('transaction_type', filters.transaction_type);
    if (filters.channel) params.set('channel', filters.channel);
    if (filters.search) params.set('search', filters.search);

    const res = await tryBackendFetch(`/banking/transactions/?${params.toString()}`);
    if (res.live && res.ok) return res.data;

    const state = getLocalState();
    const acctIds = state.accounts.filter((a) => a.user_id === userId).map((a) => a.id);
    return state.transactions.filter((t) => {
      if (!acctIds.includes(t.account)) return false;
      if (filters.account_id && Number(t.account) !== Number(filters.account_id)) return false;
      if (filters.transaction_type && t.transaction_type !== filters.transaction_type) return false;
      if (filters.channel && t.channel !== filters.channel) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const match =
          t.counterparty_name.toLowerCase().includes(q) ||
          t.reference_id.toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  },

  async getBeneficiaries(userId) {
    const res = await tryBackendFetch('/banking/beneficiaries/');
    if (res.live && res.ok) return res.data;
    const state = getLocalState();
    return state.beneficiaries.filter((b) => b.user_id === userId);
  },

  async addBeneficiary(userId, payload) {
    const res = await tryBackendFetch('/banking/beneficiaries/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.live && res.ok) return res.data;

    const state = getLocalState();
    const newBen = {
      id: Date.now(),
      user_id: userId,
      name: payload.name,
      nickname: payload.nickname || payload.name.split(' ')[0],
      account_number: payload.account_number,
      bank_name: payload.bank_name || 'BeBank',
      ifsc_code: payload.ifsc_code || 'BEBK0000101',
      upi_id: payload.upi_id || '',
      daily_limit: Number(payload.daily_limit || 100000),
      is_favorite: Boolean(payload.is_favorite),
      is_verified: true,
    };
    state.beneficiaries.unshift(newBen);
    saveLocalState(state);
    return newBen;
  },

  async deleteBeneficiary(userId, benId) {
    const res = await tryBackendFetch(`/banking/beneficiaries/${benId}/`, {
      method: 'DELETE',
    });
    if (res.live && res.ok) return true;
    const state = getLocalState();
    state.beneficiaries = state.beneficiaries.filter((b) => !(b.id === benId && b.user_id === userId));
    saveLocalState(state);
    return true;
  },

  async transferFunds(userId, payload) {
    const res = await tryBackendFetch('/banking/transfer/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.live) {
      if (!res.ok) throw new Error(res.data?.detail || 'Transfer failed');
      return res.data;
    }

    const state = getLocalState();
    const user = state.users.find((u) => u.id === userId);
    if (!user || String(user.mpin) !== String(payload.mpin).trim()) {
      throw new Error('Invalid 4-digit Transaction MPIN. Please enter valid MPIN (Demo default: 1234).');
    }

    const sourceAcct = state.accounts.find(
      (a) => a.id === Number(payload.source_account_id) && a.user_id === userId
    );
    if (!sourceAcct) throw new Error('Source account not found.');
    if (sourceAcct.status !== 'ACTIVE') {
      throw new Error(`Your account ${sourceAcct.account_number} is currently ${sourceAcct.status}.`);
    }

    const amount = Number(payload.amount);
    if (amount <= 0) throw new Error('Transfer amount must be greater than zero.');
    if (amount > Number(sourceAcct.daily_transfer_limit)) {
      throw new Error(`Amount exceeds your daily transfer limit of ₹${Number(sourceAcct.daily_transfer_limit).toLocaleString('en-IN')}.`);
    }
    if (Number(sourceAcct.balance) < amount) {
      throw new Error('Insufficient balance in selected bank account.');
    }

    sourceAcct.balance = Number((Number(sourceAcct.balance) - amount).toFixed(2));
    const refId = 'TXN' + Math.floor(10000000000 + Math.random() * 89999999999);
    const txStatus = amount >= 500000 ? 'FLAGGED' : 'COMPLETED';

    const newTx = {
      id: Date.now(),
      reference_id: refId,
      account: sourceAcct.id,
      account_number: sourceAcct.account_number,
      customer_name: user.full_name,
      transaction_type: 'DEBIT',
      channel: payload.channel || 'IMPS',
      category: payload.category || 'TRANSFER',
      amount,
      balance_after: sourceAcct.balance,
      counterparty_name: payload.recipient_name,
      counterparty_account: payload.recipient_account,
      counterparty_ifsc: payload.recipient_ifsc || 'BEBK0000101',
      description: payload.description || `${payload.channel} Transfer to ${payload.recipient_name}`,
      status: txStatus,
      is_demo: true,
      created_at: new Date().toISOString(),
    };
    state.transactions.unshift(newTx);

    // Credit destination if internal BeBank account
    const destAcct = state.accounts.find(
      (a) => a.account_number === payload.recipient_account && a.id !== sourceAcct.id
    );
    if (destAcct && destAcct.status === 'ACTIVE') {
      destAcct.balance = Number((Number(destAcct.balance) + amount).toFixed(2));
      const destOwner = state.users.find((u) => u.id === destAcct.user_id);
      state.transactions.unshift({
        id: Date.now() + 1,
        reference_id: 'CR' + Math.floor(10000000000 + Math.random() * 89999999999),
        account: destAcct.id,
        account_number: destAcct.account_number,
        customer_name: destOwner?.full_name || 'BeBank Customer',
        transaction_type: 'CREDIT',
        channel: payload.channel || 'IMPS',
        category: 'TRANSFER',
        amount,
        balance_after: destAcct.balance,
        counterparty_name: user.full_name,
        counterparty_account: sourceAcct.account_number,
        counterparty_ifsc: sourceAcct.ifsc_code,
        description: `Received via ${payload.channel} from ${user.full_name} (Ref: ${refId})`,
        status: 'COMPLETED',
        is_demo: true,
        created_at: new Date().toISOString(),
      });
    }

    state.audit_logs.unshift({
      id: Date.now() + 2,
      user_id: user.id,
      user_name: user.full_name,
      customer_id: user.customer_id,
      action: 'TRANSFER',
      description: `Transferred ₹${amount.toLocaleString('en-IN')} to ${payload.recipient_name} via ${payload.channel} [Ref: ${refId}]`,
      ip_address: '127.0.0.1',
      status: 'SUCCESS',
      created_at: new Date().toISOString(),
    });

    saveLocalState(state);
    return {
      detail: 'Demo Fund Transfer Completed Successfully!',
      transaction: newTx,
      updated_balance: sourceAcct.balance,
    };
  },

  async getCards(userId) {
    const res = await tryBackendFetch('/cards/');
    if (res.live && res.ok) return res.data;
    const state = getLocalState();
    return state.cards.filter((c) => c.user_id === userId);
  },

  async updateCardControls(userId, cardId, updates) {
    const res = await tryBackendFetch(`/cards/${cardId}/controls/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    if (res.live && res.ok) return res.data;

    const state = getLocalState();
    const card = state.cards.find((c) => c.id === Number(cardId) && c.user_id === userId);
    if (!card) throw new Error('Card not found');
    Object.assign(card, updates);

    const user = state.users.find((u) => u.id === userId);
    state.audit_logs.unshift({
      id: Date.now(),
      user_id: userId,
      user_name: user?.full_name || 'Customer',
      customer_id: user?.customer_id || '',
      action: 'CARD_CONTROL',
      description: `Updated card controls for ${card.card_number_masked} (Status: ${card.status})`,
      ip_address: '127.0.0.1',
      status: 'SUCCESS',
      created_at: new Date().toISOString(),
    });
    saveLocalState(state);
    return card;
  },

  async getDeposits(userId) {
    const res = await tryBackendFetch('/banking/deposits/');
    if (res.live && res.ok) return res.data;
    const state = getLocalState();
    return state.deposits.filter((d) => d.user_id === userId);
  },

  async createDeposit(userId, payload) {
    const res = await tryBackendFetch('/banking/deposits/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.live) {
      if (!res.ok) throw new Error(res.data?.detail || 'Could not create deposit');
      return res.data;
    }

    const state = getLocalState();
    const acct = state.accounts.find((a) => a.id === Number(payload.source_account) && a.user_id === userId);
    if (!acct) throw new Error('Source account not found');
    const principal = Number(payload.principal_amount);
    if (principal < 1000) throw new Error('Minimum deposit amount is ₹1,000.');
    if (Number(acct.balance) < principal) throw new Error('Insufficient balance in selected account.');

    acct.balance = Number((Number(acct.balance) - principal).toFixed(2));
    const tenure = Number(payload.tenure_months || 12);
    const rate = tenure < 6 ? 6.25 : tenure < 12 ? 6.80 : tenure <= 24 ? 7.25 : 7.40;
    const maturity_amount = Math.round(principal + (principal * rate * (tenure / 12)) / 100);
    const matDate = new Date();
    matDate.setMonth(matDate.getMonth() + tenure);
    const depNum = `${payload.deposit_type || 'FD'}2026${Math.floor(100000 + Math.random() * 899999)}`;

    const newDep = {
      id: Date.now(),
      user_id: userId,
      source_account: acct.id,
      source_account_number: acct.account_number,
      deposit_number: depNum,
      deposit_type: payload.deposit_type || 'FD',
      principal_amount: principal,
      interest_rate: rate,
      tenure_months: tenure,
      maturity_amount,
      maturity_date: matDate.toISOString().split('T')[0],
      auto_renew: Boolean(payload.auto_renew),
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };
    state.deposits.unshift(newDep);

    const user = state.users.find((u) => u.id === userId);
    state.transactions.unshift({
      id: Date.now() + 1,
      reference_id: 'FD' + Math.floor(10000000000 + Math.random() * 89999999999),
      account: acct.id,
      account_number: acct.account_number,
      customer_name: user?.full_name || 'Customer',
      transaction_type: 'DEBIT',
      channel: 'FD_BOOKING',
      category: 'DEPOSIT',
      amount: principal,
      balance_after: acct.balance,
      counterparty_name: `BeBank ${newDep.deposit_type} #${depNum}`,
      counterparty_account: depNum,
      counterparty_ifsc: acct.ifsc_code,
      description: `Opened ${newDep.deposit_type} for ${tenure} months @ ${rate}% p.a.`,
      status: 'COMPLETED',
      is_demo: true,
      created_at: new Date().toISOString(),
    });

    saveLocalState(state);
    return newDep;
  },

  async getLoans(userId) {
    const res = await tryBackendFetch('/loans/');
    if (res.live && res.ok) return res.data;
    const state = getLocalState();
    return state.loans.filter((l) => l.user_id === userId);
  },

  async applyLoan(userId, payload) {
    const res = await tryBackendFetch('/loans/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.live) {
      if (!res.ok) throw new Error(res.data?.detail || 'Loan application failed');
      return res.data;
    }

    const state = getLocalState();
    const user = state.users.find((u) => u.id === userId);
    const acct = state.accounts.find((a) => a.id === Number(payload.disbursal_account)) || state.accounts.find((a) => a.user_id === userId);
    const principal = Number(payload.principal_amount);
    const tenure = Number(payload.tenure_months || 24);
    const rateMap = { HOME: 8.65, VEHICLE: 9.15, EDUCATION: 8.90, BUSINESS: 11.25, PERSONAL: 10.75 };
    const rate = rateMap[payload.loan_type] || 10.75;
    const r = rate / (12 * 100);
    const emi = Math.round((principal * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1));
    const total_payable = emi * tenure;
    const loanNum = 'LN2026' + Math.floor(100000 + Math.random() * 899999);

    const typeLabels = {
      PERSONAL: 'Instant Personal Loan',
      HOME: 'BeBank Dream Home Loan',
      VEHICLE: 'Green EV & Car Loan',
      EDUCATION: 'Global Scholar Education Loan',
      BUSINESS: 'MSME Business Growth Loan',
    };

    const newLoan = {
      id: Date.now(),
      user_id: userId,
      customer_name: user?.full_name || 'Customer',
      customer_id: user?.customer_id || '',
      disbursal_account: acct.id,
      account_number: acct.account_number,
      loan_number: loanNum,
      loan_type: payload.loan_type,
      loan_type_display: typeLabels[payload.loan_type] || payload.loan_type,
      principal_amount: principal,
      interest_rate: rate,
      tenure_months: tenure,
      emi_amount: emi,
      total_payable,
      outstanding_balance: total_payable,
      purpose: payload.purpose,
      monthly_income: Number(payload.monthly_income || 85000),
      employment_type: payload.employment_type || 'Salaried',
      status: 'PENDING_APPROVAL',
      admin_remarks: 'Submitted via Digital Portal. Pending Admin Underwriting.',
      applied_at: new Date().toISOString(),
    };
    state.loans.unshift(newLoan);
    saveLocalState(state);
    return newLoan;
  },

  async getBills(userId) {
    const res = await tryBackendFetch('/banking/bills/');
    if (res.live && res.ok) return res.data;
    const state = getLocalState();
    return state.bills.filter((b) => b.user_id === userId);
  },

  async payBill(userId, payload) {
    const res = await tryBackendFetch('/banking/bills/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.live) {
      if (!res.ok) throw new Error(res.data?.detail || 'Bill payment failed');
      return res.data;
    }

    const state = getLocalState();
    const user = state.users.find((u) => u.id === userId);
    if (!user || String(user.mpin) !== String(payload.mpin).trim()) {
      throw new Error('Invalid 4-digit Transaction MPIN.');
    }
    const acct = state.accounts.find((a) => a.id === Number(payload.account) && a.user_id === userId);
    if (!acct) throw new Error('Account not found');
    const amount = Number(payload.amount);
    if (Number(acct.balance) < amount) throw new Error('Insufficient balance for bill payment.');

    acct.balance = Number((Number(acct.balance) - amount).toFixed(2));
    const refId = 'BBPS' + Math.floor(1000000000 + Math.random() * 8999999999);
    const newBill = {
      id: Date.now(),
      user_id: userId,
      account: acct.id,
      account_number: acct.account_number,
      biller_category: payload.biller_category,
      biller_name: payload.biller_name,
      consumer_number: payload.consumer_number,
      amount,
      reference_id: refId,
      auto_pay: Boolean(payload.auto_pay),
      created_at: new Date().toISOString(),
    };
    state.bills.unshift(newBill);

    state.transactions.unshift({
      id: Date.now() + 1,
      reference_id: refId,
      account: acct.id,
      account_number: acct.account_number,
      customer_name: user.full_name,
      transaction_type: 'DEBIT',
      channel: 'BILL_PAY',
      category: 'UTILITIES',
      amount,
      balance_after: acct.balance,
      counterparty_name: payload.biller_name,
      counterparty_account: payload.consumer_number,
      counterparty_ifsc: 'BBPS0000001',
      description: `Bill Pay: ${payload.biller_name} (#${payload.consumer_number})`,
      status: 'COMPLETED',
      is_demo: true,
      created_at: new Date().toISOString(),
    });
    saveLocalState(state);
    return newBill;
  },

  async getSupportTickets(userId) {
    const res = await tryBackendFetch('/support/');
    if (res.live && res.ok) return res.data;
    const state = getLocalState();
    return state.support_tickets.filter((s) => s.user_id === userId);
  },

  async createSupportTicket(userId, payload) {
    const res = await tryBackendFetch('/support/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.live && res.ok) return res.data;

    const state = getLocalState();
    const user = state.users.find((u) => u.id === userId);
    const labels = {
      CHEQUE_BOOK: 'New Cheque Book Request (25 Leaves)',
      STOP_PAYMENT: 'Stop Cheque Payment Instruction',
      KYC_UPDATE: 'Re-KYC / PAN / Address Update',
      DISPUTE_TRANSACTION: 'Transaction Dispute / Chargeback',
      ACCOUNT_STATEMENT: 'Certified Physical Account Statement',
      GENERAL_INQUIRY: 'General Banking Assistance',
    };
    const ticket = {
      id: Date.now(),
      user_id: userId,
      customer_name: user?.full_name || 'Customer',
      customer_id: user?.customer_id || '',
      ticket_number: 'SR' + Math.floor(10000000 + Math.random() * 89999999),
      request_type: payload.request_type,
      request_type_display: labels[payload.request_type] || payload.request_type,
      subject: payload.subject,
      description: payload.description,
      priority: payload.priority || 'MEDIUM',
      status: 'OPEN',
      admin_response: '',
      created_at: new Date().toISOString(),
    };
    state.support_tickets.unshift(ticket);
    saveLocalState(state);
    return ticket;
  },

  async changeMpin(userId, current_mpin, new_mpin) {
    const res = await tryBackendFetch('/auth/change-mpin/', {
      method: 'POST',
      body: JSON.stringify({ current_mpin, new_mpin }),
    });
    if (res.live) {
      if (!res.ok) throw new Error(res.data?.detail || 'Could not update MPIN');
      return res.data;
    }

    const state = getLocalState();
    const user = state.users.find((u) => u.id === userId);
    if (!user || String(user.mpin) !== String(current_mpin)) {
      throw new Error('Current MPIN is incorrect.');
    }
    if (!/^\d{4}$/.test(String(new_mpin))) {
      throw new Error('New MPIN must be an exact 4-digit number.');
    }
    user.mpin = String(new_mpin);
    state.audit_logs.unshift({
      id: Date.now(),
      user_id: userId,
      user_name: user.full_name,
      customer_id: user.customer_id,
      action: 'PIN_CHANGE',
      description: 'Customer updated 4-digit Transaction MPIN',
      ip_address: '127.0.0.1',
      status: 'SUCCESS',
      created_at: new Date().toISOString(),
    });
    saveLocalState(state);
    return { detail: '4-digit Transaction MPIN updated successfully!' };
  },

  async getCustomerAuditLogs(userId) {
    const res = await tryBackendFetch('/auth/audit-logs/');
    if (res.live && res.ok) return res.data;
    const state = getLocalState();
    return state.audit_logs.filter((l) => l.user_id === userId);
  },

  // ================= ADMIN PORTAL APIs =================
  async getAdminSummary() {
    const res = await tryBackendFetch('/admin-portal/summary/');
    if (res.live && res.ok) return res.data;

    const state = getLocalState();
    const customers = state.users.filter((u) => u.role === 'CUSTOMER');
    const total_deposits_aum = state.accounts.reduce((s, a) => s + Number(a.balance), 0);
    const total_term_deposits = state.deposits.reduce((s, d) => s + Number(d.principal_amount), 0);

    const chanMap = {};
    state.transactions.forEach((t) => {
      if (!chanMap[t.channel]) chanMap[t.channel] = { channel: t.channel, count: 0, volume: 0 };
      chanMap[t.channel].count += 1;
      chanMap[t.channel].volume += Number(t.amount);
    });

    return {
      kpis: {
        total_customers: customers.length,
        pending_kyc: customers.filter((c) => c.kyc_status === 'PENDING').length,
        total_accounts: state.accounts.length,
        total_deposits_aum,
        total_term_deposits,
        total_transactions: state.transactions.length,
        flagged_transactions: state.transactions.filter((t) => t.status === 'FLAGGED').length,
        pending_loans: state.loans.filter((l) => l.status === 'PENDING_APPROVAL').length,
        open_tickets: state.support_tickets.filter((s) => s.status !== 'RESOLVED' && s.status !== 'CLOSED').length,
      },
      channel_breakdown: Object.values(chanMap),
      recent_transactions: state.transactions.slice(0, 12),
      recent_audit_logs: state.audit_logs.slice(0, 12),
    };
  },

  async getAdminCustomers() {
    const res = await tryBackendFetch('/admin-portal/customers/');
    if (res.live && res.ok) return res.data;

    const state = getLocalState();
    return state.users
      .filter((u) => u.role === 'CUSTOMER')
      .map((c) => ({
        ...c,
        accounts: state.accounts.filter((a) => a.user_id === c.id),
      }));
  },

  async performAdminCustomerAction(customerId, payload) {
    const res = await tryBackendFetch(`/admin-portal/customers/${customerId}/action/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    if (res.live && res.ok) return res.data;

    const state = getLocalState();
    const customer = state.users.find((u) => u.id === Number(customerId));
    if (!customer) throw new Error('Customer not found');

    let desc = '';
    if (payload.action_type === 'UPDATE_KYC') {
      customer.kyc_status = payload.kyc_status;
      desc = `Admin updated KYC status for ${customer.full_name} (${customer.customer_id}) to ${payload.kyc_status}`;
    } else if (payload.action_type === 'TOGGLE_LOCK') {
      customer.is_locked = !customer.is_locked;
      desc = `Admin ${customer.is_locked ? 'locked' : 'unlocked'} login access for ${customer.customer_id}`;
    } else if (payload.action_type === 'TOGGLE_ACCOUNT_STATUS') {
      const acct = state.accounts.find((a) => a.id === Number(payload.account_id));
      if (acct) {
        acct.status = acct.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
        desc = `Admin changed account ${acct.account_number} status to ${acct.status}`;
      }
    } else if (payload.action_type === 'DEMO_TOPUP') {
      const acct = state.accounts.find((a) => a.id === Number(payload.account_id));
      const amt = Number(payload.amount || 25000);
      if (acct) {
        acct.balance = Number((Number(acct.balance) + amt).toFixed(2));
        state.transactions.unshift({
          id: Date.now(),
          reference_id: 'ADM' + Math.floor(10000000000 + Math.random() * 89999999999),
          account: acct.id,
          account_number: acct.account_number,
          customer_name: customer.full_name,
          transaction_type: 'CREDIT',
          channel: 'INTERNAL',
          category: 'DEPOSIT',
          amount: amt,
          balance_after: acct.balance,
          counterparty_name: 'BeBank Treasury Demo Credit',
          counterparty_account: 'BEBANK-TREASURY',
          counterparty_ifsc: 'BEBK0000001',
          description: 'Admin Demo Balance Top-Up',
          status: 'COMPLETED',
          is_demo: true,
          created_at: new Date().toISOString(),
        });
        desc = `Admin credited demo ₹${amt.toLocaleString('en-IN')} to account ${acct.account_number}`;
      }
    }

    state.audit_logs.unshift({
      id: Date.now() + 1,
      user_id: 99,
      user_name: 'Murugananthan (Admin)',
      customer_id: 'BEB9990001',
      action: 'ADMIN_ACTION',
      description: desc,
      ip_address: '127.0.0.1',
      status: 'SUCCESS',
      created_at: new Date().toISOString(),
    });
    saveLocalState(state);
    return {
      detail: desc,
      customer: {
        ...customer,
        accounts: state.accounts.filter((a) => a.user_id === customer.id),
      },
    };
  },

  async getAdminTransactions() {
    const res = await tryBackendFetch('/admin-portal/transactions/');
    if (res.live && res.ok) return res.data;
    const state = getLocalState();
    return state.transactions;
  },

  async updateAdminTransactionStatus(txId, status) {
    const res = await tryBackendFetch(`/admin-portal/transactions/${txId}/flag/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (res.live && res.ok) return res.data;

    const state = getLocalState();
    const tx = state.transactions.find((t) => t.id === Number(txId));
    if (!tx) throw new Error('Transaction not found');
    tx.status = status;
    saveLocalState(state);
    return tx;
  },

  async getAdminLoans() {
    const res = await tryBackendFetch('/admin-portal/loans/');
    if (res.live && res.ok) return res.data;
    const state = getLocalState();
    return state.loans;
  },

  async reviewAdminLoan(loanId, status, admin_remarks) {
    const res = await tryBackendFetch(`/admin-portal/loans/${loanId}/review/`, {
      method: 'PATCH',
      body: JSON.stringify({ status, admin_remarks }),
    });
    if (res.live && res.ok) return res.data;

    const state = getLocalState();
    const loan = state.loans.find((l) => l.id === Number(loanId));
    if (!loan) throw new Error('Loan not found');
    const wasApproved = loan.status === 'APPROVED' || loan.status === 'ACTIVE';
    loan.status = status;
    loan.admin_remarks = admin_remarks || `Marked ${status} by Credit Committee`;

    if (status === 'APPROVED' && !wasApproved) {
      const acct = state.accounts.find((a) => a.id === Number(loan.disbursal_account));
      if (acct) {
        acct.balance = Number((Number(acct.balance) + Number(loan.principal_amount)).toFixed(2));
        state.transactions.unshift({
          id: Date.now(),
          reference_id: 'LNCR' + Math.floor(1000000000 + Math.random() * 8999999999),
          account: acct.id,
          account_number: acct.account_number,
          customer_name: loan.customer_name,
          transaction_type: 'CREDIT',
          channel: 'LOAN_DISBURSAL',
          category: 'DEPOSIT',
          amount: Number(loan.principal_amount),
          balance_after: acct.balance,
          counterparty_name: `BeBank Loan Disbursal (${loan.loan_number})`,
          counterparty_account: loan.loan_number,
          counterparty_ifsc: acct.ifsc_code,
          description: `${loan.loan_type_display} Disbursal Approved by Admin`,
          status: 'COMPLETED',
          is_demo: true,
          created_at: new Date().toISOString(),
        });
      }
    }
    saveLocalState(state);
    return loan;
  },

  async getAdminSupportTickets() {
    const res = await tryBackendFetch('/admin-portal/support/');
    if (res.live && res.ok) return res.data;
    const state = getLocalState();
    return state.support_tickets;
  },

  async resolveAdminSupportTicket(ticketId, status, admin_response) {
    const res = await tryBackendFetch(`/admin-portal/support/${ticketId}/resolve/`, {
      method: 'PATCH',
      body: JSON.stringify({ status, admin_response }),
    });
    if (res.live && res.ok) return res.data;

    const state = getLocalState();
    const ticket = state.support_tickets.find((t) => t.id === Number(ticketId));
    if (!ticket) throw new Error('Ticket not found');
    ticket.status = status;
    ticket.admin_response = admin_response;
    saveLocalState(state);
    return ticket;
  },

  async getAdminAuditLogs() {
    const res = await tryBackendFetch('/admin-portal/audit-logs/');
    if (res.live && res.ok) return res.data;
    const state = getLocalState();
    return state.audit_logs;
  },
};
