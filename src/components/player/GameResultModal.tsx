import React from 'react';
import { GameResult, RewardRecord, Theme } from '../../types';
import { Trophy, Award, Target, Flame, ArrowRight } from 'lucide-react';

interface GameResultModalProps {
  result: GameResult;
  rank?: number;
  reward?: RewardRecord;
  theme: Theme;
  onProceedToReward: () => void;
  onProceedToLeaderboard: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  result,
  rank = 1,
  reward,
  theme,
  onProceedToReward,
  onProceedToLeaderboard
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 select-none max-w-xl mx-auto my-auto animate-fade-in">
      <div className="w-full rounded-3xl bg-zinc-900/95 border-2 border-zinc-800 shadow-2xl p-6 sm:p-8 backdrop-blur-md flex flex-col items-center text-center">
        {/* Victory Icon / Rank Badge */}
        <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center text-4xl mb-4 shadow-xl">
          <Trophy className="w-10 h-10" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider">
          {result.completed ? 'CHALLENGE COMPLETE!' : 'TIME EXPIRED!'}
        </h2>
        <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">
          {result.playerAlias} • {result.gameId.replace('-', ' ')}
        </p>

        {/* Score Card Display */}
        <div className="w-full my-6 p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-inner flex flex-col items-center">
          <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">FINAL SCORE</span>
          <span className="text-5xl sm:text-6xl font-black text-amber-400 font-mono tracking-tight my-1">
            {result.score}
          </span>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase">
            <span>RANK #{rank} ON LEADERBOARD</span>
          </div>
        </div>

        {/* Analytics Breakdown Grid */}
        <div className="w-full grid grid-cols-3 gap-2 mb-6">
          <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex flex-col items-center">
            <Target className="w-4 h-4 text-cyan-400 mb-1" />
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Accuracy</span>
            <span className="text-sm font-black text-white font-mono">{result.accuracy}%</span>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex flex-col items-center">
            <Flame className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Max Combo</span>
            <span className="text-sm font-black text-white font-mono">{result.analytics.highestCombo}x</span>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex flex-col items-center">
            <Award className="w-4 h-4 text-purple-400 mb-1" />
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Duration</span>
            <span className="text-sm font-black text-white font-mono">{result.durationSeconds}s</span>
          </div>
        </div>

        {/* Action Button */}
        {reward ? (
          <button
            onClick={onProceedToReward}
            style={{ backgroundColor: theme.colors.primary }}
            className="w-full h-16 rounded-2xl text-white font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Award className="w-6 h-6" />
            <span>UNLOCKED PRIZE VOUCHER!</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        ) : (
          <button
            onClick={onProceedToLeaderboard}
            style={{ backgroundColor: theme.colors.primary }}
            className="w-full h-16 rounded-2xl text-white font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span>VIEW LEADERBOARD</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        )}
      </div>
    </div>
  );
};
