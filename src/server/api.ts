import { Router, Request, Response } from 'express';
import { db } from './db';
import { validateGameScore } from './scoreValidator';
import { normalizePhoneNumber } from '../utils/phone';
import { GameResult, Lead, RewardRecord, User } from '../types';

export const apiRouter = Router();

// In-memory active session user (defaulting to SUPER_ADMIN)
let activeUser: User = {
  id: 'usr-admin-1',
  name: 'Nicklas Admin',
  email: 'nicklas@redgiant.arcade',
  role: 'SUPER_ADMIN',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  createdAt: '2026-01-01T00:00:00Z',
  lastLoginAt: new Date().toISOString()
};

// --- SYSTEM HEALTH, READINESS & VERSION ---
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: 'connected',
    version: '2.4.0'
  });
});

apiRouter.get('/ready', (_req: Request, res: Response) => {
  res.json({ ready: true });
});

apiRouter.get('/version', (_req: Request, res: Response) => {
  res.json({
    product: 'RED GIANT ARCADE',
    tagline: 'Play. Compete. Connect.',
    version: '2.4.0',
    build: '20260906.1'
  });
});

// --- AUTH & RBAC ---
apiRouter.get('/auth/me', (_req: Request, res: Response) => {
  res.json(activeUser);
});

apiRouter.post('/auth/switch-role', (req: Request, res: Response) => {
  const { role } = req.body;
  if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'OPERATOR') {
    activeUser = { ...activeUser, role };
    return res.json(activeUser);
  }
  res.status(400).json({ error: 'Invalid role requested' });
});

// --- CAMPAIGNS ---
apiRouter.get('/v1/campaigns', (_req: Request, res: Response) => {
  res.json(db.getCampaigns());
});

apiRouter.get('/v1/campaigns/:id', (req: Request, res: Response) => {
  const camp = db.getCampaignById(req.params.id);
  if (!camp) return res.status(404).json({ error: 'Campaign not found' });
  res.json(camp);
});

