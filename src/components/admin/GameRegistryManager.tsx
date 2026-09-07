import React, { useState } from 'react';
import { GameDefinition, GameDifficulty } from '../../types';
import { GameRegistry } from '../../games/registry';
import { Gamepad2, Settings2, Play, Sparkles, Check, Clock, Zap, ShieldAlert } from 'lucide-react';

interface GameRegistryManagerProps {
  onTestGame?: (gameId: string) => void;
}

export const GameRegistryManager: React.FC<GameRegistryManagerProps> = ({ onTestGame }) => {
  const [games, setGames] = useState<GameDefinition[]>(GameRegistry.getAllDefinitions());
  const [selectedGame, setSelectedGame] = useState<GameDefinition>(games[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>('MEDIUM');
  const [saveAlert, setSaveAlert] = useState(false);

  const handleToggleGame = (id: string) => {
    setGames((prev) =>
      prev.map((g) => (g.id === id ? { ...g, enabled: !g.enabled } : g))
    );
  };

  const handleToggleFeatured = (id: string) => {
    setGames((prev) =>
      prev.map((g) => (g.id === id ? { ...g, featured: !g.featured } : g))
    );
  };

  const handleParamChange = (field: 'timerSeconds' | 'scoreMultiplier' | 'mistakePenalty', value: number) => {
    setSelectedGame((prev) => ({
      ...prev,
      defaultConfig: {
        ...prev.defaultConfig,
        [selectedDifficulty]: {
          ...prev.defaultConfig[selectedDifficulty],
          [field]: value
        }
      }
    }));
  };

  const handleSave = () => {
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2000);
  };

  const currentDiffConfig = selectedGame.defaultConfig[selectedDifficulty] || selectedGame.defaultConfig.EASY;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
            ARCADE GAME REGISTRY & SDK ENGINE
          </h2>
          <p className="text-xs text-zinc-400">
            Configure gameplay mechanics, time limits, combo multipliers, and featured flags.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
        >
          {saveAlert ? <Check className="w-4 h-4" /> : <Settings2 className="w-4 h-4" />}
          <span>{saveAlert ? 'Saved Config' : 'Save Parameters'}</span>
        </button>
      </div>

      {/* Two Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Game List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-black text-zinc-400 uppercase tracking-wider block mb-1">
            Registered Arcade Games ({games.length})
          </span>

          {games.map((g) => {
            const isSelected = selectedGame.id === g.id;
            return (
              <div
                key={g.id}
                onClick={() => setSelectedGame(g)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                  isSelected
                    ? 'bg-zinc-850 border-red-500 shadow-lg'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white uppercase tracking-wider">
                      {g.name}
                    </span>
                    {g.featured && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase">
                        ★
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-400 line-clamp-1">{g.tagline}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFeatured(g.id);
                    }}
                    title="Toggle Featured"
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                      g.featured ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800 text-zinc-600'
                    }`}
                  >
                    ★
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleGame(g.id);
                    }}
                    title="Toggle Enable/Disable"
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      g.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {g.enabled ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Game Configurator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                  GAME PARAMETERS
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                  {selectedGame.name}
                </h3>
                <p className="text-xs text-zinc-400">{selectedGame.description}</p>
              </div>

              {onTestGame && (
                <button
                  onClick={() => onTestGame(selectedGame.id)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Test Run</span>
                </button>
              )}
            </div>

            {/* Difficulty Tabs */}
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              {(['EASY', 'MEDIUM', 'HARD', 'EXTREME'] as GameDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-red-600 text-white'
                      : 'text-zinc-400 hover:text-white bg-zinc-950'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Difficulty Tuning Sliders */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-zinc-400 uppercase flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> Time Limit (Seconds)
                  </span>
                  <span className="font-mono text-white text-sm">{currentDiffConfig.timerSeconds}s</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={currentDiffConfig.timerSeconds}
                  onChange={(e) => handleParamChange('timerSeconds', Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-zinc-400 uppercase flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Score Multiplier
                  </span>
                  <span className="font-mono text-white text-sm">{currentDiffConfig.scoreMultiplier}x</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.5}
                  value={currentDiffConfig.scoreMultiplier}
                  onChange={(e) => handleParamChange('scoreMultiplier', Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-zinc-400 uppercase flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Mistake Penalty
                  </span>
                  <span className="font-mono text-white text-sm">-{currentDiffConfig.mistakePenalty}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  step={10}
                  value={currentDiffConfig.mistakePenalty}
                  onChange={(e) => handleParamChange('mistakePenalty', Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400">
              💡 Changes applied here immediately update all connected kiosks for this trial without restarting.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
