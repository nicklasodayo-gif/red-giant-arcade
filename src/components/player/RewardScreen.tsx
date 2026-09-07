import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { RewardRecord, Theme } from '../../types';
import { Award, ArrowRight, Check, Copy } from 'lucide-react';

interface RewardScreenProps {
  reward: RewardRecord;
  theme: Theme;
  onProceedToLeaderboard: () => void;
}

export const RewardScreen: React.FC<RewardScreenProps> = ({
  reward,
  theme,
  onProceedToLeaderboard
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (reward.qrData) {
      QRCode.toDataURL(reward.qrData, {
        width: 250,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      })
        .then((url) => setQrUrl(url))
        .catch(() => {});
    }
  }, [reward.qrData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(reward.voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isGold = reward.tier === 'GOLD';
  const isSilver = reward.tier === 'SILVER';

  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 select-none max-w-xl mx-auto my-auto animate-fade-in">
      <div className="w-full rounded-3xl bg-zinc-900/95 border-2 border-zinc-800 shadow-2xl p-6 sm:p-8 backdrop-blur-md flex flex-col items-center text-center">
        {/* Tier Badge */}
        <div
          className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-lg ${
            isGold
              ? 'bg-amber-400 text-zinc-950 ring-4 ring-amber-400/20'
              : isSilver
              ? 'bg-slate-300 text-zinc-950 ring-4 ring-slate-300/20'
              : 'bg-orange-700 text-white'
          }`}
        >
          {reward.tier} REWARD UNLOCKED
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-1">
          {reward.title}
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          Scan QR code on your phone or present code to event staff to claim.
        </p>

        {/* QR Code Container */}
        <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white p-3 rounded-3xl shadow-2xl flex items-center justify-center border-4 border-amber-400 mb-6">
          {qrUrl ? (
            <img src={qrUrl} alt="Reward QR" className="w-full h-full object-contain" />
          ) : (
            <div className="text-zinc-500 text-xs">Generating QR...</div>
          )}
        </div>

        {/* Voucher Code Box */}
        <div className="w-full bg-zinc-950 rounded-2xl p-4 border border-zinc-800 flex items-center justify-between mb-6">
          <div className="text-left">
            <span className="text-[10px] text-zinc-500 font-black uppercase block tracking-wider">Voucher Code</span>
            <span className="text-lg font-black text-amber-400 font-mono tracking-wider">{reward.voucherCode}</span>
          </div>
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Continue Button */}
        <button
          onClick={onProceedToLeaderboard}
          style={{ backgroundColor: theme.colors.primary }}
          className="w-full h-16 rounded-2xl text-white font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <span>VIEW LEADERBOARD</span>
          <ArrowRight className="w-5 h-5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
