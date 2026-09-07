// Red Giant Arcade - Core Domain Types

export type GameDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';

export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'ENDED' | 'ARCHIVED';

export type KioskStatus = 'ONLINE' | 'OFFLINE' | 'WARNING' | 'MAINTENANCE';

export type KioskOrientation = 'LANDSCAPE' | 'PORTRAIT' | 'ADAPTIVE';

export type NetworkState = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNC_ERROR';

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR';

export type RewardType = 'COUPON' | 'PRIZE_CODE' | 'VOUCHER' | 'QR_CODE' | 'BONUS_PLAY' | 'CUSTOM' | 'TRY_AGAIN';

export type RewardTier = 'GOLD' | 'SILVER' | 'BRONZE' | 'PARTICIPATION';

export interface User {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
}

// ------------------- THEME TYPES -------------------
export interface ThemeIdentity {
  id: string;
  name: string;
  brandName: string;
  tagline: string;
  description: string;
  author: string;
  version: string;
  isTemplate?: boolean;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  glow: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  baseFontSize: number;
}

export interface ThemeAssets {
  logoUrl: string;
  backgroundPattern?: 'grid' | 'dots' | 'radial' | 'waves' | 'none';
  soundPack: 'arcade' | 'retro' | 'cyber' | 'minimal';
}

export interface ThemeGameAssets {
  cardBackUrl?: string;
  targetSkinUrl?: string;
  mascotEmojiOrUrl: string;
  puzzleImageUrl: string;
  colorPalette: string[];
}

export interface ThemeContent {
  attractHeadline: string;
  attractSubheadline: string;
  tapToStartText: string;
  congratsMessage: string;
  failureMessage: string;
  disclaimerText: string;
}

export interface ThemeRewardStyle {
  goldBadgeColor: string;
  silverBadgeColor: string;
  bronzeBadgeColor: string;
  voucherCardBackground: string;
}

export interface Theme {
  identity: ThemeIdentity;
  colors: ThemeColors;
  typography: ThemeTypography;
  assets: ThemeAssets;
  gameAssets: ThemeGameAssets;
  content: ThemeContent;
  rewardStyle: ThemeRewardStyle;
  cardStyle: 'flat' | 'glass' | 'neon' | 'bordered';
  buttonStyle: 'rounded' | 'pill' | 'retro-square';
  createdAt: string;
  updatedAt: string;
}

// ------------------- GAME CONFIG & SDK TYPES -------------------
export interface GameAnalytics {
  attempts: number;
  accuracy: number;
  avgReactionTimeMs?: number;
  bestReactionTimeMs?: number;
  highestCombo: number;
  totalHits?: number;
  totalMisses?: number;
  mistakesCount?: number;
  movesCount?: number;
  durationSeconds: number;
}

export interface GameResult {
  sessionId: string;
  gameId: string;
  playerId: string;
  playerAlias: string;
  score: number;
  difficulty: GameDifficulty;
  durationSeconds: number;
  completed: boolean;
  accuracy: number;
  analytics: GameAnalytics;
  createdAt: string;
  hashSignature?: string; // Anti-tamper verification signature
}

export interface GameConfig {
  timerSeconds: number;
  difficulty: GameDifficulty;
  scoreMultiplier: number;
  mistakePenalty: number;
  completionBonus: number;
  customOptions?: Record<string, any>;
}

export interface GameDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  version: string;
  icon: string;
  thumbnail: string;
  category: 'PUZZLE' | 'REACTION' | 'MEMORY' | 'ARCADE';
  supportedDifficulties: GameDifficulty[];
  defaultConfig: Record<GameDifficulty, GameConfig>;
  enabled: boolean;
  featured?: boolean;
}

// ------------------- CAMPAIGN TYPES -------------------
export interface RewardRule {
  id: string;
  tier: RewardTier;
  title: string;
  description: string;
  rewardType: RewardType;
  minScore: number;
  couponCode?: string;
  qrPayload?: string;
  maxDailyRedemptions?: number;
  currentRedemptions?: number;
}

export interface LeadCaptureSettings {
  enabled: boolean;
  requireName: boolean;
  requirePhone: boolean;
  requireEmail: boolean;
  requireConsent: boolean;
  consentMessage: string;
  countryCodePrefix: string; // e.g. "+254"
}

export interface LeaderboardSettings {
  enabled: boolean;
  maxEntriesDisplayed: number;
  timeframe: 'DAILY' | 'WEEKLY' | 'ALL_TIME';
  allowAnonymous: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  client: string;
  description: string;
  themeId: string;
  status: CampaignStatus;
  version: number;
  startDate: string;
  endDate: string;
  enabledGameIds: string[];
  gameConfigs: Record<string, Partial<Record<GameDifficulty, GameConfig>>>;
  rewards: RewardRule[];
  leadSettings: LeadCaptureSettings;
  leaderboardSettings: LeaderboardSettings;
  createdAt: string;
  updatedAt: string;
}

// ------------------- KIOSK TYPES -------------------
export interface Kiosk {
  id: string;
  name: string;
  location: string;
  campaignId: string;
  orientation: KioskOrientation;
  status: KioskStatus;
  lastHeartbeat: string;
  softwareVersion: string;
  currentGameId?: string;
  isOnline: boolean;
  deviceInfo?: {
    platform: string;
    screenWidth: number;
    screenHeight: number;
    userAgent: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ------------------- LEADERBOARD & PLAYER -------------------
export interface Player {
  id: string;
  alias: string;
  avatarSeed: string;
  firstSeenAt: string;
}

export interface LeaderboardEntry {
  id: string;
  campaignId: string;
  gameId: string;
  kioskId?: string;
  playerId: string;
  playerAlias: string;
  score: number;
  rank?: number;
  difficulty: GameDifficulty;
  createdAt: string;
}

// ------------------- LEADS & REWARDS -------------------
export interface Lead {
  id: string;
  campaignId: string;
  kioskId?: string;
  gameId?: string;
  playerId: string;
  playerAlias: string;
  name?: string;
  phone?: string;
  normalizedPhone?: string;
  email?: string;
  consentGiven: boolean;
  consentTimestamp: string;
  scoreAchieved: number;
  rewardIssuedId?: string;
  createdAt: string;
}

export interface RewardRecord {
  id: string;
  ruleId: string;
  campaignId: string;
  kioskId?: string;
  playerId: string;
  playerAlias: string;
  tier: RewardTier;
  title: string;
  rewardType: RewardType;
  voucherCode: string;
  qrData: string;
  redeemed: boolean;
  redeemedAt?: string;
  createdAt: string;
}

// ------------------- ANALYTICS -------------------
export type AnalyticsEventType =
  | 'session_started'
  | 'game_selected'
  | 'game_started'
  | 'game_completed'
  | 'game_timeout'
  | 'game_abandoned'
  | 'score_created'
  | 'reward_issued'
  | 'leaderboard_updated'
  | 'lead_form_opened'
  | 'lead_submitted'
  | 'lead_failed'
  | 'theme_loaded'
  | 'campaign_loaded'
  | 'kiosk_online'
  | 'kiosk_offline'
  | 'sync_started'
  | 'sync_completed'
  | 'sync_failed';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  campaignId?: string;
  kioskId?: string;
  gameId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

// ------------------- SYNC QUEUE -------------------
export interface SyncQueueItem {
  id: string;
  idempotencyKey: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH';
  payload: any;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED' | 'COMPLETED';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}
