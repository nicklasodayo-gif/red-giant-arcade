import React, { useState } from 'react';
import { audio } from '../../services/audioManager';
import { Volume2, VolumeX } from 'lucide-react';

export const AudioControl: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isMuted, setIsMuted] = useState(audio.getMuted());

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = audio.toggleMute();
    setIsMuted(next);
    if (!next) {
      audio.playClick();
    }
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={isMuted ? 'Unmute arcade audio' : 'Mute arcade audio'}
      className={`w-10 h-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:text-white transition-all backdrop-blur-md cursor-pointer active:scale-95 shadow-md ${className}`}
    >
      {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
    </button>
  );
};
