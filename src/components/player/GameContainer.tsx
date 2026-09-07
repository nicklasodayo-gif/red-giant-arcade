import React, { useState, useEffect, useRef } from 'react';
import {
  Campaign,
  GameDefinition,
  GameDifficulty,
  GameResult,
  LeaderboardEntry,
  RewardRecord,
  Theme
} from '../../types';
import { GameRegistry } from '../../games/registry';
import { ApiClient } from '../../services/api';
import { KioskHeader } from './KioskHeader';
import { AttractScreen } from './AttractScreen';
import { WelcomeScreen } from './WelcomeScreen';
import { GameArcadeSelector } from './GameArcadeSelector';
import { GameIntroModal } from './GameIntroModal';
import { GameCountdown } from './GameCountdown';
import { GameResultModal } from './GameResultModal';
import { RewardScreen } from './RewardScreen';
import { LeaderboardScreen } from './LeaderboardScreen';
import { LeadCaptureModal } from './LeadCaptureModal';
import { ThankYouScreen } from './ThankYouScreen';

type PlayerStep =
  | 'ATTRACT'
  | 'WELCOME'
  | 'GAME_SELECT'
  | 'GAME_INTRO'
  | 'COUNTDOWN'
  | 'PLAYING'
  | 'RESULT'
  | 'REWARD'
  | 'LEADERBOARD'
  | 'LEAD_CAPTURE'
  | 'THANK_YOU';

