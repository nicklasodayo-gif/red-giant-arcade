import { GameDefinition } from '../../types';

export const TargetTapDefinition: GameDefinition = {
  id: 'target-tap',
  name: 'Target Tap',
  tagline: 'Arcade Point Hunter & Power-Up Rush',
  description: 'Tap tiered point targets (+10, +25, +50, +100), grab Freeze & 2X Multiplier power-ups, and avoid skulls!',
  version: '2.0.0',
  icon: 'Crosshair',
  thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80',
  category: 'ARCADE',
  supportedDifficulties: ['EASY', 'MEDIUM', 'HARD', 'EXTREME'],
  defaultConfig: {
    EASY: {
      timerSeconds: 35,
      difficulty: 'EASY',
      scoreMultiplier: 1.0,
      mistakePenalty: 15,
      completionBonus: 250,
      customOptions: { spawnRateMs: 800, maxTargets: 5 }
    },
    MEDIUM: {
      timerSeconds: 30,
      difficulty: 'MEDIUM',
      scoreMultiplier: 1.5,
      mistakePenalty: 30,
      completionBonus: 400,
      customOptions: { spawnRateMs: 650, maxTargets: 6 }
    },
    HARD: {
      timerSeconds: 30,
      difficulty: 'HARD',
      scoreMultiplier: 2.0,
      mistakePenalty: 45,
      completionBonus: 600,
      customOptions: { spawnRateMs: 500, maxTargets: 7 }
    },
    EXTREME: {
      timerSeconds: 25,
      difficulty: 'EXTREME',
      scoreMultiplier: 3.0,
      mistakePenalty: 60,
      completionBonus: 900,
      customOptions: { spawnRateMs: 380, maxTargets: 8 }
    }
  },
  enabled: true,
  featured: false
};
