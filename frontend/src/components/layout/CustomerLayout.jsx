import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Wallet, Send, CreditCard, PiggyBank,
  Landmark, Receipt, LifeBuoy, ShieldCheck, LogOut, Menu, X,
  RefreshCw, ArrowUpRight, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { resetDemoDatabase } from '../../api/bankingApi';

const NAV_ITEMS = [
  { to: '/app/dashboard', label: 'BeBank Overview', icon: LayoutDashboard },
  { to: '/app/accounts', label: 'Accounts & Passbook', icon: Wallet },
  { to: '/app/transfer', label: 'Fund Transfer & UPI', icon: Send },
  { to: '/app/cards', label: 'Cards Control Center', icon: CreditCard },
  { to: '/app/deposits', label: 'Fixed & Recurring Deposits', icon: PiggyBank },
  { to: '/app/loans', label: 'Loans & EMI Center', icon: Landmark },
  { to: '/app/bills', label: 'Bill Pay & Recharge', icon: Receipt },
  { to: '/app/support', label: 'Service & Security', icon: LifeBuoy },
];

export default function CustomerLayout() {
  const { user, login, logout, liveBackend, notify } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSwitchToAdmin = async () => {
    try {
      await login('murugananthan@bebank.in', 'Admin@BeBank2026');
      navigate('/admin-portal');
    } catch (e) {
      notify(e.message, 'error');
    }
  };

  const handleResetDemo = () => {
    resetDemoDatabase();
    notify('Demo banking ledger reset to initial seed balances!', 'info');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex bg-[#F4F7FB]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-[#173B73] text-white shadow-xl no-print">
        <div className="p-5 bg-white border-b border-slate-100 flex items-center justify-between">
          <img
            src="/assets/bebank-logo.png"
            alt="BeBank Logo"
            className="h-11 object-contain"
          />
          <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-[#079669]/15 text-[#079669] rounded-full">
            BeBank
          </span>
        </div>

        {/* Customer Info Card */}
        <div className="mx-4 mt-5 p-4 rounded-xl bg-white/10 backdrop-blur border border-white/15">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-300 uppercase tracking-wider">Welcome</p>
              <p className="font-bold text-base text-white truncate">{user?.full_name}</p>
              <p className="text-xs text-emerald-300 font-medium mt-0.5">CIF: {user?.customer_id}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#079669] flex items-center justify-center font-bold text-white shadow">
              {user?.full_name?.[0] || 'B'}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> KYC: {user?.kyc_status || 'VERIFIED'}
            </span>
            <span className="text-slate-300">MPIN Active</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#079669] text-white shadow-md'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Quick Portal Switcher & Logout */}
        <div className="p-4 border-t border-white/15 space-y-2">
          <button
            onClick={handleSwitchToAdmin}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-emerald-300 transition"
          >
            <span>Switch to Admin Portal (Demo)</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-sm font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-[#173B73] text-white flex flex-col z-10">
            <div className="p-4 bg-white flex items-center justify-between">
              <img src="/assets/bebank-logo.png" alt="BeBank" className="h-9 object-contain" />
              <button onClick={() => setMobileOpen(false)} className="text-slate-700 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                      isActive ? 'bg-[#079669] text-white' : 'text-slate-200 hover:bg-white/10'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 no-print">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#173B73] hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#173B73]">
                BeBank Digital Banking Portal
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                256-Bit SSL Encrypted • RBI-Style Demo Sandbox Environment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                liveBackend
                  ? 'bg-emerald-50 text-[#079669] border border-emerald-200'
                  : 'bg-blue-50 text-[#173B73] border border-blue-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#079669] animate-pulse" />
              {liveBackend ? 'Django REST API Live' : 'Demo Ledger Active'}
            </span>

            <button
              onClick={handleResetDemo}
              title="Reset Demo Balances"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo Data</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#173B73]/5 text-[#173B73] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#079669]" />
              <span>Demo Mode</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
