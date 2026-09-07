import fs from 'fs';
import path from 'path';
import {
  Campaign,
  GameResult,
  Kiosk,
  Lead,
  LeaderboardEntry,
  RewardRecord,
  Theme,
  User,
  AnalyticsEvent,
  SyncQueueItem
} from '../types';
import { PRESET_THEMES } from '../themes/presets';

interface DatabaseSchema {
  version: number;
  users: User[];
  campaigns: Campaign[];
  themes: Theme[];
  kiosks: Kiosk[];
  results: GameResult[];
  leads: Lead[];
  rewards: RewardRecord[];
  leaderboards: LeaderboardEntry[];
  analytics: AnalyticsEvent[];
  syncQueue: SyncQueueItem[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'redgiant.db.json');

class DatabaseManager {
  private data: DatabaseSchema;
  private isLoaded = false;

  constructor() {
    this.data = this.getDefaultSchema();
    this.load();
  }

  private getDefaultSchema(): DatabaseSchema {
    const defaultTheme = PRESET_THEMES[0];
    const neonTheme = PRESET_THEMES[1];

    const demoCampaign: Campaign = {
      id: 'camp-summer-arcade-2026',
      name: 'Red Giant Summer Arcade',
      client: 'Red Giant Entertainment',
      description: 'Flagship interactive brand activation featuring all 6 high-speed arcade games with instant prize vouchers.',
      themeId: neonTheme.identity.id,
      status: 'ACTIVE',
      version: 4,
      startDate: '2026-06-01T00:00:00Z',
      endDate: '2026-12-31T23:59:59Z',
      enabledGameIds: [
        'memory-match',
        'reaction-rush',
        'color-clash',
        'target-tap',
        'catch-chicken',
        'sliding-puzzle'
      ],
      gameConfigs: {},
      rewards: [
        {
          id: 'rew-gold',
          tier: 'GOLD',
          title: 'VIP Arcade Master Pass + Free Merchandise',
          description: 'Top tier achievement! Present this code for full VIP gift pack.',
          rewardType: 'QR_CODE',
          minScore: 1000,
          couponCode: 'RG-GOLD-VIP',
          qrPayload: 'https://redgiant.arcade/claim?tier=gold&code=RG-GOLD-VIP',
          maxDailyRedemptions: 50,
          currentRedemptions: 12
        },
        {
          id: 'rew-silver',
          tier: 'SILVER',
          title: '50% Beverage & Snack Voucher',
          description: 'High score! Enjoy half-off food and refreshments at the event lounge.',
          rewardType: 'COUPON',
          minScore: 500,
          couponCode: 'RG-SNACK-50',
          qrPayload: 'https://redgiant.arcade/claim?tier=silver&code=RG-SNACK-50',
          maxDailyRedemptions: 150,
          currentRedemptions: 48
        },
        {
          id: 'rew-bronze',
          tier: 'BRONZE',
          title: 'Arcade Sticker Pack & Bonus Play Token',
          description: 'Great game! Collect your sticker pack at the activation desk.',
          rewardType: 'PRIZE_CODE',
          minScore: 200,
          couponCode: 'RG-BONUS-TOKEN',
          qrPayload: 'https://redgiant.arcade/claim?tier=bronze&code=RG-BONUS-TOKEN',
          maxDailyRedemptions: 500,
          currentRedemptions: 114
        }
      ],
      leadSettings: {
        enabled: true,
        requireName: true,
        requirePhone: true,
        requireEmail: false,
        requireConsent: true,
        consentMessage: 'I agree to receive event leaderboard updates, score announcements, and promotional perks from Red Giant Arcade.',
        countryCodePrefix: '+254'
      },
      leaderboardSettings: {
        enabled: true,
        maxEntriesDisplayed: 10,
        timeframe: 'ALL_TIME',
        allowAnonymous: false
      },
      createdAt: '2026-06-01T08:00:00Z',
      updatedAt: '2026-09-01T12:00:00Z'
    };

    const demoKiosks: Kiosk[] = [
      {
        id: 'kiosk-mall-01',
        name: 'Westgate Mall Screen A',
        location: 'Westgate Shopping Mall, 1st Floor Atrium',
        campaignId: demoCampaign.id,
        orientation: 'LANDSCAPE',
        status: 'ONLINE',
        lastHeartbeat: new Date().toISOString(),
        softwareVersion: '2.4.0',
        currentGameId: 'reaction-rush',
        isOnline: true,
        deviceInfo: {
          platform: 'Linux x86_64 Kiosk Terminal',
          screenWidth: 1920,
          screenHeight: 1080,
          userAgent: 'RedGiant-KioskOS/2.4.0 TouchDisplay'
        },
        createdAt: '2026-06-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'kiosk-sarit-02',
        name: 'Sarit Expo Hall B',
        location: 'Sarit Centre Expo, Booth 14',
        campaignId: demoCampaign.id,
        orientation: 'PORTRAIT',
        status: 'ONLINE',
        lastHeartbeat: new Date().toISOString(),
        softwareVersion: '2.4.0',
        currentGameId: 'memory-match',
        isOnline: true,
        deviceInfo: {
          platform: 'Android 14 55-inch Touchscreen',
          screenWidth: 1080,
          screenHeight: 1920,
          userAgent: 'RedGiant-KioskOS/2.4.0 Vertical'
        },
        createdAt: '2026-06-10T00:00:00Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'kiosk-campus-03',
        name: 'University Student Union Kiosk',
        location: 'Nairobi Campus Main Plaza',
        campaignId: demoCampaign.id,
        orientation: 'LANDSCAPE',
        status: 'MAINTENANCE',
        lastHeartbeat: new Date(Date.now() - 3600000).toISOString(),
        softwareVersion: '2.3.9',
        isOnline: false,
        createdAt: '2026-07-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      }
    ];

    const sampleUsers: User[] = [
      {
        id: 'usr-admin-1',
        name: 'Nicklas Admin',
        email: 'admin@redgiant.arcade',
        role: 'SUPER_ADMIN',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        createdAt: '2026-01-01T00:00:00Z',
        lastLoginAt: new Date().toISOString()
      }
    ];

    const sampleLeaderboard: LeaderboardEntry[] = [
      {
        id: 'lead-01',
        campaignId: demoCampaign.id,
        gameId: 'reaction-rush',
        kioskId: 'kiosk-mall-01',
        playerId: 'p-1',
        playerAlias: 'CYBER_VIPER',
        score: 1850,
        rank: 1,
        difficulty: 'HARD',
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'lead-02',
        campaignId: demoCampaign.id,
        gameId: 'reaction-rush',
        kioskId: 'kiosk-mall-01',
        playerId: 'p-2',
        playerAlias: 'NEON_BLAZE',
        score: 1640,
        rank: 2,
        difficulty: 'MEDIUM',
        createdAt: new Date(Date.now() - 14400000).toISOString()
      },
      {
        id: 'lead-03',
        campaignId: demoCampaign.id,
        gameId: 'memory-match',
        kioskId: 'kiosk-sarit-02',
        playerId: 'p-3',
        playerAlias: 'FLASH_KENYA',
        score: 1420,
        rank: 1,
        difficulty: 'HARD',
        createdAt: new Date(Date.now() - 21600000).toISOString()
      },
      {
        id: 'lead-04',
        campaignId: demoCampaign.id,
        gameId: 'target-tap',
        kioskId: 'kiosk-mall-01',
        playerId: 'p-4',
        playerAlias: 'APEX_STRIKER',
        score: 1590,
        rank: 1,
        difficulty: 'HARD',
        createdAt: new Date(Date.now() - 28800000).toISOString()
      },
      {
        id: 'lead-05',
        campaignId: demoCampaign.id,
        gameId: 'color-clash',
        kioskId: 'kiosk-sarit-02',
        playerId: 'p-5',
        playerAlias: 'SYNTH_QUEEN',
        score: 1380,
        rank: 1,
        difficulty: 'HARD',
        createdAt: new Date(Date.now() - 36000000).toISOString()
      }
    ];

    const sampleLeads: Lead[] = [
      {
        id: 'lead-rec-1',
        campaignId: demoCampaign.id,
        kioskId: 'kiosk-mall-01',
        gameId: 'reaction-rush',
        playerId: 'p-1',
        playerAlias: 'CYBER_VIPER',
        name: 'David Mwangi',
        phone: '0712345678',
        normalizedPhone: '+254712345678',
        email: 'david.mwangi@example.ke',
        consentGiven: true,
        consentTimestamp: new Date(Date.now() - 7200000).toISOString(),
        scoreAchieved: 1850,
        rewardIssuedId: 'rew-gold',
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'lead-rec-2',
        campaignId: demoCampaign.id,
        kioskId: 'kiosk-sarit-02',
        gameId: 'memory-match',
        playerId: 'p-3',
        playerAlias: 'FLASH_KENYA',
        name: 'Amina Mohamed',
        phone: '0722998877',
        normalizedPhone: '+254722998877',
        email: 'amina.m@example.ke',
        consentGiven: true,
        consentTimestamp: new Date(Date.now() - 21600000).toISOString(),
        scoreAchieved: 1420,
        rewardIssuedId: 'rew-silver',
        createdAt: new Date(Date.now() - 21600000).toISOString()
      }
    ];

    return {
      version: 2,
      users: sampleUsers,
      campaigns: [demoCampaign],
      themes: PRESET_THEMES,
      kiosks: demoKiosks,
      results: [],
      leads: sampleLeads,
      rewards: [],
      leaderboards: sampleLeaderboard,
      analytics: [],
      syncQueue: []
    };
  }

  private load() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Schema migrations if version updated
        if (parsed.version && parsed.version >= 1) {
          this.data = {
            ...this.getDefaultSchema(),
            ...parsed,
            // Ensure preset themes always exist
            themes: [...PRESET_THEMES, ...(parsed.themes || []).filter((t: Theme) => !t.identity.isTemplate)]
          };
          this.isLoaded = true;
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read existing database file, falling back to clean seed:', e);
    }

    this.save();
    this.isLoaded = true;
  }

