import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, User, Mail, Phone, MapPin, ShieldCheck, ArrowRight, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login');
  const { login, register, notify } = useAuth();
  const navigate = useNavigate();

  // Login State
  const [identifier, setIdentifier] = useState('arjun.mehta@bebank.in');
  const [password, setPassword] = useState('BeBank@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Registration State
  const [regForm, setRegForm] = useState({
    full_name: '',
    email: '',
    phone_number: '+91 98400 11223',
    pan_number: 'ABCDE1234F',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Anna Nagar, Chennai',
    pincode: '600040',
    password: '',
    mpin: '0710',
    initial_deposit: '25000',
  });

  useEffect(() => {
    if (searchParams.get('tab') === 'register') setTab('register');
  }, [searchParams]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(identifier, password);
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin-portal');
      } else {
        navigate('/app/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (id, pass) => {
    setIdentifier(id);
    setPassword(pass);
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(id, pass);
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin-portal');
      } else {
        navigate('/app/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (regForm.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/^\d{4}$/.test(regForm.mpin)) {
      setError('Transaction MPIN must be an exact 4-digit number.');
      return;
    }
    setLoading(true);
    try {
      await register(regForm);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#173B73] via-[#173B73] to-[#0F2952] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto grid lg:grid-cols-12 bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        {/* Left Branding Panel */}
        <div className="lg:col-span-5 bg-[#F4F7FB] p-8 flex flex-col justify-between border-r border-slate-200">
          <div>
            <Link to="/" className="inline-block bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
              <img src="/assets/bebank-logo.png" alt="BeBank Logo" className="h-12 object-contain" />
            </Link>
            <h2 className="mt-6 text-2xl font-extrabold text-[#173B73]">
              BeBank Digital Banking Portal
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Sign in with your Customer ID (CIF) or Email address, or use the 1-Click Demo Credentials below to explore both the Customer and Admin Portals immediately.
            </p>

            {/* 1-Click Demo Credentials Box */}
            <div className="mt-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#079669] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> 1-Click Demo Accounts (Pre-Seeded)
              </p>

              <button
                type="button"
                onClick={() => handleQuickLogin('arjun.mehta@bebank.in', 'BeBank@2026')}
                className="w-full text-left p-3.5 rounded-xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-[#079669] transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#173B73]">Customer 1: Arjun Mehta</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#079669]/15 text-[#079669]">
                    MPIN: 1234
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  CIF: <strong className="text-slate-700">BEB1002045</strong> • Savings + Current (₹17.25L)
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('priya.sharma@bebank.in', 'BeBank@2026')}
                className="w-full text-left p-3.5 rounded-xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-[#079669] transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#173B73]">Customer 2: Priya Sharma</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#079669]/15 text-[#079669]">
                    MPIN: 5678
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  CIF: <strong className="text-slate-700">BEB1002046</strong> • Savings Account (₹2.15L)
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('murugananthan@bebank.in', 'Admin@BeBank2026')}
                className="w-full text-left p-3.5 rounded-xl bg-[#173B73] text-white hover:bg-[#0F2952] transition shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Bank Admin: Murugananthan</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#079669] text-white">
                    ADMIN PORTAL
                  </span>
                </div>
                <p className="text-xs text-slate-200 mt-1">
                  Approve KYC, Disburse Loans, Monitor Transfers & Audit Logs
                </p>
              </button>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#079669]" /> 256-Bit Encrypted
            </span>
            <Link to="/" className="text-[#173B73] font-semibold hover:underline">
              ← Back to BeBank Home
            </Link>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-8 sm:p-10">
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition ${
                tab === 'login' ? 'bg-[#173B73] text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In to Portal
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition ${
                tab === 'register' ? 'bg-[#079669] text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Open Digital Account
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Customer ID (CIF) or Email Address
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. BEB1002045 or arjun.mehta@bebank.in"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#173B73] focus:ring-2 focus:ring-[#173B73]/20 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Internet Banking Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#173B73] focus:ring-2 focus:ring-[#173B73]/20 outline-none text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Signing In Securely...' : 'Secure Login to BeBank'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Full Legal Name (As per PAN)</label>
                  <input
                    type="text"
                    required
                    value={regForm.full_name}
                    onChange={(e) => setRegForm({ ...regForm, full_name: e.target.value })}
                    placeholder="e.g. Rohan Venkat"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="rohan@example.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={regForm.phone_number}
                    onChange={(e) => setRegForm({ ...regForm, phone_number: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">PAN Number</label>
                  <input
                    type="text"
                    required
                    value={regForm.pan_number}
                    onChange={(e) => setRegForm({ ...regForm, pan_number: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm uppercase"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Set Login Password (min 8 chars)</label>
                  <input
                    type="password"
                    required
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Set 4-Digit Transaction MPIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={regForm.mpin}
                    onChange={(e) => setRegForm({ ...regForm, mpin: e.target.value })}
                    placeholder="1234"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Demo Opening Deposit Credit (INR)
                </label>
                <input
                  type="number"
                  min="1000"
                  max="500000"
                  value={regForm.initial_deposit}
                  onChange={(e) => setRegForm({ ...regForm, initial_deposit: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-[#173B73] hover:bg-[#0F2952] text-white font-bold text-sm shadow-lg transition"
              >
                {loading ? 'Opening Your BeBank Account...' : 'Instant Open BeBank Smart Savings Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
