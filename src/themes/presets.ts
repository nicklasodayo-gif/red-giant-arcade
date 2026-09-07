import { Theme } from '../types';

export const PRESET_THEMES: Theme[] = [
  {
    identity: {
      id: 'theme-red-giant',
      name: 'Red Giant Original',
      brandName: 'Red Giant Arcade',
      tagline: 'Play. Compete. Connect.',
      description: 'Official flagship brand theme featuring high-energy crimson, carbon obsidian, and gold arcade highlights.',
      author: 'Red Giant Studios',
      version: '2.1.0',
      isTemplate: true
    },
    colors: {
      primary: '#E50914', // Vibrant crimson
      secondary: '#1F1F24',
      accent: '#FFB800', // Arcade gold
      background: '#0B0B0E',
      surface: '#15151A',
      card: '#1C1C24',
      textPrimary: '#FFFFFF',
      textSecondary: '#A1A1AA',
      border: '#2A2A35',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      glow: 'rgba(229, 9, 20, 0.45)'
    },
    typography: {
      headingFont: "'Cabinet Grotesk', system-ui, -apple-system, sans-serif",
      bodyFont: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      baseFontSize: 16
    },
    assets: {
      logoUrl: '',
      backgroundPattern: 'radial',
      soundPack: 'arcade'
    },
    gameAssets: {
      mascotEmojiOrUrl: '🦁',
      puzzleImageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
      colorPalette: ['#E50914', '#FFB800', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899']
    },
    content: {
      attractHeadline: 'RED GIANT ARCADE',
      attractSubheadline: 'PLAY. COMPETE. CONNECT.',
      tapToStartText: 'TAP SCREEN TO PLAY',
      congratsMessage: 'CHAMPION STATUS UNLOCKED!',
      failureMessage: 'GOOD EFFORT! TRY AGAIN',
      disclaimerText: 'Red Giant Arcade Interactive Platform. High scores reset at midnight.'
    },
    rewardStyle: {
      goldBadgeColor: '#FFB800',
      silverBadgeColor: '#E2E8F0',
      bronzeBadgeColor: '#CD7F32',
      voucherCardBackground: 'linear-gradient(135deg, #1C1C24 0%, #2A1518 100%)'
    },
    cardStyle: 'neon',
    buttonStyle: 'rounded',
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z'
  },
  {
    identity: {
      id: 'theme-neon-arcade',
      name: 'Neon Cyber Arcade',
      brandName: 'Cyber Strike 84',
      tagline: 'High Voltage Retro Wave',
      description: 'Electric 80s synthwave arcade aesthetic featuring neon cyan, hot magenta, and dark grid vibes.',
      author: 'Arcade Classics',
      version: '1.8.0',
      isTemplate: true
    },
    colors: {
      primary: '#06B6D4', // Electric cyan
      secondary: '#D946EF', // Hot magenta
      accent: '#FACC15', // Neon yellow
      background: '#090514',
      surface: '#120B24',
      card: '#1C1338',
      textPrimary: '#F8FAFC',
      textSecondary: '#A78BFA',
      border: '#3B1E6D',
      success: '#22C55E',
      warning: '#F59E0B',
      danger: '#F43F5E',
      glow: 'rgba(6, 182, 212, 0.5)'
    },
    typography: {
      headingFont: "'Press Start 2P', system-ui, sans-serif",
      bodyFont: "system-ui, -apple-system, sans-serif",
      baseFontSize: 16
    },
    assets: {
      logoUrl: '',
      backgroundPattern: 'grid',
      soundPack: 'cyber'
    },
    gameAssets: {
      mascotEmojiOrUrl: '🕹️',
      puzzleImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
      colorPalette: ['#06B6D4', '#D946EF', '#FACC15', '#A855F7', '#3B82F6', '#10B981']
    },
    content: {
      attractHeadline: 'READY PLAYER ONE?',
      attractSubheadline: 'HIGH VOLTAGE ARCADE ARENA',
      tapToStartText: 'INSERT COIN / TAP SCREEN',
      congratsMessage: 'MAX SCORE ACHIEVED!',
      failureMessage: 'GAME OVER — CONTINUE?',
      disclaimerText: 'Powered by Red Giant Arcade engine. Top 3 win instant prize tokens.'
    },
    rewardStyle: {
      goldBadgeColor: '#FACC15',
      silverBadgeColor: '#38BDF8',
      bronzeBadgeColor: '#F472B6',
      voucherCardBackground: 'linear-gradient(135deg, #180E38 0%, #290849 100%)'
    },
    cardStyle: 'neon',
    buttonStyle: 'retro-square',
    createdAt: '2026-02-15T00:00:00.000Z',
    updatedAt: '2026-08-20T00:00:00.000Z'
  },
  {
    identity: {
      id: 'theme-corporate-modern',
      name: 'Summit Corporate',
      brandName: 'Global Innovation Forum',
      tagline: 'Connect. Innovate. Excel.',
      description: 'Sophisticated corporate activation theme with sapphire blue, crisp executive typography, and slate accents.',
      author: 'Enterprise Brand Lab',
      version: '1.2.0',
      isTemplate: true
    },
    colors: {
      primary: '#2563EB', // Sapphire
      secondary: '#0F172A',
      accent: '#0EA5E9',
      background: '#0B1120',
      surface: '#111C35',
      card: '#182747',
      textPrimary: '#FFFFFF',
      textSecondary: '#94A3B8',
      border: '#233863',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      glow: 'rgba(37, 99, 235, 0.35)'
    },
    typography: {
      headingFont: "system-ui, -apple-system, sans-serif",
      bodyFont: "system-ui, -apple-system, sans-serif",
      baseFontSize: 16
    },
    assets: {
      logoUrl: '',
      backgroundPattern: 'dots',
      soundPack: 'minimal'
    },
    gameAssets: {
      mascotEmojiOrUrl: '💼',
      puzzleImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
      colorPalette: ['#2563EB', '#0EA5E9', '#6366F1', '#10B981', '#F59E0B', '#64748B']
    },
    content: {
      attractHeadline: 'LEADERSHIP CHALLENGE',
      attractSubheadline: 'TEST YOUR AGILITY & FOCUS',
      tapToStartText: 'TOUCH DISPLAY TO BEGIN',
      congratsMessage: 'EXEMPLARY PERFORMANCE!',
      failureMessage: 'SESSION COMPLETE',
      disclaimerText: 'Sponsored by Corporate Communications. Vouchers redeemable at conference info desk.'
    },
    rewardStyle: {
      goldBadgeColor: '#F59E0B',
      silverBadgeColor: '#94A3B8',
      bronzeBadgeColor: '#B45309',
      voucherCardBackground: 'linear-gradient(135deg, #111C35 0%, #1E3A8A 100%)'
    },
    cardStyle: 'bordered',
    buttonStyle: 'rounded',
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-08-15T00:00:00.000Z'
  },
  {
    identity: {
      id: 'theme-summer-festival',
      name: 'Sunfest Carnival',
      brandName: 'Summer Jam 2026',
      tagline: 'Vibes, Music & Fun',
      description: 'Vibrant festival theme featuring warm sunburst coral, warm amber, and tropical teal energy.',
      author: 'Festival Productions',
      version: '1.4.0',
      isTemplate: true
    },
    colors: {
      primary: '#F97316', // Bright Orange
      secondary: '#14B8A6', // Tropical Teal
      accent: '#FACC15', // Amber Sunshine
      background: '#140D07',
      surface: '#24170E',
      card: '#352115',
      textPrimary: '#FFF7ED',
      textSecondary: '#FDBA74',
      border: '#4D2F1E',
      success: '#10B981',
      warning: '#FBBF24',
      danger: '#EF4444',
      glow: 'rgba(249, 115, 22, 0.4)'
    },
    typography: {
      headingFont: "system-ui, -apple-system, sans-serif",
      bodyFont: "system-ui, -apple-system, sans-serif",
      baseFontSize: 16
    },
    assets: {
      logoUrl: '',
      backgroundPattern: 'waves',
      soundPack: 'arcade'
    },
    gameAssets: {
      mascotEmojiOrUrl: '☀️',
      puzzleImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      colorPalette: ['#F97316', '#14B8A6', '#FACC15', '#EC4899', '#8B5CF6', '#3B82F6']
    },
    content: {
      attractHeadline: 'FESTIVAL SPEED CARNIVAL',
      attractSubheadline: 'WIN FREE FESTIVAL PASSES & MERCH',
      tapToStartText: 'TAP TO JAM & PLAY',
      congratsMessage: 'FESTIVAL VIP SCORE!',
      failureMessage: 'CATCH YOUR BREATH & TRY AGAIN',
      disclaimerText: 'Claim drink vouchers at Stage 1 bar. Must be 18+ for beverage tokens.'
    },
    rewardStyle: {
      goldBadgeColor: '#FACC15',
      silverBadgeColor: '#E0F2FE',
      bronzeBadgeColor: '#FB923C',
      voucherCardBackground: 'linear-gradient(135deg, #2D170D 0%, #431407 100%)'
    },
    cardStyle: 'flat',
    buttonStyle: 'pill',
    createdAt: '2026-04-10T00:00:00.000Z',
    updatedAt: '2026-08-10T00:00:00.000Z'
  },
  {
    identity: {
      id: 'theme-sports-arena',
      name: 'Velocity Sports',
      brandName: 'Athletic Arena',
      tagline: 'Speed. Agility. Victory.',
      description: 'High performance sports activation theme with carbon black, neon emerald, and athletic gold.',
      author: 'Sport Pro Tech',
      version: '1.1.0',
      isTemplate: true
    },
    colors: {
      primary: '#10B981', // Athletic Emerald
      secondary: '#0F172A',
      accent: '#F59E0B', // Gold
      background: '#080E0B',
      surface: '#111D17',
      card: '#182C22',
      textPrimary: '#F0FDF4',
      textSecondary: '#86EFAC',
      border: '#214233',
      success: '#22C55E',
      warning: '#EAB308',
      danger: '#F43F5E',
      glow: 'rgba(16, 185, 129, 0.45)'
    },
    typography: {
      headingFont: "system-ui, -apple-system, sans-serif",
      bodyFont: "system-ui, -apple-system, sans-serif",
      baseFontSize: 16
    },
    assets: {
      logoUrl: '',
      backgroundPattern: 'grid',
      soundPack: 'arcade'
    },
    gameAssets: {
      mascotEmojiOrUrl: '⚡',
      puzzleImageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
      colorPalette: ['#10B981', '#F59E0B', '#06B6D4', '#3B82F6', '#EF4444', '#A855F7']
    },
    content: {
      attractHeadline: 'ARENA SPEED TRIAL',
      attractSubheadline: 'PROVE YOUR REACTION SPEED',
      tapToStartText: 'TAP TO STEP INTO THE ARENA',
      congratsMessage: 'CHAMPION ON THE PODIUM!',
      failureMessage: 'TRAIN HARDER — RETRY',
      disclaimerText: 'Red Giant Sports Engine. Top daily score wins athletic footwear gift card.'
    },
    rewardStyle: {
      goldBadgeColor: '#F59E0B',
      silverBadgeColor: '#D1D5DB',
      bronzeBadgeColor: '#B45309',
      voucherCardBackground: 'linear-gradient(135deg, #111D17 0%, #064E3B 100%)'
    },
    cardStyle: 'neon',
    buttonStyle: 'rounded',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z'
  },
  {
    identity: {
      id: 'theme-tech-minimal',
      name: 'Titanium Tech',
      brandName: 'NextGen Systems',
      tagline: 'Pure Performance',
      description: 'Clean modern monochrome and titanium with electric lime accents for product launches.',
      author: 'Minimal Labs',
      version: '1.0.0',
      isTemplate: true
    },
    colors: {
      primary: '#84CC16', // Electric Lime
      secondary: '#18181B',
      accent: '#38BDF8',
      background: '#09090B',
      surface: '#141417',
      card: '#1E1E24',
      textPrimary: '#FAFAFA',
      textSecondary: '#A1A1AA',
      border: '#27272A',
      success: '#84CC16',
      warning: '#EAB308',
      danger: '#EF4444',
      glow: 'rgba(132, 204, 22, 0.4)'
    },
    typography: {
      headingFont: "system-ui, -apple-system, sans-serif",
      bodyFont: "system-ui, -apple-system, sans-serif",
      baseFontSize: 16
    },
    assets: {
      logoUrl: '',
      backgroundPattern: 'none',
      soundPack: 'retro'
    },
    gameAssets: {
      mascotEmojiOrUrl: '🚀',
      puzzleImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      colorPalette: ['#84CC16', '#38BDF8', '#F43F5E', '#A855F7', '#F59E0B', '#64748B']
    },
    content: {
      attractHeadline: 'NEXTGEN ARCADE BENCHMARK',
      attractSubheadline: 'HIGH-FREQUENCY INTERACTIVE BENCHMARK',
      tapToStartText: 'TAP TO INITIALIZE TEST',
      congratsMessage: 'BENCHMARK RECORD BROKEN!',
      failureMessage: 'BENCHMARK COMPLETED',
      disclaimerText: 'Hardware performance benchmark. Scores logged to verified device registry.'
    },
    rewardStyle: {
      goldBadgeColor: '#84CC16',
      silverBadgeColor: '#E4E4E7',
      bronzeBadgeColor: '#71717A',
      voucherCardBackground: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)'
    },
    cardStyle: 'bordered',
    buttonStyle: 'rounded',
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z'
  }
];

export const DEFAULT_THEME = PRESET_THEMES[0];
