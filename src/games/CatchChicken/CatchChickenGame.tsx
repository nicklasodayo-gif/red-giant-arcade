import React, { useState, useEffect, useRef } from 'react';
import { GameInstanceProps } from '../sdk';
import { audio } from '../../services/audioManager';

interface MascotEntity {
  id: string;
  x: number; // 10 to 80%
  y: number; // 10 to 75%
  isGolden: boolean;
  isDecoy: boolean;
  behavior: 'ZIGZAG' | 'DASH' | 'PEEKABOO';
  size: number;
}

export const CatchChickenGame: React.FC<GameInstanceProps> = ({
  config,
  difficulty,
  theme,
  playerId,
  playerAlias,
  sessionId,
  onScoreUpdate,
  onGameOver
}) => {
  const [timeLeft, setTimeLeft] = useState(config.timerSeconds);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [highestCombo, setHighestCombo] = useState(0);
  const [catches, setCatches] = useState(0);
  const [misses, setMisses] = useState(0);
  const [entities, setEntities] = useState<MascotEntity[]>([]);
  const [eventAlert, setEventAlert] = useState<string | null>(null);

  const isFinishedRef = useRef(false);
  const clockTimerRef = useRef<any>(null);
  const moveTimerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(Date.now());

  const mascotIcon = theme.gameAssets.mascotEmojiOrUrl || '🐔';
  const moveInterval = config.customOptions?.moveIntervalMs || 800;
  const bonusChance = config.customOptions?.bonusChance || 0.2;

  // Move / Spawn Mascot loop
  const updateEntities = () => {
    if (isFinishedRef.current) return;

    // Normal mascot
    const mainMascot: MascotEntity = {
      id: 'main',
      x: Math.floor(10 + Math.random() * 75),
      y: Math.floor(10 + Math.random() * 70),
      isGolden: false,
      isDecoy: false,
      behavior: Math.random() > 0.5 ? 'DASH' : 'ZIGZAG',
      size: 75
    };

    const newEntities = [mainMascot];

    // Chance for golden bonus mascot
    if (Math.random() < bonusChance) {
      newEntities.push({
        id: `bonus_${Date.now()}`,
        x: Math.floor(10 + Math.random() * 75),
        y: Math.floor(10 + Math.random() * 70),
        isGolden: true,
        isDecoy: false,
        behavior: 'PEEKABOO',
        size: 70
      });
    }

    // Chance for decoy fake target
    if (Math.random() < 0.3) {
      newEntities.push({
        id: `decoy_${Date.now()}`,
        x: Math.floor(10 + Math.random() * 75),
        y: Math.floor(10 + Math.random() * 70),
        isGolden: false,
        isDecoy: true,
        behavior: 'ZIGZAG',
        size: 60
      });
    }

    setEntities(newEntities);
  };

  useEffect(() => {
    startTimeRef.current = Date.now();
    isFinishedRef.current = false;
    updateEntities();

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

    moveTimerRef.current = setInterval(updateEntities, moveInterval);

    return () => {
      if (clockTimerRef.current) clearInterval(clockTimerRef.current);
      if (moveTimerRef.current) clearInterval(moveTimerRef.current);
    };
  }, [moveInterval, bonusChance]);

  const handleGameOver = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    if (clockTimerRef.current) clearInterval(clockTimerRef.current);
    if (moveTimerRef.current) clearInterval(moveTimerRef.current);

    const durationSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const totalAttempts = catches + misses;
    const accuracy = totalAttempts > 0 ? Math.round((catches / totalAttempts) * 100) : 0;
    const finalScore = score + config.completionBonus;

    audio.playVictory();

    onGameOver({
      sessionId,
      gameId: 'catch-chicken',
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
        totalHits: catches,
        totalMisses: misses,
        highestCombo,
        durationSeconds
      },
      createdAt: new Date().toISOString()
    });
  };

  const handleTapEntity = (entity: MascotEntity, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFinishedRef.current) return;

    if (entity.isDecoy) {
      audio.playMistake();
      setCombo(0);
      setMisses((m) => m + 1);
      setEventAlert('OOPS! FAKE DECOY -25');
      const pen = Math.max(0, score - config.mistakePenalty);
      setScore(pen);
      onScoreUpdate(pen, 0);
      setEntities((prev) => prev.filter((item) => item.id !== entity.id));
      return;
    }

    // Caught!
    const nextCombo = combo + 1;
    setCombo(nextCombo);
    if (nextCombo > highestCombo) setHighestCombo(nextCombo);
    setCatches((c) => c + 1);

    let basePts = 100;
    if (entity.isGolden) {
      basePts = 300;
      audio.playPowerup();
      setEventAlert('🌟 GOLDEN MASCOT CAUGHT (+300)!');
    } else {
      audio.playCombo(nextCombo);
      setEventAlert(`CAUGHT! +${basePts}`);
    }

    const earned = Math.round(basePts * config.scoreMultiplier * (1 + nextCombo * 0.15));
    const newScore = score + earned;
    setScore(newScore);
    onScoreUpdate(newScore, nextCombo);

    // Remove caught entity and quickly respawn
    setEntities((prev) => prev.filter((item) => item.id !== entity.id));
  };

  const handleMissTap = () => {
    if (isFinishedRef.current) return;
    setCombo(0);
    setMisses((m) => m + 1);
    setEventAlert('MISSED!');
    audio.playMistake();
    const pen = Math.max(0, score - 10);
    setScore(pen);
    onScoreUpdate(pen, 0);
  };

  return (
    <div
      onClick={handleMissTap}
      className="relative flex flex-col w-full h-full p-4 select-none touch-none overflow-hidden cursor-pointer"
    >
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
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Catches</span>
          <span className="text-2xl font-bold text-emerald-400 tabular-nums">{catches}</span>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="h-8 flex items-center justify-center my-1 z-10">
        {eventAlert && (
          <span
            key={Date.now()}
            className="px-4 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-amber-400 font-black text-xs uppercase tracking-wider shadow-lg animate-pulse"
          >
            {eventAlert} {combo > 1 ? `(${combo}x)` : ''}
          </span>
        )}
      </div>

      {/* Touch Pursuit Arena */}
      <div className="relative flex-1 w-full max-w-3xl mx-auto rounded-3xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-sm overflow-hidden">
        {entities.map((entity) => {
          if (entity.isDecoy) {
            return (
              <button
                key={entity.id}
                onClick={(e) => handleTapEntity(entity, e)}
                style={{
                  left: `${entity.x}%`,
                  top: `${entity.y}%`,
                  width: `${entity.size}px`,
                  height: `${entity.size}px`
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-zinc-800/90 border border-zinc-600 text-3xl flex items-center justify-center shadow-lg active:scale-90 transition-all duration-300"
              >
                🥚
              </button>
            );
          }

          if (entity.isGolden) {
            return (
              <button
                key={entity.id}
                onClick={(e) => handleTapEntity(entity, e)}
                style={{
                  left: `${entity.x}%`,
                  top: `${entity.y}%`,
                  width: `${entity.size}px`,
                  height: `${entity.size}px`
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-100 border-4 border-white text-4xl flex items-center justify-center shadow-2xl shadow-yellow-500/80 animate-bounce cursor-pointer active:scale-95 transition-all duration-200"
              >
                ⭐
              </button>
            );
          }

          return (
            <button
              key={entity.id}
              onClick={(e) => handleTapEntity(entity, e)}
              style={{
                left: `${entity.x}%`,
                top: `${entity.y}%`,
                width: `${entity.size}px`,
                height: `${entity.size}px`
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 border-4 border-white text-4xl flex items-center justify-center shadow-xl shadow-red-500/50 cursor-pointer active:scale-90 transition-all duration-200"
            >
              {mascotIcon}
            </button>
          );
        })}
      </div>

      <div className="mt-2 text-center text-xs text-zinc-400 font-medium">
        🎯 Catch {mascotIcon} as it dashes • Grab ⭐ Golden Mascot for 3X • Avoid decoy 🥚
      </div>
    </div>
  );
};
