import { GameDefinition } from '../../types';

export const MemoryMatchDefinition: GameDefinition = {
  id: 'memory-match',
  name: 'Memory Match',
  tagline: 'Pair Up Arcade Icons Against the Clock',
  description: 'Flip cards and match identical pairs before time runs out. Fast matches build combo multipliers!',
  version: '2.0.0',
  icon: 'Layers',
  thumbnail: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=400&q=80',
  category: 'MEMORY',
  supportedDifficulties: ['EASY', 'MEDIUM', 'HARD', 'EXTREME'],
  defaultConfig: {
    EASY: {
      timerSeconds: 45,
      difficulty: 'EASY',
      scoreMultiplier: 1.0,
      mistakePenalty: 10,
      completionBonus: 250,
      customOptions: { pairs: 3, flipDelayMs: 650 }
    },
    MEDIUM: {
      timerSeconds: 40,
      difficulty: 'MEDIUM',
      scoreMultiplier: 1.5,
      mistakePenalty: 15,
      completionBonus: 400,
      customOptions: { pairs: 6, flipDelayMs: 600 }
    },
    HARD: {
      timerSeconds: 35,
      difficulty: 'HARD',
      scoreMultiplier: 2.0,
      mistakePenalty: 25,
      completionBonus: 650,
      customOptions: { pairs: 8, flipDelayMs: 500 }
    },
    EXTREME: {
      timerSeconds: 30,
      difficulty: 'EXTREME',
      scoreMultiplier: 3.0,
      mistakePenalty: 40,
      completionBonus: 1000,
      customOptions: { pairs: 10, flipDelayMs: 450 }
    }
  },
  enabled: true,
  featured: true
};
