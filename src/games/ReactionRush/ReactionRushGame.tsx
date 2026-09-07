import React, { useState, useEffect, useRef } from 'react';
import { GameInstanceProps } from '../sdk';
import { audio } from '../../services/audioManager';

interface RushTarget {
  id: string;
  x: number; // percentage (10 to 80)
  y: number; // percentage (10 to 80)
  size: number; // px size 60 to 90
  isDecoy: boolean;
  spawnTime: number;
  durationMs: number;
}

export const ReactionRushGame: React.FC<GameInstanceProps> = ({
  config,
  difficulty,
  theme,
  playerId,
  playerAlias,
  sessionId,
  onScoreUpdate,
  onGameOver
}) => {
  const [targets, setTargets] = useState<RushTarget[]>([]);
  const [timeLeft, setTimeLeft] = useState(config.timerSeconds);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [highestCombo, setHighestCombo] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [lastTapRating, setLastTapRating] = useState<string | null>(null);

  const reactionTimesRef = useRef<number[]>([]);
  const isFinishedRef = useRef(false);
  const spawnTimerRef = useRef<any>(null);
  const clockTimerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(Date.now());

  const spawnInterval = config.customOptions?.spawnIntervalMs || 650;
  const targetDuration = config.customOptions?.targetDurationMs || 1000;
  const decoyChance = config.customOptions?.decoyChance || 0.25;

  useEffect(() => {
    startTimeRef.current = Date.now();
    isFinishedRef.current = false;

    // Game Clock Countdown
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

    // Target Spawner Loop
    const spawnTarget = () => {
      if (isFinishedRef.current) return;

      const isDecoy = Math.random() < decoyChance;
      const id = `${Date.now()}_${Math.random()}`;
      const newTarget: RushTarget = {
        id,
        x: Math.floor(10 + Math.random() * 75),
        y: Math.floor(10 + Math.random() * 75),
        size: Math.floor(65 + Math.random() * 25),
        isDecoy,
        spawnTime: Date.now(),
        durationMs: targetDuration
      };

      setTargets((prev) => {
        // Keep max 4 targets at once
        const filtered = prev.slice(-3);
        return [...filtered, newTarget];
      });

      // Target expire timer
      setTimeout(() => {
        setTargets((prev) => {
          const targetStillThere = prev.find((t) => t.id === id);
          if (targetStillThere && !targetStillThere.isDecoy) {
            // Expired valid target counts as a missed opportunity
            setCombo(0);
          }
          return prev.filter((t) => t.id !== id);
        });
      }, targetDuration);
    };

    spawnTimerRef.current = setInterval(spawnTarget, spawnInterval);

    return () => {
      if (clockTimerRef.current) clearInterval(clockTimerRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [spawnInterval, targetDuration, decoyChance]);

  const handleGameOver = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    if (clockTimerRef.current) clearInterval(clockTimerRef.current);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);

    const durationSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const totalAttempts = hits + misses;
    const accuracy = totalAttempts > 0 ? Math.round((hits / totalAttempts) * 100) : 0;
    const bestReaction = reactionTimesRef.current.length > 0 ? Math.min(...reactionTimesRef.current) : 0;
    const avgReaction =
      reactionTimesRef.current.length > 0
        ? Math.round(reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length)
        : 0;

    const finalScore = score + config.completionBonus;

    if (hits > misses) {
      audio.playVictory();
    } else {
      audio.playMistake();
    }

    onGameOver({
      sessionId,
      gameId: 'reaction-rush',
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
        totalHits: hits,
        totalMisses: misses,
        highestCombo,
        bestReactionTimeMs: bestReaction,
        avgReactionTimeMs: avgReaction,
        durationSeconds
      },
      createdAt: new Date().toISOString()
    });
  };

  const handleTapTarget = (target: RushTarget, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (isFinishedRef.current) return;

    // Remove target immediately
    setTargets((prev) => prev.filter((t) => t.id !== target.id));

    if (target.isDecoy) {
      // Tapped DECOY! Penalty!
      audio.playMistake();
      setCombo(0);
      setMisses((m) => m + 1);
      setLastTapRating('TRAP! -50');

      const penalized = Math.max(0, score - config.mistakePenalty * 2);
      setScore(penalized);
      onScoreUpdate(penalized, 0);
      return;
    }

    // Valid Hit! Calculate reaction time
    const reactionMs = Math.max(50, Date.now() - target.spawnTime);
    reactionTimesRef.current.push(reactionMs);

    const nextCombo = combo + 1;
    setCombo(nextCombo);
    if (nextCombo > highestCombo) setHighestCombo(nextCombo);
    setHits((h) => h + 1);

    let speedBonus = 50;
    let rating = 'GOOD';

    if (reactionMs < 350) {
      speedBonus = 200;
      rating = '⚡ CRITICAL HIT!';
      audio.playPowerup();
    } else if (reactionMs < 550) {
      speedBonus = 120;
      rating = 'FAST!';
      audio.playCombo(nextCombo);
    } else {
      audio.playMatch();
    }

    setLastTapRating(rating);

    const points = Math.round((speedBonus + nextCombo * 15) * config.scoreMultiplier);
    const newScore = score + points;
    setScore(newScore);
    onScoreUpdate(newScore, nextCombo);
  };

  // Background miss click (tapped empty space)
  const handleBackgroundTap = () => {
    if (isFinishedRef.current) return;
    setCombo(0);
    setMisses((m) => m + 1);
    setLastTapRating('MISS');
    audio.playMistake();

    const penalized = Math.max(0, score - config.mistakePenalty);
    setScore(penalized);
    onScoreUpdate(penalized, 0);
  };

  return (
    <div
      onClick={handleBackgroundTap}
      className="relative flex flex-col w-full h-full p-4 select-none touch-none overflow-hidden cursor-crosshair"
    >
      {/* HUD Header */}
      <div className="w-full max-w-2xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl bg-zinc-900/85 border border-zinc-800 shadow-xl backdrop-blur-md z-10">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Score</span>
          <span className="text-3xl font-black text-cyan-400 tabular-nums">{score}</span>
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
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Hits / Miss</span>
          <span className="text-xl font-bold tabular-nums">
            <span className="text-emerald-400">{hits}</span> / <span className="text-red-400">{misses}</span>
          </span>
        </div>
      </div>

      {/* Floating Feedback Banner */}
      <div className="h-8 flex items-center justify-center my-2 z-10">
        {lastTapRating && (
          <span
            key={Date.now()}
            className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg ${
              lastTapRating.includes('CRITICAL')
                ? 'bg-amber-400 text-black animate-bounce'
                : lastTapRating.includes('TRAP') || lastTapRating.includes('MISS')
                ? 'bg-red-500 text-white animate-shake'
                : 'bg-cyan-500 text-black'
            }`}
          >
            {lastTapRating} {combo > 1 ? `(${combo}x)` : ''}
          </span>
        )}
      </div>

      {/* Touch Arena Canvas Area */}
      <div className="relative flex-1 w-full max-w-3xl mx-auto rounded-3xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-sm overflow-hidden">
        {targets.map((target) => {
          if (target.isDecoy) {
            return (
              <button
                key={target.id}
                onClick={(e) => handleTapTarget(target, e)}
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  width: `${target.size}px`,
                  height: `${target.size}px`
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/90 border-2 border-red-400 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-red-500/50 cursor-pointer animate-pulse active:scale-90 transition-transform"
                aria-label="Decoy Target"
              >
                💣
              </button>
            );
          }

          return (
            <button
              key={target.id}
              onClick={(e) => handleTapTarget(target, e)}
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: `${target.size}px`,
                height: `${target.size}px`
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500 border-4 border-white text-zinc-950 flex flex-col items-center justify-center font-black shadow-xl shadow-cyan-500/50 cursor-pointer active:scale-90 transition-transform"
              aria-label="Touch Target"
            >
              <span className="text-xl">⚡</span>
              <span className="text-[10px] uppercase font-bold tracking-tighter">TAP</span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 text-center text-xs text-zinc-400 font-medium z-10">
        ⚡ Tap cyan lightning targets instantly • 💣 Avoid red bomb decoys • Don't tap empty space
      </div>
    </div>
  );
};
