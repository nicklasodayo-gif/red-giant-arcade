import React, { useState } from 'react';
import { AdminRole, User } from '../../types';
import { NetworkStatusBadge } from '../common/NetworkStatusBadge';
import { AudioControl } from '../common/AudioControl';
import { QuickThemeSelector } from '../common/QuickThemeSelector';
import {
  LayoutDashboard,
  Megaphone,
  Palette,
  Gamepad2,
  Monitor,
  Users,
  Award,
  Trophy,
  BarChart3,
  RefreshCw,
  Settings,
  Tv,
  LogOut,
  ChevronRight,
  Shield
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'campaigns'
  | 'themes'
  | 'games'
  | 'kiosks'
  | 'leads'
  | 'rewards'
  | 'leaderboards'
  | 'analytics'
  | 'sync'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onSwitchToKiosk: () => void;
  user: User;
  onSwitchRole: (role: AdminRole) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onSwitchToKiosk,
  user,
  onSwitchRole,
  children
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode; minRole?: AdminRole }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'themes', label: 'Theme Studio', icon: <Palette className="w-4 h-4" /> },
    { id: 'games', label: 'Games Registry', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'kiosks', label: 'Kiosks & Terminals', icon: <Monitor className="w-4 h-4" /> },
    { id: 'leads', label: 'Leads & CRM', icon: <Users className="w-4 h-4" /> },
    { id: 'rewards', label: 'Rewards & Redemption', icon: <Award className="w-4 h-4" /> },
    { id: 'leaderboards', label: 'Leaderboards', icon: <Trophy className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics & KPIs', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'sync', label: 'Sync Monitor', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'settings', label: 'System & RBAC', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* SaaS Admin Sidebar */}
      <aside
        className={`${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } h-full bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between transition-all duration-300 select-none z-30 shrink-0`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-base shrink-0 shadow-md">
                RG
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col text-left truncate">
                  <span className="font-black text-sm text-white uppercase tracking-wider truncate">
                    RED GIANT
                  </span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    OPERATOR PLATFORM
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)]">
            {menuItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  title={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Launch Kiosk Player Button & Profile */}
        <div className="p-3 border-t border-zinc-800 space-y-2">
          <button
            onClick={onSwitchToKiosk}
            title="Launch Kiosk Touch Display"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer"
          >
            <Tv className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>LAUNCH KIOSK</span>}
          </button>

          {!isSidebarCollapsed && (
            <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-amber-400">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left truncate">
                  <span className="text-xs font-bold text-white truncate">{user.name}</span>
                  <span className="text-[9px] text-zinc-500 uppercase font-mono">{user.role}</span>
                </div>
              </div>
              <Shield className="w-3.5 h-3.5 text-red-500 shrink-0" />
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 px-6 bg-zinc-900/60 border-b border-zinc-800 backdrop-blur-md flex items-center justify-between shrink-0 select-none z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-black text-white uppercase tracking-wider capitalize">
              {currentTab.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <QuickThemeSelector />
            <NetworkStatusBadge />
            <AudioControl />

            {/* Quick RBAC Role Selector */}
            <div className="flex items-center gap-2 bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800 text-xs">
              <span className="text-zinc-500 font-bold uppercase text-[10px]">Role:</span>
              <select
                value={user.role}
                onChange={(e) => onSwitchRole(e.target.value as AdminRole)}
                className="bg-transparent text-amber-400 font-bold outline-none cursor-pointer"
              >
                <option value="SUPER_ADMIN" className="bg-zinc-900 text-white">Super Admin</option>
                <option value="ADMIN" className="bg-zinc-900 text-white">Admin</option>
                <option value="OPERATOR" className="bg-zinc-900 text-white">Operator</option>
              </select>
            </div>
          </div>
        </header>

        {/* Scrollable Stage Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-zinc-950">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
