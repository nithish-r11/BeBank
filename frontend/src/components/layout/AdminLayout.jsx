import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Shield, LogOut, ArrowLeftRight, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { resetDemoDatabase } from '../../api/bankingApi';

export default function AdminLayout() {
  const { user, login, logout, liveBackend, notify } = useAuth();
  const navigate = useNavigate();

  const handleSwitchToCustomer = async () => {
    try {
      await login('arjun.mehta@bebank.in', 'BeBank@2026');
      navigate('/app/dashboard');
    } catch (e) {
      notify(e.message, 'error');
    }
  };

  const handleReset = () => {
    resetDemoDatabase();
    notify('Demo banking database reset to initial state!', 'info');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB]">
      <header className="bg-[#173B73] text-white shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm">
              <img src="/assets/bebank-logo.png" alt="BeBank" className="h-9 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#079669] text-white">
                  Admin Command Center
                </span>
                <span className="text-xs text-emerald-300 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {liveBackend ? 'Django API Connected' : 'Demo Ledger Mode'}
                </span>
              </div>
              <p className="text-sm font-bold text-white mt-0.5">
                Officer: {user?.full_name} ({user?.customer_id})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSwitchToCustomer}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold shadow transition"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Switch to Customer Portal (Arjun)</span>
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo DB</span>
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/25 hover:bg-red-500/40 text-red-100 text-xs font-semibold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
