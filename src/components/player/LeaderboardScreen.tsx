import React, { useState } from 'react';
import { LeaderboardEntry, Theme } from '../../types';
import { Trophy, Medal, ArrowRight } from 'lucide-react';

interface LeaderboardScreenProps {
  entries: LeaderboardEntry[];
  currentPlayerAlias: string;
  theme: Theme;
  onProceed: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  entries,
  currentPlayerAlias,
  theme,
  onProceed
}) => {
  const [timeframe, setTimeframe] = useState<'DAILY' | 'ALL_TIME'>('ALL_TIME');

  const sorted = [...entries].sort((a, b) => b.score - a.score).slice(0, 10);

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-8 max-w-3xl mx-auto select-none overflow-y-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
              LIVE LEADERBOARD
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">Real-time kiosk high score standings</p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
          <button
            onClick={() => setTimeframe('ALL_TIME')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              timeframe === 'ALL_TIME' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All-Time
          </button>
          <button
            onClick={() => setTimeframe('DAILY')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              timeframe === 'DAILY' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Today
          </button>
        </div>
      </div>

      {/* Leaderboard Table List */}
      <div className="w-full space-y-2.5 my-6">
        {sorted.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 font-bold">No scores recorded yet. Be the first!</div>
        ) : (
          sorted.map((item, idx) => {
            const rank = idx + 1;
            const isCurrent = item.playerAlias.toUpperCase() === currentPlayerAlias.toUpperCase();

            let rankBadge = (
              <span className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center font-mono font-bold text-xs">
                #{rank}
              </span>
            );

            if (rank === 1) {
              rankBadge = (
                <div className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center font-black text-sm shadow-md">
                  👑
                </div>
              );
            } else if (rank === 2) {
              rankBadge = (
                <div className="w-8 h-8 rounded-full bg-slate-300 text-black flex items-center justify-center font-black text-sm shadow-md">
                  🥈
                </div>
              );
            } else if (rank === 3) {
              rankBadge = (
                <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center font-black text-sm shadow-md">
                  🥉
                </div>
              );
            }

            return (
              <div
                key={item.id || idx}
                className={`w-full h-14 sm:h-16 px-4 sm:px-6 rounded-2xl flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-red-950/50 border-2 border-red-500 text-white shadow-lg ring-2 ring-red-500/30'
                    : 'bg-zinc-900/80 border border-zinc-800 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {rankBadge}
                  <div className="text-left">
                    <span className="text-sm sm:text-base font-black tracking-wide block font-mono">
                      {item.playerAlias} {isCurrent && <span className="text-red-400 text-xs">(YOU)</span>}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                      {item.gameId.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono tabular-nums">
                    {item.score}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom CTA */}
      <div className="pt-4 border-t border-zinc-800 flex justify-end">
        <button
          onClick={onProceed}
          style={{ backgroundColor: theme.colors.primary }}
          className="w-full sm:w-auto px-8 h-14 rounded-2xl text-white font-black text-base uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <span>CONTINUE</span>
          <ArrowRight className="w-5 h-5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
