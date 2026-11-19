import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Printer, Search, Filter, Sliders, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bankingApi } from '../../api/bankingApi';

export default function AccountsAndStatementsPage() {
  const { user, notify } = useAuth();
  const [searchParams] = useSearchParams();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(searchParams.get('account_id') || '');
  const [txType, setTxType] = useState('');
  const [channel, setChannel] = useState('');
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [editingLimit, setEditingLimit] = useState(null);
  const [newLimitValue, setNewLimitValue] = useState('');

  useEffect(() => {
    if (user) {
      bankingApi.getAccounts(user.id).then((accts) => {
        setAccounts(accts);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      bankingApi
        .getTransactions(user.id, {
          account_id: selectedAccount,
          transaction_type: txType,
          channel,
          search,
        })
        .then(setTransactions);
    }
  }, [user, selectedAccount, txType, channel, search]);

  const handleSaveLimit = async (acctId) => {
    try {
      const updated = await bankingApi.updateAccountLimit(user.id, acctId, newLimitValue);
      setAccounts((prev) => prev.map((a) => (a.id === acctId ? updated : a)));
      setEditingLimit(null);
      notify('Daily transfer limit updated successfully!');
    } catch (e) {
      notify(e.message, 'error');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Reference ID', 'Account Number', 'Type', 'Channel', 'Counterparty', 'Description', 'Amount (INR)', 'Balance After (INR)', 'Status'];
    const rows = transactions.map((t) => [
      new Date(t.created_at).toISOString().split('T')[0],
      t.reference_id,
      t.account_number,
      t.transaction_type,
      t.channel,
      `"${(t.counterparty_name || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.amount,
      t.balance_after,
      t.status,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BeBank_Statement_${user?.customer_id}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Account statement exported as CSV!');
  };

  return (
    <div className="space-y-6">
      {/* Printable Statement Header (Visible when printing) */}
      <div className="hidden print:flex items-center justify-between border-b-2 border-[#173B73] pb-4 mb-6">
        <img src="/assets/bebank-logo.png" alt="BeBank" className="h-12 object-contain" />
        <div className="text-right text-xs">
          <p className="font-bold text-[#173B73] text-sm">Official Digital Account Statement</p>
          <p>Customer: {user?.full_name} (CIF: {user?.customer_id})</p>
          <p>Generated on: {new Date().toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-extrabold text-[#173B73]">My Accounts & Digital Passbook</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            View detailed account info, adjust daily transfer limits, and download statements
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-xs sm:text-sm font-bold shadow transition"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#173B73] hover:bg-[#0F2952] text-white text-xs sm:text-sm font-bold shadow transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Statement</span>
          </button>
        </div>
      </div>

      {/* Account Detail Cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {accounts.map((acct) => (
          <div key={acct.id} className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#173B73]/10 text-[#173B73] text-xs font-bold">
                {acct.account_type_display || acct.account_type}
              </span>
              <span className="text-xs font-bold text-[#079669]">{acct.status}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Account Number</p>
                <p className="text-base font-extrabold text-[#173B73] font-mono">{acct.account_number}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Available Balance</p>
                <p className="text-xl font-extrabold text-[#079669]">
                  ₹{Number(acct.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">IFSC Code & Branch</p>
                <p className="text-xs font-bold text-slate-700">{acct.ifsc_code} • {acct.branch_name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Registered Nominee</p>
                <p className="text-xs font-bold text-slate-700">{acct.nominee_name || 'Registered'}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between no-print">
              {editingLimit === acct.id ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="number"
                    value={newLimitValue}
                    onChange={(e) => setNewLimitValue(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs w-40"
                  />
                  <button
                    onClick={() => handleSaveLimit(acct.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#079669] text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Save
                  </button>
                  <button
                    onClick={() => setEditingLimit(null)}
                    className="text-xs text-slate-500 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-xs text-slate-500">
                    Daily Transfer Limit:{' '}
                    <strong className="text-[#173B73]">
                      ₹{Number(acct.daily_transfer_limit).toLocaleString('en-IN')}
                    </strong>
                  </span>
                  <button
                    onClick={() => {
                      setEditingLimit(acct.id);
                      setNewLimitValue(acct.daily_transfer_limit);
                    }}
                    className="text-xs font-bold text-[#079669] hover:underline flex items-center gap-1"
                  >
                    <Sliders className="w-3.5 h-3.5" /> Modify Limit
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Passbook Filters & Ledger Table */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
        <div className="grid sm:grid-cols-4 gap-3 mb-5 no-print">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, ref ID, remarks..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
            />
          </div>

          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
          >
            <option value="">All My Accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.account_number} ({a.account_type})
              </option>
            ))}
          </select>

          <select
            value={txType}
            onChange={(e) => setTxType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
          >
            <option value="">All Types (Credit & Debit)</option>
            <option value="CREDIT">Credits Only (+)</option>
            <option value="DEBIT">Debits Only (-)</option>
          </select>

          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
          >
            <option value="">All Channels</option>
            <option value="IMPS">IMPS</option>
            <option value="NEFT">NEFT</option>
            <option value="RTGS">RTGS</option>
            <option value="UPI">UPI</option>
            <option value="BILL_PAY">Bill Pay</option>
            <option value="FD_BOOKING">Deposit Booking</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-[#F4F7FB]">
                <th className="py-3 px-4">Date & Ref ID</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Particulars / Counterparty</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Closing Balance</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="font-semibold text-slate-800">
                      {new Date(tx.created_at).toLocaleDateString('en-IN')}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400">{tx.reference_id}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#173B73] font-semibold">
                    {tx.account_number}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{tx.counterparty_name}</p>
                    <p className="text-xs text-slate-500">{tx.description}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-[#173B73] text-xs font-bold">
                      {tx.channel}
                    </span>
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right font-extrabold whitespace-nowrap ${
                      tx.transaction_type === 'CREDIT' ? 'text-[#079669]' : 'text-slate-800'
                    }`}
                  >
                    {tx.transaction_type === 'CREDIT' ? '+' : '-'}₹
                    {Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-600 whitespace-nowrap">
                    ₹{Number(tx.balance_after).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        tx.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-[#079669]'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching transactions found for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
