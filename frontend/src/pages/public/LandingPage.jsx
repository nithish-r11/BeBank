import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Smartphone, Zap, Lock, CreditCard, Landmark,
  ArrowRight, CheckCircle2, PiggyBank, Users, Calculator, Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LandingPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Interactive FD/Loan Calculator on Landing Page
  const [calcTab, setCalcTab] = useState('FD');
  const [fdAmount, setFdAmount] = useState(250000);
  const [fdMonths, setFdMonths] = useState(12);
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanMonths, setLoanMonths] = useState(36);

  const fdRate = fdMonths < 6 ? 6.25 : fdMonths < 12 ? 6.8 : fdMonths <= 24 ? 7.25 : 7.4;
  const fdInterest = Math.round((fdAmount * fdRate * (fdMonths / 12)) / 100);
  const fdMaturity = fdAmount + fdInterest;

  const loanRate = 9.15;
  const r = loanRate / (12 * 100);
  const emi = Math.round((loanAmount * r * Math.pow(1 + r, loanMonths)) / (Math.pow(1 + r, loanMonths) - 1));

  const handleQuickDemoLogin = async (identifier, password, targetPath) => {
    await login(identifier, password);
    navigate(targetPath);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Regulatory Banner */}
      <div className="bg-[#173B73] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#079669]" />
            BeBank Digital Banking • Your Trusting for Tomorrow
          </span>
          <span className="text-slate-200">
            IFSC Prefix: <strong className="text-white">BEBK0000101</strong> | 24x7 Customer Care: 1800-425-2026
          </span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/bebank-logo.png"
              alt="BeBank - Your Trusting for Tomorrow"
              className="h-12 sm:h-14 object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#173B73]">
            <a href="#features" className="hover:text-[#079669] transition">Digital Banking</a>
            <a href="#calculators" className="hover:text-[#079669] transition">FD & EMI Calculators</a>
            <a href="#security" className="hover:text-[#079669] transition">Security</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuickDemoLogin('murugananthan@bebank.in', 'Admin@BeBank2026', '/admin-portal')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-[#173B73] text-[#173B73] hover:bg-[#173B73] hover:text-white text-xs sm:text-sm font-bold transition"
            >
              <span>Admin Portal</span>
            </button>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-sm font-bold shadow-md transition"
            >
              <span>Internet Banking Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#173B73] via-[#173B73] to-[#0F2952] text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#079669]/25 border border-[#079669]/50 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" /> Next-Gen BeBank Banking Experience
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Simple, Comfortable & Trustworthy Banking for{' '}
              <span className="text-[#10B981]">Every Indian Household.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
              Experience zero-clutter digital banking with BeBank. Instant IMPS/NEFT/UPI transfers,
              4-digit MPIN security, one-tap Debit & Credit card controls, paperless Fixed Deposits up to{' '}
              <strong className="text-white">7.40% p.a.</strong>, and instant loan approvals.
            </p>

            {/* One-Click Demo Portal Launchers */}
            <div className="pt-2 flex flex-wrap gap-3.5">
              <button
                onClick={() => handleQuickDemoLogin('arjun.mehta@bebank.in', 'BeBank@2026', '/app/dashboard')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white font-bold text-sm shadow-lg transition"
              >
                <span>Launch Customer Portal (1-Click Demo)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleQuickDemoLogin('murugananthan@bebank.in', 'Admin@BeBank2026', '/admin-portal')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white text-[#173B73] hover:bg-slate-100 font-bold text-sm shadow-lg transition"
              >
                <span>Launch Admin Portal (1-Click Demo)</span>
              </button>
              <Link
                to="/login?tab=register"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-sm transition"
              >
                <span>Open Digital Savings Account</span>
              </Link>
            </div>

            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/15 max-w-lg">
              <div>
                <p className="text-2xl font-extrabold text-[#10B981]">7.40%</p>
                <p className="text-xs text-slate-300">Max FD Interest p.a.</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">0 Fee</p>
                <p className="text-xs text-slate-300">IMPS / NEFT / UPI</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#10B981]">4-Digit</p>
                <p className="text-xs text-slate-300">BeBank MPIN Guard</p>
              </div>
            </div>
          </div>

          {/* Interactive FD & Loan Calculator Card */}
          <div id="calculators" className="lg:col-span-5">
            <div className="bg-white text-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#079669]" />
                  <h2 className="text-lg font-extrabold text-[#173B73]">Smart Return & EMI Calculator</h2>
                </div>
                <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-bold">
                  <button
                    onClick={() => setCalcTab('FD')}
                    className={`px-3 py-1.5 rounded-md transition ${
                      calcTab === 'FD' ? 'bg-[#173B73] text-white' : 'text-slate-600'
                    }`}
                  >
                    FD Maturity
                  </button>
                  <button
                    onClick={() => setCalcTab('EMI')}
                    className={`px-3 py-1.5 rounded-md transition ${
                      calcTab === 'EMI' ? 'bg-[#079669] text-white' : 'text-slate-600'
                    }`}
                  >
                    Loan EMI
                  </button>
                </div>
              </div>

              {calcTab === 'FD' ? (
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-1.5">
                      <span className="text-slate-600">Deposit Amount</span>
                      <span className="text-[#173B73] font-bold">₹{fdAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="2500000"
                      step="10000"
                      value={fdAmount}
                      onChange={(e) => setFdAmount(Number(e.target.value))}
                      className="w-full accent-[#079669]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-1.5">
                      <span className="text-slate-600">Tenure (Months)</span>
                      <span className="text-[#173B73] font-bold">{fdMonths} Months ({fdRate}% p.a.)</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="60"
                      step="3"
                      value={fdMonths}
                      onChange={(e) => setFdMonths(Number(e.target.value))}
                      className="w-full accent-[#173B73]"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-[#F4F7FB] border border-slate-200 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Guaranteed Interest</p>
                      <p className="text-lg font-extrabold text-[#079669]">+₹{fdInterest.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Maturity Value</p>
                      <p className="text-xl font-extrabold text-[#173B73]">₹{fdMaturity.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-1.5">
                      <span className="text-slate-600">Loan Principal</span>
                      <span className="text-[#173B73] font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="5000000"
                      step="25000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full accent-[#079669]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-1.5">
                      <span className="text-slate-600">Repayment Tenure</span>
                      <span className="text-[#173B73] font-bold">{loanMonths} Months ({loanRate}% p.a.)</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="84"
                      step="6"
                      value={loanMonths}
                      onChange={(e) => setLoanMonths(Number(e.target.value))}
                      className="w-full accent-[#173B73]"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-[#F4F7FB] border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Monthly EMI (@ {loanRate}% p.a.)</p>
                      <p className="text-2xl font-extrabold text-[#079669]">₹{emi.toLocaleString('en-IN')} / mo</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Total Payable</p>
                      <p className="text-sm font-bold text-[#173B73]">₹{(emi * loanMonths).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              )}

              <Link
                to="/login"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#173B73] hover:bg-[#0F2952] text-white font-bold text-sm transition"
              >
                <span>Log In to Book Instantly</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BeBank Core Features Section */}
      <section id="features" className="py-16 bg-[#F4F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#079669]">
              Designed Around Comfort
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B73] mt-1">
              Everything You Need in One Clean Banking Interface
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              BeBank eliminates confusing menus and gives you one-click access to essential banking services.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Smartphone,
                title: 'Quick Balance & Passbook',
                desc: 'View Savings & Current balances at a glance, filter transactions by IMPS/NEFT/UPI, and export official CSV/printable statements.',
              },
              {
                icon: Zap,
                title: 'Instant Fund Transfers',
                desc: 'Zero-fee IMPS, NEFT, RTGS, UPI, and internal BeBank transfers protected by your 4-digit Transaction MPIN.',
              },
              {
                icon: CreditCard,
                title: 'Granular Card Controls',
                desc: 'Toggle Domestic, International, Contactless NFC, Online E-Commerce, and ATM access or adjust daily limits in real time.',
              },
              {
                icon: PiggyBank,
                title: 'Paperless FD & RD',
                desc: 'Open high-yield Fixed and Recurring Deposits in 10 seconds with instant maturity calculations and auto-renewal.',
              },
              {
                icon: Landmark,
                title: 'Instant Loans & Underwriting',
                desc: 'Apply for Personal, Home, Green EV, or Education loans with transparent EMI breakdowns and instant disbursal to your account.',
              },
              {
                icon: ShieldCheck,
                title: 'Executive Admin Command Center',
                desc: 'Dedicated Bank Admin Portal for KYC approvals, compliance monitoring, loan disbursals, demo top-ups, and security audit trails.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 hover:border-[#079669]/40 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-[#173B73]/10 text-[#173B73] flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#079669]" />
                </div>
                <h3 className="text-base font-bold text-[#173B73]">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Regulatory Footer */}
      <footer id="security" className="bg-[#173B73] text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl">
              <img src="/assets/bebank-logo.png" alt="BeBank" className="h-9 object-contain" />
            </div>
            <div>
              <p className="font-bold text-sm">BeBank Digital Banking Platform</p>
              <p className="text-xs text-slate-300">
                Your Trusting for Tomorrow • Demo Banking Sandbox Mode Enabled
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-300 text-center sm:text-right">
            <p>© 2026 BeBank Financial Services. Built with Python Django & React + Tailwind CSS.</p>
            <p className="text-emerald-300 mt-1">
              Configured for Windows PC & Google Antigravity AI Development Workflow.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
