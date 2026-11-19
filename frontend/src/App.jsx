import React, { useState } from 'react';
import { resetDemoDatabase } from './api/bankingApi';

const I18N = {
  English: {
    basic: 'Basic',
    privilege: 'Privilege',
    show: 'Show',
    hide: 'Hide',
    savings: 'Savings',
    odcc: 'OD/CC',
    deposits: 'Deposits',
    loans: 'Loans',
    adminBtn: 'Admin Portal',
    customerBtn: 'Customer Home',
    accDetails: 'Account Details',
    accStmt: 'Account Statement',
    mPassbook: 'm-Passbook',
    fundTrans: 'Fund Transfers',
    benefits: 'BeBank Benefits',
    callBack: 'Call Back',
    virtualRm: 'Virtual RM',
    priorityCard: 'Priority Service Card',
    upi: 'UPI',
    rewards: 'Rewards',
    openOd: 'Open OD Against...',
    wealthSmart: 'Wealth Smart',
    billPay: 'Bill Payments...',
    fastag: 'FASTag',
    applyLoan: 'Apply New Loan',
    applyDebit: 'Apply for New Debit...',
    debitCard: 'Debit Card',
    creditCard: 'Credit Card',
    loanAccs: 'Loan Accounts',
    itrFiling: 'ITR Filing',
    easyPay: 'Easy Pay',
    recharge: 'Recharge',
    manageLimits: 'Manage Limits',
    managePayee: 'Manage Payee',
  },
  'தமிழ்': {
    basic: 'அடிப்படை',
    privilege: 'சிறப்பு',
    show: 'காட்டு',
    hide: 'மறை',
    savings: 'சேமிப்பு',
    odcc: 'நடப்பு/OD',
    deposits: 'வைப்பு',
    loans: 'கடன்கள்',
    adminBtn: 'நிர்வாக தளம்',
    customerBtn: 'வாடிக்கையாளர் முகப்பு',
    accDetails: 'கணக்கு விவரம்',
    accStmt: 'கணக்கு அறிக்கை',
    mPassbook: 'இ-பாஸ்புக்',
    fundTrans: 'பண பரிமாற்றம்',
    benefits: 'BeBank சலுகை',
    callBack: 'அழைப்பு கோரிக்கை',
    virtualRm: 'உறவு மேலாளர்',
    priorityCard: 'முன்னுரிமை அட்டை',
    upi: 'UPI',
    rewards: 'வெகுமதிகள்',
    openOd: 'FD மீது OD',
    wealthSmart: 'செல்வ முதலீடு',
    billPay: 'பில் கட்டணம்',
    fastag: 'FASTag',
    applyLoan: 'புதிய கடன்',
    applyDebit: 'புதிய டெபிட் கார்டு',
    debitCard: 'டெபிட் கார்டு',
    creditCard: 'கிரெடிட் கார்டு',
    loanAccs: 'கடன் கணக்குகள்',
    itrFiling: 'வருமான வரி (ITR)',
    easyPay: 'எளிய பே',
    recharge: 'ரீசார்ஜ்',
    manageLimits: 'வரம்புகள்',
    managePayee: 'பயனாளிகள்',
  },
};

