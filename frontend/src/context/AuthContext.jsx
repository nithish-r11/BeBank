import React, { createContext, useContext, useState, useEffect } from 'react';
import { bankingApi } from '../api/bankingApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bebank_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [liveBackend, setLiveBackend] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    bankingApi.checkHealth().then((info) => {
      setLiveBackend(Boolean(info.liveBackend));
    });
  }, []);

  const notify = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev ? null : null));
    }, 4000);
  };

  const login = async (identifier, password) => {
    const res = await bankingApi.login(identifier, password);
    setUser(res.user);
    setLiveBackend(Boolean(res.liveBackend));
    localStorage.setItem('bebank_active_user', JSON.stringify(res.user));
    notify(`Welcome back to BeBank, ${res.user.full_name}!`, 'success');
    return res.user;
  };

  const register = async (payload) => {
    const res = await bankingApi.registerCustomer(payload);
    setUser(res.user);
    setLiveBackend(Boolean(res.liveBackend));
    localStorage.setItem('bebank_active_user', JSON.stringify(res.user));
    notify(`Welcome to BeBank, ${res.user.full_name}! Your Savings Account is active.`, 'success');
    return res.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bebank_active_user');
    localStorage.removeItem('bebank_access_token');
    notify('You have been securely logged out of BeBank.', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, liveBackend, notify }}>
      {children}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-bounce no-print">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-elevated border text-sm font-semibold ${
              toast.type === 'error'
                ? 'bg-red-600 text-white border-red-700'
                : toast.type === 'info'
                ? 'bg-[#173B73] text-white border-[#0F2952]'
                : 'bg-[#079669] text-white border-[#057A55]'
            }`}
          >
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-white/80 hover:text-white">
              ✕
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
