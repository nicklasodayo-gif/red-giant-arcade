import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './themes/themeContext';
import { Campaign, Theme, User, AdminRole } from './types';
import { PRESET_THEMES } from './themes/presets';
import { GameContainer } from './components/player/GameContainer';
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { CampaignManager } from './components/admin/CampaignManager';
import { ThemeStudio } from './components/admin/ThemeStudio';
import { GameRegistryManager } from './components/admin/GameRegistryManager';
import { KioskHardwareMonitor } from './components/admin/KioskHardwareMonitor';
import { LeadsManager } from './components/admin/LeadsManager';
import { RewardManager } from './components/admin/RewardManager';
import { LeaderboardManager } from './components/admin/LeaderboardManager';
import { AnalyticsDashboard } from './components/admin/AnalyticsDashboard';
import { SyncQueueMonitor } from './components/admin/SyncQueueMonitor';
import { SettingsRBAC } from './components/admin/SettingsRBAC';
import { ApiClient } from './services/api';

const DEFAULT_CAMPAIGN: Campaign = {
  id: 'camp-summer-arcade-2026',
  name: 'Red Giant Summer Arcade',
  client: 'Red Giant Entertainment',
  description: 'Flagship interactive brand activation featuring 6 high-speed arcade games with instant prize vouchers.',
  themeId: PRESET_THEMES[1].identity.id,
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

function AppInner() {
  const { theme, setTheme } = useTheme();
  // Allow forcing admin mode or a specific admin tab via URL query params
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const initialModeParam = params.get('mode')?.toLowerCase();
  const initialTabParam = params.get('tab') as AdminTab | null;

  const [mode, setMode] = useState<'KIOSK' | 'ADMIN'>(initialModeParam === 'admin' ? 'ADMIN' : 'KIOSK');
  const [adminTab, setAdminTab] = useState<AdminTab>(initialTabParam ?? 'dashboard');
  const [campaign, setCampaign] = useState<Campaign>(DEFAULT_CAMPAIGN);
  const [user, setUser] = useState<User>({
    id: 'usr-admin-1',
    name: 'Nicklas Admin',
    email: 'admin@redgiant.arcade',
    role: 'SUPER_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-01-01T00:00:00Z'
  });

  // Load campaign from API if available
  useEffect(() => {
    ApiClient.getCampaign('camp-summer-arcade-2026')
      .then((c) => {
        if (c) setCampaign(c);
      })
      .catch(() => {});
  }, []);

  const handleApplyTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleUpdateCampaign = (updated: Campaign) => {
    setCampaign(updated);
  };

  const handleSwitchRole = (role: AdminRole) => {
    setUser((prev) => ({ ...prev, role }));
  };

  if (mode === 'KIOSK') {
    return (
      <GameContainer
        campaign={campaign}
        theme={theme}
        onOpenAdmin={() => setMode('ADMIN')}
      />
    );
  }

  return (
    <AdminLayout
      currentTab={adminTab}
      onTabChange={setAdminTab}
      onSwitchToKiosk={() => setMode('KIOSK')}
      user={user}
      onSwitchRole={handleSwitchRole}
    >
      {adminTab === 'dashboard' && (
        <DashboardOverview
          onSwitchToKiosk={() => setMode('KIOSK')}
          onNavigateTab={(tab) => setAdminTab(tab)}
        />
      )}

      {adminTab === 'campaigns' && (
        <CampaignManager
          campaign={campaign}
          onUpdateCampaign={handleUpdateCampaign}
        />
      )}

      {adminTab === 'themes' && (
        <ThemeStudio
          activeTheme={theme}
          onApplyTheme={handleApplyTheme}
        />
      )}

      {adminTab === 'games' && (
        <GameRegistryManager
          onTestGame={(gameId) => {
            setCampaign((c) => ({ ...c, enabledGameIds: [gameId] }));
            setMode('KIOSK');
          }}
        />
      )}

      {adminTab === 'kiosks' && <KioskHardwareMonitor />}

      {adminTab === 'leads' && <LeadsManager />}

      {adminTab === 'rewards' && <RewardManager />}

      {adminTab === 'leaderboards' && <LeaderboardManager />}

      {adminTab === 'analytics' && <AnalyticsDashboard />}

      {adminTab === 'sync' && <SyncQueueMonitor />}

      {adminTab === 'settings' && (
        <SettingsRBAC user={user} onSwitchRole={handleSwitchRole} />
      )}
    </AdminLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider initialTheme={PRESET_THEMES[1]}>
      <AppInner />
    </ThemeProvider>
  );
}
