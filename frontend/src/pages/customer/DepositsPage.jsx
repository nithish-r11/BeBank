import React, { useEffect, useState } from 'react';
import { PiggyBank, PlusCircle, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bankingApi } from '../../api/bankingApi';

export default function DepositsPage() {
  const { user, notify } = useAuth();
  const [deposits, setDeposits] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    source_account: '',
    deposit_type: 'FD',
    principal_amount: 100000,
    tenure_months: 12,
    auto_renew: true,
  });

  useEffect(() => {
    if (user) {
      bankingApi.getDeposits(user.id).then(setDeposits);
      bankingApi.getAccounts(user.id).then((accts) => {
        setAccounts(accts);
        if (accts.length > 0) setForm((prev) => ({ ...prev, source_account: accts[0].id }));
      });
    }
  }, [user]);

  const rate =
    form.tenure_months < 6
      ? 6.25
      : form.tenure_months < 12
      ? 6.8
      : form.tenure_months <= 24
      ? 7.25
      : 7.4;
  const estInterest = Math.round((Number(form.principal_amount) * rate * (form.tenure_months / 12)) / 100);
  const estMaturity = Number(form.principal_amount) + estInterest;

  const handleCreateDeposit = async (e) => {
    e.preventDefault();
    try {
      const created = await bankingApi.createDeposit(user.id, form);
      setDeposits((prev) => [created, ...prev]);
      const updatedAccts = await bankingApi.getAccounts(user.id);
      setAccounts(updatedAccts);
      notify(`Successfully booked ${created.deposit_type} #${created.deposit_number}!`);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#173B73]">
          Fixed & Recurring Deposits (FD / RD)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Earn assured returns up to 7.40% p.a. with instant paperless booking
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Book New FD/RD Form */}
        <form
          onSubmit={handleCreateDeposit}
          className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-4"
        >
          <h3 className="text-base font-extrabold text-[#173B73] flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#079669]" /> Open Instant Deposit
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Debit From Account</label>
            <select
              value={form.source_account}
              onChange={(e) => setForm({ ...form, source_account: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.account_number} (Avl: ₹{Number(a.balance).toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {['FD', 'RD'].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm({ ...form, deposit_type: t })}
                className={`py-2.5 rounded-xl text-xs font-bold border ${
                  form.deposit_type === t
                    ? 'bg-[#173B73] text-white border-[#173B73]'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                {t === 'FD' ? 'Fixed Deposit (FD)' : 'Recurring Deposit (RD)'}
              </button>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-600">Principal Amount (INR)</span>
              <span className="text-[#173B73]">₹{Number(form.principal_amount).toLocaleString('en-IN')}</span>
            </div>
            <input
              type="number"
              min="1000"
              step="500"
              value={form.principal_amount}
              onChange={(e) => setForm({ ...form, principal_amount: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-600">Tenure: {form.tenure_months} Months</span>
              <span className="text-[#079669]">Interest Rate: {rate}% p.a.</span>
            </div>
            <input
              type="range"
              min="3"
              max="60"
              step="3"
              value={form.tenure_months}
              onChange={(e) => setForm({ ...form, tenure_months: Number(e.target.value) })}
              className="w-full accent-[#079669]"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#F4F7FB] border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-500">Interest Earned</p>
              <p className="text-base font-extrabold text-[#079669]">+₹{estInterest.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-slate-500">Maturity Value</p>
              <p className="text-base font-extrabold text-[#173B73]">₹{estMaturity.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white font-bold text-sm shadow"
          >
            Book {form.deposit_type} Instantly
          </button>
        </form>

        {/* Active Deposits List */}
        <div className="lg:col-span-7 space-y-4">
          {deposits.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#173B73] text-white text-xs font-bold">
                    {d.deposit_type}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#173B73]">#{d.deposit_number}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#079669] text-[11px] font-bold">
                    {d.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Tenure: <strong>{d.tenure_months} Months</strong> @{' '}
                  <strong className="text-[#079669]">{d.interest_rate}% p.a.</strong> • Matures on:{' '}
                  <strong>{d.maturity_date}</strong>
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-xs text-slate-500">Principal: ₹{Number(d.principal_amount).toLocaleString('en-IN')}</p>
                <p className="text-lg font-extrabold text-[#079669]">
                  Maturity: ₹{Number(d.maturity_amount).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
