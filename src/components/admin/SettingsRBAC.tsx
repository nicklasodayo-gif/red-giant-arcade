import React, { useState } from 'react';
import { AdminRole, User } from '../../types';
import { Shield, Check, Lock, Info, Server, Cpu } from 'lucide-react';

interface SettingsRBACProps {
  user: User;
  onSwitchRole: (role: AdminRole) => void;
}

export const SettingsRBAC: React.FC<SettingsRBACProps> = ({ user, onSwitchRole }) => {
  const [activeRole, setActiveRole] = useState<AdminRole>(user.role);

  const handleRoleChange = (role: AdminRole) => {
    setActiveRole(role);
    onSwitchRole(role);
  };

  const capabilities = [
    { name: 'Launch & Play Kiosks', superAdmin: true, admin: true, operator: true },
    { name: 'Scan & Redeem Vouchers', superAdmin: true, admin: true, operator: true },
    { name: 'View Kiosk Telemetry', superAdmin: true, admin: true, operator: true },
    { name: 'Remote Kiosk Reset Signal', superAdmin: true, admin: true, operator: false },
    { name: 'Export Leads & CRM Records', superAdmin: true, admin: true, operator: false },
    { name: 'Edit Theme & Brand Visuals', superAdmin: true, admin: true, operator: false },
    { name: 'Create & Edit Campaigns', superAdmin: true, admin: true, operator: false },
    { name: 'Game Difficulty & Timer Tuning', superAdmin: true, admin: true, operator: false },
    { name: 'System Migrations & Role Assign', superAdmin: true, admin: false, operator: false }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800">
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
          SYSTEM CONFIGURATION & ROLE-BASED ACCESS CONTROL (RBAC)
        </h2>
        <p className="text-xs text-zinc-400">
          Switch test accounts and verify permission barriers between Super Admins, Campaign Admins, and On-site Operators.
        </p>
      </div>

      {/* Role Switcher Selector */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-500" />
          <span>Active Operator Profile</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => handleRoleChange('SUPER_ADMIN')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              activeRole === 'SUPER_ADMIN'
                ? 'bg-zinc-850 border-red-500 shadow-lg'
                : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-white uppercase">Super Admin</span>
              {activeRole === 'SUPER_ADMIN' && <Check className="w-4 h-4 text-red-500" />}
            </div>
            <p className="text-xs text-zinc-400">
              Full administrative privileges across all campaigns, themes, system migrations, and audit logs.
            </p>
          </div>

          <div
            onClick={() => handleRoleChange('ADMIN')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              activeRole === 'ADMIN'
                ? 'bg-zinc-850 border-amber-500 shadow-lg'
                : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-white uppercase">Campaign Admin</span>
              {activeRole === 'ADMIN' && <Check className="w-4 h-4 text-amber-500" />}
            </div>
            <p className="text-xs text-zinc-400">
              Manages themes, active games, prize rules, kiosk assignments, and leads CSV downloads.
            </p>
          </div>

          <div
            onClick={() => handleRoleChange('OPERATOR')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              activeRole === 'OPERATOR'
                ? 'bg-zinc-850 border-cyan-500 shadow-lg'
                : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-white uppercase">Field Operator</span>
              {activeRole === 'OPERATOR' && <Check className="w-4 h-4 text-cyan-500" />}
            </div>
            <p className="text-xs text-zinc-400">
              On-site mall kiosk monitor: voucher redemption scanner, touch screen launcher, and status inspection.
            </p>
          </div>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider">
          Permission Enforcement Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3">Platform Capability</th>
                <th className="px-4 py-3 text-center">Super Admin</th>
                <th className="px-4 py-3 text-center">Campaign Admin</th>
                <th className="px-4 py-3 text-center">Field Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {capabilities.map((cap) => (
                <tr key={cap.name}>
                  <td className="px-4 py-3 font-medium text-white">{cap.name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-emerald-400 font-bold">✓ Full</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {cap.admin ? (
                      <span className="text-emerald-400 font-bold">✓ Yes</span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {cap.operator ? (
                      <span className="text-emerald-400 font-bold">✓ Yes</span>
                    ) : (
                      <span className="text-zinc-600 font-bold">Locked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Diagnostics Card */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase block">Platform Version</span>
          <span className="text-xs font-mono font-black text-white">Red Giant Arcade v2.4.0</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase block">Audio Subsystem</span>
          <span className="text-xs font-mono font-black text-emerald-400">Zero-Latency Web Audio API</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase block">Persistence Engine</span>
          <span className="text-xs font-mono font-black text-amber-400">Relational DB with Sync Queue</span>
        </div>
      </div>
    </div>
  );
};
