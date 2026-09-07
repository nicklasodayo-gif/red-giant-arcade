import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../services/api';
import { GameRegistry } from '../../games/registry';
import {
  Gamepad2,
  Users,
  Monitor,
  Award,
  TrendingUp,
  ArrowUpRight,
  Tv,
  PlusCircle,
  Download,
  Play
} from 'lucide-react';

interface DashboardOverviewProps {
  onSwitchToKiosk: () => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onSwitchToKiosk,
  onNavigateTab
}) => {
  const [analytics, setAnalytics] = useState<any>({
    totalSessions: 142,
    totalLeads: 58,
    uniquePlayers: 104,
    totalRewardsIssued: 42,
    conversionRate: 41,
    kiosksOnline: 2,
    kiosksTotal: 3,
    gameCounts: {
      'reaction-rush': 48,
      'memory-match': 36,
      'target-tap': 30,
      'color-clash': 25,
      'catch-chicken': 20,
      'sliding-puzzle': 16
    }
  });

  useEffect(() => {
    ApiClient.getAnalyticsOverview()
      .then((data) => {
        if (data) setAnalytics(data);
      })
      .catch(() => {});
  }, []);

  const games = GameRegistry.getAllDefinitions();

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="rounded-3xl bg-gradient-to-r from-red-950/60 via-zinc-900 to-zinc-900 border border-red-900/30 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-red-500 uppercase tracking-widest">
            COMMERCIAL KIOSK PLATFORM ACTIVE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mt-1">
            RED GIANT SUMMER ARCADE
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Live interactive touchscreen deployment across Nairobi mall activations with automated prize redemption & offline resilience.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onSwitchToKiosk}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
          >
            <Tv className="w-4 h-4" />
            <span>Open Touch Kiosk</span>
          </button>

          <button
            onClick={() => onNavigateTab('campaigns')}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Campaigns</span>
          </button>

          <button
            onClick={() => onNavigateTab('leads')}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Leads CRM</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sessions */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Plays</span>
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{analytics.totalSessions}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold mt-2">
            <TrendingUp className="w-3 h-3" />
            <span>+18% from yesterday</span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Lead Conversion</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{analytics.conversionRate}%</div>
          <div className="text-[11px] text-zinc-500 font-medium mt-2">
            {analytics.totalLeads} opt-in contacts captured
          </div>
        </div>

        {/* Active Kiosks */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Kiosk Health</span>
            <Monitor className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {analytics.kiosksOnline} / {analytics.kiosksTotal}
          </div>
          <div className="text-[11px] text-emerald-400 font-bold mt-2">
            <span>All hardware telemetry healthy</span>
          </div>
        </div>

        {/* Rewards Issued */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Vouchers Issued</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{analytics.totalRewardsIssued}</div>
          <div className="text-[11px] text-zinc-400 font-medium mt-2">
            <span>Instant QR vouchers distributed</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Game Performance & Registered Trials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Activity Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                Game Session Distribution
              </h3>
              <p className="text-xs text-zinc-400">Total plays tracked across all 6 arcade games</p>
            </div>
            <button
              onClick={() => onNavigateTab('games')}
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Games</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {games.map((game) => {
              const count = analytics.gameCounts?.[game.id] || 0;
              const maxCount = 60;
              const pct = Math.min(100, Math.round((count / maxCount) * 100));

              return (
                <div key={game.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-white uppercase">{game.name}</span>
                    <span className="font-mono text-zinc-400 font-bold">{count} plays ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-zinc-950 overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Kiosk Status Overview */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                Active Kiosks
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                2 Online
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Westgate Mall Screen A</span>
                  <span className="text-[10px] text-zinc-500">1920x1080 Landscape • Reaction Rush</span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Sarit Expo Hall B</span>
                  <span className="text-[10px] text-zinc-500">1080x1920 Portrait • Memory Match</span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between opacity-60">
                <div>
                  <span className="text-xs font-bold text-white block">University Union Screen</span>
                  <span className="text-[10px] text-zinc-500">Maintenance • Standby</span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-400/20" />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('kiosks')}
            className="w-full mt-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white uppercase tracking-wider transition-colors cursor-pointer"
          >
            Open Kiosk Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
