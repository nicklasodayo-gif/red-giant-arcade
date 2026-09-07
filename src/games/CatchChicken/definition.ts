import { GameDefinition } from '../../types';

export const CatchChickenDefinition: GameDefinition = {
  id: 'catch-chicken',
  name: 'Catch the Mascot',
  tagline: 'Fast-Moving Touch Pursuit Game',
  description: 'The agile mascot darts across the screen! Track its unpredictable movements and catch it for big bonus streaks.',
  version: '2.0.0',
  icon: 'Smile',
  thumbnail: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80',
  category: 'ARCADE',
  supportedDifficulties: ['EASY', 'MEDIUM', 'HARD', 'EXTREME'],
  defaultConfig: {
    EASY: {
      timerSeconds: 35,
      difficulty: 'EASY',
      scoreMultiplier: 1.0,
      mistakePenalty: 10,
      completionBonus: 250,
      customOptions: { moveIntervalMs: 1100, bonusChance: 0.15 }
    },
    MEDIUM: {
      timerSeconds: 30,
      difficulty: 'MEDIUM',
      scoreMultiplier: 1.5,
      mistakePenalty: 20,
      completionBonus: 400,
      customOptions: { moveIntervalMs: 850, bonusChance: 0.20 }
    },
    HARD: {
      timerSeconds: 30,
      difficulty: 'HARD',
      scoreMultiplier: 2.0,
      mistakePenalty: 35,
      completionBonus: 600,
      customOptions: { moveIntervalMs: 600, bonusChance: 0.25 }
    },
    EXTREME: {
      timerSeconds: 25,
      difficulty: 'EXTREME',
      scoreMultiplier: 3.0,
      mistakePenalty: 50,
      completionBonus: 900,
      customOptions: { moveIntervalMs: 450, bonusChance: 0.30 }
    }
  },
  enabled: true,
  featured: false
};