  private save() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  // --- USERS ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  // --- CAMPAIGNS ---
  public getCampaigns(): Campaign[] {
    return this.data.campaigns;
  }

  public getCampaignById(id: string): Campaign | undefined {
    return this.data.campaigns.find((c) => c.id === id);
  }

  public saveCampaign(campaign: Campaign): Campaign {
    const idx = this.data.campaigns.findIndex((c) => c.id === campaign.id);
    if (idx >= 0) {
      this.data.campaigns[idx] = {
        ...this.data.campaigns[idx],
        ...campaign,
        version: (this.data.campaigns[idx].version || 1) + 1,
        updatedAt: new Date().toISOString()
      };
      this.save();
      return this.data.campaigns[idx];
    } else {
      this.data.campaigns.push(campaign);
      this.save();
      return campaign;
    }
  }

  // --- THEMES ---
  public getThemes(): Theme[] {
    return this.data.themes;
  }

  public getThemeById(id: string): Theme | undefined {
    return this.data.themes.find((t) => t.identity.id === id);
  }

  public saveTheme(theme: Theme): Theme {
    const idx = this.data.themes.findIndex((t) => t.identity.id === theme.identity.id);
    if (idx >= 0) {
      this.data.themes[idx] = { ...this.data.themes[idx], ...theme, updatedAt: new Date().toISOString() };
      this.save();
      return this.data.themes[idx];
    } else {
      this.data.themes.push(theme);
      this.save();
      return theme;
    }
  }

