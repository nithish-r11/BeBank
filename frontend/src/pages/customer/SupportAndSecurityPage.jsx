import React, { useEffect, useState } from 'react';
import { LifeBuoy, ShieldCheck, KeyRound, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bankingApi } from '../../api/bankingApi';

export default function SupportAndSecurityPage() {
  const { user, notify } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [logs, setLogs] = useState([]);
  const [ticketForm, setTicketForm] = useState({
    request_type: 'CHEQUE_BOOK',
    subject: '',
    description: '',
    priority: 'MEDIUM',
  });
  const [mpinForm, setMpinForm] = useState({
    current_mpin: '',
    new_mpin: '',
  });

  useEffect(() => {
    if (user) {
      bankingApi.getSupportTickets(user.id).then(setTickets);
      bankingApi.getCustomerAuditLogs(user.id).then(setLogs);
    }
  }, [user]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const created = await bankingApi.createSupportTicket(user.id, ticketForm);
      setTickets((prev) => [created, ...prev]);
      setTicketForm({ request_type: 'CHEQUE_BOOK', subject: '', description: '', priority: 'MEDIUM' });
      notify(`Service Request #${created.ticket_number} submitted!`);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleChangeMpin = async (e) => {
    e.preventDefault();
    try {
      const res = await bankingApi.changeMpin(user.id, mpinForm.current_mpin, mpinForm.new_mpin);
      setMpinForm({ current_mpin: '', new_mpin: '' });
      notify(res.detail || 'MPIN updated!');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#173B73]">
          Service Requests & Security Center
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Request cheque books, update your 4-digit Transaction MPIN, and inspect your security activity trail
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Raise Service Request */}
        <form
          onSubmit={handleCreateTicket}
          className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-4"
        >
          <h3 className="text-base font-extrabold text-[#173B73] flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-[#079669]" /> Raise Banking Service Request
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Service Category</label>
            <select
              value={ticketForm.request_type}
              onChange={(e) => setTicketForm({ ...ticketForm, request_type: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            >
              <option value="CHEQUE_BOOK">New Cheque Book Request (25 Leaves)</option>
              <option value="STOP_PAYMENT">Stop Cheque Payment Instruction</option>
              <option value="KYC_UPDATE">Re-KYC / PAN / Address Update</option>
              <option value="DISPUTE_TRANSACTION">Transaction Dispute / Chargeback</option>
              <option value="ACCOUNT_STATEMENT">Certified Physical Account Statement</option>
              <option value="GENERAL_INQUIRY">General Banking Assistance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Subject</label>
            <input
              type="text"
              required
              value={ticketForm.subject}
              onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
              placeholder="e.g. Dispatch 25-leaf Cheque Book to Registered Address"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Details / Instructions</label>
            <textarea
              rows={3}
              required
              value={ticketForm.description}
              onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
              placeholder="Provide account number or relevant reference details..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white font-bold text-sm shadow"
          >
            Submit Service Ticket
          </button>
        </form>

        {/* Update 4-Digit MPIN & KYC Summary */}
        <div className="lg:col-span-6 space-y-6">
          <form
            onSubmit={handleChangeMpin}
            className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-4"
          >
            <h3 className="text-base font-extrabold text-[#173B73] flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#079669]" /> Change 4-Digit Transaction MPIN
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Current 4-Digit MPIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={mpinForm.current_mpin}
                  onChange={(e) => setMpinForm({ ...mpinForm, current_mpin: e.target.value })}
                  placeholder="••••"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm tracking-widest"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">New 4-Digit MPIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={mpinForm.new_mpin}
                  onChange={(e) => setMpinForm({ ...mpinForm, new_mpin: e.target.value })}
                  placeholder="••••"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm tracking-widest"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#173B73] hover:bg-[#0F2952] text-white font-bold text-xs sm:text-sm"
            >
              Update Transaction MPIN
            </button>
          </form>

          {/* My Service Tickets */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-3">
            <h3 className="text-base font-extrabold text-[#173B73]">My Service Requests</h3>
            {tickets.map((t) => (
              <div key={t.id} className="p-3.5 rounded-xl border border-slate-100 bg-[#F4F7FB] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#173B73]">
                    #{t.ticket_number} • {t.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#079669] font-bold">
                    {t.status}
                  </span>
                </div>
                <p className="text-slate-600">{t.description}</p>
                {t.admin_response && (
                  <p className="text-[#079669] font-semibold pt-1">
                    Bank Desk Response: {t.admin_response}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Security Audit Trail */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
        <h3 className="text-base font-extrabold text-[#173B73] mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#079669]" /> Recent Security & Activity Audit Log
        </h3>
        <div className="divide-y divide-slate-100 text-xs">
          {logs.slice(0, 8).map((l) => (
            <div key={l.id} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#173B73] mr-2">[{l.action}]</span>
                <span className="text-slate-700">{l.description}</span>
              </div>
              <span className="text-slate-400">
                IP: {l.ip_address} • {new Date(l.created_at).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
