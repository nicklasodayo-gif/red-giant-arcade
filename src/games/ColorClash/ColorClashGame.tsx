import React, { useState, useEffect, useRef } from 'react';
import { GameInstanceProps } from '../sdk';
import { audio } from '../../services/audioManager';

interface ColorDef {
  name: string;
  hex: string;
}

const COLORS: ColorDef[] = [
  { name: 'RED', hex: '#EF4444' },
  { name: 'BLUE', hex: '#3B82F6' },
  { name: 'GREEN', hex: '#10B981' },
  { name: 'YELLOW', hex: '#FACC15' },
  { name: 'PURPLE', hex: '#A855F7' },
  { name: 'ORANGE', hex: '#F97316' }
];

type RuleMode = 'INK_COLOR' | 'WORD_TEXT';

export const ColorClashGame: React.FC<GameInstanceProps> = ({
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
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  // Current prompt
  const [currentRule, setCurrentRule] = useState<RuleMode>('INK_COLOR');
  const [wordColor, setWordColor] = useState<ColorDef>(COLORS[0]);
  const [inkColor, setInkColor] = useState<ColorDef>(COLORS[1]);
  const [options, setOptions] = useState<ColorDef[]>([]);

  const isFinishedRef = useRef(false);
  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(Date.now());

  const generateRound = () => {
    // Pick rule: 60% ink color, 40% word text
    const rule: RuleMode = Math.random() > 0.4 ? 'INK_COLOR' : 'WORD_TEXT';
    setCurrentRule(rule);

    // Pick two different colors for word and ink
    const wordIdx = Math.floor(Math.random() * COLORS.length);
    let inkIdx = Math.floor(Math.random() * COLORS.length);
    while (inkIdx === wordIdx) {
      inkIdx = Math.floor(Math.random() * COLORS.length);
    }

    const word = COLORS[wordIdx];
    const ink = COLORS[inkIdx];
    setWordColor(word);
    setInkColor(ink);

    // Correct answer depends on rule
    const correctDef = rule === 'INK_COLOR' ? ink : word;

    // Pick 3 distractors
    const remaining = COLORS.filter((c) => c.name !== correctDef.name);
    // Shuffle remaining and pick 3
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    const choices = [correctDef, remaining[0], remaining[1], remaining[2]];
    // Shuffle choices
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    setOptions(choices);
  };

  useEffect(() => {
    startTimeRef.current = Date.now();
    isFinishedRef.current = false;
    generateRound();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleGameOver = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);

    const durationSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const accuracy = attempts > 0 ? Math.round((correctCount / attempts) * 100) : 0;
    const finalScore = score + config.completionBonus;

    if (correctCount > mistakes) {
      audio.playVictory();
    } else {
      audio.playMistake();
    }

    onGameOver({
      sessionId,
      gameId: 'color-clash',
      playerId,
      playerAlias,
      score: finalScore,
      difficulty,
      durationSeconds,
      completed: true,
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

  const handleChoice = (chosen: ColorDef) => {
    if (isFinishedRef.current) return;

    setAttempts((a) => a + 1);
    const target = currentRule === 'INK_COLOR' ? inkColor : wordColor;

    if (chosen.name === target.name) {
      // CORRECT
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      if (nextCombo > highestCombo) setHighestCombo(nextCombo);
      setCorrectCount((c) => c + 1);

      audio.playCombo(nextCombo);

      const pts = Math.round((80 + nextCombo * 15) * config.scoreMultiplier);
      const newScore = score + pts;
      setScore(newScore);
      onScoreUpdate(newScore, nextCombo);

      generateRound();
    } else {
      // MISTAKE
      setCombo(0);
      setMistakes((m) => m + 1);
      audio.playMistake();

      const penal = Math.max(0, score - config.mistakePenalty);
      setScore(penal);
      onScoreUpdate(penal, 0);

      generateRound();
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full p-4 select-none touch-none">
      {/* HUD Header */}
      <div className="w-full max-w-2xl flex items-center justify-between px-6 py-3 rounded-2xl bg-zinc-900/85 border border-zinc-800 shadow-xl backdrop-blur-md mb-2">
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
          <span className="text-2xl font-bold text-cyan-400">{combo}x</span>
        </div>
      </div>

      {/* Main Challenge Board */}
      <div className="flex-1 w-full max-w-xl flex flex-col items-center justify-center my-auto">
        {/* Dynamic Rule Prompt Banner */}
        <div
          className={`px-6 py-2 rounded-full font-black text-sm uppercase tracking-wider mb-6 shadow-lg transition-all ${
            currentRule === 'INK_COLOR'
              ? 'bg-amber-400 text-zinc-950 ring-4 ring-amber-400/30'
              : 'bg-cyan-400 text-zinc-950 ring-4 ring-cyan-400/30'
          }`}
        >
          {currentRule === 'INK_COLOR' ? '🎨 TAP THE INK COLOR!' : '📖 TAP THE WORD TEXT!'}
        </div>

        {/* Central Stroop Word Stimulus */}
        <div className="w-full h-40 rounded-3xl bg-zinc-900/90 border-2 border-zinc-800 shadow-2xl flex items-center justify-center p-6">
          <span
            style={{ color: inkColor.hex }}
            className="text-5xl sm:text-6xl font-black tracking-widest drop-shadow-md select-none"
          >
            {wordColor.name}
          </span>
        </div>
      </div>

      {/* 4 Touch Answer Buttons */}
      <div className="w-full max-w-xl grid grid-cols-2 gap-4 pb-4">
        {options.map((option) => (
          <button
            key={option.name}
            onClick={() => handleChoice(option)}
            className="h-20 sm:h-24 rounded-2xl border-2 border-zinc-700 bg-zinc-800/90 active:scale-95 transition-transform flex items-center justify-center gap-3 px-4 shadow-lg cursor-pointer hover:border-zinc-500"
          >
            <div
              style={{ backgroundColor: option.hex }}
              className="w-8 h-8 rounded-full shadow-inner border border-white/20"
            />
            <span className="text-xl sm:text-2xl font-black text-white tracking-wide">{option.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
