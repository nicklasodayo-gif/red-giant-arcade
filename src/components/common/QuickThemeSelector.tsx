import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../themes/themeContext';
import { PRESET_THEMES } from '../../themes/presets';
import { audio } from '../../services/audioManager';
import { Palette, Check, Sparkles, X } from 'lucide-react';

interface QuickThemeSelectorProps {
  compact?: boolean;
}

export const QuickThemeSelector: React.FC<QuickThemeSelectorProps> = ({ compact = false }) => {
  const { theme, setThemeById, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectTheme = (themeId: string) => {
    setThemeById(themeId);
    audio.playPowerup();
    setIsOpen(false);
  };

  const themesToDisplay = availableThemes.length > 0 ? availableThemes : PRESET_THEMES;

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => {
          audio.playClick();
          setIsOpen(!isOpen);
        }}
        title="Change Theme at will"
        aria-label="Change arcade theme"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer select-none backdrop-blur-md ${
          isOpen
            ? 'bg-zinc-800 border-red-500 text-white shadow-lg ring-2 ring-red-500/20'
            : 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700/80 text-zinc-300 hover:text-white'
        }`}
      >
        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: theme.colors.primary }}>
          <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
        </div>
        <Palette className="w-3.5 h-3.5 text-zinc-400" />
        {!compact && (
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline max-w-[130px] truncate">
            {theme.identity.name}
          </span>
        )}
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-3xl bg-zinc-900 border-2 border-zinc-700/80 shadow-2xl p-4 z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider">
                Instant Theme Switcher
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-zinc-400 mb-3">
            Change visual palette, audio soundbank, and typography at will:
          </p>

          {/* Theme Option Cards */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {themesToDisplay.map((item) => {
              const isSelected = item.identity.id === theme.identity.id;

              return (
                <div
                  key={item.identity.id}
                  onClick={() => handleSelectTheme(item.identity.id)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-zinc-800 border-red-500 shadow-md ring-1 ring-red-500/40'
                      : 'bg-zinc-950/80 hover:bg-zinc-850 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Swatch dots */}
                    <div className="flex flex-col gap-1 items-center">
                      <div
                        className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: item.colors.primary }}
                      />
                      <div
                        className="w-3 h-3 rounded-full border border-black/40"
                        style={{ backgroundColor: item.colors.accent }}
                      />
                    </div>

                    <div className="text-left">
                      <span className="text-xs font-black text-white uppercase tracking-wide block">
                        {item.identity.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 capitalize">
                        {item.assets?.soundPack || 'arcade'} Audio • {item.typography?.headingFont || 'Display'}
                      </span>
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center text-[10px] font-bold opacity-40">
                      Tap
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-zinc-800 text-center">
            <span className="text-[10px] text-zinc-500 font-medium">
              💡 Custom colors & assets can also be crafted in Theme Studio
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
