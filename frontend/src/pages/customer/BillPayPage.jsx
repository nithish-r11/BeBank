import React, { useEffect, useState } from 'react';
import { Receipt, Zap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bankingApi } from '../../api/bankingApi';

export default function BillPayPage() {
  const { user, notify } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [bills, setBills] = useState([]);
  const [form, setForm] = useState({
    account: '',
    biller_category: 'ELECTRICITY',
    biller_name: 'TANGEDCO Electricity Board',
    consumer_number: '09214005812',
    amount: '2450',
    mpin: '',
    auto_pay: true,
  });

  useEffect(() => {
    if (user) {
      bankingApi.getAccounts(user.id).then((accts) => {
        setAccounts(accts);
        if (accts.length > 0) setForm((prev) => ({ ...prev, account: accts[0].id }));
      });
      bankingApi.getBills(user.id).then(setBills);
    }
  }, [user]);

  const handlePayBill = async (e) => {
    e.preventDefault();
    try {
      const paid = await bankingApi.payBill(user.id, form);
      setBills((prev) => [paid, ...prev]);
      setForm((prev) => ({ ...prev, mpin: '' }));
      notify(`Bill paid successfully! Reference ID: ${paid.reference_id}`);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#173B73]">
          Bharat BillPay (BBPS) & Utility Recharge
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Pay Electricity, Mobile, Fiber Broadband, Water, FASTag, and Insurance bills with zero convenience fee
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <form
          onSubmit={handlePayBill}
          className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-4"
        >
          <h3 className="text-base font-extrabold text-[#173B73] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#079669]" /> Instant Bill Payment
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Select Account</label>
            <select
              value={form.account}
              onChange={(e) => setForm({ ...form, account: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.account_number} (Avl: ₹{Number(a.balance).toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Utility Category</label>
            <select
              value={form.biller_category}
              onChange={(e) => setForm({ ...form, biller_category: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            >
              <option value="ELECTRICITY">Electricity Board (TANGEDCO / BESCOM)</option>
              <option value="MOBILE_POSTPAID">Mobile Postpaid / 5G Recharge</option>
              <option value="BROADBAND">Fiber Broadband (Airtel / JioFiber / ACT)</option>
              <option value="FASTAG">NHAI FASTag Recharge</option>
              <option value="WATER">Metro Water & Sewage Board</option>
              <option value="INSURANCE">LIC / Health Insurance Premium</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Biller / Operator Name</label>
            <input
              type="text"
              required
              value={form.biller_name}
              onChange={(e) => setForm({ ...form, biller_name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Consumer / Service No.</label>
              <input
                type="text"
                required
                value={form.consumer_number}
                onChange={(e) => setForm({ ...form, consumer_number: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Bill Amount (INR)</label>
              <input
                type="number"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              4-Digit Transaction MPIN (Default: 1234)
            </label>
            <input
              type="password"
              maxLength={4}
              required
              value={form.mpin}
              onChange={(e) => setForm({ ...form, mpin: e.target.value })}
              placeholder="••••"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold tracking-widest"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white font-bold text-sm shadow"
          >
            Pay Utility Bill Now
          </button>
        </form>

        {/* Paid Bills History */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-3">
          <h3 className="text-base font-extrabold text-[#173B73]">Recent Bill Payments</h3>
          {bills.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-xl border border-slate-100 bg-[#F4F7FB] flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-bold text-[#173B73]">{b.biller_name}</p>
                <p className="text-xs text-slate-500">
                  Consumer #{b.consumer_number} • Ref: <span className="font-mono">{b.reference_id}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-[#079669]">
                  ₹{Number(b.amount).toLocaleString('en-IN')}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3" /> Paid
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
