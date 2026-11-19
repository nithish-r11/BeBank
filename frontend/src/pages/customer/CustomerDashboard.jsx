import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Send, CreditCard, PiggyBank, Receipt, Landmark,
  FileText, ArrowUpRight, ArrowDownLeft, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bankingApi } from '../../api/bankingApi';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    if (user) {
      bankingApi.getCustomerDashboard(user.id).then(setData);
    }
  }, [user]);

  if (!data) {
    return <div className="p-8 text-center text-slate-500 font-semibold">Loading your BeBank Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top BeBank Welcome & Quick Balance Hero */}
      <div className="bg-gradient-to-r from-[#173B73] via-[#173B73] to-[#0F2952] rounded-2xl p-6 sm:p-8 text-white shadow-elevated">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#079669] text-white text-xs font-bold uppercase tracking-wider">
              BeBank Personal Banking
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
              Good Day, {user?.full_name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
              Customer ID: <strong>{user?.customer_id}</strong> • Primary Branch: Chennai Anna Salai
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 sm:px-6 min-w-[260px]">
            <div className="flex items-center justify-between text-xs text-slate-200 mb-1">
              <span>Total Relationship Balance</span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-emerald-300 hover:text-white flex items-center gap-1 font-semibold"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showBalance ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {showBalance
                ? `₹${Number(data.total_balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                : '₹ ••••••••'}
            </p>
            <p className="text-xs text-emerald-300 mt-1 font-medium">
              + ₹{Number(data.total_deposits).toLocaleString('en-IN')} in Active Fixed/Recurring Deposits
            </p>
          </div>
        </div>

        {/* Account Cards Row */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {data.accounts.map((acct) => (
            <div
              key={acct.id}
              className="bg-white text-slate-800 rounded-xl p-5 shadow flex flex-col justify-between border-l-4 border-[#079669]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#079669]">
                    {acct.account_type_display || acct.account_type}
                  </span>
                  <p className="text-lg font-extrabold text-[#173B73] mt-0.5 font-mono">
                    A/C: {acct.account_number}
                  </p>
                  <p className="text-xs text-slate-500">
                    IFSC: <strong>{acct.ifsc_code}</strong> • {acct.branch_name}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    acct.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-[#079669]'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {acct.status}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Available Balance</p>
                  <p className="text-xl font-extrabold text-[#173B73]">
                    {showBalance
                      ? `₹${Number(acct.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                      : '₹ ••••••'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/app/accounts?account_id=${acct.id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#173B73] text-xs font-bold transition"
                  >
                    Passbook
                  </Link>
                  <Link
                    to={`/app/transfer?source=${acct.id}`}
                    className="px-3 py-1.5 rounded-lg bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold transition"
                  >
                    Send Money
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BeBank 6 Quick Action Tiles */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#173B73] mb-4">
          BeBank Quick Banking Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            { label: 'Fund Transfer', sub: 'IMPS / NEFT / UPI', icon: Send, to: '/app/transfer', color: 'bg-[#079669]' },
            { label: 'Passbook', sub: 'Statements & CSV', icon: FileText, to: '/app/accounts', color: 'bg-[#173B73]' },
            { label: 'Card Controls', sub: 'Limits & Freeze', icon: CreditCard, to: '/app/cards', color: 'bg-[#079669]' },
            { label: 'Open FD / RD', sub: 'Up to 7.40% p.a.', icon: PiggyBank, to: '/app/deposits', color: 'bg-[#173B73]' },
            { label: 'Apply Loan', sub: 'Instant EMI Calc', icon: Landmark, to: '/app/loans', color: 'bg-[#079669]' },
            { label: 'Pay Bills', sub: 'Electricity & Mobile', icon: Receipt, to: '/app/bills', color: 'bg-[#173B73]' },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className="group p-4 rounded-xl border border-slate-200 hover:border-[#079669] hover:shadow-md transition flex flex-col items-center text-center bg-[#F4F7FB]/50 hover:bg-white"
            >
              <div className={`w-11 h-11 rounded-xl ${item.color} text-white flex items-center justify-center mb-2.5 shadow group-hover:scale-105 transition`}>
                <item.icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-[#173B73]">{item.label}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{item.sub}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Transactions & Quick Beneficiaries Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-card border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#173B73]">Recent Account Transactions</h3>
              <p className="text-xs text-slate-500">Real-time ledger updates across your BeBank accounts</p>
            </div>
            <Link
              to="/app/accounts"
              className="text-xs font-bold text-[#079669] hover:underline flex items-center gap-1"
            >
              <span>View Full Passbook</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {data.recent_transactions.slice(0, 6).map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.transaction_type === 'CREDIT'
                        ? 'bg-emerald-50 text-[#079669]'
                        : 'bg-blue-50 text-[#173B73]'
                    }`}
                  >
                    {tx.transaction_type === 'CREDIT' ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{tx.counterparty_name}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {tx.channel} • Ref: {tx.reference_id} • {new Date(tx.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`text-sm font-extrabold ${
                      tx.transaction_type === 'CREDIT' ? 'text-[#079669]' : 'text-slate-800'
                    }`}
                  >
                    {tx.transaction_type === 'CREDIT' ? '+' : '-'}₹
                    {Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Bal: ₹{Number(tx.balance_after).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Send to Favorite Beneficiaries */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-[#173B73]">Quick Pay Beneficiaries</h3>
              <Link to="/app/transfer" className="text-xs font-bold text-[#079669] hover:underline">
                + Manage
              </Link>
            </div>
            <div className="space-y-3">
              {data.quick_beneficiaries.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl border border-slate-100 bg-[#F4F7FB] flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-bold text-[#173B73]">{b.name}</p>
                    <p className="text-xs text-slate-500">
                      {b.bank_name} • {b.account_number.slice(-4)}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigate(
                        `/app/transfer?name=${encodeURIComponent(b.name)}&acct=${encodeURIComponent(
                          b.account_number
                        )}&ifsc=${encodeURIComponent(b.ifsc_code)}`
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold transition"
                  >
                    Pay Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#173B73] text-white rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> BeBank Cyber Safe Tip
            </div>
            <p className="text-sm font-bold mt-2">Never Share Your 4-Digit MPIN or OTP</p>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              BeBank officials will never ask for your password, CVV, or MPIN. You can lock your Debit/Credit cards anytime with one tap in the Cards Control Center.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
