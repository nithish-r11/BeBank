import React, { useEffect, useState } from 'react';
import { CreditCard, Lock, Unlock, Wifi, Globe, ShoppingBag, ShieldCheck, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bankingApi } from '../../api/bankingApi';

export default function CardsPage() {
  const { user, notify } = useAuth();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (user) {
      bankingApi.getCards(user.id).then(setCards);
    }
  }, [user]);

  const handleToggle = async (card, field, value) => {
    try {
      const updated = await bankingApi.updateCardControls(user.id, card.id, { [field]: value });
      setCards((prev) => prev.map((c) => (c.id === card.id ? updated : c)));
      notify(`Updated ${field.replace('_', ' ')} for ${card.card_number_masked}`);
    } catch (e) {
      notify(e.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#173B73]">BeBank Cards Control Center</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your BeBank Debit & Credit cards, toggle usage channels, and set daily spending limits
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {cards.map((card) => {
          const isBlocked = card.status === 'BLOCKED';
          const isCredit = card.card_type.includes('CREDIT');
          return (
            <div key={card.id} className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 space-y-6">
              {/* Visual Banking Card */}
              <div
                className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-xl ${
                  isBlocked
                    ? 'bg-slate-700'
                    : isCredit
                    ? 'bg-gradient-to-br from-[#079669] via-[#057A55] to-[#173B73]'
                    : 'bg-gradient-to-br from-[#173B73] via-[#173B73] to-[#0F2952]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-300">
                      {card.card_type_display || card.card_type}
                    </p>
                    <p className="text-xs text-slate-200 mt-0.5">Linked A/C: {card.account_number}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-extrabold tracking-wider">
                    {card.network}
                  </span>
                </div>

                <p className="my-6 text-xl sm:text-2xl font-mono font-extrabold tracking-widest">
                  {card.card_number_masked}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="text-slate-300 uppercase text-[10px]">Cardholder Name</p>
                    <p className="font-bold tracking-wider">{card.cardholder_name}</p>
                  </div>
                  <div>
                    <p className="text-slate-300 uppercase text-[10px]">Valid Thru</p>
                    <p className="font-bold">
                      {String(card.expiry_month).padStart(2, '0')}/{String(card.expiry_year).slice(-2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-300 uppercase text-[10px]">Status</p>
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        isBlocked ? 'bg-red-500 text-white' : 'bg-emerald-400/25 text-emerald-200'
                      }`}
                    >
                      {card.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Freeze / Unfreeze & Reward Points */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#F4F7FB]">
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-[#079669]" />
                  <div>
                    <p className="text-xs text-slate-500">BeBank Reward Points</p>
                    <p className="text-sm font-extrabold text-[#173B73]">
                      {Number(card.reward_points || 0).toLocaleString('en-IN')} pts
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleToggle(card, 'status', isBlocked ? 'ACTIVE' : 'BLOCKED')
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    isBlocked
                      ? 'bg-[#079669] text-white'
                      : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                  }`}
                >
                  {isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{isBlocked ? 'Unblock Card' : 'Temporary Block Card'}</span>
                </button>
              </div>

              {/* BeBank Channel Toggles */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Channel Security Switches
                </h4>
                {[
                  { key: 'domestic_enabled', label: 'Domestic Usage (India)', icon: ShieldCheck },
                  { key: 'online_tx_enabled', label: 'Online E-Commerce & Apps', icon: ShoppingBag },
                  { key: 'contactless_enabled', label: 'Contactless Tap & Pay (NFC)', icon: Wifi },
                  { key: 'atm_enabled', label: 'ATM Cash Withdrawals', icon: CreditCard },
                  { key: 'international_enabled', label: 'International Usage', icon: Globe },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                  >
                    <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                      <item.icon className="w-4 h-4 text-[#173B73]" />
                      <span>{item.label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle(card, item.key, !card[item.key])}
                      className={`w-12 h-6 rounded-full transition-colors p-0.5 ${
                        card[item.key] ? 'bg-[#079669]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                          card[item.key] ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Daily Limit Sliders */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">Daily ATM Withdrawal Limit</span>
                    <span className="text-[#173B73]">
                      ₹{Number(card.daily_atm_limit).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="5000"
                    value={card.daily_atm_limit}
                    onChange={(e) => handleToggle(card, 'daily_atm_limit', Number(e.target.value))}
                    className="w-full accent-[#173B73]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">Daily POS & Online Limit</span>
                    <span className="text-[#079669]">
                      ₹{Number(card.daily_pos_limit).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="10000"
                    value={card.daily_pos_limit}
                    onChange={(e) => handleToggle(card, 'daily_pos_limit', Number(e.target.value))}
                    className="w-full accent-[#079669]"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