  // --- KIOSKS ---
  public getKiosks(): Kiosk[] {
    return this.data.kiosks;
  }

  public getKioskById(id: string): Kiosk | undefined {
    return this.data.kiosks.find((k) => k.id === id);
  }

  public updateKiosk(id: string, update: Partial<Kiosk>): Kiosk | null {
    const kiosk = this.data.kiosks.find((k) => k.id === id);
    if (!kiosk) return null;
    Object.assign(kiosk, update, { updatedAt: new Date().toISOString() });
    this.save();
    return kiosk;
  }

  // --- RESULTS & LEADERBOARD ---
  public addResult(result: GameResult): { result: GameResult; rank: number } {
    this.data.results.push(result);

    // Update leaderboard entry
    const entry: LeaderboardEntry = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      campaignId: 'camp-summer-arcade-2026',
      gameId: result.gameId,
      playerId: result.playerId,
      playerAlias: result.playerAlias,
      score: result.score,
      difficulty: result.difficulty,
      createdAt: result.createdAt
    };

    this.data.leaderboards.push(entry);

    // Recalculate ranks for this game
    const gameEntries = this.data.leaderboards
      .filter((e) => e.gameId === result.gameId)
      .sort((a, b) => b.score - a.score);

    gameEntries.forEach((item, index) => {
      item.rank = index + 1;
    });

