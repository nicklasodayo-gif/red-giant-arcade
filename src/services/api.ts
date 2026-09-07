import {
  Campaign,
  GameResult,
  Kiosk,
  Lead,
  LeaderboardEntry,
  RewardRecord,
  AnalyticsEvent,
  User,
  Theme
} from '../types';
import { offlineSync } from './offlineSync';

const API_BASE = '/api';

export class ApiClient {
  private static kioskId: string = 'kiosk-mall-01';

  public static setKioskId(id: string) {
    this.kioskId = id;
  }

  public static getKioskId(): string {
    return this.kioskId;
  }

  // --- HEALTH ---
  public static async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  }

  // --- AUTH ---
  public static async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`);
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  }

  public static async switchRole(role: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/switch-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return res.json();
  }

  // --- CAMPAIGNS ---
  public static async getCampaigns(): Promise<Campaign[]> {
    try {
      const res = await fetch(`${API_BASE}/v1/campaigns`);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('redgiant_cached_campaigns', JSON.stringify(data));
        return data;
      }
    } catch {}
    const cached = localStorage.getItem('redgiant_cached_campaigns');
    return cached ? JSON.parse(cached) : [];
  }

  public static async getCampaign(id: string): Promise<Campaign | null> {
    try {
      const res = await fetch(`${API_BASE}/v1/campaigns/${id}`);
      if (res.ok) return res.json();
    } catch {}
    const list = await this.getCampaigns();
    return list.find((c) => c.id === id) || null;
  }

  public static async saveCampaign(campaign: Partial<Campaign>): Promise<Campaign> {
    const res = await fetch(`${API_BASE}/v1/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaign)
    });
    return res.json();
  }

  public static async updateCampaignStatus(id: string, status: string): Promise<Campaign> {
    const res = await fetch(`${API_BASE}/v1/campaigns/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  }

  // --- THEMES ---
  public static async getThemes(): Promise<Theme[]> {
    try {
      const res = await fetch(`${API_BASE}/v1/themes`);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('redgiant_cached_themes', JSON.stringify(data));
        return data;
      }
    } catch {}
    const cached = localStorage.getItem('redgiant_cached_themes');
    return cached ? JSON.parse(cached) : [];
  }

  public static async saveTheme(theme: Theme): Promise<Theme> {
    const res = await fetch(`${API_BASE}/v1/themes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(theme)
    });
    return res.json();
  }

  // --- KIOSKS ---
  public static async getKiosks(): Promise<Kiosk[]> {
    try {
      const res = await fetch(`${API_BASE}/v1/kiosks`);
      if (res.ok) return res.json();
    } catch {}
    return [];
  }

  public static async sendHeartbeat(kioskId: string, info?: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/v1/kiosks/${kioskId}/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          softwareVersion: '2.4.0',
          deviceInfo: {
            platform: navigator.platform,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            userAgent: navigator.userAgent
          },
          ...info
        })
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  public static async updateKioskCampaign(kioskId: string, campaignId: string): Promise<Kiosk> {
    const res = await fetch(`${API_BASE}/v1/kiosks/${kioskId}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId })
    });
    return res.json();
  }

  public static async restartKioskSession(kioskId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/v1/kiosks/${kioskId}/restart`, { method: 'POST' });
    return res.ok;
  }

  public static async restartKiosk(kioskId: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/v1/kiosks/${kioskId}/restart`, { method: 'POST' });
    return res.json();
  }

  // --- GAME RESULTS & LEADERBOARD (Offline Safe) ---
  public static async submitGameResult(result: Partial<GameResult>): Promise<{ success: boolean; result: GameResult; reward?: RewardRecord; rank?: number }> {
    try {
      const res = await fetch(`${API_BASE}/v1/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result, kioskId: this.kioskId })
      });
      if (res.ok) {
        return res.json();
      }
    } catch (err) {
      console.warn('Network offline, enqueueing game result for sync:', err);
    }

    // Offline fallback queue
    offlineSync.enqueue(`${API_BASE}/v1/results`, 'POST', { ...result, kioskId: this.kioskId });
    return {
      success: true,
      result: result as GameResult,
      rank: 1
    };
  }

  public static async getLeaderboard(gameId?: string, campaignId?: string, timeframe = 'ALL_TIME'): Promise<LeaderboardEntry[]> {
    try {
      const query = new URLSearchParams();
      if (gameId) query.set('gameId', gameId);
      if (campaignId) query.set('campaignId', campaignId);
      query.set('timeframe', timeframe);

      const res = await fetch(`${API_BASE}/v1/leaderboards?${query.toString()}`);
      if (res.ok) return res.json();
    } catch {}
    return [];
  }

  // --- LEADS ---
  public static async submitLead(lead: Partial<Lead>): Promise<{ success: boolean; lead: Lead; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/v1/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, kioskId: this.kioskId })
      });
      return res.json();
    } catch (err) {
      console.warn('Network offline, enqueueing lead capture:', err);
      offlineSync.enqueue(`${API_BASE}/v1/leads`, 'POST', { ...lead, kioskId: this.kioskId });
      return { success: true, lead: lead as Lead };
    }
  }

  public static async getLeads(campaignId?: string): Promise<Lead[]> {
    const query = campaignId ? `?campaignId=${campaignId}` : '';
    const res = await fetch(`${API_BASE}/v1/leads${query}`);
    return res.json();
  }

  // --- REWARDS ---
  public static async getRewards(campaignId?: string): Promise<RewardRecord[]> {
    const query = campaignId ? `?campaignId=${campaignId}` : '';
    const res = await fetch(`${API_BASE}/v1/rewards${query}`);
    return res.json();
  }

  public static async redeemReward(voucherCode: string): Promise<{ success: boolean; message: string; reward?: RewardRecord }> {
    const res = await fetch(`${API_BASE}/v1/rewards/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voucherCode })
    });
    return res.json();
  }

  // --- ANALYTICS ---
  public static trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) {
    const payload = {
      ...event,
      kioskId: event.kioskId || this.kioskId,
      timestamp: new Date().toISOString()
    };
    try {
      fetch(`${API_BASE}/v1/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {
        offlineSync.enqueue(`${API_BASE}/v1/analytics`, 'POST', payload);
      });
    } catch {
      offlineSync.enqueue(`${API_BASE}/v1/analytics`, 'POST', payload);
    }
  }

  public static async getAnalyticsOverview(): Promise<any> {
    const res = await fetch(`${API_BASE}/v1/analytics/overview`);
    return res.json();
  }
}
