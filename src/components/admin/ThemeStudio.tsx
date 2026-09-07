import React, { useState } from 'react';
import { Theme } from '../../types';
import { PRESET_THEMES } from '../../themes/presets';
import { audio } from '../../services/audioManager';
import { Palette, Play, Copy, Download, Upload, Check, Sparkles, RefreshCw } from 'lucide-react';

interface ThemeStudioProps {
  activeTheme: Theme;
  onApplyTheme: (theme: Theme) => void;
}

export const ThemeStudio: React.FC<ThemeStudioProps> = ({ activeTheme, onApplyTheme }) => {
  const [themes, setThemes] = useState<Theme[]>(PRESET_THEMES);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(activeTheme);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSelectPreset = (preset: Theme) => {
    setSelectedTheme({ ...preset });
    audio.playClick();
  };

  const handleColorChange = (key: keyof Theme['colors'], val: string) => {
    setSelectedTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: val
      }
    }));
  };

  const handleContentChange = (key: keyof Theme['content'], val: string) => {
    setSelectedTheme((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: val
      }
    }));
  };

  const handleApplyToApp = () => {
    audio.playPowerup();
    onApplyTheme(selectedTheme);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(selectedTheme, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${selectedTheme.identity.slug || 'theme'}.json`);
    dlAnchor.click();
  };

  const handleDuplicate = () => {
    const duplicated: Theme = {
      ...selectedTheme,
      identity: {
        ...selectedTheme.identity,
        id: `theme-custom-${Date.now()}`,
        name: `${selectedTheme.identity.name} (Copy)`,
        slug: `${selectedTheme.identity.slug}-copy`,
        isTemplate: false
      }
    };
    setThemes((prev) => [...prev, duplicated]);
    setSelectedTheme(duplicated);
    audio.playPowerup();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
            THEME STUDIO & DESIGN SYSTEM
          </h2>
          <p className="text-xs text-zinc-400">
            Customize typography, color palettes, sound banks, and brand assets with live preview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDuplicate}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleApplyToApp}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
          >
            {saveSuccess ? <Check className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4" />}
            <span>{saveSuccess ? 'Applied!' : 'Apply Theme Live'}</span>
          </button>
        </div>
      </div>

      {/* Preset Marketplace Selector */}
      <div>
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-3">
          Commercial Theme Presets
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {themes.map((t) => {
            const isSelected = selectedTheme.identity.id === t.identity.id;
            return (
              <div
                key={t.identity.id}
                onClick={() => handleSelectPreset(t)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-800 border-red-500 shadow-lg scale-102'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.colors.primary }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.colors.accent }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.colors.surface }} />
                </div>
                <div>
                  <span className="text-xs font-black text-white uppercase block truncate">
                    {t.identity.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 truncate block">
                    {t.identity.soundBank} audio
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Workspace: Controls on Left, Live Interactive Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Palette Customizer */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4 text-red-500" />
              <span>Color Palette</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Primary Brand
                </label>
                <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                  <input
                    type="color"
                    value={selectedTheme.colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-white font-bold">{selectedTheme.colors.primary}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                  <input
                    type="color"
                    value={selectedTheme.colors.accent}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-white font-bold">{selectedTheme.colors.accent}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Glow Color
                </label>
                <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                  <input
                    type="color"
                    value={selectedTheme.colors.glow}
                    onChange={(e) => handleColorChange('glow', e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-white font-bold">{selectedTheme.colors.glow}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Background
                </label>
                <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                  <input
                    type="color"
                    value={selectedTheme.colors.background}
                    onChange={(e) => handleColorChange('background', e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-white font-bold">{selectedTheme.colors.background}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Card Surface
                </label>
                <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                  <input
                    type="color"
                    value={selectedTheme.colors.surface}
                    onChange={(e) => handleColorChange('surface', e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-white font-bold">{selectedTheme.colors.surface}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Success State
                </label>
                <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                  <input
                    type="color"
                    value={selectedTheme.colors.success}
                    onChange={(e) => handleColorChange('success', e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-white font-bold">{selectedTheme.colors.success}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Typography & Audio Bank */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                Font Family
              </label>
              <select
                value={selectedTheme.typography.fontFamily}
                onChange={(e) =>
                  setSelectedTheme((prev) => ({
                    ...prev,
                    typography: { ...prev.typography, fontFamily: e.target.value }
                  }))
                }
                className="w-full h-11 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-white outline-none cursor-pointer"
              >
                <option value="system-ui, sans-serif">Modern System Sans</option>
                <option value="'Courier New', monospace">Retro Arcade Monospace</option>
                <option value="'Trebuchet MS', sans-serif">Bold Touchscreen Sans</option>
                <option value="Georgia, serif">Classic Serif</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Audio Soundbank
                </label>
                <button
                  onClick={() => audio.playVictory()}
                  className="text-[10px] font-bold text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1"
                >
                  <Play className="w-2.5 h-2.5" /> Test Sound
                </button>
              </div>
              <select
                value={selectedTheme.identity.soundBank}
                onChange={(e) =>
                  setSelectedTheme((prev) => ({
                    ...prev,
                    identity: { ...prev.identity, soundBank: e.target.value as any }
                  }))
                }
                className="w-full h-11 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-white outline-none cursor-pointer"
              >
                <option value="ARCADE">Arcade Synth (Classic Chiptune)</option>
                <option value="FUTURISTIC">Futuristic (Sci-Fi Sine & Pulse)</option>
                <option value="CASINO">Casino & Gold (Metallic Chimes)</option>
                <option value="MINIMAL">Corporate Minimal (Soft UI Ticks)</option>
                <option value="ORGANIC">Safari Organic (Warm Percussion)</option>
              </select>
            </div>
          </div>

          {/* Copywriting / Text Customizer */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Kiosk Copywriting & Display Headlines
            </h3>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Attract Mode Headline
              </label>
              <input
                type="text"
                value={selectedTheme.content.attractHeadline}
                onChange={(e) => handleContentChange('attractHeadline', e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-bold text-white outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Tap To Start CTA
              </label>
              <input
                type="text"
                value={selectedTheme.content.tapToStartText}
                onChange={(e) => handleContentChange('tapToStartText', e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-bold text-white outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Live Interactive Preview Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                Interactive Kiosk Preview
              </span>
              <span className="text-[10px] font-mono text-zinc-500 font-bold">100% Client-Side Render</span>
            </div>

            {/* Simulated Miniature Kiosk Screen */}
            <div
              style={{
                backgroundColor: selectedTheme.colors.background,
                fontFamily: selectedTheme.typography.fontFamily
              }}
              className="w-full aspect-[4/5] rounded-2xl border-4 border-zinc-800 p-6 flex flex-col justify-between items-center text-center shadow-2xl relative overflow-hidden select-none"
            >
              {/* Mini Brand Header */}
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: selectedTheme.colors.primary }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs"
                  >
                    RG
                  </div>
                  <span className="text-xs font-black text-white uppercase">
                    {selectedTheme.identity.brandName}
                  </span>
                </div>
                <span className="text-[9px] text-amber-400 font-bold uppercase">LIVE</span>
              </div>

              {/* Center Content */}
              <div className="my-auto space-y-3">
                <h4 className="text-xl font-black text-white uppercase tracking-wider">
                  {selectedTheme.content.attractHeadline}
                </h4>
                <p className="text-[11px] text-zinc-400 max-w-xs">
                  {selectedTheme.content.attractSubheadline}
                </p>

                {/* Simulated CTA button */}
                <div
                  style={{
                    backgroundColor: selectedTheme.colors.primary,
                    boxShadow: `0 0 20px ${selectedTheme.colors.glow}`
                  }}
                  className="px-6 py-3 rounded-full text-white font-black text-xs uppercase tracking-wider inline-block cursor-pointer"
                >
                  {selectedTheme.content.tapToStartText}
                </div>
              </div>

              {/* Mini Footer */}
              <div
                style={{ backgroundColor: selectedTheme.colors.surface }}
                className="w-full p-2.5 rounded-xl border border-zinc-700/50 flex items-center justify-between text-[10px] text-zinc-400"
              >
                <span>Theme: {selectedTheme.identity.name}</span>
                <span className="text-emerald-400 font-bold">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
