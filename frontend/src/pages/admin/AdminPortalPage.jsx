import React, { useEffect, useState } from 'react';
import {
  Users, Landmark, ShieldAlert, CheckCircle2, XCircle, Lock, Unlock,
  PlusCircle, FileText, Activity, LifeBuoy, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bankingApi } from '../../api/bankingApi';

export default function AdminPortalPage() {
  const { notify } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const loadAllAdminData = async () => {
    const [sumData, custData, txData, loanData, supData, logData] = await Promise.all([
      bankingApi.getAdminSummary(),
      bankingApi.getAdminCustomers(),
      bankingApi.getAdminTransactions(),
      bankingApi.getAdminLoans(),
      bankingApi.getAdminSupportTickets(),
      bankingApi.getAdminAuditLogs(),
    ]);
    setSummary(sumData);
    setCustomers(custData);
    setTransactions(txData);
    setLoans(loanData);
    setTickets(supData);
    setAuditLogs(logData);
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleCustomerAction = async (customerId, payload) => {
    try {
      const res = await bankingApi.performAdminCustomerAction(customerId, payload);
      notify(res.detail || 'Admin action completed!');
      loadAllAdminData();
    } catch (e) {
      notify(e.message, 'error');
    }
  };

  const handleFlagTx = async (txId, newStatus) => {
    await bankingApi.updateAdminTransactionStatus(txId, newStatus);
    notify(`Transaction status updated to ${newStatus}`);
    loadAllAdminData();
  };

  const handleReviewLoan = async (loanId, decision) => {
    const remarks =
      decision === 'APPROVED'
        ? 'Approved & Disbursed by BeBank Credit Committee into Customer Account.'
        : 'Declined per internal underwriting policy.';
    await bankingApi.reviewAdminLoan(loanId, decision, remarks);
    notify(
      decision === 'APPROVED'
        ? 'Loan Approved & Principal Disbursed to Customer Account!'
        : 'Loan Application Declined.',
      decision === 'APPROVED' ? 'success' : 'info'
    );
    loadAllAdminData();
  };

  const handleResolveTicket = async (ticketId) => {
    await bankingApi.resolveAdminSupportTicket(
      ticketId,
      'RESOLVED',
      'Request verified and fulfilled by BeBank Operations Desk.'
    );
    notify('Service Request marked as RESOLVED!');
    loadAllAdminData();
  };

  if (!summary) {
    return <div className="p-10 text-center font-bold text-[#173B73]">Loading BeBank Admin Command Center...</div>;
  }

  const { kpis } = summary;

  return (
    <div className="space-y-6">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Customers', value: kpis.total_customers, sub: `${kpis.pending_kyc} Pending KYC`, color: 'border-[#173B73]' },
          { label: 'CASA Deposits AUM', value: `₹${(Number(kpis.total_deposits_aum) / 100000).toFixed(2)}L`, sub: `${kpis.total_accounts} Active A/Cs`, color: 'border-[#079669]' },
          { label: 'Term Deposits (FD/RD)', value: `₹${(Number(kpis.total_term_deposits) / 100000).toFixed(2)}L`, sub: 'Fixed & Recurring', color: 'border-[#173B73]' },
          { label: 'Total Transactions', value: kpis.total_transactions, sub: `${kpis.flagged_transactions} Flagged`, color: 'border-[#079669]' },
          { label: 'Pending Loans', value: kpis.pending_loans, sub: 'Awaiting Disbursal', color: 'border-amber-500' },
          { label: 'Open Service Tickets', value: kpis.open_tickets, sub: 'Customer Helpdesk', color: 'border-[#079669]' },
        ].map((card, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl p-4 shadow-card border-l-4 ${card.color}`}
          >
            <p className="text-xs font-bold text-slate-500">{card.label}</p>
            <p className="text-xl sm:text-2xl font-extrabold text-[#173B73] mt-1">{card.value}</p>
            <p className="text-[11px] font-semibold text-[#079669] mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-card border border-slate-100">
        {[
          { id: 'overview', label: '1. Executive Overview' },
          { id: 'customers', label: `2. Customers & KYC (${customers.length})` },
          { id: 'transactions', label: `3. Transaction Monitor (${transactions.length})` },
          { id: 'loans', label: `4. Loan Underwriting (${kpis.pending_loans} Pending)` },
          { id: 'support', label: `5. Support Tickets (${kpis.open_tickets} Open)` },
          { id: 'audit', label: '6. System Security Audit Logs' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === t.id
                ? 'bg-[#173B73] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-card border border-slate-100">
            <h3 className="text-base font-extrabold text-[#173B73] mb-4">
              Latest Bank-Wide Transactions
            </h3>
            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              {summary.recent_transactions.slice(0, 7).map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">
                      {tx.customer_name} → {tx.counterparty_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {tx.channel} • A/C {tx.account_number} • Ref: {tx.reference_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-[#173B73]">
                      ₹{Number(tx.amount).toLocaleString('en-IN')}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tx.status === 'FLAGGED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-50 text-[#079669]'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
              <h3 className="text-base font-extrabold text-[#173B73] mb-4">
                Payment Channel Volume Breakdown
              </h3>
              <div className="space-y-3">
                {summary.channel_breakdown.map((ch, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#F4F7FB] flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-[#173B73]">{ch.channel}</span>
                      <p className="text-xs text-slate-500">{ch.count} transactions processed</p>
                    </div>
                    <p className="text-sm font-extrabold text-[#079669]">
                      ₹{Number(ch.volume).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMERS & KYC MANAGEMENT */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          {customers.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-extrabold text-[#173B73]">{c.full_name}</h3>
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      CIF: {c.customer_id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        c.kyc_status === 'VERIFIED'
                          ? 'bg-emerald-50 text-[#079669]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      KYC: {c.kyc_status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Email: {c.email} • Phone: {c.phone_number} • PAN: {c.pan_number} • City: {c.city}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {c.kyc_status !== 'VERIFIED' && (
                    <button
                      onClick={() =>
                        handleCustomerAction(c.id, { action_type: 'UPDATE_KYC', kyc_status: 'VERIFIED' })
                      }
                      className="px-3.5 py-2 rounded-xl bg-[#079669] text-white text-xs font-bold shadow"
                    >
                      ✓ Approve KYC
                    </button>
                  )}
                  <button
                    onClick={() => handleCustomerAction(c.id, { action_type: 'TOGGLE_LOCK' })}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border ${
                      c.is_locked
                        ? 'bg-emerald-50 text-[#079669] border-emerald-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    {c.is_locked ? 'Unlock Login' : 'Lock Login'}
                  </button>
                </div>
              </div>

              {/* Customer Bank Accounts & Admin Demo Top-Up */}
              <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                {(c.accounts || []).map((acct) => (
                  <div
                    key={acct.id}
                    className="p-4 rounded-xl bg-[#F4F7FB] border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#173B73]">
                        {acct.account_type} • <span className="font-mono">{acct.account_number}</span>
                      </p>
                      <p className="text-base font-extrabold text-[#079669] mt-0.5">
                        ₹{Number(acct.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                      <span className="text-[11px] text-slate-500">Status: {acct.status}</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() =>
                          handleCustomerAction(c.id, {
                            action_type: 'DEMO_TOPUP',
                            account_id: acct.id,
                            amount: 25000,
                          })
                        }
                        className="px-3 py-1.5 rounded-lg bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold"
                      >
                        + Credit ₹25,000 Demo
                      </button>
                      <button
                        onClick={() =>
                          handleCustomerAction(c.id, {
                            action_type: 'TOGGLE_ACCOUNT_STATUS',
                            account_id: acct.id,
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold"
                      >
                        {acct.status === 'ACTIVE' ? 'Freeze Account' : 'Unfreeze Account'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: TRANSACTION COMPLIANCE MONITOR */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 overflow-x-auto">
          <h3 className="text-base font-extrabold text-[#173B73] mb-4">
            Real-Time Transaction Monitoring & AML Compliance
          </h3>
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F4F7FB] border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3 px-4">Ref ID & Date</th>
                <th className="py-3 px-4">Customer / Account</th>
                <th className="py-3 px-4">Counterparty</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Compliance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="py-3 px-4 font-mono text-xs">
                    <p className="font-bold text-slate-800">{tx.reference_id}</p>
                    <p className="text-slate-400">{new Date(tx.created_at).toLocaleDateString('en-IN')}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-[#173B73]">{tx.customer_name}</p>
                    <p className="font-mono text-xs text-slate-500">{tx.account_number}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{tx.counterparty_name}</p>
                    <p className="text-xs text-slate-500">{tx.description}</p>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#173B73]">{tx.channel}</td>
                  <td className="py-3 px-4 text-right font-extrabold">
                    ₹{Number(tx.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        tx.status === 'FLAGGED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-50 text-[#079669]'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {tx.status === 'FLAGGED' ? (
                      <button
                        onClick={() => handleFlagTx(tx.id, 'COMPLETED')}
                        className="px-3 py-1 rounded-lg bg-[#079669] text-white text-xs font-bold"
                      >
                        Clear Flag
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFlagTx(tx.id, 'FLAGGED')}
                        className="px-3 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold"
                      >
                        Flag Review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: LOAN UNDERWRITING & DISBURSAL */}
      {activeTab === 'loans' && (
        <div className="space-y-4">
          {loans.map((l) => (
            <div
              key={l.id}
              className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#173B73] text-white text-xs font-bold">
                    {l.loan_type_display || l.loan_type}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#173B73]">#{l.loan_number}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      l.status === 'PENDING_APPROVAL'
                        ? 'bg-amber-100 text-amber-800'
                        : l.status === 'APPROVED' || l.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-[#079669]'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {l.status}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Applicant: {l.customer_name} ({l.customer_id}) → Disbursal A/C: {l.account_number}
                </p>
                <p className="text-xs text-slate-600">
                  Principal: <strong>₹{Number(l.principal_amount).toLocaleString('en-IN')}</strong> •{' '}
                  {l.tenure_months} Months @ {l.interest_rate}% p.a. • EMI: ₹
                  {Number(l.emi_amount).toLocaleString('en-IN')}/mo
                </p>
                <p className="text-xs text-slate-500">Purpose: {l.purpose}</p>
              </div>

              {l.status === 'PENDING_APPROVAL' && (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleReviewLoan(l.id, 'APPROVED')}
                    className="px-4 py-2.5 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold shadow"
                  >
                    ✓ Approve & Disburse Principal
                  </button>
                  <button
                    onClick={() => handleReviewLoan(l.id, 'REJECTED')}
                    className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: SUPPORT TICKETS */}
      {activeTab === 'support' && (
        <div className="space-y-4">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#173B73]">#{t.ticket_number}</span>
                  <span className="text-sm font-extrabold text-[#173B73]">{t.subject}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#079669] text-xs font-bold">
                    {t.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Customer: {t.customer_name} ({t.customer_id}) • Type: {t.request_type_display || t.request_type}
                </p>
                <p className="text-xs text-slate-700">{t.description}</p>
              </div>

              {t.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleResolveTicket(t.id)}
                  className="px-4 py-2 rounded-xl bg-[#079669] text-white text-xs font-bold shadow"
                >
                  ✓ Mark Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: SYSTEM SECURITY AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
          <h3 className="text-base font-extrabold text-[#173B73] mb-4">
            Immutable System Security & Audit Logs
          </h3>
          <div className="divide-y divide-slate-100 text-xs sm:text-sm">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="px-2 py-0.5 rounded bg-[#173B73]/10 text-[#173B73] font-bold text-xs mr-2">
                    {log.action}
                  </span>
                  <span className="font-semibold text-slate-800">{log.description}</span>
                  <p className="text-xs text-slate-400 mt-0.5">
                    User: {log.user_name || 'System'} ({log.customer_id || 'SYS'}) • IP: {log.ip_address}
                  </p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
