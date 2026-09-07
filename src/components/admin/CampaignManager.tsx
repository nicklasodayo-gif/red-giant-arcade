import React, { useState } from 'react';
import { Campaign, CampaignStatus } from '../../types';
import { GameRegistry } from '../../games/registry';
import { PRESET_THEMES } from '../../themes/presets';
import {
  Megaphone,
  CheckCircle2,
  PauseCircle,
  Clock,
  Settings2,
  Gift,
  Users,
  Trophy,
  Plus,
  Play
} from 'lucide-react';

interface CampaignManagerProps {
  campaign: Campaign;
  onUpdateCampaign: (updated: Campaign) => void;
}

export const CampaignManager: React.FC<CampaignManagerProps> = ({ campaign, onUpdateCampaign }) => {
  const [activeCamp, setActiveCamp] = useState<Campaign>(campaign);
  const [isSaved, setIsSaved] = useState(false);

  const allGames = GameRegistry.getAllDefinitions();

  const handleStatusChange = (status: CampaignStatus) => {
    const updated = { ...activeCamp, status, updatedAt: new Date().toISOString() };
    setActiveCamp(updated);
    onUpdateCampaign(updated);
  };

  const handleToggleGame = (gameId: string) => {
    let current = activeCamp.enabledGameIds || [];
    if (current.includes(gameId)) {
      if (current.length <= 1) {
        alert('At least one game must remain enabled in an active campaign.');
        return;
      }
      current = current.filter((id) => id !== gameId);
    } else {
      current = [...current, gameId];
    }
    const updated = { ...activeCamp, enabledGameIds: current, updatedAt: new Date().toISOString() };
    setActiveCamp(updated);
    onUpdateCampaign(updated);
  };

  const handleLeadToggle = (field: 'requireName' | 'requirePhone' | 'requireEmail' | 'requireConsent') => {
    const updated = {
      ...activeCamp,
      leadSettings: {
        ...activeCamp.leadSettings,
        [field]: !activeCamp.leadSettings[field]
      },
      updatedAt: new Date().toISOString()
    };
    setActiveCamp(updated);
    onUpdateCampaign(updated);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCampaign(activeCamp);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const statusColors: Record<CampaignStatus, string> = {
    ACTIVE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    PAUSED: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    DRAFT: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    SCHEDULED: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    ENDED: 'bg-red-500/20 text-red-400 border-red-500/40',
    ARCHIVED: 'bg-zinc-900 text-zinc-600 border-zinc-800'
  };

  return (
    <div className="space-y-6">
      {/* Campaign Header & Status Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase border ${statusColors[activeCamp.status]}`}>
              {activeCamp.status}
            </span>
            <span className="text-xs font-mono text-zinc-500">v{activeCamp.version || 1}.0</span>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider mt-1">
            {activeCamp.name}
          </h2>
          <p className="text-xs text-zinc-400">{activeCamp.client} • {activeCamp.description}</p>
        </div>

        {/* Quick Status Control Buttons */}
        <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
          <button
            onClick={() => handleStatusChange('ACTIVE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
              activeCamp.status === 'ACTIVE'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Activate
          </button>
          <button
            onClick={() => handleStatusChange('PAUSED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
              activeCamp.status === 'PAUSED'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Pause
          </button>
          <button
            onClick={() => handleStatusChange('DRAFT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
              activeCamp.status === 'DRAFT'
                ? 'bg-zinc-700 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Draft
          </button>
        </div>
      </div>

      {/* Grid: Campaign Settings & Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: General Info & Enabled Games */}
        <div className="space-y-6">
          {/* General Metadata */}
          <form onSubmit={handleSaveGeneral} className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-red-500" />
              <span>General Campaign Parameters</span>
            </h3>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                value={activeCamp.name}
                onChange={(e) => setActiveCamp({ ...activeCamp, name: e.target.value })}
                className="w-full h-11 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-bold text-white outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Client / Sponsor
              </label>
              <input
                type="text"
                value={activeCamp.client}
                onChange={(e) => setActiveCamp({ ...activeCamp, client: e.target.value })}
                className="w-full h-11 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-bold text-white outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={activeCamp.startDate?.substring(0, 10) || '2026-06-01'}
                  onChange={(e) => setActiveCamp({ ...activeCamp, startDate: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={activeCamp.endDate?.substring(0, 10) || '2026-12-31'}
                  onChange={(e) => setActiveCamp({ ...activeCamp, endDate: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white uppercase tracking-wider transition-colors cursor-pointer"
            >
              {isSaved ? 'Saved Successfully!' : 'Save Details'}
            </button>
          </form>

          {/* Enabled Arcade Games Selector */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2">
              Active Arcade Game Selection
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Toggle which games are visible on the kiosk selection carousel for this campaign.
            </p>

            <div className="space-y-2.5">
              {allGames.map((game) => {
                const isEnabled = (activeCamp.enabledGameIds || []).includes(game.id);

                return (
                  <div
                    key={game.id}
                    onClick={() => handleToggleGame(game.id)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer select-none ${
                      isEnabled
                        ? 'bg-zinc-800/80 border-red-500/50 text-white'
                        : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-500 opacity-60'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider block">
                        {game.name}
                      </span>
                      <span className="text-[10px] text-zinc-400">{game.tagline}</span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isEnabled ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-600'
                      }`}
                    >
                      {isEnabled ? '✓' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Lead Settings & Reward Tiers */}
        <div className="space-y-6">
          {/* Lead Capture Controls */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Lead Capture & Privacy Policy</span>
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">Require Full Name</span>
                  <span className="text-[10px] text-zinc-500">Collect player real name for prizes</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeCamp.leadSettings?.requireName}
                  onChange={() => handleLeadToggle('requireName')}
                  className="w-5 h-5 rounded text-red-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">Require Mobile Number (Kenya +254)</span>
                  <span className="text-[10px] text-zinc-500">Auto-normalize 07xx, 01xx, +254</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeCamp.leadSettings?.requirePhone}
                  onChange={() => handleLeadToggle('requirePhone')}
                  className="w-5 h-5 rounded text-red-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">Require Email Address</span>
                  <span className="text-[10px] text-zinc-500">Optional for email newsletter opt-in</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeCamp.leadSettings?.requireEmail}
                  onChange={() => handleLeadToggle('requireEmail')}
                  className="w-5 h-5 rounded text-red-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">Mandatory Consent Checkbox</span>
                  <span className="text-[10px] text-zinc-500">GDPR & Kenya Data Protection compliance</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeCamp.leadSettings?.requireConsent}
                  onChange={() => handleLeadToggle('requireConsent')}
                  className="w-5 h-5 rounded text-red-600 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Reward Tiers & Voucher Rules */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Prize Tiers & Reward Rules</span>
              </h3>
              <span className="text-xs font-mono text-zinc-400">{activeCamp.rewards?.length || 0} tiers</span>
            </div>

            <div className="space-y-3">
              {(activeCamp.rewards || []).map((reward) => (
                <div
                  key={reward.id}
                  className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wide">
                      {reward.tier} TIER: {reward.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] font-mono text-zinc-300 font-bold">
                      Score ≥ {reward.minScore}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">{reward.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-850">
                    <span>Code: <strong className="text-white font-mono">{reward.couponCode}</strong></span>
                    <span>Daily Limit: {reward.maxDailyRedemptions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
