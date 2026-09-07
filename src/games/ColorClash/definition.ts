import { GameDefinition } from '../../types';

export const ColorClashDefinition: GameDefinition = {
  id: 'color-clash',
  name: 'Color Clash',
  tagline: 'High-Speed Stroop Brain Teaser',
  description: 'Match either the ink color or the written text depending on the rapid dynamic challenge rule!',
  version: '2.0.0',
  icon: 'Palette',
  thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80',
  category: 'PUZZLE',
  supportedDifficulties: ['EASY', 'MEDIUM', 'HARD', 'EXTREME'],
  defaultConfig: {
    EASY: {
      timerSeconds: 35,
      difficulty: 'EASY',
      scoreMultiplier: 1.0,
      mistakePenalty: 15,
      completionBonus: 250,
      customOptions: { timePerRoundMs: 2400 }
    },
    MEDIUM: {
      timerSeconds: 30,
      difficulty: 'MEDIUM',
      scoreMultiplier: 1.5,
      mistakePenalty: 25,
      completionBonus: 400,
      customOptions: { timePerRoundMs: 1900 }
    },
    HARD: {
      timerSeconds: 30,
      difficulty: 'HARD',
      scoreMultiplier: 2.0,
      mistakePenalty: 35,
      completionBonus: 600,
      customOptions: { timePerRoundMs: 1400 }
    },
    EXTREME: {
      timerSeconds: 25,
      difficulty: 'EXTREME',
      scoreMultiplier: 3.0,
      mistakePenalty: 50,
      completionBonus: 900,
      customOptions: { timePerRoundMs: 1000 }
    }
  },
  enabled: true,
  featured: false
};
