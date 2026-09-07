import React, { useState } from 'react';
import { Theme } from '../../types';
import { audio } from '../../services/audioManager';
import { Shuffle, User, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  theme: Theme;
  onProceed: (alias: string, avatarSeed: string) => void;
  onBack: () => void;
}

const ALIAS_PREFIXES = ['CYBER', 'SPEED', 'TURBO', 'BLAZE', 'APEX', 'NEON', 'VORTEX', 'HYPER', 'LASER', 'VIPER'];
const ALIAS_SUFFIXES = ['LION', 'STRIKER', 'FALCON', 'TITAN', 'RUNNER', 'CHAMP', 'ACE', 'VIPER', 'HAWK', 'GHOST'];
const AVATAR_SEEDS = ['🦁', '⚡', '🚀', '👑', '🔥', '👾', '🕹️', '🐯'];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  theme,
  onProceed,
  onBack
}) => {
  const getRandomAlias = () => {
    const pre = ALIAS_PREFIXES[Math.floor(Math.random() * ALIAS_PREFIXES.length)];
    const suf = ALIAS_SUFFIXES[Math.floor(Math.random() * ALIAS_SUFFIXES.length)];
    const num = Math.floor(10 + Math.random() * 89);
    return `${pre}_${suf}_${num}`;
  };

  const [alias, setAlias] = useState(getRandomAlias());
  const [avatar, setAvatar] = useState(AVATAR_SEEDS[0]);

  const handleRandomize = () => {
    audio.playClick();
    setAlias(getRandomAlias());
    setAvatar(AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alias.trim()) return;
    audio.playPowerup();
    onProceed(alias.trim().toUpperCase(), avatar);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-6 select-none max-w-xl mx-auto my-auto animate-fade-in">
      <div className="w-full rounded-3xl bg-zinc-900/90 border-2 border-zinc-800 shadow-2xl p-8 backdrop-blur-md flex flex-col items-center text-center">
        {/* Avatar Display */}
        <div className="w-24 h-24 rounded-3xl bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-5xl mb-6 shadow-xl relative">
          <span>{avatar}</span>
          <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-red-600 text-[10px] font-black text-white uppercase tracking-wider">
            READY
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-2">
          PLAYER PROFILE
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mb-6">
          Choose your arcade handle to appear on the live leaderboard
        </p>

        {/* Alias Input Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="relative flex items-center">
            <input
              type="text"
              maxLength={18}
              value={alias}
              onChange={(e) => setAlias(e.target.value.toUpperCase())}
              placeholder="ENTER ALIAS..."
              className="w-full h-16 rounded-2xl bg-zinc-950 border-2 border-zinc-700 focus:border-red-500 text-center text-xl sm:text-2xl font-black text-white tracking-widest uppercase px-14 outline-none shadow-inner transition-colors"
            />
            <button
              type="button"
              onClick={handleRandomize}
              title="Generate random cool alias"
              aria-label="Randomize player alias"
              className="absolute right-3 w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <Shuffle className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Avatar Chooser */}
          <div className="flex items-center justify-center gap-2 py-1">
            {AVATAR_SEEDS.map((seed) => (
              <button
                key={seed}
                type="button"
                onClick={() => {
                  audio.playClick();
                  setAvatar(seed);
                }}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                  avatar === seed
                    ? 'bg-amber-400 text-black scale-110 shadow-lg'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                }`}
              >
                {seed}
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{ backgroundColor: theme.colors.primary }}
            className="w-full h-16 rounded-2xl text-white font-black text-xl uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span>ENTER ARCADE</span>
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>
        </form>

        <button
          type="button"
          onClick={onBack}
          className="mt-6 text-xs text-zinc-500 hover:text-zinc-300 uppercase tracking-widest font-bold cursor-pointer"
        >
          Cancel & Return
        </button>
      </div>
    </div>
  );
};
