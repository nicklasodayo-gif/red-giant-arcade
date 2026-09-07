import { ComponentType } from 'react';
import { GameConfig, GameDefinition, GameDifficulty, GameResult, Theme } from '../types';

export interface GameHostCallbacks {
  onScoreUpdate: (score: number, combo?: number) => void;
  onGameOver: (result: GameResult) => void;
  onAnalyticsEvent?: (name: string, payload?: any) => void;
}

export interface GameInstanceProps {
  config: GameConfig;
  difficulty: GameDifficulty;
  theme: Theme;
  playerId: string;
  playerAlias: string;
  sessionId: string;
  onScoreUpdate: (score: number, combo?: number) => void;
  onGameOver: (result: GameResult) => void;
}

export interface GameSDKLifecycle {
  initialize: (props: GameInstanceProps) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  destroy: () => void;
}

export interface RegisteredGame {
  definition: GameDefinition;
  Component: ComponentType<GameInstanceProps>;
}
