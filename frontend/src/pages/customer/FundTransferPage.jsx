import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, UserPlus, Trash2, CheckCircle2, ShieldAlert, Lock, Printer } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bankingApi } from '../../api/bankingApi';

export default function FundTransferPage() {
  const { user, notify } = useAuth();
  const [searchParams] = useSearchParams();

  const [accounts, setAccounts] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [tab, setTab] = useState('transfer'); // 'transfer' | 'beneficiaries'

  const [form, setForm] = useState({
    source_account_id: searchParams.get('source') || '',
    recipient_name: searchParams.get('name') || '',
    recipient_account: searchParams.get('acct') || '',
    recipient_ifsc: searchParams.get('ifsc') || 'BEBK0000102',
    channel: 'IMPS',
    category: 'TRANSFER',
    amount: '',
    description: '',
    mpin: '',
  });

  const [showMpinModal, setShowMpinModal] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Add Beneficiary Form
  const [benForm, setBenForm] = useState({
    name: '',
    nickname: '',
    account_number: '',
    bank_name: 'BeBank',
    ifsc_code: 'BEBK0000101',
    upi_id: '',
    daily_limit: '100000',
    is_favorite: true,
  });

  useEffect(() => {
    if (user) {
      bankingApi.getAccounts(user.id).then((accts) => {
        setAccounts(accts);
        if (accts.length > 0 && !form.source_account_id) {
          setForm((prev) => ({ ...prev, source_account_id: accts[0].id }));
        }
      });
      bankingApi.getBeneficiaries(user.id).then(setBeneficiaries);
    }
  }, [user]);

  const handleSelectBeneficiary = (b) => {
    setForm((prev) => ({
      ...prev,
      recipient_name: b.name,
      recipient_account: b.account_number,
      recipient_ifsc: b.ifsc_code,
    }));
    setTab('transfer');
    notify(`Selected beneficiary: ${b.name}`, 'info');
  };

  const handleInitiateTransfer = (e) => {
    e.preventDefault();
    if (!form.recipient_name || !form.recipient_account || !form.amount) {
      notify('Please complete all recipient and amount fields.', 'error');
      return;
    }
    setShowMpinModal(true);
  };

  const handleConfirmTransfer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await bankingApi.transferFunds(user.id, form);
      setReceipt(res.transaction);
      setShowMpinModal(false);
      setForm((prev) => ({ ...prev, amount: '', description: '', mpin: '' }));
      const updatedAccts = await bankingApi.getAccounts(user.id);
      setAccounts(updatedAccts);
      notify(res.detail || 'Transfer completed!');
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    try {
      const created = await bankingApi.addBeneficiary(user.id, benForm);
      setBeneficiaries((prev) => [created, ...prev]);
      setBenForm({
        name: '',
        nickname: '',
        account_number: '',
        bank_name: 'BeBank',
        ifsc_code: 'BEBK0000101',
        upi_id: '',
        daily_limit: '100000',
        is_favorite: true,
      });
      notify(`Beneficiary ${created.name} added & verified!`);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleDeleteBeneficiary = async (id) => {
    await bankingApi.deleteBeneficiary(user.id, id);
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    notify('Beneficiary removed.', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#173B73]">
            Fund Transfer & Beneficiary Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Instant 24x7 IMPS, NEFT, RTGS, UPI & Internal BeBank Transfers (Demo Banking Mode)
          </p>
        </div>

        <div className="flex rounded-xl bg-white p-1 shadow-sm border border-slate-200">
          <button
            onClick={() => setTab('transfer')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
              tab === 'transfer' ? 'bg-[#173B73] text-white' : 'text-slate-600'
            }`}
          >
            Send Money
          </button>
          <button
            onClick={() => setTab('beneficiaries')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
              tab === 'beneficiaries' ? 'bg-[#079669] text-white' : 'text-slate-600'
            }`}
          >
            Manage Beneficiaries ({beneficiaries.length})
          </button>
        </div>
      </div>

      {/* Instant Transfer Receipt Banner if just completed */}
      {receipt && (
        <div className="bg-emerald-50 border-2 border-[#079669] rounded-2xl p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-[#079669]" />
              <div>
                <h3 className="text-lg font-extrabold text-[#173B73]">
                  Demo Transaction Successful!
                </h3>
                <p className="text-xs text-slate-600">
                  Reference ID: <strong className="font-mono">{receipt.reference_id}</strong> •{' '}
                  {new Date(receipt.created_at).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#173B73] flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" /> Print Receipt
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-emerald-200 grid sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500">Paid To</span>
              <p className="font-bold text-slate-800">{receipt.counterparty_name} ({receipt.counterparty_account})</p>
            </div>
            <div>
              <span className="text-slate-500">Transfer Mode</span>
              <p className="font-bold text-[#173B73]">{receipt.channel}</p>
            </div>
            <div>
              <span className="text-slate-500">Amount Transferred</span>
              <p className="text-base font-extrabold text-[#079669]">
                ₹{Number(receipt.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Updated Account Balance</span>
              <p className="font-bold text-[#173B73]">
                ₹{Number(receipt.balance_after).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === 'transfer' ? (
        <div className="grid lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleInitiateTransfer}
            className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-5"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                1. Debit From Account
              </label>
              <select
                value={form.source_account_id}
                onChange={(e) => setForm({ ...form, source_account_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-[#173B73]"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.account_type_display || a.account_type} - {a.account_number} (Avl: ₹
                    {Number(a.balance).toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            {/* Transfer Mode Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                2. Select Transfer Mode
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'IMPS', label: 'IMPS', desc: 'Instant (24x7)' },
                  { id: 'NEFT', label: 'NEFT', desc: 'National Transfer' },
                  { id: 'RTGS', label: 'RTGS', desc: 'High Value (₹2L+)' },
                  { id: 'UPI', label: 'UPI ID', desc: 'Instant VPA Pay' },
                ].map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setForm({ ...form, channel: m.id })}
                    className={`p-3 rounded-xl border text-left transition ${
                      form.channel === m.id
                        ? 'border-[#079669] bg-emerald-50/60 text-[#173B73]'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-sm font-extrabold">{m.label}</p>
                    <p className="text-[11px] text-slate-500">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Beneficiary / Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={form.recipient_name}
                  onChange={(e) => setForm({ ...form, recipient_name: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  {form.channel === 'UPI' ? 'Recipient UPI ID (VPA)' : 'Recipient Account Number'}
                </label>
                <input
                  type="text"
                  required
                  value={form.recipient_account}
                  onChange={(e) => setForm({ ...form, recipient_account: e.target.value })}
                  placeholder={form.channel === 'UPI' ? 'priya@bebank' : '202600108921'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Bank IFSC Code</label>
                <input
                  type="text"
                  value={form.recipient_ifsc}
                  onChange={(e) => setForm({ ...form, recipient_ifsc: e.target.value.toUpperCase() })}
                  placeholder="BEBK0000102"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm uppercase font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Amount (INR)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Enter amount in ₹"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-extrabold text-[#173B73]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Remarks / Purpose</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Monthly Rent / Family Support / Vendor Invoice"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Proceed to Verify with 4-Digit MPIN</span>
            </button>
          </form>

          {/* Saved Beneficiaries Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-card border border-slate-100">
            <h3 className="text-base font-extrabold text-[#173B73] mb-1">
              Click a Beneficiary to Auto-Fill
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Tip: Selecting Priya Sharma (A/C 202600108921) performs an instant internal BeBank credit!
            </p>
            <div className="space-y-3">
              {beneficiaries.map((b) => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => handleSelectBeneficiary(b)}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-[#079669] hover:bg-emerald-50/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#173B73]">{b.name}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {b.bank_name}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-500 mt-1">
                    A/C: {b.account_number} • IFSC: {b.ifsc_code}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleAddBeneficiary}
            className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-4"
          >
            <h3 className="text-base font-extrabold text-[#173B73] flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#079669]" /> Add New Beneficiary
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Beneficiary Full Name</label>
              <input
                type="text"
                required
                value={benForm.name}
                onChange={(e) => setBenForm({ ...benForm, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Account Number</label>
              <input
                type="text"
                required
                value={benForm.account_number}
                onChange={(e) => setBenForm({ ...benForm, account_number: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Bank Name</label>
                <input
                  type="text"
                  required
                  value={benForm.bank_name}
                  onChange={(e) => setBenForm({ ...benForm, bank_name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">IFSC Code</label>
                <input
                  type="text"
                  required
                  value={benForm.ifsc_code}
                  onChange={(e) => setBenForm({ ...benForm, ifsc_code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm uppercase font-mono"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white font-bold text-sm"
            >
              Save & Verify Beneficiary
            </button>
          </form>

          <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-3">
            <h3 className="text-base font-extrabold text-[#173B73]">Registered Beneficiaries</h3>
            {beneficiaries.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-[#173B73]">{b.name}</p>
                  <p className="text-xs text-slate-500 font-mono">
                    {b.bank_name} • A/C: {b.account_number} • IFSC: {b.ifsc_code}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSelectBeneficiary(b)}
                    className="px-3 py-1.5 rounded-lg bg-[#173B73] text-white text-xs font-bold"
                  >
                    Send Money
                  </button>
                  <button
                    onClick={() => handleDeleteBeneficiary(b.id)}
                    className="p-2 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4-Digit BeBank MPIN Confirmation Modal */}
      {showMpinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmTransfer}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#173B73] text-white flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#173B73]">
                  Authorize with 4-Digit MPIN
                </h3>
                <p className="text-xs text-slate-500">
                  BeBank Two-Step Transaction Security
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F4F7FB] text-xs space-y-1">
              <p className="flex justify-between">
                <span className="text-slate-500">Recipient:</span>
                <strong className="text-slate-800">{form.recipient_name}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Account / VPA:</span>
                <strong className="font-mono">{form.recipient_account}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Amount:</span>
                <strong className="text-[#079669] text-sm">
                  ₹{Number(form.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Enter 4-Digit MPIN (Arjun default: 1234, Priya: 5678)
              </label>
              <input
                type="password"
                maxLength={4}
                autoFocus
                required
                value={form.mpin}
                onChange={(e) => setForm({ ...form, mpin: e.target.value })}
                placeholder="••••"
                className="w-full px-4 py-3 text-center tracking-[1em] text-xl font-extrabold rounded-xl border-2 border-[#173B73] outline-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowMpinModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white font-bold text-xs shadow"
              >
                {submitting ? 'Processing...' : 'Confirm & Transfer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
