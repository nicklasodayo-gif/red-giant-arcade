import React, { useEffect, useState } from 'react';
import { Theme } from '../../types';
import { audio } from '../../services/audioManager';
import { Sparkles, RotateCcw } from 'lucide-react';

interface ThankYouScreenProps {
  theme: Theme;
  playerAlias: string;
  onReset: () => void;
}

export const ThankYouScreen: React.FC<ThankYouScreenProps> = ({
  theme,
  playerAlias,
  onReset
}) => {
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    audio.playMatch();
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          onReset();
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onReset]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 select-none max-w-lg mx-auto text-center my-auto animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 text-red-500 flex items-center justify-center mb-6 shadow-2xl animate-bounce">
        <Sparkles className="w-10 h-10" />
      </div>

      <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider mb-2">
        THANK YOU FOR PLAYING!
      </h2>

      <p className="text-sm text-zinc-300 font-medium mb-1">
        Great session, <span className="text-amber-400 font-bold font-mono">{playerAlias}</span>!
      </p>
      <p className="text-xs text-zinc-500 max-w-sm mb-8">
        Your score is locked into the Red Giant Arcade registry. Keep an eye on the top leaderboard.
      </p>

      {/* Auto Reset Badge */}
      <div className="px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 mb-6">
        Returning to attract mode in <span className="text-white font-mono font-black">{countdown}s</span>
      </div>

      <button
        onClick={onReset}
        className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>RESET NOW</span>
      </button>
    </div>
  );
};
