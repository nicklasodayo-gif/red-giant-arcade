import { GameDefinition } from '../../types';

export const SlidingPuzzleDefinition: GameDefinition = {
  id: 'sliding-puzzle',
  name: 'Sliding Puzzle',
  tagline: 'Classic Sliding Tile Brain Challenge',
  description: 'Slide numbered image tiles into the empty slot to assemble the brand artwork in minimal moves.',
  version: '2.0.0',
  icon: 'Grid',
  thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
  category: 'PUZZLE',
  supportedDifficulties: ['EASY', 'MEDIUM', 'HARD', 'EXTREME'],
  defaultConfig: {
    EASY: {
      timerSeconds: 90,
      difficulty: 'EASY',
      scoreMultiplier: 1.0,
      mistakePenalty: 5,
      completionBonus: 500,
      customOptions: { gridSize: 3, shuffleMoves: 25 }
    },
    MEDIUM: {
      timerSeconds: 80,
      difficulty: 'MEDIUM',
      scoreMultiplier: 1.5,
      mistakePenalty: 10,
      completionBonus: 750,
      customOptions: { gridSize: 3, shuffleMoves: 40 }
    },
    HARD: {
      timerSeconds: 90,
      difficulty: 'HARD',
      scoreMultiplier: 2.0,
      mistakePenalty: 15,
      completionBonus: 1000,
      customOptions: { gridSize: 4, shuffleMoves: 50 }
    },
    EXTREME: {
      timerSeconds: 120,
      difficulty: 'EXTREME',
      scoreMultiplier: 3.0,
      mistakePenalty: 20,
      completionBonus: 1500,
      customOptions: { gridSize: 4, shuffleMoves: 80 }
    }
  },
  enabled: true,
  featured: false
};
