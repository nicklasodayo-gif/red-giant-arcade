import React, { useState, useEffect, useRef } from 'react';
import { GameInstanceProps } from '../sdk';
import { audio } from '../../services/audioManager';

interface CardItem {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SYMBOL_POOL = ['💎', '👑', '🚀', '⭐', '⚡', '🏆', '🔥', '👾', '🎯', '🍕', '🎸', '🕹️'];

export const MemoryMatchGame: React.FC<GameInstanceProps> = ({
  config,
  difficulty,
  theme,
  playerId,
  playerAlias,
  sessionId,
  onScoreUpdate,
  onGameOver
}) => {
  const pairsCount = config.customOptions?.pairs || (difficulty === 'EASY' ? 3 : difficulty === 'MEDIUM' ? 6 : difficulty === 'HARD' ? 8 : 10);
  const flipDelay = config.customOptions?.flipDelayMs || 600;

  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timerSeconds);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [highestCombo, setHighestCombo] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(Date.now());
  const isFinishedRef = useRef(false);

  // Initialize deck
  useEffect(() => {
    const selectedSymbols = SYMBOL_POOL.slice(0, pairsCount);
    const deckSymbols = [...selectedSymbols, ...selectedSymbols];

    // Fisher-Yates shuffle
    for (let i = deckSymbols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deckSymbols[i], deckSymbols[j]] = [deckSymbols[j], deckSymbols[i]];
    }

    const initialCards: CardItem[] = deckSymbols.map((symbol, idx) => ({
      id: idx,
      symbol,
      isFlipped: false,
      isMatched: false
    }));

    setCards(initialCards);
    startTimeRef.current = Date.now();
    isFinishedRef.current = false;

    // Countdown Timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleGameOver(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pairsCount]);

  const handleGameOver = (completed: boolean) => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);

    const durationSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const accuracy = attempts > 0 ? Math.round((matches / attempts) * 100) : 0;
    const finalScore = completed ? score + config.completionBonus : score;

    if (completed) {
      audio.playVictory();
    } else {
      audio.playMistake();
    }

    onGameOver({
      sessionId,
      gameId: 'memory-match',
      playerId,
      playerAlias,
      score: finalScore,
      difficulty,
      durationSeconds,
      completed,
      accuracy,
      analytics: {
        attempts,
        accuracy,
        highestCombo,
        mistakesCount: mistakes,
        durationSeconds
      },
      createdAt: new Date().toISOString()
    });
  };

  const handleCardClick = (id: number) => {
    if (isLocked) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    audio.playFlip();

    const newCards = cards.map((c) => (c.id === id ? { ...c, isFlipped: true } : c));
    setCards(newCards);

    const newSelected = [...selectedCards, id];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsLocked(true);
      setAttempts((a) => a + 1);

      const [firstId, secondId] = newSelected;
      const firstCard = newCards.find((c) => c.id === firstId);
      const secondCard = newCards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // MATCH!
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        if (nextCombo > highestCombo) setHighestCombo(nextCombo);

        const pointGain = Math.round(100 * config.scoreMultiplier * (1 + nextCombo * 0.2));
        const newScore = score + pointGain;
        setScore(newScore);
        onScoreUpdate(newScore, nextCombo);

        audio.playCombo(nextCombo);
        audio.playMatch();

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c))
          );
          setSelectedCards([]);
          setIsLocked(false);
          setMatches((m) => {
            const nextMatches = m + 1;
            if (nextMatches >= pairsCount) {
              handleGameOver(true);
            }
            return nextMatches;
          });
        }, 300);
      } else {
        // MISMATCH
        setCombo(0);
        setMistakes((m) => m + 1);
        const penal = Math.max(0, score - config.mistakePenalty);
        setScore(penal);
        onScoreUpdate(penal, 0);
        audio.playMistake();

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c))
          );
          setSelectedCards([]);
          setIsLocked(false);
        }, flipDelay);
      }
    }
  };

  // Determine grid columns based on number of cards
  const gridColsClass =
    cards.length <= 6
      ? 'grid-cols-3'
      : cards.length <= 12
      ? 'grid-cols-4'
      : cards.length <= 16
      ? 'grid-cols-4'
      : 'grid-cols-5';

  return (
    <div className="flex flex-col items-center justify-between w-full h-full p-4 select-none touch-none">
      {/* HUD Header */}
      <div className="w-full max-w-2xl flex items-center justify-between px-6 py-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl backdrop-blur-md mb-4">
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
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Pairs</span>
          <span className="text-2xl font-bold text-emerald-400">
            {matches} / {pairsCount}
          </span>
        </div>
      </div>

      {/* Combo Banner */}
      <div className="h-7 mb-2">
        {combo > 1 && (
          <div className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-black font-black text-xs uppercase tracking-wider shadow-lg animate-bounce">
            🔥 {combo}x COMBO STREAK!
          </div>
        )}
      </div>

      {/* Card Grid */}
      <div
        className={`grid ${gridColsClass} gap-3 sm:gap-4 w-full max-w-xl aspect-square p-2 items-center justify-center`}
      >
        {cards.map((card) => {
          const showFace = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched || isLocked}
              aria-label={`Card ${card.id + 1}`}
              className={`relative w-full aspect-square rounded-2xl cursor-pointer transition-all duration-300 transform active:scale-95 shadow-md flex items-center justify-center font-bold text-3xl sm:text-4xl ${
                card.isMatched
                  ? 'bg-emerald-500/20 border-2 border-emerald-400 text-white scale-95 opacity-90 shadow-emerald-500/30'
                  : showFace
                  ? 'bg-zinc-800 border-2 border-amber-400 text-white shadow-amber-500/20'
                  : 'bg-zinc-800/90 hover:bg-zinc-700/90 border border-zinc-700 active:border-amber-400 text-zinc-500'
              }`}
            >
              {showFace ? (
                <span>{card.symbol}</span>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-zinc-600 flex items-center justify-center">
                  <span className="text-xs font-black text-zinc-500">RG</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Instructions */}
      <div className="mt-4 text-xs text-zinc-400 font-medium tracking-wide">
        Find matching pairs • Mistakes reduce score • Fast pairs unlock combos
      </div>
    </div>
  );
};
