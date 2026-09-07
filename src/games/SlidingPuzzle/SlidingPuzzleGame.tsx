import React, { useState, useEffect, useRef } from 'react';
import { GameInstanceProps } from '../sdk';
import { audio } from '../../services/audioManager';

export const SlidingPuzzleGame: React.FC<GameInstanceProps> = ({
  config,
  difficulty,
  theme,
  playerId,
  playerAlias,
  sessionId,
  onScoreUpdate,
  onGameOver
}) => {
  const size = config.customOptions?.gridSize || (difficulty === 'EXTREME' || difficulty === 'HARD' ? 4 : 3);
  const totalTiles = size * size;
  const emptyTileValue = totalTiles - 1; // Last index represents the empty hole

  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.timerSeconds);
  const [isSolved, setIsSolved] = useState(false);

  const isFinishedRef = useRef(false);
  const clockTimerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(Date.now());

  const puzzleImg =
    theme.gameAssets.puzzleImageUrl ||
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';

  // Generate a 100% solvable board by applying random legal moves from the solved state
  const initBoard = () => {
    const solved = Array.from({ length: totalTiles }, (_, i) => i);
    let currentTiles = [...solved];
    let emptyIdx = emptyTileValue;

    const shuffleSteps = config.customOptions?.shuffleMoves || (size === 3 ? 30 : 60);

    for (let step = 0; step < shuffleSteps; step++) {
      const emptyRow = Math.floor(emptyIdx / size);
      const emptyCol = emptyIdx % size;
      const neighbors: number[] = [];

      if (emptyRow > 0) neighbors.push((emptyRow - 1) * size + emptyCol);
      if (emptyRow < size - 1) neighbors.push((emptyRow + 1) * size + emptyCol);
      if (emptyCol > 0) neighbors.push(emptyRow * size + (emptyCol - 1));
      if (emptyCol < size - 1) neighbors.push(emptyRow * size + (emptyCol + 1));

      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      currentTiles[emptyIdx] = currentTiles[randomNeighbor];
      currentTiles[randomNeighbor] = emptyTileValue;
      emptyIdx = randomNeighbor;
    }

    setTiles(currentTiles);
    setMoves(0);
    setIsSolved(false);
  };

  useEffect(() => {
    startTimeRef.current = Date.now();
    isFinishedRef.current = false;
    initBoard();

    clockTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(clockTimerRef.current);
          handleGameOver(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (clockTimerRef.current) clearInterval(clockTimerRef.current);
    };
  }, [size]);

  const handleGameOver = (completed: boolean) => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    if (clockTimerRef.current) clearInterval(clockTimerRef.current);

    const durationSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    // Calculate score: bonus for remaining time and low moves
    let finalScore = 0;
    if (completed) {
      const timeBonus = timeLeft * 10;
      const moveEfficiency = Math.max(50, 500 - moves * 5);
      finalScore = Math.round((config.completionBonus + timeBonus + moveEfficiency) * config.scoreMultiplier);
      audio.playVictory();
    } else {
      audio.playMistake();
      finalScore = Math.max(0, 100 - moves * 2);
    }

    onGameOver({
      sessionId,
      gameId: 'sliding-puzzle',
      playerId,
      playerAlias,
      score: finalScore,
      difficulty,
      durationSeconds,
      completed,
      accuracy: completed ? 100 : 50,
      analytics: {
        attempts: moves,
        accuracy: completed ? 100 : 50,
        highestCombo: 1,
        movesCount: moves,
        durationSeconds
      },
      createdAt: new Date().toISOString()
    });
  };

  const handleTileClick = (index: number) => {
    if (isSolved || isFinishedRef.current) return;

    const tileVal = tiles[index];
    if (tileVal === emptyTileValue) return;

    const row = Math.floor(index / size);
    const col = index % size;

    const emptyIndex = tiles.indexOf(emptyTileValue);
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      audio.playFlip();

      const newTiles = [...tiles];
      newTiles[emptyIndex] = tileVal;
      newTiles[index] = emptyTileValue;
      setTiles(newTiles);

      const nextMoves = moves + 1;
      setMoves(nextMoves);

      // Check if solved
      const solved = newTiles.every((val, idx) => val === idx);
      if (solved) {
        setIsSolved(true);
        handleGameOver(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full p-4 select-none touch-none">
      {/* HUD Header */}
      <div className="w-full max-w-2xl flex items-center justify-between px-6 py-3 rounded-2xl bg-zinc-900/85 border border-zinc-800 shadow-xl backdrop-blur-md mb-2">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Moves</span>
          <span className="text-3xl font-black text-amber-400 tabular-nums">{moves}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Time</span>
          <span
            className={`text-3xl font-black tabular-nums ${
              timeLeft <= 15 ? 'text-red-500 animate-pulse' : 'text-white'
            }`}
          >
            {timeLeft}s
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Grid</span>
          <span className="text-2xl font-bold text-cyan-400">
            {size}x{size}
          </span>
        </div>
      </div>

      {/* Sliding Puzzle Canvas Box */}
      <div className="flex-1 w-full max-w-md flex items-center justify-center p-2 my-auto">
        <div
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`
          }}
          className="grid gap-2 w-full aspect-square p-3 rounded-3xl bg-zinc-900 border-2 border-zinc-800 shadow-2xl"
        >
          {tiles.map((val, idx) => {
            const isEmpty = val === emptyTileValue;
            if (isEmpty) {
              return (
                <div
                  key="empty"
                  className="rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-950/60"
                />
              );
            }

            // Calculate background position for image slice
            const originalRow = Math.floor(val / size);
            const originalCol = val % size;
            const posX = (originalCol / (size - 1)) * 100;
            const posY = (originalRow / (size - 1)) * 100;

            return (
              <button
                key={val}
                onClick={() => handleTileClick(idx)}
                style={{
                  backgroundImage: `url(${puzzleImg})`,
                  backgroundSize: `${size * 100}%`,
                  backgroundPosition: `${posX}% ${posY}%`
                }}
                className="relative rounded-2xl border border-white/20 shadow-md cursor-pointer active:scale-95 transition-transform flex items-end justify-end p-2 overflow-hidden hover:brightness-110"
              >
                <div className="absolute inset-0 bg-black/25 pointer-events-none" />
                <span className="relative z-10 w-6 h-6 rounded-full bg-black/75 border border-white/30 flex items-center justify-center text-xs font-black text-amber-400">
                  {val + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2 text-center text-xs text-zinc-400 font-medium">
        🧩 Tap any tile adjacent to the empty slot to slide • Reorder 1 to {totalTiles - 1} to solve
      </div>
    </div>
  );
};