apiRouter.post('/v1/campaigns', (req: Request, res: Response) => {
  const payload = req.body;
  if (!payload.name || !payload.themeId) {
    return res.status(400).json({ error: 'Missing campaign name or themeId' });
  }

  const campaign = {
    ...payload,
    id: payload.id || `camp-${Date.now()}`,
    version: (payload.version || 0) + 1,
    createdAt: payload.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const saved = db.saveCampaign(campaign);
  res.status(201).json(saved);
});

apiRouter.patch('/v1/campaigns/:id/status', (req: Request, res: Response) => {
  const camp = db.getCampaignById(req.params.id);
  if (!camp) return res.status(404).json({ error: 'Campaign not found' });

  const { status } = req.body;
  camp.status = status;
  camp.updatedAt = new Date().toISOString();
  db.saveCampaign(camp);

  res.json(camp);
});

// --- THEMES ---
apiRouter.get('/v1/themes', (_req: Request, res: Response) => {
  res.json(db.getThemes());
});

apiRouter.post('/v1/themes', (req: Request, res: Response) => {
  const payload = req.body;
  if (!payload.identity?.name) {
    return res.status(400).json({ error: 'Invalid theme structure' });
  }
  const saved = db.saveTheme(payload);
  res.status(201).json(saved);
});

// --- KIOSKS ---
apiRouter.get('/v1/kiosks', (_req: Request, res: Response) => {
  res.json(db.getKiosks());
});

apiRouter.post('/v1/kiosks/:id/heartbeat', (req: Request, res: Response) => {
  const { id } = req.params;
  const update = {
    lastHeartbeat: new Date().toISOString(),
    isOnline: true,
    status: 'ONLINE' as const,
    deviceInfo: req.body.deviceInfo,
    softwareVersion: req.body.softwareVersion || '2.4.0'
  };
  const updated = db.updateKiosk(id, update);
  res.json({ success: !!updated, kiosk: updated });
});

apiRouter.patch('/v1/kiosks/:id/assign', (req: Request, res: Response) => {
  const { id } = req.params;
  const { campaignId } = req.body;
  const updated = db.updateKiosk(id, { campaignId });
  if (!updated) return res.status(404).json({ error: 'Kiosk not found' });
  res.json(updated);
});

apiRouter.post('/v1/kiosks/:id/restart', (req: Request, res: Response) => {
  const { id } = req.params;
  const kiosk = db.getKioskById(id);
  if (!kiosk) return res.status(404).json({ error: 'Kiosk not found' });
  // Log event
  db.logAnalytics({
    id: `ev-${Date.now()}`,
    type: 'kiosk_online',
    kioskId: id,
    metadata: { reason: 'remote_session_restart' },
    timestamp: new Date().toISOString()
  });
  res.json({ success: true, message: `Session reset signal dispatched to ${kiosk.name}` });
});

// --- SCORE SUBMISSION & REWARDS ---
apiRouter.post('/v1/results', (req: Request, res: Response) => {
  const result: GameResult = req.body;

  // Server-side anti-cheat validation
  const validation = validateGameScore(result);
  if (!validation.isValid) {
    console.warn(`[SECURITY WARNING] Rejected suspicious score submission:`, validation.reason);
    return res.status(400).json({ error: validation.reason, rejected: true });
  }

  // Save result and calculate leaderboard rank
  const { rank } = db.addResult(result);

  // Evaluate reward eligibility based on campaign rules
  let eligibleReward: RewardRecord | undefined;
  const campaign = db.getCampaignById('camp-summer-arcade-2026');
  if (campaign && campaign.rewards.length > 0) {
    // Check highest qualifying tier
    const sortedRules = [...campaign.rewards].sort((a, b) => b.minScore - a.minScore);
    const matchedRule = sortedRules.find((r) => result.score >= r.minScore);

    if (matchedRule) {
      eligibleReward = {
        id: `rew-${Date.now()}`,
        ruleId: matchedRule.id,
        campaignId: campaign.id,
        kioskId: req.body.kioskId,
        playerId: result.playerId,
        playerAlias: result.playerAlias,
        tier: matchedRule.tier,
        title: matchedRule.title,
        rewardType: matchedRule.rewardType,
        voucherCode: `${matchedRule.couponCode || 'RG'}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        qrData: matchedRule.qrPayload || `https://redgiant.arcade/voucher?code=${matchedRule.couponCode}`,
        redeemed: false,
        createdAt: new Date().toISOString()
      };
      db.addReward(eligibleReward);
    }
  }

  db.logAnalytics({
    id: `ev-${Date.now()}`,
    type: 'score_created',
    gameId: result.gameId,
    sessionId: result.sessionId,
    metadata: { score: result.score, rank, flagged: validation.flaggedForAudit },
    timestamp: new Date().toISOString()
  });

  res.status(201).json({
    success: true,
    result,
    rank,
    reward: eligibleReward
  });
});

// --- LEADERBOARDS ---
apiRouter.get('/v1/leaderboards', (req: Request, res: Response) => {
  const gameId = req.query.gameId as string | undefined;
  const campaignId = req.query.campaignId as string | undefined;
  const timeframe = (req.query.timeframe as string) || 'ALL_TIME';

  const list = db.getLeaderboard(gameId, campaignId, timeframe);
  res.json(list);
});

// --- LEADS ---
apiRouter.post('/v1/leads', (req: Request, res: Response) => {
  const rawLead = req.body;

  let normalized = '';
  if (rawLead.phone) {
    const phoneVal = normalizePhoneNumber(rawLead.phone, 'KE');
    if (!phoneVal.isValid) {
      return res.status(400).json({ error: phoneVal.error || 'Invalid phone number format' });
    }
    normalized = phoneVal.normalized;
  }

  const lead: Lead = {
    id: `lead-${Date.now()}`,
    campaignId: rawLead.campaignId || 'camp-summer-arcade-2026',
    kioskId: rawLead.kioskId,
    gameId: rawLead.gameId,
    playerId: rawLead.playerId || `p-${Date.now()}`,
    playerAlias: rawLead.playerAlias || 'ANONYMOUS',
    name: rawLead.name,
    phone: rawLead.phone,
    normalizedPhone: normalized,
    email: rawLead.email,
    consentGiven: !!rawLead.consentGiven,
    consentTimestamp: new Date().toISOString(),
    scoreAchieved: rawLead.scoreAchieved || 0,
    rewardIssuedId: rawLead.rewardIssuedId,
    createdAt: new Date().toISOString()
  };

  const saved = db.addLead(lead);

  db.logAnalytics({
    id: `ev-${Date.now()}`,
    type: 'lead_submitted',
    campaignId: lead.campaignId,
    kioskId: lead.kioskId,
    metadata: { hasPhone: !!lead.phone, hasEmail: !!lead.email },
    timestamp: new Date().toISOString()
  });

  res.status(201).json({ success: true, lead: saved });
});

apiRouter.get('/v1/leads', (req: Request, res: Response) => {
  const campaignId = req.query.campaignId as string | undefined;
  res.json(db.getLeads(campaignId));
});

// --- REWARDS & REDEMPTION SCANNER ---
apiRouter.get('/v1/rewards', (req: Request, res: Response) => {
  const campaignId = req.query.campaignId as string | undefined;
  res.json(db.getRewards(campaignId));
});

apiRouter.post('/v1/rewards/redeem', (req: Request, res: Response) => {
  const { voucherCode } = req.body;
  if (!voucherCode) return res.status(400).json({ error: 'Missing voucher code' });
  const result = db.redeemReward(voucherCode);
  res.json(result);
});

// --- ANALYTICS ---
apiRouter.post('/v1/analytics', (req: Request, res: Response) => {
  const event = req.body;
  db.logAnalytics({
    ...event,
    id: `ev-${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: event.timestamp || new Date().toISOString()
  });
  res.json({ received: true });
});

apiRouter.get('/v1/analytics/overview', (_req: Request, res: Response) => {
  res.json(db.getAnalyticsSummary());
});
