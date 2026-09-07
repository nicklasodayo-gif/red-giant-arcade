import React, { useState, useEffect, useRef } from 'react';
import { GameInstanceProps } from '../sdk';
import { audio } from '../../services/audioManager';

type TargetType = '10' | '25' | '50' | '100' | 'TRAP' | 'DOUBLE' | 'FREEZE' | 'EXTRA_TIME';

interface ArcadeTarget {
  id: string;
  type: TargetType;
  x: number; // 10 to 85%
  y: number; // 10 to 80%
  size: number;
  spawnTime: number;
  durationMs: number;
}

export const TargetTapGame: React.FC<GameInstanceProps> = ({
  config,
  difficulty,
  theme,
  playerId,
  playerAlias,
  sessionId,
  onScoreUpdate,
  onGameOver
}) => {
  const [targets, setTargets] = useState<ArcadeTarget[]>([]);
  const [timeLeft, setTimeLeft] = useState(config.timerSeconds);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [highestCombo, setHighestCombo] = useState(0);
  const [totalHits, setTotalHits] = useState(0);
  const [totalMisses, setTotalMisses] = useState(0);

  // Active temporary powerup states
  const [isDoubleScore, setIsDoubleScore] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [activeBanner, setActiveBanner] = useState<string | null>(null);

  const isFinishedRef = useRef(false);
  const clockTimerRef = useRef<any>(null);
  const spawnerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(Date.now());

  const spawnInterval = config.customOptions?.spawnRateMs || 650;
  const maxTargets = config.customOptions?.maxTargets || 6;

  useEffect(() => {
    startTimeRef.current = Date.now();
    isFinishedRef.current = false;

    clockTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(clockTimerRef.current);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawnOne = () => {
      if (isFinishedRef.current || isFrozen) return;

      const roll = Math.random();
      let type: TargetType = '10';
      let durationMs = 2000;
      let size = 65;

      if (roll < 0.35) {
        type = '10';
        size = 70;
        durationMs = 2400;
      } else if (roll < 0.55) {
        type = '25';
        size = 65;
        durationMs = 2000;
      } else if (roll < 0.70) {
        type = '50';
        size = 58;
        durationMs = 1700;
      } else if (roll < 0.80) {
        type = '100';
        size = 52;
        durationMs = 1300;
      } else if (roll < 0.88) {
        type = 'TRAP';
        size = 65;
        durationMs = 2200;
      } else if (roll < 0.92) {
        type = 'DOUBLE';
        size = 62;
        durationMs = 2000;
      } else if (roll < 0.96) {
        type = 'FREEZE';
        size = 62;
        durationMs = 2000;
      } else {
        type = 'EXTRA_TIME';
        size = 62;
        durationMs = 2000;
      }

      const id = `${Date.now()}_${Math.random()}`;
      const newTarget: ArcadeTarget = {
        id,
        type,
        x: Math.floor(10 + Math.random() * 75),
        y: Math.floor(12 + Math.random() * 70),
        size,
        spawnTime: Date.now(),
        durationMs
      };

      setTargets((prev) => {
        const filtered = prev.slice(-(maxTargets - 1));
        return [...filtered, newTarget];
      });

      // Vanish timer
      setTimeout(() => {
        setTargets((prev) => prev.filter((t) => t.id !== id));
      }, durationMs);
    };

    spawnerRef.current = setInterval(spawnOne, spawnInterval);

    return () => {
      if (clockTimerRef.current) clearInterval(clockTimerRef.current);
      if (spawnerRef.current) clearInterval(spawnerRef.current);
    };
  }, [spawnInterval, isFrozen, maxTargets]);

  const handleGameOver = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    if (clockTimerRef.current) clearInterval(clockTimerRef.current);
    if (spawnerRef.current) clearInterval(spawnerRef.current);

    const durationSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const totalAttempts = totalHits + totalMisses;
    const accuracy = totalAttempts > 0 ? Math.round((totalHits / totalAttempts) * 100) : 0;
    const finalScore = score + config.completionBonus;

    audio.playVictory();

    onGameOver({
      sessionId,
      gameId: 'target-tap',
      playerId,
      playerAlias,
      score: finalScore,
      difficulty,
      durationSeconds,
      completed: true,
      accuracy,
      analytics: {
        attempts: totalAttempts,
        accuracy,
        totalHits,
        totalMisses,
        highestCombo,
        durationSeconds
      },
      createdAt: new Date().toISOString()
    });
  };

  const handleTargetClick = (target: ArcadeTarget, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFinishedRef.current) return;

    setTargets((prev) => prev.filter((t) => t.id !== target.id));

    if (target.type === 'TRAP') {
      audio.playMistake();
      setCombo(0);
      setTotalMisses((m) => m + 1);
      setActiveBanner('💥 TRAP HIT! -50');
      const pen = Math.max(0, score - config.mistakePenalty * 2);
      setScore(pen);
      onScoreUpdate(pen, 0);
      return;
    }

    if (target.type === 'DOUBLE') {
      audio.playPowerup();
      setIsDoubleScore(true);
      setActiveBanner('⚡ 2X DOUBLE POINTS ACTIVE (5s)!');
      setTimeout(() => setIsDoubleScore(false), 5000);
      return;
    }

    if (target.type === 'FREEZE') {
      audio.playPowerup();
      setIsFrozen(true);
      setActiveBanner('❄️ TARGETS FROZEN (4s)!');
      setTimeout(() => setIsFrozen(false), 4000);
      return;
    }

    if (target.type === 'EXTRA_TIME') {
      audio.playPowerup();
      setTimeLeft((t) => t + 5);
      setActiveBanner('⏱️ +5 SECONDS BONUS!');
      return;
    }

    // Standard Point target
    const basePts = parseInt(target.type, 10) || 10;
    const nextCombo = combo + 1;
    setCombo(nextCombo);
    if (nextCombo > highestCombo) setHighestCombo(nextCombo);
    setTotalHits((h) => h + 1);

    audio.playCombo(nextCombo);

    let earned = Math.round(basePts * config.scoreMultiplier * (1 + nextCombo * 0.1));
    if (isDoubleScore) earned *= 2;

    const newScore = score + earned;
    setScore(newScore);
    onScoreUpdate(newScore, nextCombo);
    setActiveBanner(`+${earned} PTS`);
  };

  return (
    <div className="relative flex flex-col w-full h-full p-4 select-none touch-none overflow-hidden">
      {/* HUD Header */}
      <div className="w-full max-w-2xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl bg-zinc-900/85 border border-zinc-800 shadow-xl backdrop-blur-md z-10 mb-2">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Score</span>
          <span className="text-3xl font-black text-amber-400 tabular-nums">{score}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Time</span>
          <span
            className={`text-3xl font-black tabular-nums ${
              timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'
            }`}
          >
            {timeLeft}s
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Streak</span>
          <span className="text-2xl font-bold text-emerald-400">{combo}x</span>
        </div>
      </div>

      {/* Active Powerups & Feedback Banner */}
      <div className="h-8 flex items-center justify-center gap-3 my-1 z-10">
        {isDoubleScore && (
          <span className="px-3 py-1 rounded-full bg-amber-500 text-black font-black text-xs uppercase animate-pulse">
            ⚡ 2X ACTIVE
          </span>
        )}
        {isFrozen && (
          <span className="px-3 py-1 rounded-full bg-cyan-400 text-black font-black text-xs uppercase animate-pulse">
            ❄️ FREEZE
          </span>
        )}
        {activeBanner && (
          <span className="px-4 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-white font-bold text-xs tracking-wider">
            {activeBanner}
          </span>
        )}
      </div>

      {/* Touch Playfield Area */}
      <div className="relative flex-1 w-full max-w-3xl mx-auto rounded-3xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-sm overflow-hidden">
        {targets.map((target) => {
          let styleClass = 'bg-blue-600 border-white text-white';
          let label = '+10';

          if (target.type === '25') {
            styleClass = 'bg-emerald-600 border-emerald-300 text-white';
            label = '+25';
          } else if (target.type === '50') {
            styleClass = 'bg-purple-600 border-purple-300 text-white';
            label = '+50';
          } else if (target.type === '100') {
            styleClass = 'bg-gradient-to-tr from-amber-500 to-yellow-300 border-white text-black animate-pulse';
            label = '+100';
          } else if (target.type === 'TRAP') {
            styleClass = 'bg-red-600 border-red-400 text-white animate-pulse';
            label = '💣';
          } else if (target.type === 'DOUBLE') {
            styleClass = 'bg-amber-400 border-white text-black animate-bounce';
            label = '2X';
          } else if (target.type === 'FREEZE') {
            styleClass = 'bg-cyan-400 border-white text-black animate-bounce';
            label = '❄️';
          } else if (target.type === 'EXTRA_TIME') {
            styleClass = 'bg-pink-500 border-white text-white animate-bounce';
            label = '+5s';
          }

          return (
            <button
              key={target.id}
              onClick={(e) => handleTargetClick(target, e)}
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: `${target.size}px`,
                height: `${target.size}px`
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 flex items-center justify-center font-black shadow-lg cursor-pointer active:scale-90 transition-transform ${styleClass}`}
            >
              <span className="text-sm sm:text-base">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 text-center text-xs text-zinc-400 font-medium">
        ⭐ Tap points (+10 to +100) • Grab 2X & Freeze power-ups • Avoid 💣 traps
      </div>
    </div>
  );
};
