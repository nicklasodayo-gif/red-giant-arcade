import React, { useEffect, useState } from 'react';
import { offlineSync } from '../../services/offlineSync';
import { NetworkState } from '../../types';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

export const NetworkStatusBadge: React.FC = () => {
  const [state, setState] = useState<NetworkState>(offlineSync.getNetworkState());
  const [pendingCount, setPendingCount] = useState<number>(offlineSync.getPendingCount());

  useEffect(() => {
    const unsub = offlineSync.subscribe((s, count) => {
      setState(s);
      setPendingCount(count);
    });
    return unsub;
  }, []);

  const config = {
    ONLINE: {
      color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      icon: <Wifi className="w-3.5 h-3.5" />,
      label: 'ONLINE'
    },
    OFFLINE: {
      color: 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse',
      icon: <WifiOff className="w-3.5 h-3.5" />,
      label: 'OFFLINE'
    },
    SYNCING: {
      color: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
      icon: <RefreshCw className="w-3.5 h-3.5 animate-spin" />,
      label: 'SYNCING'
    },
    SYNC_ERROR: {
      color: 'bg-rose-500/20 border-rose-500/40 text-rose-400',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      label: 'SYNC ERROR'
    }
  }[state];

  return (
    <div
      title={pendingCount > 0 ? `${pendingCount} offline action(s) queued for sync` : 'Network connected'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md transition-all ${config.color}`}
    >
      {config.icon}
      <span>{config.label}</span>
      {pendingCount > 0 && (
        <span className="ml-1 px-1.5 py-0.2 bg-zinc-800 rounded-full text-[10px] text-zinc-300 font-mono">
          {pendingCount}
        </span>
      )}
    </div>
  );
};
