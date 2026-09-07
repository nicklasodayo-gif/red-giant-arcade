import { GameDefinition } from '../../types';

export const ReactionRushDefinition: GameDefinition = {
  id: 'reaction-rush',
  name: 'Reaction Rush',
  tagline: 'High-Velocity Touch Reflex Challenge',
  description: 'Tap appearing targets before they vanish. Beware of red decoy targets and chase critical hits!',
  version: '2.0.0',
  icon: 'Zap',
  thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
  category: 'REACTION',
  supportedDifficulties: ['EASY', 'MEDIUM', 'HARD', 'EXTREME'],
  defaultConfig: {
    EASY: {
      timerSeconds: 30,
      difficulty: 'EASY',
      scoreMultiplier: 1.0,
      mistakePenalty: 15,
      completionBonus: 200,
      customOptions: { targetDurationMs: 1400, spawnIntervalMs: 800, decoyChance: 0.15 }
    },
    MEDIUM: {
      timerSeconds: 30,
      difficulty: 'MEDIUM',
      scoreMultiplier: 1.5,
      mistakePenalty: 25,
      completionBonus: 350,
      customOptions: { targetDurationMs: 1100, spawnIntervalMs: 650, decoyChance: 0.25 }
    },
    HARD: {
      timerSeconds: 30,
      difficulty: 'HARD',
      scoreMultiplier: 2.0,
      mistakePenalty: 40,
      completionBonus: 500,
      customOptions: { targetDurationMs: 850, spawnIntervalMs: 500, decoyChance: 0.35 }
    },
    EXTREME: {
      timerSeconds: 30,
      difficulty: 'EXTREME',
      scoreMultiplier: 3.0,
      mistakePenalty: 60,
      completionBonus: 800,
      customOptions: { targetDurationMs: 650, spawnIntervalMs: 380, decoyChance: 0.45 }
    }
  },
  enabled: true,
  featured: true
};