export default function App() {
  const [screen, setScreen] = useState('prelogin');
  const [isCustomerAuth, setIsCustomerAuth] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = useState(false); // 'home' | 'admin' | 'prelogin'
  const [language, setLanguage] = useState('English');
  const [tierMode, setTierMode] = useState('Basic');
  const [showBalances, setShowBalances] = useState(false);
  const [showAdminBalances, setShowAdminBalances] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [toast, setToast] = useState('');

  const [user, setUser] = useState({
    id: 1,
    name: 'Manojkumar',
    cif: 'BEB1002045',
    email: 'manojkumar@bebank.in',
    phone: '+91 98405 67890',
    pan: 'BGLPN4521C',
    nominee: 'Meera Kumar',
    mpin: '0710',
    kyc: 'VERIFIED',
    rewardPoints: 17470,
    fastagVehicle: 'TN 01 BW 2026',
    fastagBalance: 1420,
    loungeVisitsLeft: 4,
    priorityPassCode: 'BEB-PRIO-9920',
    form15gSubmitted: false,
  });

  const [bankRates, setBankRates] = useState({
    savingsRate: 4.0,
    fdRate: 7.25,
    loanBaseRate: 9.15,
  });

  const [accounts, setAccounts] = useState([
    {
      id: 101,
      number: '202600104582',
      type: 'SAVINGS',
      label: 'BeBank Smart Savings Account',
      ifsc: 'BEBK0000101',
      branch: 'Chennai Anna Salai Main Branch',
      balance: 485620.5,
      limit: 500000,
      upiLimit: 100000,
      status: 'ACTIVE',
    },
    {
      id: 102,
      number: '202600908114',
      type: 'OD/CC',
      label: 'BeBank Current / Overdraft Account',
      ifsc: 'BEBK0000101',
      branch: 'Chennai Anna Salai Main Branch',
      balance: 1240000.0,
      limit: 1500000,
      upiLimit: 200000,
      status: 'ACTIVE',
    },
  ]);

  const [deposits, setDeposits] = useState([
    { id: 501, number: 'FD2026008812', type: 'FD', principal: 250000, rate: 7.25, months: 12, maturity: 268125, maturityDate: '2027-08-25', status: 'ACTIVE', odTaken: false },
    { id: 502, number: 'RD2026004419', type: 'RD', principal: 60000, rate: 7.0, months: 24, maturity: 68400, maturityDate: '2028-05-10', status: 'ACTIVE', odTaken: false },
  ]);

  const [wealthInvestments, setWealthInvestments] = useState([
    { id: 1, name: 'BeBank Bluechip Equity SIP', category: 'Mutual Fund', invested: 125000, currentValue: 148200, returns: '+18.5%' },
    { id: 2, name: '24K Sovereign Digital Gold', category: 'Gold Bond', invested: 75000, currentValue: 86400, returns: '+15.2%' },
  ]);

  const [loans, setLoans] = useState([
    { id: 601, number: 'LN2026001920', applicant: 'Manojkumar', cif: 'BEB1002045', accountNumber: '202600104582', type: 'Vehicle Loan', principal: 850000, outstanding: 742100, rate: 9.15, months: 48, emi: 21214, purpose: 'Purchase of EV SUV', status: 'ACTIVE' },
    { id: 602, number: 'LN2026005541', applicant: 'Priya Sharma', cif: 'BEB1002046', accountNumber: '202600108921', type: 'Personal Loan', principal: 300000, outstanding: 300000, rate: 10.75, months: 24, emi: 13948, purpose: 'Home Studio & Workstation Upgrade', status: 'PENDING_APPROVAL' },
  ]);

  const [cards, setCards] = useState([
    { id: 401, masked: '4532 •••• •••• 8821', fullNumber: '4532 8910 4421 8821', cvv: '842', showCvv: false, type: 'DEBIT', label: 'BeBank Platinum Visa Debit Card', network: 'VISA', holder: 'MANOJKUMAR', exp: '11/30', status: 'ACTIVE', domestic: true, online: true, contactless: true, international: false },
    { id: 402, masked: '5419 •••• •••• 3094', fullNumber: '5419 7700 1290 3094', cvv: '916', showCvv: false, type: 'CREDIT', label: 'BeBank Emerald Mastercard Credit Card', network: 'MASTERCARD', holder: 'MANOJKUMAR', exp: '08/29', status: 'ACTIVE', domestic: true, online: true, contactless: true, international: true, creditLimit: 500000, billDue: 57500 },
  ]);

  const [benefitsList, setBenefitsList] = useState([
    { id: 1, title: '₹500 Instant Welcome Cashback', desc: 'Zero-fee digital banking reward credited directly to your Savings A/C', amount: 500, claimed: false },
    { id: 2, title: '₹250 Green Paperless Banking Bonus', desc: 'Bonus for activating e-Statements & m-Passbook', amount: 250, claimed: false },
    { id: 3, title: 'Zero Forex Markup Privilege', desc: 'Activated on your BeBank Emerald Card for international travel', amount: 0, claimed: true },
  ]);

  const [callbacks, setCallbacks] = useState([
    { id: 801, ticket: 'CB2026101', customer: 'Manojkumar', topic: 'Home Loan Top-Up Inquiry', slot: 'Today, 4:00 PM - 5:00 PM', status: 'OPEN' },
    { id: 802, ticket: 'SR2026102', customer: 'Karthik Sundaram', topic: 'Video KYC Verification Request', slot: 'Immediate', status: 'OPEN' },
  ]);

  const [cheques, setCheques] = useState([
    { id: 901, chequeNo: '448921', payee: 'Apex Builders Pvt Ltd', amount: 185000, date: '2026-11-14', status: 'VERIFIED' },
  ]);

  const [payees, setPayees] = useState([
    { id: 201, name: 'Priya Sharma', bank: 'BeBank', account: '202600108921', ifsc: 'BEBK0000102' },
    { id: 202, name: 'Vikram Nair', bank: 'HDFC Bank', account: '501002938475', ifsc: 'HDFC0000142' },
    { id: 203, name: 'Ananya Krishnan', bank: 'SBI', account: '309485716253', ifsc: 'SBIN0000800' },
  ]);

  const [transactions, setTransactions] = useState([
    { id: 301, ref: 'TXN20261112001', date: '2026-11-12', account: '202600104582', type: 'CREDIT', channel: 'NEFT', name: 'Zoho Corporation Pvt Ltd', desc: 'Monthly Salary Credit', amount: 165000.0, balance: 512120.5, status: 'COMPLETED' },
    { id: 302, ref: 'TXN20261112002', date: '2026-11-10', account: '202600104582', type: 'DEBIT', channel: 'IMPS', name: 'Vikram Nair', desc: 'Monthly Apartment Rent', amount: 22000.0, balance: 490120.5, status: 'COMPLETED' },
    { id: 303, ref: 'TXN20261112003', date: '2026-11-08', account: '202600104582', type: 'DEBIT', channel: 'BILL_PAY', name: 'TANGEDCO Electricity', desc: 'Electricity Bill #09214005812', amount: 3450.0, balance: 486670.5, status: 'COMPLETED' },
    { id: 304, ref: 'TXN20261112004', date: '2026-11-06', account: '202600104582', type: 'DEBIT', channel: 'UPI', name: 'Saravana Bhavan Anna Salai', desc: 'UPI Scan & Pay', amount: 1050.0, balance: 485620.5, status: 'COMPLETED' },
    { id: 305, ref: 'TXN20261112005', date: '2026-11-05', account: '202600908114', type: 'CREDIT', channel: 'RTGS', name: 'Apex Global Solutions LLP', desc: 'Enterprise Milestone Invoice #INV-204', amount: 640000.0, balance: 1240000.0, status: 'FLAGGED' },
  ]);

  const [adminCustomers, setAdminCustomers] = useState([
    { id: 1, name: 'Manojkumar', cif: 'BEB1002045', email: 'manojkumar@bebank.in', kyc: 'VERIFIED', account: '202600104582', balance: 485620.5, status: 'ACTIVE' },
    { id: 2, name: 'Priya Sharma', cif: 'BEB1002046', email: 'priya.sharma@bebank.in', kyc: 'VERIFIED', account: '202600108921', balance: 215400.0, status: 'ACTIVE' },
    { id: 3, name: 'Karthik Sundaram', cif: 'BEB1002047', email: 'karthik.s@bebank.in', kyc: 'PENDING', account: '202600109934', balance: 64000.0, status: 'ACTIVE' },
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, action: 'LOGIN', desc: 'Biometric & MPIN session authenticated for Manojkumar', time: 'Today, 07:40 AM' },
    { id: 2, action: 'SECURITY', desc: '256-Bit SSL & Two-Factor MPIN guard verified', time: 'Today, 07:30 AM' },
  ]);

  const [rmChat, setRmChat] = useState([
    { sender: 'rm', text: 'Hello Nithish! I am Anitha Krishnan, your dedicated BeBank Virtual Relationship Manager. How can I assist you today?' },
  ]);

  const t = (k) => (I18N[language] && I18N[language][k]) || I18N.English[k] || k;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  const formatRupee = (val, show) =>
    show
      ? `₹ ${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '₹ XXXX.XX';

  const recordDebit = (accIdx, amount, channel, name, desc) => {
    const numAmt = Number(amount);
    const updatedAccts = [...accounts];
    updatedAccts[accIdx].balance = +(updatedAccts[accIdx].balance - numAmt).toFixed(2);
    setAccounts(updatedAccts);
    if (accIdx === 0) {
      setAdminCustomers((prev) =>
        prev.map((c) => (c.id === 1 ? { ...c, balance: updatedAccts[0].balance } : c))
      );
    }
    const ref = 'TXN' + Math.floor(100000000 + Math.random() * 900000000);
    setTransactions((prev) => [
      {
        id: Date.now(),
        ref,
        date: new Date().toISOString().slice(0, 10),
        account: updatedAccts[accIdx].number,
        type: 'DEBIT',
        channel,
        name,
        desc,
        amount: numAmt,
        balance: updatedAccts[accIdx].balance,
        status: numAmt >= 500000 ? 'FLAGGED' : 'COMPLETED',
      },
      ...prev,
    ]);
    setAuditLogs((prev) => [
      { id: Date.now(), action: channel, desc: `Debited ₹${numAmt.toLocaleString('en-IN')} to ${name}`, time: 'Just now' },
      ...prev,
    ]);
    return ref;
  };

  const recordCredit = (accIdx, amount, channel, name, desc) => {
    const numAmt = Number(amount);
    const updatedAccts = [...accounts];
    updatedAccts[accIdx].balance = +(updatedAccts[accIdx].balance + numAmt).toFixed(2);
    setAccounts(updatedAccts);
    if (accIdx === 0) {
      setAdminCustomers((prev) =>
        prev.map((c) => (c.id === 1 ? { ...c, balance: updatedAccts[0].balance } : c))
      );
    }
    const ref = 'CR' + Math.floor(100000000 + Math.random() * 900000000);
    setTransactions((prev) => [
      {
        id: Date.now(),
        ref,
        date: new Date().toISOString().slice(0, 10),
        account: updatedAccts[accIdx].number,
        type: 'CREDIT',
        channel,
        name,
        desc,
        amount: numAmt,
        balance: updatedAccts[accIdx].balance,
        status: 'COMPLETED',
      },
      ...prev,
    ]);
    setAuditLogs((prev) => [
      { id: Date.now(), action: channel, desc: `Credited ₹${numAmt.toLocaleString('en-IN')} from ${name}`, time: 'Just now' },
      ...prev,
    ]);
    return ref;
  };

  const exportStatementCSV = () => {
    const rows = ['Date,Ref_ID,Account,Type,Channel,Counterparty,Description,Amount,Balance,Status'];
    transactions.forEach((tx) => {
      rows.push(`${tx.date},${tx.ref},${tx.account},${tx.type},${tx.channel},"${tx.name}","${tx.desc}",${tx.amount},${tx.balance},${tx.status}`);
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BeBank_Statement_${user.cif}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Statement CSV downloaded!');
  };

  const savingsBal = accounts[0].balance;
  const odBal = accounts[1].balance;
  const depBal = deposits.reduce((s, d) => s + d.principal, 0);
  const loanBal = loans.filter((l) => l.cif === user.cif).reduce((s, l) => s + l.outstanding, 0);

  const totalCasa = adminCustomers.reduce((s, c) => s + c.balance, 0);
  const totalLoansBook = loans.reduce((s, l) => s + l.principal, 0);
  const pendingKycCount = adminCustomers.filter((c) => c.kyc !== 'VERIFIED').length;
  const flaggedCount = transactions.filter((tx) => tx.status === 'FLAGGED').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2952] via-[#173B73] to-[#079669] py-0 sm:py-4 px-0 sm:px-4 flex justify-center">
      {toast && (
        <div className="fixed top-4 right-4 z-50 max-w-xs px-4 py-3 rounded-2xl shadow-2xl bg-[#079669] text-white text-xs font-bold border border-white/25">
          {toast}
        </div>
      )}

      <div className="max-w-[440px] w-full min-h-screen sm:min-h-[860px] bg-white sm:rounded-[38px] sm:shadow-2xl sm:border-[5px] sm:border-[#173B73] overflow-hidden flex flex-col relative">
        {/* ================= PRE-LOGIN SCREEN (Clean top-right Admin Portal & Language Change) ================= */}
        {screen === 'prelogin' && (
          <div className="flex-1 flex flex-col bg-[#173B73]">
            <div className="px-5 pt-4 pb-3 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => { setScreen('admin'); setActiveModal(null); }}
                className="px-3.5 py-1.5 rounded-full bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold shadow transition"
              >
                {t('adminBtn')} →
              </button>
              <button
                type="button"
                onClick={() => setLanguage(language === 'English' ? 'தமிழ்' : 'English')}
                className="px-3.5 py-1.5 rounded-full border border-white/60 text-white text-xs font-semibold flex items-center gap-1.5 bg-white/10"
              >
                <span>{language}</span>
                <span className="text-[10px]">▼</span>
              </button>
            </div>

            <div className="flex-1 bg-gradient-to-b from-[#F4F8FB] to-[#E6F1F8] rounded-t-[30px] px-5 pt-5 pb-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <img src="/assets/bebank-logo.png" alt="BeBank" className="h-7 object-contain" />
                <span className="text-[11px] font-bold text-[#079669] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  CIF: {user.cif}
                </span>
              </div>

              <div className="flex flex-col items-center text-center my-2">
                <div className="w-20 h-20 rounded-full bg-white shadow-md border-2 border-slate-200 flex items-center justify-center overflow-hidden mb-2">
                  <svg viewBox="0 0 24 24" className="w-16 h-16 text-slate-800 fill-current translate-y-2">
                    <circle cx="12" cy="8" r="4.5" />
                    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8H4z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#173B73]">Hi,</p>
                <h2 className="text-lg font-extrabold text-[#173B73]">{user.name}</h2>
                <span className="mt-1.5 px-6 py-1 rounded-full bg-[#173B73] text-white text-xs font-bold shadow">
                  {t('basic')}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    showToast('Biometric Verified! Welcome ' + user.name);
                    setScreen('home');
                  }}
                  className="mt-4 flex flex-col items-center group"
                >
                  <div className="w-13 h-13 p-2.5 rounded-full bg-white text-[#079669] shadow border border-[#079669]/30 group-hover:scale-105 transition">
                    <span className="text-2xl">🫆</span>
                  </div>
                  <span className="text-xs font-semibold text-[#173B73] mt-1.5 group-hover:underline">
                    Login with Biometric
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-between px-1 py-2 border-b border-slate-200 text-xs font-extrabold tracking-wide text-[#173B73]">
                <button type="button" onClick={() => setActiveModal('mpin_login')} className="hover:text-[#079669] uppercase">
                  LOGIN WITH MPIN
                </button>
                <button type="button" onClick={() => setActiveModal('mpin_login')} className="hover:text-[#079669] uppercase">
                  FORGOT MPIN
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5 my-3">
                {[
                  ['upi', 'UPI', '⚡'],
                  ['itr_filing', 'Digi Cert', '🛡️'],
                  ['benefits', 'Useful Links', '🔗'],
                  ['open_ac', 'Online A/C Opening', '👤'],
                  ['scan_qr', 'Scan and Pay', '⊞'],
                  ['apply_loan', 'Apply Digital Loans', '💰'],
                ].map(([id, label, ic]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setScreen('home');
                      setActiveModal(id);
                    }}
                    className="bg-white hover:bg-emerald-50 rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center min-h-[80px] transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#173B73]/10 text-[#079669] flex items-center justify-center mb-1.5 text-sm">
                      {ic}
                    </div>
                    <span className="text-[11px] font-semibold text-[#173B73] leading-tight">{label}</span>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-gradient-to-r from-[#173B73] via-[#1E4B8F] to-[#079669] text-white p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-emerald-300">One Number • Endless possibilities</p>
                  <div className="mt-1 inline-flex items-center gap-1.5 bg-white text-[#173B73] px-2.5 py-0.5 rounded-full text-xs font-extrabold">
                    <span>📞 1800-1700</span>
                  </div>
                  <p className="text-[10px] text-slate-200 mt-1">National Helpline | Toll Free | 24x7 Available</p>
                </div>
                <span className="px-2 py-1 rounded bg-red-600 text-white text-[10px] font-extrabold">
                  Report Fraud 1930
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= ADMIN PORTAL (Exact Same Visual Style as Home UI!) ================= */}
        {screen === 'admin' && (
          <div className="flex-1 flex flex-col bg-gradient-to-b from-[#D9ECFA] via-[#E8F4FA] to-[#D9ECFA] pb-24 relative">
            <header className="bg-[#173B73] text-white px-4 py-3 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <button type="button" onClick={() => setDrawerOpen(true)} className="p-1 rounded-lg hover:bg-white/10">
                  ☰
                </button>
                <span className="px-2.5 py-1 rounded-lg bg-[#079669] text-white text-xs font-extrabold tracking-wide">
                  BeBank Admin
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setScreen('home'); setActiveModal(null); }}
                  className="px-3 py-1 rounded-full bg-white text-[#173B73] hover:bg-emerald-50 text-[11px] font-extrabold shadow transition"
                >
                  {t('customerBtn')}
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage(language === 'English' ? 'தமிழ்' : 'English')}
                  className="px-2.5 py-1 rounded-full border border-white/50 bg-white/10 text-white text-[11px] font-bold"
                >
                  {language} ▼
                </button>
              </div>
            </header>

            <div className="px-4 py-2.5 flex items-center justify-between">
              <img src="/assets/bebank-logo.png" alt="BeBank" className="h-6 object-contain" />
              <div className="bg-white rounded-full p-1 shadow-sm flex items-center gap-1.5 border border-slate-200/80">
                <span className="px-4 py-1 rounded-full text-xs font-bold bg-[#173B73] text-white shadow">Admin CBS</span>
                <button
                  type="button"
                  onClick={() => setActiveModal('adm_audit')}
                  className="w-6 h-6 rounded-full bg-slate-200 text-[#173B73] text-xs font-bold flex items-center justify-center"
                >
                  i
                </button>
              </div>
            </div>

            <div className="px-4">
              <div className="bg-gradient-to-br from-[#173B73] via-[#1B4585] to-[#0F2952] rounded-2xl p-4 text-white shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                    Bank Treasury &amp; CBS
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAdminBalances(!showAdminBalances)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-xs font-semibold"
                  >
                    <span>👁 {showAdminBalances ? t('hide') : t('show')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 relative">
                  <div className="absolute inset-x-2 top-1/2 h-[1px] bg-white/20" />
                  <div className="absolute inset-y-1 left-1/2 w-[1px] bg-white/20" />

                  <button type="button" onClick={() => setActiveModal('adm_customers')} className="p-3 flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-300 flex items-center justify-center text-sm shrink-0">🏦</div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-extrabold truncate">{formatRupee(totalCasa, showAdminBalances)}</p>
                      <p className="text-[11px] font-semibold text-slate-200">Total CASA({adminCustomers.length})</p>
                    </div>
                  </button>

                  <button type="button" onClick={() => setActiveModal('adm_loans')} className="p-3 pl-4 flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-300 flex items-center justify-center text-sm shrink-0">💼</div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-extrabold truncate">{formatRupee(totalLoansBook, showAdminBalances)}</p>
                      <p className="text-[11px] font-semibold text-slate-200">Loan Book({loans.length})</p>
                    </div>
                  </button>

                  <button type="button" onClick={() => setActiveModal('adm_kyc')} className="p-3 flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-300 flex items-center justify-center text-sm shrink-0">👤</div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-extrabold truncate">{pendingKycCount} Pending</p>
                      <p className="text-[11px] font-semibold text-slate-200">KYC Queue({adminCustomers.length})</p>
                    </div>
                  </button>

                  <button type="button" onClick={() => setActiveModal('adm_transactions')} className="p-3 pl-4 flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-300 flex items-center justify-center text-sm shrink-0">🛡️</div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-extrabold truncate">{flaggedCount} Flagged</p>
                      <p className="text-[11px] font-semibold text-slate-200">Transactions({transactions.length})</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="px-4 py-4 grid grid-cols-4 gap-y-4 gap-x-2">
              {[
                ['adm_kyc', 'Customer KYC', '✅'],
                ['adm_customers', 'Manage A/Cs', '👥'],
                ['adm_topup', 'Credit Demo ₹', '💵'],
                ['adm_loans', 'Loan Approvals', '📝'],
                ['adm_transactions', 'AML Monitor', '🔍'],
                ['adm_callbacks', 'Support Desk', '🎧'],
                ['adm_rates', 'Interest Rates', '📊'],
                ['adm_audit', 'Audit Trail', '🔐'],
              ].map(([id, label, ic]) => (
                <button key={id} type="button" onClick={() => setActiveModal(id)} className="flex flex-col items-center text-center group">
                  <div className="w-13 h-13 p-3.5 rounded-full bg-white shadow-md border border-slate-100 group-hover:border-[#079669] flex items-center justify-center text-lg">
                    <span>{ic}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#173B73] mt-1.5 leading-tight px-0.5">{label}</span>
                </button>
              ))}
            </div>

            <div className="px-4 flex-1">
              <div className="bg-white rounded-3xl p-4 shadow-lg border border-slate-100 grid grid-cols-4 gap-y-5 gap-x-2">
                {[
                  ['open_ac', 'New A/C Opening', '➕'],
                  ['adm_cards', 'Card Hotlist', '💳'],
                  ['deposits', 'FD/RD Ledger', '🏦'],
                  ['open_od_fd', 'OD Sanctions', '⚡'],
                  ['adm_transactions', 'BBPS Ledger', '🧾'],
                  ['fastag', 'FASTag Pool', '🚗'],
                  ['adm_loans', 'Disburse Loan', '💰'],
                  ['adm_pps', 'Positive Pay', '✒️'],
                  ['adm_branch', 'Branch & IFSC', '🏢'],
                  ['adm_rewards', 'Rewards Desk', '🎁'],
                  ['itr_filing', '15G / Tax Desk', '📑'],
                  ['adm_export', 'Export Ledger', '📥'],
                ].map(([id, label, ic], idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => (id === 'adm_export' ? exportStatementCSV() : setActiveModal(id))}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-[#F4F8FB] group-hover:bg-emerald-50 flex items-center justify-center text-base">
                      <span>{ic}</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-700 mt-1.5 leading-tight line-clamp-2 px-0.5">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-[#C7E2F5] via-[#D8ECF8] to-white/95 border-t border-slate-200 px-2 pt-2 pb-2.5 flex items-end justify-around">
              <button type="button" onClick={() => setActiveModal('adm_kyc')} className="flex flex-col items-center text-[#173B73] w-16">
                <span className="text-base">✅</span>
                <span className="text-[10px] font-bold mt-0.5">KYC Desk</span>
              </button>
              <button type="button" onClick={() => setActiveModal('adm_topup')} className="flex flex-col items-center text-[#173B73] w-16">
                <span className="text-base">💵</span>
                <span className="text-[10px] font-bold mt-0.5">Top-Up A/C</span>
              </button>
              <div className="relative -top-4 flex flex-col items-center">
                <button type="button" onClick={() => setActiveModal('adm_customers')} className="w-14 h-14 rounded-full bg-white shadow-xl border-4 border-[#079669] flex items-center justify-center text-lg">
                  🛡️
                </button>
              </div>
              <button type="button" onClick={() => setActiveModal('adm_loans')} className="flex flex-col items-center text-[#173B73] w-16">
                <span className="text-base">📝</span>
                <span className="text-[10px] font-bold mt-0.5">Loans Desk</span>
              </button>
              <button type="button" onClick={() => setActiveModal('adm_audit')} className="flex flex-col items-center text-[#173B73] w-16">
                <span className="text-base">🔐</span>
                <span className="text-[10px] font-bold mt-0.5">Audit Trail</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= CUSTOMER HOME UI ================= */}
        {screen === 'home' && (
          <div className="flex-1 flex flex-col bg-gradient-to-b from-[#D9ECFA] via-[#E8F4FA] to-[#D9ECFA] pb-24 relative">
            <header className="bg-[#173B73] text-white px-3.5 py-3 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setDrawerOpen(true)} className="p-1 rounded-lg hover:bg-white/10">
                  ☰
                </button>
                <button type="button" onClick={() => setActiveModal('search')} className="p-1 rounded hover:bg-white/10">
                  🔍
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => { setScreen('admin'); setActiveModal(null); }}
                  className="px-2.5 py-1 rounded-full bg-[#079669] hover:bg-[#057A55] text-white text-[11px] font-extrabold shadow"
                >
                  {t('adminBtn')}
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage(language === 'English' ? 'தமிழ்' : 'English')}
                  className="px-2.5 py-1 rounded-full border border-white/50 bg-white/10 text-white text-[11px] font-bold"
                >
                  {language} ▼
                </button>
                <button type="button" onClick={() => setActiveModal('mpassbook')} className="p-1 rounded hover:bg-white/10">
                  🔔
                </button>
                <button type="button" onClick={() => setScreen('prelogin')} className="p-1 rounded hover:bg-white/10">
                  ⏻
                </button>
              </div>
            </header>

            <div className="px-4 py-2.5 flex items-center justify-between">
              <img src="/assets/bebank-logo.png" alt="BeBank" className="h-6 object-contain" />
              <div className="bg-white rounded-full p-1 shadow-sm flex items-center gap-1.5 border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setTierMode(tierMode === 'Basic' ? 'Privilege' : 'Basic')}
                  className="px-4 py-1 rounded-full text-xs font-bold bg-[#173B73] text-white shadow"
                >
                  {tierMode === 'Basic' ? t('basic') : t('privilege')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal('benefits')}
                  className="w-6 h-6 rounded-full bg-slate-200 text-[#173B73] text-xs font-bold flex items-center justify-center"
                >
                  i
                </button>
              </div>
            </div>

            <div className="px-4">
              <div className="bg-gradient-to-br from-[#173B73] via-[#1B4585] to-[#0F2952] rounded-2xl p-4 text-white shadow-xl relative overflow-hidden">
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={() => setShowBalances(!showBalances)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-xs font-semibold"
                  >
                    <span>👁 {showBalances ? t('hide') : t('show')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 relative">
                  <div className="absolute inset-x-2 top-1/2 h-[1px] bg-white/20" />
                  <div className="absolute inset-y-1 left-1/2 w-[1px] bg-white/20" />

                  <button type="button" onClick={() => setActiveModal('account_details')} className="p-3 flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-300 flex items-center justify-center font-extrabold text-sm shrink-0">₹</div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-extrabold truncate">{formatRupee(savingsBal, showBalances)}</p>
                      <p className="text-[11px] font-semibold text-slate-200">{t('savings')}(1)</p>
                    </div>
                  </button>

                  <button type="button" onClick={() => setActiveModal('account_details')} className="p-3 pl-4 flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-300 flex items-center justify-center font-extrabold text-sm shrink-0">🏦</div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-extrabold truncate">{formatRupee(odBal, showBalances)}</p>
                      <p className="text-[11px] font-semibold text-slate-200">{t('odcc')}(1)</p>
                    </div>
                  </button>

                  <button type="button" onClick={() => setActiveModal('deposits')} className="p-3 flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-300 flex items-center justify-center font-extrabold text-sm shrink-0">🛡️</div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-extrabold truncate">{formatRupee(depBal, showBalances)}</p>
                      <p className="text-[11px] font-semibold text-slate-200">{t('deposits')}({deposits.length})</p>
                    </div>
                  </button>

                  <button type="button" onClick={() => setActiveModal('loan_accounts')} className="p-3 pl-4 flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-300 flex items-center justify-center font-extrabold text-sm shrink-0">💼</div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-extrabold truncate">{formatRupee(loanBal, showBalances)}</p>
                      <p className="text-[11px] font-semibold text-slate-200">{t('loans')}(1)</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="px-4 py-4 grid grid-cols-4 gap-y-4 gap-x-2">
              {[
                ['account_details', t('accDetails'), '👤'],
                ['mpassbook', t('accStmt'), '📄'],
                ['mpassbook', t('mPassbook'), '📒'],
                ['fund_transfers', t('fundTrans'), '💸'],
                ['benefits', t('benefits'), '🎁'],
                ['callback', t('callBack'), '📞'],
                ['virtual_rm', t('virtualRm'), '🎧'],
                ['priority_card', t('priorityCard'), '💎'],
              ].map(([id, label, icon], idx) => (
                <button key={idx} type="button" onClick={() => setActiveModal(id)} className="flex flex-col items-center text-center group">
                  <div className="w-13 h-13 p-3.5 rounded-full bg-white shadow-md border border-slate-100 group-hover:border-[#079669] flex items-center justify-center text-lg">
                    <span>{icon}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#173B73] mt-1.5 leading-tight px-0.5">{label}</span>
                </button>
              ))}
            </div>

            <div className="px-4 flex-1">
              <div className="bg-white rounded-3xl p-4 shadow-lg border border-slate-100 grid grid-cols-4 gap-y-5 gap-x-2">
                {[
                  ['upi', t('upi'), '⚡'],
                  ['rewards', t('rewards'), '🏆'],
                  ['open_od_fd', t('openOd'), '🏦'],
                  ['wealth_smart', t('wealthSmart'), '📈'],
                  ['bills', t('billPay'), '🧾'],
                  ['fastag', t('fastag'), '🚗'],
                  ['apply_loan', t('applyLoan'), '💰'],
                  ['apply_debit', t('applyDebit'), '🪪'],
                  ['debit_card', t('debitCard'), '💳'],
                  ['credit_card', t('creditCard'), '🌟'],
                  ['loan_accounts', t('loanAccs'), '📊'],
                  ['itr_filing', t('itrFiling'), '📑'],
                ].map(([id, label, icon], idx) => (
                  <button key={idx} type="button" onClick={() => setActiveModal(id)} className="flex flex-col items-center text-center group">
                    <div className="w-11 h-11 rounded-2xl bg-[#F4F8FB] group-hover:bg-emerald-50 flex items-center justify-center text-base">
                      <span>{icon}</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-700 mt-1.5 leading-tight line-clamp-2 px-0.5">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal('virtual_rm')}
              className="absolute bottom-20 right-4 z-20 w-12 h-12 rounded-full bg-white shadow-xl border-2 border-[#079669] flex items-center justify-center text-lg"
            >
              🎧
            </button>

            <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-[#C7E2F5] via-[#D8ECF8] to-white/95 border-t border-slate-200 px-2 pt-2 pb-2.5 flex items-end justify-around">
              <button type="button" onClick={() => setActiveModal('easy_pay')} className="flex flex-col items-center text-[#173B73] w-16">
                <span className="text-base">💸</span>
                <span className="text-[10px] font-bold mt-0.5">{t('easyPay')}</span>
              </button>
              <button type="button" onClick={() => setActiveModal('recharge')} className="flex flex-col items-center text-[#173B73] w-16">
                <span className="text-base">📱</span>
                <span className="text-[10px] font-bold mt-0.5">{t('recharge')}</span>
              </button>
              <div className="relative -top-4 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setActiveModal('scan_qr')}
                  className="w-14 h-14 rounded-full bg-white shadow-xl border-4 border-[#079669] flex items-center justify-center text-[#173B73] font-extrabold text-lg"
                >
                  ⊞
                </button>
              </div>
              <button type="button" onClick={() => setActiveModal('manage_limits')} className="flex flex-col items-center text-[#173B73] w-16">
                <span className="text-base">🎚️</span>
                <span className="text-[10px] font-bold mt-0.5">{t('manageLimits')}</span>
              </button>
              <button type="button" onClick={() => setActiveModal('manage_payee')} className="flex flex-col items-center text-[#173B73] w-16">
                <span className="text-base">👥</span>
                <span className="text-[10px] font-bold mt-0.5">{t('managePayee')}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= DRAWER ================= */}
        {drawerOpen && (
          <div className="absolute inset-0 z-40 flex">
            <div onClick={() => setDrawerOpen(false)} className="absolute inset-0 bg-slate-900/60" />
            <div className="relative w-72 bg-[#173B73] text-white flex flex-col z-10 h-full">
              <div className="p-4 bg-white flex items-center justify-between border-b-4 border-[#079669]">
                <img src="/assets/bebank-logo.png" alt="BeBank" className="h-8 object-contain" />
                <button type="button" onClick={() => setDrawerOpen(false)} className="text-slate-700 font-bold px-2">
                  ✕
                </button>
              </div>
              <div className="p-4 bg-white/10 border-b border-white/10">
                <p className="text-xs text-emerald-300 font-bold uppercase">KYC: {user.kyc}</p>
                <p className="text-base font-extrabold">{user.name}</p>
                <p className="text-xs text-slate-300">CIF: {user.cif}</p>
              </div>
              <div className="flex-1 p-3 space-y-1 overflow-y-auto text-xs font-bold">
                {[
                  ['account_details', '👤 Account Details & Nominee'],
                  ['mpassbook', '📒 m-Passbook & CSV Statement'],
                  ['fund_transfers', '💸 Fund Transfers (IMPS/NEFT)'],
                  ['upi', '⚡ UPI Hub'],
                  ['debit_card', '💳 Debit & Credit Cards'],
                  ['deposits', '🛡️ Fixed & Recurring Deposits'],
                  ['wealth_smart', '📈 Wealth Smart SIP'],
                  ['loan_accounts', '💼 Loans & EMI Center'],
                  ['itr_filing', '📑 ITR & Form 15G'],
                ].map(([id, lbl]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      setActiveModal(id);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10"
                  >
                    {lbl}
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-white/15 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    setActiveModal(null);
                    setScreen(screen === 'admin' ? 'home' : 'admin');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#079669] text-white text-xs font-extrabold shadow"
                >
                  {screen === 'admin' ? 'Switch to Customer Home' : 'Switch to Admin Portal'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= ACTIVE SUB-MODAL ================= */}
        {activeModal && (
          <div className="absolute inset-0 z-30 bg-[#F4F8FB] flex flex-col overflow-y-auto">
            <div className="bg-[#173B73] text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-10 shadow">
              <button type="button" onClick={() => setActiveModal(null)} className="text-xs font-bold hover:text-emerald-300">
                ← Back
              </button>
              <img src="/assets/bebank-logo.png" alt="BeBank" className="h-6 bg-white px-2 py-0.5 rounded object-contain" />
            </div>

            <div className="p-4 flex-1 space-y-4 text-xs">
              {activeModal === 'account_details' && (
                <div className="space-y-3">
                  <h3 className="text-base font-extrabold text-[#173B73]">My BeBank Accounts</h3>
                  {accounts.map((a) => (
                    <div key={a.id} className="bg-white rounded-2xl p-4 shadow border-l-4 border-[#079669] space-y-1.5">
                      <p className="font-bold text-[#079669]">{a.label}</p>
                      <p className="text-sm font-mono font-extrabold text-[#173B73]">A/C: {a.number}</p>
                      <p className="text-xl font-extrabold text-[#079669]">₹{a.balance.toLocaleString('en-IN')}</p>
                      <p className="text-slate-500">IFSC: {a.ifsc} • {a.branch}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeModal === 'mpassbook' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-extrabold text-[#173B73]">BeBank m-Passbook &amp; Statement</h3>
                    <button type="button" onClick={exportStatementCSV} className="px-3 py-1.5 rounded-lg bg-[#079669] text-white font-bold">
                      Download CSV
                    </button>
                  </div>
                  {transactions.map((tx) => (
                    <div key={tx.id} className="bg-white rounded-xl p-3.5 shadow-sm flex justify-between">
                      <div>
                        <p className="font-bold text-[#173B73]">{tx.name}</p>
                        <p className="text-slate-500">{tx.desc}</p>
                        <p className="text-[10px] font-mono text-slate-400">{tx.channel} • {tx.ref} • {tx.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-extrabold text-sm ${tx.type === 'CREDIT' ? 'text-[#079669]' : 'text-slate-800'}`}>
                          {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] text-slate-400">Bal: ₹{tx.balance.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(activeModal === 'fund_transfers' || activeModal === 'upi' || activeModal === 'easy_pay') && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const name = fd.get('name');
                    const acc = fd.get('acc');
                    const amt = Number(fd.get('amt'));
                    const chan = fd.get('chan') || 'IMPS';
                    if (amt > 0 && amt <= accounts[0].balance) {
                      const ref = recordDebit(0, amt, chan, name, `${chan} Transfer to ${acc}`);
                      showToast(`Sent ₹${amt.toLocaleString('en-IN')} to ${name}! Ref: ${ref}`);
                      setActiveModal('mpassbook');
                    }
                  }}
                  className="bg-white rounded-2xl p-4 shadow space-y-3"
                >
                  <h3 className="text-base font-extrabold text-[#173B73]">
                    {activeModal === 'upi' ? 'BeBank Instant UPI Pay' : activeModal === 'easy_pay' ? 'Easy Pay Quick Transfer' : 'Fund Transfers (IMPS / NEFT / RTGS)'}
                  </h3>
                  <select name="chan" className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-[#173B73]">
                    <option value="IMPS">IMPS Instant Transfer</option>
                    <option value="UPI">UPI Instant Pay</option>
                    <option value="NEFT">NEFT Transfer</option>
                  </select>
                  <input name="name" defaultValue="Priya Sharma" required placeholder="Recipient Name" className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  <input name="acc" defaultValue="202600108921" required placeholder="Account Number / UPI ID" className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono" />
                  <input name="amt" type="number" defaultValue="2500" required min="1" placeholder="Amount (₹)" className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold" />
                  <input name="mpin" type="password" maxLength={4} defaultValue="0710" required placeholder="4-Digit MPIN" className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold tracking-widest" />
                  <button type="submit" className="w-full py-3 rounded-xl bg-[#079669] text-white font-bold shadow">
                    Authorize &amp; Send Money
                  </button>
                </form>
              )}

              {(activeModal === 'adm_kyc' || activeModal === 'adm_customers' || activeModal === 'adm_topup') && (
                <div className="space-y-3">
                  <h3 className="text-base font-extrabold text-[#173B73]">Admin Customer, KYC &amp; Top-Up Desk</h3>
                  {adminCustomers.map((c) => (
                    <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="font-extrabold text-[#173B73] text-sm">{c.name} ({c.cif})</span>
                        <span className="font-bold text-[#079669]">KYC: {c.kyc}</span>
                      </div>
                      <p className="text-slate-500 font-mono">A/C: {c.account} • Bal: ₹{c.balance.toLocaleString('en-IN')}</p>
                      <div className="flex gap-2">
                        {c.kyc !== 'VERIFIED' && (
                          <button
                            type="button"
                            onClick={() => {
                              setAdminCustomers((prev) => prev.map((x) => (x.id === c.id ? { ...x, kyc: 'VERIFIED' } : x)));
                              showToast(`KYC Verified for ${c.name}!`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#079669] text-white font-bold"
                          >
                            ✓ Approve KYC
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setAdminCustomers((prev) => prev.map((x) => (x.id === c.id ? { ...x, balance: x.balance + 25000 } : x)));
                            if (c.id === 1) recordCredit(0, 25000, 'ADMIN_TOPUP', 'BeBank Treasury', 'Admin Demo Credit');
                            showToast(`Credited +₹25,000 to ${c.name}!`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#173B73] text-white font-bold"
                        >
                          + Credit ₹25,000
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(activeModal === 'adm_loans' || activeModal === 'loan_accounts' || activeModal === 'apply_loan') && (
                <div className="space-y-3">
                  <h3 className="text-base font-extrabold text-[#173B73]">Loans &amp; Underwriting Center</h3>
                  {loans.map((l) => (
                    <div key={l.id} className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-[#173B73]">#{l.number} • {l.type}</span>
                        <span className="font-bold text-[#079669]">{l.status}</span>
                      </div>
                      <p className="font-extrabold text-sm">Applicant: {l.applicant} — ₹{l.principal.toLocaleString('en-IN')}</p>
                      {l.status === 'PENDING_APPROVAL' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setLoans((prev) => prev.map((x) => (x.id === l.id ? { ...x, status: 'ACTIVE' } : x)));
                            showToast(`Loan #${l.number} Approved & Disbursed!`);
                          }}
                          className="w-full py-2 rounded-xl bg-[#079669] text-white font-bold"
                        >
                          ✓ Approve &amp; Disburse Loan
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            recordDebit(0, l.emi, 'LOAN_EMI', `Loan #${l.number}`, 'Monthly Loan EMI Payment');
                            showToast(`Paid EMI of ₹${l.emi.toLocaleString('en-IN')}!`);
                          }}
                          className="w-full py-2 rounded-xl bg-[#173B73] text-white font-bold"
                        >
                          Pay Monthly EMI (₹{l.emi.toLocaleString('en-IN')})
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {![
                'account_details',
                'mpassbook',
                'fund_transfers',
                'upi',
                'easy_pay',
                'adm_kyc',
                'adm_customers',
                'adm_topup',
                'adm_loans',
                'loan_accounts',
                'apply_loan',
              ].includes(activeModal) && (
                <div className="bg-white rounded-2xl p-5 shadow space-y-3">
                  <h3 className="text-base font-extrabold text-[#173B73] uppercase">{activeModal.replace(/_/g, ' ')}</h3>
                  <p className="text-slate-600">
                    Active for Customer <strong>{user.name}</strong> (CIF: <strong>{user.cif}</strong>) • Savings A/C Balance:{' '}
                    <strong className="text-[#079669]">₹{accounts[0].balance.toLocaleString('en-IN')}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Transaction / Service executed successfully!');
                      setActiveModal(null);
                    }}
                    className="w-full py-3 rounded-xl bg-[#079669] text-white font-bold shadow"
                  >
                    Confirm &amp; Execute Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