interface GameContainerProps {
  campaign: Campaign;
  theme: Theme;
  onOpenAdmin: () => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  campaign,
  theme,
  onOpenAdmin
}) => {
  const [step, setStep] = useState<PlayerStep>('ATTRACT');
  const [playerId, setPlayerId] = useState<string>(`p-${Date.now()}`);
  const [playerAlias, setPlayerAlias] = useState<string>('CYBER_LION');
  const [selectedGame, setSelectedGame] = useState<GameDefinition | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>('MEDIUM');
  const [sessionId, setSessionId] = useState<string>(`sess-${Date.now()}`);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [lastRank, setLastRank] = useState<number>(1);
  const [lastReward, setLastReward] = useState<RewardRecord | undefined>(undefined);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Inactivity Attract Mode Timer (45s idle returns to attract mode if not playing)
  const idleTimerRef = useRef<any>(null);

  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (step !== 'PLAYING' && step !== 'COUNTDOWN' && step !== 'ATTRACT') {
      idleTimerRef.current = setTimeout(() => {
        handleResetToAttract();
      }, 45000);
    }
  };

  useEffect(() => {
    resetIdleTimer();
    const handleTouch = () => resetIdleTimer();
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('click', handleTouch);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('click', handleTouch);
    };
  }, [step]);

  // Fetch leaderboard on mount and periodically
  const refreshLeaderboard = async () => {
    try {
      const entries = await ApiClient.getLeaderboard(undefined, campaign.id);
      setLeaderboard(entries);
    } catch {}
  };

  useEffect(() => {
    refreshLeaderboard();
  }, [campaign.id]);

  const handleStartFromAttract = () => {
    setPlayerId(`p-${Date.now()}`);
    setStep('WELCOME');
  };

  const handleWelcomeProceed = (alias: string) => {
    setPlayerAlias(alias);
    setStep('GAME_SELECT');
    ApiClient.trackEvent({
      type: 'session_started',
      campaignId: campaign.id,
      sessionId,
      metadata: { playerAlias: alias }
    });
  };

  const handleSelectGame = (game: GameDefinition, difficulty: GameDifficulty) => {
    setSelectedGame(game);
    setSelectedDifficulty(difficulty);
    setStep('GAME_INTRO');
    ApiClient.trackEvent({
      type: 'game_selected',
      campaignId: campaign.id,
      gameId: game.id,
      metadata: { difficulty }
    });
  };

  const handleStartCountdown = () => {
    setStep('COUNTDOWN');
  };

  const handleCountdownComplete = () => {
    setSessionId(`sess-${Date.now()}`);
    setStep('PLAYING');
    ApiClient.trackEvent({
      type: 'game_started',
      campaignId: campaign.id,
      gameId: selectedGame?.id,
      sessionId
    });
  };

  const handleScoreUpdate = (currentScore: number, combo?: number) => {
    // Score update hook
  };

  const handleGameOver = async (result: GameResult) => {
    setLastResult(result);

    try {
      const response = await ApiClient.submitGameResult(result);
      if (response && response.rank) {
        setLastRank(response.rank);
      }
      if (response && response.reward) {
        setLastReward(response.reward);
      }
      refreshLeaderboard();
    } catch (err) {
      console.warn('Offline score submission saved to queue:', err);
    }

    setStep('RESULT');
  };

  const handleLeadSubmit = async (leadData: any) => {
    try {
      await ApiClient.submitLead({
        ...leadData,
        campaignId: campaign.id,
        gameId: selectedGame?.id
      });
    } catch {}
    setStep('THANK_YOU');
  };

  const handleResetToAttract = () => {
    setStep('ATTRACT');
    setSelectedGame(null);
    setLastResult(null);
    setLastReward(undefined);
  };

  // Find Component for active game
  const activeRegisteredGame = selectedGame ? GameRegistry.getGame(selectedGame.id) : null;
  const ActiveGameComponent = activeRegisteredGame?.Component;
  const activeGameConfig = selectedGame
    ? selectedGame.defaultConfig[selectedDifficulty] || selectedGame.defaultConfig.EASY
    : null;

  return (
    <div className="relative w-full h-screen flex flex-col bg-zinc-950 text-white overflow-hidden">
      {/* Top Kiosk Header */}
      <KioskHeader
        campaign={campaign}
        theme={theme}
        onHomeClick={step !== 'ATTRACT' ? handleResetToAttract : undefined}
        onOpenAdmin={onOpenAdmin}
      />

      {/* Main Interactive Stage */}
      <main className="relative flex-1 w-full h-full overflow-hidden flex flex-col items-center justify-center">
        {step === 'ATTRACT' && (
          <AttractScreen
            campaign={campaign}
            theme={theme}
            leaderboard={leaderboard}
            onStart={handleStartFromAttract}
          />
        )}

        {step === 'WELCOME' && (
          <WelcomeScreen
            theme={theme}
            onProceed={handleWelcomeProceed}
            onBack={handleResetToAttract}
          />
        )}

        {step === 'GAME_SELECT' && (
          <GameArcadeSelector
            campaign={campaign}
            theme={theme}
            playerAlias={playerAlias}
            onSelectGame={handleSelectGame}
          />
        )}

        {step === 'GAME_INTRO' && selectedGame && (
          <GameIntroModal
            game={selectedGame}
            difficulty={selectedDifficulty}
            theme={theme}
            onStartCountdown={handleStartCountdown}
            onBack={() => setStep('GAME_SELECT')}
          />
        )}

        {step === 'COUNTDOWN' && (
          <GameCountdown onComplete={handleCountdownComplete} />
        )}

        {step === 'PLAYING' && ActiveGameComponent && activeGameConfig && (
          <ActiveGameComponent
            config={activeGameConfig}
            difficulty={selectedDifficulty}
            theme={theme}
            playerId={playerId}
            playerAlias={playerAlias}
            sessionId={sessionId}
            onScoreUpdate={handleScoreUpdate}
            onGameOver={handleGameOver}
          />
        )}

        {step === 'RESULT' && lastResult && (
          <GameResultModal
            result={lastResult}
            rank={lastRank}
            reward={lastReward}
            theme={theme}
            onProceedToReward={() => setStep('REWARD')}
            onProceedToLeaderboard={() => setStep('LEADERBOARD')}
          />
        )}

        {step === 'REWARD' && lastReward && (
          <RewardScreen
            reward={lastReward}
            theme={theme}
            onProceedToLeaderboard={() => setStep('LEADERBOARD')}
          />
        )}

        {step === 'LEADERBOARD' && (
          <LeaderboardScreen
            entries={leaderboard}
            currentPlayerAlias={playerAlias}
            theme={theme}
            onProceed={() => {
              if (campaign.leadSettings?.enabled) {
                setStep('LEAD_CAPTURE');
              } else {
                setStep('THANK_YOU');
              }
            }}
          />
        )}

        {step === 'LEAD_CAPTURE' && (
          <LeadCaptureModal
            campaign={campaign}
            theme={theme}
            playerId={playerId}
            playerAlias={playerAlias}
            score={lastResult?.score || 0}
            onSubmit={handleLeadSubmit}
            onSkip={() => setStep('THANK_YOU')}
          />
        )}

        {step === 'THANK_YOU' && (
          <ThankYouScreen
            theme={theme}
            playerAlias={playerAlias}
            onReset={handleResetToAttract}
          />
        )}
      </main>
    </div>
  );
};
