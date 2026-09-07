import React from 'react';
import { GameDefinition, GameDifficulty, Theme } from '../../types';
import { audio } from '../../services/audioManager';
import { Play, ArrowLeft, Clock, Zap, ShieldAlert } from 'lucide-react';

interface GameIntroModalProps {
  game: GameDefinition;
  difficulty: GameDifficulty;
  theme: Theme;
  onStartCountdown: () => void;
  onBack: () => void;
}

export const GameIntroModal: React.FC<GameIntroModalProps> = ({
  game,
  difficulty,
  theme,
  onStartCountdown,
  onBack
}) => {
  const config = game.defaultConfig[difficulty] || game.defaultConfig.EASY;

  const handleStart = () => {
    audio.playPowerup();
    onStartCountdown();
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 select-none max-w-xl mx-auto my-auto animate-fade-in">
      <div className="w-full rounded-3xl bg-zinc-900/95 border-2 border-zinc-800 shadow-2xl p-6 sm:p-8 backdrop-blur-md flex flex-col items-center text-center">
        {/* Category & Difficulty Pill */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-zinc-800 text-[11px] font-black text-zinc-400 uppercase tracking-widest">
            {game.category}
          </span>
          <span className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-[11px] font-black uppercase tracking-widest">
            {difficulty} DIFFICULTY
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider mb-2">
          {game.name}
        </h2>
        <p className="text-sm text-zinc-400 max-w-md mb-6">{game.description}</p>

        {/* Challenge Stats Card */}
        <div className="w-full grid grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 mb-6">
          <div className="flex flex-col items-center">
            <Clock className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase">Time Limit</span>
            <span className="text-base font-black text-white font-mono">{config.timerSeconds}s</span>
          </div>

          <div className="flex flex-col items-center">
            <Zap className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase">Multiplier</span>
            <span className="text-base font-black text-white font-mono">{config.scoreMultiplier}x</span>
          </div>

          <div className="flex flex-col items-center">
            <ShieldAlert className="w-5 h-5 text-red-400 mb-1" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase">Penalty</span>
            <span className="text-base font-black text-white font-mono">-{config.mistakePenalty}</span>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          style={{ backgroundColor: theme.colors.primary }}
          className="w-full h-16 rounded-2xl text-white font-black text-xl uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>START CHALLENGE</span>
        </button>

        <button
          onClick={onBack}
          className="mt-4 flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white uppercase tracking-widest font-bold cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Game Select</span>
        </button>
      </div>
    </div>
  );
};
