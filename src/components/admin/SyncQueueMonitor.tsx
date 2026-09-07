import React, { useState, useEffect } from 'react';
import { offlineSync } from '../../services/offlineSync';
import { NetworkState, SyncQueueItem } from '../../types';
import { RefreshCw, CheckCircle2, AlertTriangle, Wifi, WifiOff, Trash2, ShieldCheck } from 'lucide-react';

export const SyncQueueMonitor: React.FC = () => {
  const [networkState, setNetworkState] = useState<NetworkState>(offlineSync.getNetworkState());
  const [pendingCount, setPendingCount] = useState<number>(offlineSync.getPendingCount());
  const [isDraining, setIsDraining] = useState(false);
  const [simulatedItems, setSimulatedItems] = useState<SyncQueueItem[]>([]);

  const refreshStatus = () => {
    setNetworkState(offlineSync.getNetworkState());
    setPendingCount(offlineSync.getPendingCount());
  };

  useEffect(() => {
    const unsub = offlineSync.subscribe((state, count) => {
      setNetworkState(state);
      setPendingCount(count);
    });
    return unsub;
  }, []);

  const handleForceDrain = async () => {
    setIsDraining(true);
    await offlineSync.drainQueue();
    setTimeout(() => {
      setIsDraining(false);
      refreshStatus();
    }, 1200);
  };

  const handleClearQueue = () => {
    offlineSync.clearQueue();
    refreshStatus();
  };

  const handleSimulateOfflineAction = () => {
    offlineSync.queueAction('game_result', {
      gameId: 'reaction-rush',
      score: 1200,
      timestamp: new Date().toISOString()
    });
    refreshStatus();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
            OFFLINE SYNC ENGINE & QUEUE MONITOR
          </h2>
          <p className="text-xs text-zinc-400">
            Idempotent background sync queue. Automatically captures scores and leads when kiosk network drops.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateOfflineAction}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Queue Test Action
          </button>

          <button
            onClick={handleForceDrain}
            disabled={isDraining}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isDraining ? 'animate-spin' : ''}`} />
            <span>{isDraining ? 'Draining Queue...' : 'Force Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Sync Health Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Network State</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">
              {networkState}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
            {networkState === 'ONLINE' ? (
              <Wifi className="w-6 h-6 text-emerald-400" />
            ) : (
              <WifiOff className="w-6 h-6 text-red-400 animate-pulse" />
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Queued Actions
            </span>
            <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
              {pendingCount} Pending
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center font-mono font-black text-amber-400">
            {pendingCount}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Idempotency Deduplication
            </span>
            <span className="text-xs font-black text-emerald-400 font-mono mt-1 block">
              ENABLED (Zero Duplicates)
            </span>
          </div>
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>
      </div>

      {/* Queue Details Box */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Offline Storage Buffer ({pendingCount} items)
          </h3>
          {pendingCount > 0 && (
            <button
              onClick={handleClearQueue}
              className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Failed Queue</span>
            </button>
          )}
        </div>

        {pendingCount === 0 ? (
          <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-850 text-center text-zinc-500 text-xs font-bold">
            Queue is clean. All arcade scores and leads are synchronized with central cloud repository.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
                  PENDING
                </span>
                <span className="font-mono text-zinc-300">Action: game_result / score_submission</span>
              </div>
              <span className="text-zinc-500 font-mono text-[11px]">Idempotency: auto-generated</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