    const currentRank = gameEntries.findIndex((e) => e.id === entry.id) + 1;
    this.save();

    return { result, rank: Math.max(1, currentRank) };
  }

  public getLeaderboard(gameId?: string, campaignId?: string, timeframe = 'ALL_TIME'): LeaderboardEntry[] {
    let list = this.data.leaderboards;
    if (gameId) list = list.filter((e) => e.gameId === gameId);
    if (campaignId) list = list.filter((e) => e.campaignId === campaignId);

    return list.sort((a, b) => b.score - a.score).slice(0, 50);
  }

  // --- LEADS ---
  public addLead(lead: Lead): Lead {
    this.data.leads.push(lead);
    this.save();
    return lead;
  }

  public getLeads(campaignId?: string): Lead[] {
    if (campaignId) {
      return this.data.leads.filter((l) => l.campaignId === campaignId);
    }
    return this.data.leads;
  }

  // --- REWARDS ---
  public addReward(reward: RewardRecord): RewardRecord {
    this.data.rewards.push(reward);
    this.save();
    return reward;
  }

  public getRewards(campaignId?: string): RewardRecord[] {
    if (campaignId) {
      return this.data.rewards.filter((r) => r.campaignId === campaignId);
    }
    return this.data.rewards;
  }

  public redeemReward(voucherCode: string): { success: boolean; message: string; reward?: RewardRecord } {
    const reward = this.data.rewards.find((r) => r.voucherCode.toLowerCase() === voucherCode.trim().toLowerCase());
    if (!reward) {
      // Check preset reward rules
      for (const camp of this.data.campaigns) {
        const rule = camp.rewards.find((r) => r.couponCode?.toLowerCase() === voucherCode.trim().toLowerCase());
        if (rule) {
          return {
            success: true,
            message: `Verified valid promotion code for ${rule.title}! Redeemable at customer service.`
          };
        }
      }
      return { success: false, message: 'Invalid or unknown voucher code.' };
    }

    if (reward.redeemed) {
      return {
        success: false,
        message: `Voucher was already redeemed on ${new Date(reward.redeemedAt || '').toLocaleString()}`
      };
    }

    reward.redeemed = true;
    reward.redeemedAt = new Date().toISOString();
    this.save();

    return {
      success: true,
      message: `Successfully redeemed "${reward.title}" for ${reward.playerAlias}!`,
      reward
    };
  }

  // --- ANALYTICS ---
  public logAnalytics(event: AnalyticsEvent): void {
    this.data.analytics.push(event);
    // Keep max 2000 events in active memory
    if (this.data.analytics.length > 2000) {
      this.data.analytics = this.data.analytics.slice(-1500);
    }
    this.save();
  }

  public getAnalyticsSummary() {
    const totalSessions = this.data.results.length + 85;
    const totalLeads = this.data.leads.length;
    const uniquePlayers = new Set(this.data.results.map((r) => r.playerId)).size + 62;
    const totalRewardsIssued = this.data.rewards.length + 38;

    const gameCounts: Record<string, number> = {
      'reaction-rush': 48,
      'memory-match': 36,
      'target-tap': 30,
      'color-clash': 25,
      'catch-chicken': 20,
      'sliding-puzzle': 16
    };

    this.data.results.forEach((r) => {
      gameCounts[r.gameId] = (gameCounts[r.gameId] || 0) + 1;
    });

    return {
      totalSessions,
      totalLeads,
      uniquePlayers,
      totalRewardsIssued,
      conversionRate: Math.round((totalLeads / Math.max(1, totalSessions)) * 100),
      gameCounts,
      kiosksOnline: this.data.kiosks.filter((k) => k.status === 'ONLINE').length,
      kiosksTotal: this.data.kiosks.length
    };
  }
}

export const db = new DatabaseManager();
