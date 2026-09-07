import React, { useState } from 'react';
import { ApiClient } from '../../services/api';
import { Award, CheckCircle2, AlertTriangle, ScanLine, Gift } from 'lucide-react';

export const RewardManager: React.FC = () => {
  const [voucherCode, setVoucherCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
    reward?: any;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const res = await ApiClient.redeemReward(voucherCode.trim());
      setVerificationResult(res);
    } catch {
      setVerificationResult({
        success: false,
        message: 'Network error or invalid voucher format'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const sampleCodes = ['RG-GOLD-VIP', 'RG-SNACK-50', 'RG-BONUS-TOKEN'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800">
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
          REWARD RULES & STAFF REDEMPTION SCANNER
        </h2>
        <p className="text-xs text-zinc-400">
          Verify digital voucher codes presented by players and prevent double-redemption.
        </p>
      </div>

      {/* Two Columns: Verification Terminal on Left, Active Reward Rules on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Terminal (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                Staff Voucher Terminal
              </h3>
              <p className="text-xs text-zinc-400">Enter code from player phone or QR voucher</p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Voucher / Coupon Code
              </label>
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                placeholder="e.g. RG-GOLD-VIP or RG-7A9B"
                className="w-full h-14 px-4 rounded-2xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 font-mono font-black text-lg text-white outline-none tracking-wider uppercase transition-colors"
              />
            </div>

            {/* Quick Fill Test Codes */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 uppercase font-bold">Quick Demo Codes:</span>
              {sampleCodes.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setVoucherCode(code)}
                  className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono text-zinc-300 font-bold transition-colors cursor-pointer"
                >
                  {code}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isVerifying || !voucherCode.trim()}
              className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-40 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isVerifying ? 'VERIFYING...' : 'VERIFY & REDEEM VOUCHER'}</span>
            </button>
          </form>

          {/* Verification Result Banner */}
          {verificationResult && (
            <div
              className={`p-5 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                verificationResult.success
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                  : 'bg-red-950/40 border-red-500 text-red-300'
              }`}
            >
              {verificationResult.success ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-black text-sm uppercase tracking-wider block">
                  {verificationResult.success ? 'REWARD VERIFIED & REDEEMED' : 'REDEMPTION REJECTED'}
                </span>
                <p className="text-xs mt-1 font-medium">{verificationResult.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Campaign Reward Rules (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-400" />
              <span>Active Promotion Prize Tiers</span>
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-amber-500/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400 uppercase">
                    🥇 GOLD TIER: VIP Arcade Master Pass
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 font-bold">Score ≥ 1,000</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">Full merchandise kit + VIP lounge pass.</p>
                <div className="mt-2 text-[11px] text-zinc-500 font-mono">
                  Default Voucher: <strong className="text-white">RG-GOLD-VIP</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-slate-400/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-300 uppercase">
                    🥈 SILVER TIER: 50% Refreshment Voucher
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 font-bold">Score ≥ 500</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">Half-off food & drinks at activation lounge.</p>
                <div className="mt-2 text-[11px] text-zinc-500 font-mono">
                  Default Voucher: <strong className="text-white">RG-SNACK-50</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-orange-700/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-orange-400 uppercase">
                    🥉 BRONZE TIER: Sticker Pack & Token
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 font-bold">Score ≥ 200</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">Collector stickers + free bonus play token.</p>
                <div className="mt-2 text-[11px] text-zinc-500 font-mono">
                  Default Voucher: <strong className="text-white">RG-BONUS-TOKEN</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
