import React from 'react';
import { Campaign, Theme } from '../../types';
import { NetworkStatusBadge } from '../common/NetworkStatusBadge';
import { AudioControl } from '../common/AudioControl';
import { QuickThemeSelector } from '../common/QuickThemeSelector';
import { Shield, Home } from 'lucide-react';

interface KioskHeaderProps {
  campaign: Campaign;
  theme: Theme;
  onHomeClick?: () => void;
  onOpenAdmin: () => void;
}

export const KioskHeader: React.FC<KioskHeaderProps> = ({
  campaign,
  theme,
  onHomeClick,
  onOpenAdmin
}) => {
  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md select-none z-20">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        {onHomeClick && (
          <button
            onClick={onHomeClick}
            title="Arcade Home"
            aria-label="Return to arcade attract screen"
            className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div
            style={{ backgroundColor: theme.colors.primary }}
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-md"
          >
            RG
          </div>
          <div>
            <span className="text-sm font-black text-white uppercase tracking-wider block leading-none">
              {theme.identity.brandName}
            </span>
            <span className="text-[10px] font-semibold text-zinc-400 leading-none">
              {campaign.name}
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Theme Switcher, Network Status, Audio Control & Admin Shortcut */}
      <div className="flex items-center gap-2 sm:gap-3">
        <QuickThemeSelector />
        <NetworkStatusBadge />
        <AudioControl />

        <button
          onClick={onOpenAdmin}
          title="Open Admin Portal"
          aria-label="Switch to operator admin portal"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
        >
          <Shield className="w-3.5 h-3.5 text-red-500" />
          <span className="hidden sm:inline">STAFF</span>
        </button>
      </div>
    </header>
  );
};
