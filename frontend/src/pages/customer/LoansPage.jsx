import React, { useEffect, useState } from 'react';
import { Landmark, Calculator, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bankingApi } from '../../api/bankingApi';

export default function LoansPage() {
  const { user, notify } = useAuth();
  const [loans, setLoans] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    disbursal_account: '',
    loan_type: 'PERSONAL',
    principal_amount: 350000,
    tenure_months: 36,
    purpose: 'Home Renovation & Solar Rooftop Setup',
    monthly_income: 120000,
    employment_type: 'Salaried',
  });

  useEffect(() => {
    if (user) {
      bankingApi.getLoans(user.id).then(setLoans);
      bankingApi.getAccounts(user.id).then((accts) => {
        setAccounts(accts);
        if (accts.length > 0) setForm((prev) => ({ ...prev, disbursal_account: accts[0].id }));
      });
    }
  }, [user]);

  const rateMap = { HOME: 8.65, VEHICLE: 9.15, EDUCATION: 8.9, BUSINESS: 11.25, PERSONAL: 10.75 };
  const rate = rateMap[form.loan_type] || 10.75;
  const r = rate / (12 * 100);
  const emi = Math.round(
    (Number(form.principal_amount) * r * Math.pow(1 + r, form.tenure_months)) /
      (Math.pow(1 + r, form.tenure_months) - 1)
  );

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    try {
      const created = await bankingApi.applyLoan(user.id, form);
      setLoans((prev) => [created, ...prev]);
      notify(
        `Loan application #${created.loan_number} submitted! Switch to the Admin Portal to approve & disburse it immediately.`
      );
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#173B73]">Loans & Digital Credit Center</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Calculate EMIs transparently and apply for instant paperless credit
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <form
          onSubmit={handleApplyLoan}
          className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-4"
        >
          <h3 className="text-base font-extrabold text-[#173B73] flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#079669]" /> Apply for Instant Loan
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Loan Category</label>
            <select
              value={form.loan_type}
              onChange={(e) => setForm({ ...form, loan_type: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
            >
              <option value="PERSONAL">Instant Personal Loan (10.75% p.a.)</option>
              <option value="HOME">BeBank Dream Home Loan (8.65% p.a.)</option>
              <option value="VEHICLE">Green EV & Car Loan (9.15% p.a.)</option>
              <option value="EDUCATION">Global Scholar Education Loan (8.90% p.a.)</option>
              <option value="BUSINESS">MSME Business Growth Loan (11.25% p.a.)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Disbursal Bank Account</label>
            <select
              value={form.disbursal_account}
              onChange={(e) => setForm({ ...form, disbursal_account: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  A/C {a.account_number} ({a.account_type})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Loan Amount (INR)</label>
              <input
                type="number"
                min="25000"
                step="5000"
                value={form.principal_amount}
                onChange={(e) => setForm({ ...form, principal_amount: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Tenure (Months)</label>
              <input
                type="number"
                min="6"
                max="240"
                value={form.tenure_months}
                onChange={(e) => setForm({ ...form, tenure_months: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Purpose of Loan</label>
            <input
              type="text"
              required
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#F4F7FB] border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Monthly EMI (@ {rate}% p.a.)</p>
              <p className="text-xl font-extrabold text-[#079669]">₹{emi.toLocaleString('en-IN')} / mo</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Total Repayment</p>
              <p className="text-sm font-bold text-[#173B73]">
                ₹{(emi * form.tenure_months).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#173B73] hover:bg-[#0F2952] text-white font-bold text-sm shadow"
          >
            Submit Digital Loan Application
          </button>
        </form>

        {/* Active & Pending Loans */}
        <div className="lg:col-span-7 space-y-4">
          {loans.map((loan) => (
            <div key={loan.id} className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#079669]">
                    {loan.loan_type_display || loan.loan_type}
                  </span>
                  <h4 className="text-base font-extrabold text-[#173B73]">
                    Loan #{loan.loan_number} • ₹{Number(loan.principal_amount).toLocaleString('en-IN')}
                  </h4>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    loan.status === 'ACTIVE' || loan.status === 'APPROVED'
                      ? 'bg-emerald-50 text-[#079669]'
                      : loan.status === 'PENDING_APPROVAL'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {loan.status}
                </span>
              </div>

              <p className="text-xs text-slate-600">{loan.purpose}</p>

              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400">Interest Rate</span>
                  <p className="font-bold text-slate-800">{loan.interest_rate}% p.a. ({loan.tenure_months}m)</p>
                </div>
                <div>
                  <span className="text-slate-400">Monthly EMI</span>
                  <p className="font-bold text-[#079669]">₹{Number(loan.emi_amount).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <span className="text-slate-400">Disbursal Account</span>
                  <p className="font-mono font-bold text-[#173B73]">{loan.account_number}</p>
                </div>
              </div>

              {loan.admin_remarks && (
                <p className="text-xs bg-slate-50 p-2.5 rounded-lg text-slate-600">
                  <strong>Underwriting Note:</strong> {loan.admin_remarks}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
