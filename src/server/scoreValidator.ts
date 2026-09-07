import { GameResult } from '../types';

export interface ScoreValidationResult {
  isValid: boolean;
  reason?: string;
  flaggedForAudit: boolean;
}

/**
 * Server-side score security validator
 * Detects cheating, impossible speeds, and forged client submissions
 */
export function validateGameScore(result: Partial<GameResult>): ScoreValidationResult {
  const { gameId, score = 0, durationSeconds = 0, difficulty = 'EASY', analytics } = result;

  // Rule 1: Duration must be realistic (at least 2 seconds)
  if (durationSeconds < 2) {
    return {
      isValid: false,
      reason: 'Game duration unrealistically short (<2s)',
      flaggedForAudit: true
    };
  }

  // Rule 2: Score cannot be negative
  if (score < 0) {
    return {
      isValid: false,
      reason: 'Score cannot be negative',
      flaggedForAudit: true
    };
  }

  // Rule 3: Max points per second heuristic per game
  const maxScorePerSecondMap: Record<string, number> = {
    'memory-match': 300,
    'reaction-rush': 500,
    'color-clash': 400,
    'target-tap': 600,
    'catch-chicken': 450,
    'sliding-puzzle': 250
  };

  const maxAllowedRate = maxScorePerSecondMap[gameId || ''] || 500;
  const actualRate = score / Math.max(1, durationSeconds);

  if (actualRate > maxAllowedRate * 3) {
    return {
      isValid: false,
      reason: `Impossible score rate of ${Math.round(actualRate)} pts/sec exceeds maximum theoretical ceiling`,
      flaggedForAudit: true
    };
  }

  // Rule 4: Human physiological reaction time threshold
  if (analytics?.bestReactionTimeMs && analytics.bestReactionTimeMs > 0 && analytics.bestReactionTimeMs < 75) {
    return {
      isValid: false,
      reason: `Reaction time (${analytics.bestReactionTimeMs}ms) violates human sensory limit (<75ms)`,
      flaggedForAudit: true
    };
  }

  // Auditing flag for borderline high scores
  const isHighAnomaly = actualRate > maxAllowedRate * 1.5;

  return {
    isValid: true,
    flaggedForAudit: isHighAnomaly
  };
}
