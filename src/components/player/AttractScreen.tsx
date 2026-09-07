import React, { useState, useEffect } from 'react';
import { Campaign, LeaderboardEntry, Theme } from '../../types';
import { audio } from '../../services/audioManager';
import { GameRegistry } from '../../games/registry';
import { Trophy, Zap, ChevronRight } from 'lucide-react';

interface AttractScreenProps {
  campaign: Campaign;
  theme: Theme;
  leaderboard: LeaderboardEntry[];
  onStart: () => void;
}

export const AttractScreen: React.FC<AttractScreenProps> = ({
  campaign,
  theme,
  leaderboard,
  onStart
}) => {
  const games = GameRegistry.getAllDefinitions();
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  const messages = [
    theme.content.attractHeadline || 'RED GIANT ARCADE',
    'PLAY. COMPETE. CONNECT.',
    'TOUCHSCREEN SPEED & PUZZLE CHALLENGE',
    'BEAT THE HIGH SCORE & WIN INSTANT VOUCHERS'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const handleScreenTouch = () => {
    audio.playPowerup();
    onStart();
  };

  const topScores = leaderboard.slice(0, 4);

  return (
    <div
      onClick={handleScreenTouch}
      className="relative w-full h-full flex flex-col justify-between items-center p-6 sm:p-10 select-none cursor-pointer overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 30%, ${theme.colors.surface} 0%, ${theme.colors.background} 100%)`
      }}
    >
      {/* Background Ambient Glow & Grid Lines */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#e50914_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Campaign Bar */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-5xl">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: theme.colors.primary }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-red-500/30"
          >
            RG
          </div>
          <div className="text-left">
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">
              {theme.identity.brandName}
            </h2>
            <p className="text-xs font-semibold text-zinc-400 tracking-wider">
              {campaign.name} • {theme.identity.tagline}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-bold text-amber-400">
          <Trophy className="w-4 h-4" />
          <span>DAILY LEADERBOARD LIVE</span>
        </div>
      </div>

      {/* Hero Animated Centerpiece */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl my-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest mb-6">
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          COMMERCIAL INTERACTIVE KIOSK
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase transition-all duration-700 leading-none">
          {messages[activeMessageIndex]}
        </h1>

        <p className="mt-4 text-base sm:text-xl text-zinc-400 max-w-2xl font-medium">
          {theme.content.attractSubheadline || 'Challenge your reflexes across 6 arcade trials. Real-time ranking.'}
        </p>

        {/* Pulsing Touch to Play CTA Button */}
        <div className="mt-8 sm:mt-12 group">
          <div
            style={{
              backgroundColor: theme.colors.primary,
              boxShadow: `0 0 35px ${theme.colors.glow}`
            }}
            className="relative px-8 sm:px-12 py-5 sm:py-6 rounded-full text-white font-black text-xl sm:text-2xl uppercase tracking-widest flex items-center gap-3 animate-bounce transition-transform"
          >
            <span>{theme.content.tapToStartText || 'TAP SCREEN TO PLAY'}</span>
            <ChevronRight className="w-7 h-7 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* Bottom Marquee & Game Icons Preview */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800/80">
        {/* Games icons row */}
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mr-1">Games:</span>
          {games.map((g) => (
            <div
              key={g.id}
              className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-bold text-zinc-300 flex items-center gap-2 whitespace-nowrap"
            >
              <span>{g.name}</span>
            </div>
          ))}
        </div>

        {/* High Score Ticker */}
        {topScores.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
            <span className="text-amber-400">👑 Top High Score:</span>
            <span className="text-white font-mono">{topScores[0].playerAlias}</span>
            <span className="text-emerald-400 font-mono font-black">{topScores[0].score} pts</span>
          </div>
        )}
      </div>
    </div>
  );
};
