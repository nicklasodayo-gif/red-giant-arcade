import React, { useState } from 'react';
import { Campaign, GameDefinition, GameDifficulty, Theme } from '../../types';
import { GameRegistry } from '../../games/registry';
import { audio } from '../../services/audioManager';
import { Play, Sparkles, Layers, Zap, Palette, Crosshair, Smile, Grid } from 'lucide-react';

interface GameArcadeSelectorProps {
  campaign: Campaign;
  theme: Theme;
  playerAlias: string;
  onSelectGame: (game: GameDefinition, difficulty: GameDifficulty) => void;
}

const ICON_MAP: Record<string, any> = {
  Layers: Layers,
  Zap: Zap,
  Palette: Palette,
  Crosshair: Crosshair,
  Smile: Smile,
  Grid: Grid
};

export const GameArcadeSelector: React.FC<GameArcadeSelectorProps> = ({
  campaign,
  theme,
  playerAlias,
  onSelectGame
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>('MEDIUM');
  const allGames = GameRegistry.getAllDefinitions();

  // Filter games enabled in this campaign (or fallback to all enabled)
  const enabledGames = allGames.filter((g) => {
    if (campaign.enabledGameIds && campaign.enabledGameIds.length > 0) {
      return campaign.enabledGameIds.includes(g.id);
    }
    return g.enabled;
  });

  const difficulties: GameDifficulty[] = ['EASY', 'MEDIUM', 'HARD', 'EXTREME'];

  const handleGameClick = (game: GameDefinition) => {
    audio.playClick();
    onSelectGame(game, selectedDifficulty);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-8 max-w-6xl mx-auto select-none overflow-y-auto">
      {/* Header & Difficulty Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-red-500 uppercase tracking-widest">PLAYER ACTIVE:</span>
            <span className="text-sm font-black text-white font-mono">{playerAlias}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mt-0.5">
            SELECT ARCADE TRIAL
          </h2>
        </div>

        {/* Difficulty Pill Selectors */}
        <div className="flex items-center bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
          {difficulties.map((diff) => {
            const isSelected = selectedDifficulty === diff;
            let badgeStyle = isSelected ? 'bg-red-600 text-white font-black shadow-md' : 'text-zinc-400 hover:text-white';
            if (isSelected && diff === 'EASY') badgeStyle = 'bg-emerald-600 text-white font-black shadow-md';
            if (isSelected && diff === 'MEDIUM') badgeStyle = 'bg-amber-600 text-white font-black shadow-md';
            if (isSelected && diff === 'HARD') badgeStyle = 'bg-red-600 text-white font-black shadow-md';
            if (isSelected && diff === 'EXTREME') badgeStyle = 'bg-purple-600 text-white font-black shadow-md';

            return (
              <button
                key={diff}
                onClick={() => {
                  audio.playClick();
                  setSelectedDifficulty(diff);
                }}
                className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${badgeStyle}`}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Game Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
        {enabledGames.map((game) => {
          const IconComponent = ICON_MAP[game.icon] || Zap;
          const diffConfig = game.defaultConfig[selectedDifficulty] || game.defaultConfig.EASY;

          return (
            <div
              key={game.id}
              onClick={() => handleGameClick(game)}
              className="group relative rounded-3xl bg-zinc-900/90 hover:bg-zinc-850 border-2 border-zinc-800 hover:border-zinc-700 shadow-xl overflow-hidden cursor-pointer transition-all duration-300 transform active:scale-95 flex flex-col justify-between p-6"
            >
              {/* Category & Featured Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-zinc-800 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  {game.category}
                </span>

                {game.featured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    FEATURED
                  </span>
                )}
              </div>

              {/* Game Icon & Title */}
              <div className="flex items-center gap-4 my-2">
                <div
                  style={{ backgroundColor: theme.colors.surface }}
                  className="w-16 h-16 rounded-2xl border border-zinc-700 flex items-center justify-center text-red-500 shadow-inner group-hover:scale-105 transition-transform"
                >
                  <IconComponent className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wider group-hover:text-red-400 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5">{game.tagline}</p>
                </div>
              </div>

              {/* Specs & Launch Bar */}
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase block">Timer / Mult</span>
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    {diffConfig.timerSeconds}s • {diffConfig.scoreMultiplier}x
                  </span>
                </div>

                <div
                  style={{ backgroundColor: theme.colors.primary }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-zinc-500 font-medium pb-2">
        Touch any game card to launch • Scores update the real-time leaderboard
      </div>
    </div>
  );
};
