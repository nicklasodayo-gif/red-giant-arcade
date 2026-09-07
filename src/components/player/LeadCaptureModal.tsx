import React, { useState } from 'react';
import { Campaign, Lead, Theme } from '../../types';
import { normalizePhoneNumber } from '../../utils/phone';
import { audio } from '../../services/audioManager';
import { Phone, Mail, User, ShieldCheck, CheckCircle } from 'lucide-react';

interface LeadCaptureModalProps {
  campaign: Campaign;
  theme: Theme;
  playerId: string;
  playerAlias: string;
  score: number;
  onSubmit: (leadData: Partial<Lead>) => void;
  onSkip: () => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  campaign,
  theme,
  playerId,
  playerAlias,
  score,
  onSubmit,
  onSkip
}) => {
  const settings = campaign.leadSettings;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(true);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (settings.requirePhone && phone) {
      const check = normalizePhoneNumber(phone, 'KE');
      if (!check.isValid) {
        setPhoneError(check.error || 'Please enter a valid Kenyan phone number (e.g. 07XXXXXXXX)');
        audio.playMistake();
        return;
      }
    }

    if (settings.requireConsent && !consent) {
      alert('Please accept terms to participate in the prize giveaway.');
      return;
    }

    audio.playPowerup();
    onSubmit({
      playerId,
      playerAlias,
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      consentGiven: consent,
      scoreAchieved: score
    });
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 select-none max-w-lg mx-auto my-auto animate-fade-in">
      <div className="w-full rounded-3xl bg-zinc-900/95 border-2 border-zinc-800 shadow-2xl p-6 sm:p-8 backdrop-blur-md flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-1">
          CLAIM PRIZE & UPDATES
        </h2>
        <p className="text-xs text-zinc-400 mb-6 max-w-sm">
          Enter your contact details to save your leaderboard standing and receive SMS reward redemption alerts.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
          {/* Name Field */}
          {settings.requireName && (
            <div>
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Mwangi"
                  className="w-full h-13 pl-11 pr-4 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-red-500 text-sm font-semibold text-white outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Phone Field with Kenya Hint */}
          {settings.requirePhone && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Mobile Number (Kenya)
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">07xx / 01xx / +254</span>
              </div>
              <div className="relative flex items-center">
                <Phone className="absolute left-4 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError(null);
                  }}
                  placeholder="0712 345 678"
                  className={`w-full h-13 pl-11 pr-4 rounded-xl bg-zinc-950 border text-sm font-semibold text-white outline-none transition-colors ${
                    phoneError ? 'border-red-500 focus:border-red-400' : 'border-zinc-800 focus:border-red-500'
                  }`}
                />
              </div>
              {phoneError && <span className="text-xs text-red-400 mt-1 block font-medium">{phoneError}</span>}
            </div>
          )}

          {/* Email Field */}
          {settings.requireEmail && (
            <div>
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.ke"
                  className="w-full h-13 pl-11 pr-4 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-red-500 text-sm font-semibold text-white outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Consent Checkbox */}
          {settings.requireConsent && (
            <label className="flex items-start gap-3 pt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-red-600 focus:ring-0 cursor-pointer"
              />
              <span className="text-[11px] text-zinc-400 leading-tight">
                {settings.consentMessage || 'I agree to receive score announcements and promotional updates.'}
              </span>
            </label>
          )}

          {/* Submit */}
          <button
            type="submit"
            style={{ backgroundColor: theme.colors.primary }}
            className="w-full h-14 rounded-2xl text-white font-black text-base uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer mt-4"
          >
            <CheckCircle className="w-5 h-5" />
            <span>SUBMIT & COMPLETE</span>
          </button>
        </form>

        <button
          onClick={onSkip}
          className="mt-4 text-xs text-zinc-500 hover:text-zinc-300 uppercase tracking-widest font-bold cursor-pointer transition-colors"
        >
          Skip without saving contact info
        </button>
      </div>
    </div>
  );
};
