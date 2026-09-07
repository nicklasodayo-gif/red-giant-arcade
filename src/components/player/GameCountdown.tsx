import React, { useEffect, useState } from 'react';
import { audio } from '../../services/audioManager';

interface GameCountdownProps {
  onComplete: () => void;
}

export const GameCountdown: React.FC<GameCountdownProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(3);

  useEffect(() => {
    // Initial sound
    audio.playCountdownTick(false);

    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev === 1) {
          audio.playCountdownTick(true); // "GO!" beep
          return 0;
        }
        if (prev <= 0) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        audio.playCountdownTick(false);
        return prev - 1;
      });
    }, 900);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center justify-center">
        <span className="text-zinc-400 text-sm font-black uppercase tracking-widest mb-4 animate-pulse">
          GET READY...
        </span>
        <div className="w-48 h-48 rounded-full border-4 border-amber-400/40 bg-zinc-900/90 flex items-center justify-center shadow-2xl shadow-amber-500/20">
          <span className="text-7xl sm:text-8xl font-black text-amber-400 font-mono scale-110 transition-transform">
            {step === 0 ? 'GO!' : step}
          </span>
        </div>
      </div>
    </div>
  );
};
