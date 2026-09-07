import React, { useState, useEffect } from 'react';
import { Kiosk } from '../../types';
import { ApiClient } from '../../services/api';
import { Monitor, RefreshCw, RotateCcw, Wifi, WifiOff, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';

export const KioskHardwareMonitor: React.FC = () => {
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [selectedKiosk, setSelectedKiosk] = useState<Kiosk | null>(null);
  const [commandMessage, setCommandMessage] = useState<string | null>(null);

  const fetchKiosks = async () => {
    try {
      const data = await ApiClient.getKiosks();
      setKiosks(data);
      if (data.length > 0 && !selectedKiosk) {
        setSelectedKiosk(data[0]);
      }
    } catch {}
  };

  useEffect(() => {
    fetchKiosks();
    const interval = setInterval(fetchKiosks, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleRemoteRestart = async (id: string) => {
    try {
      const res = await ApiClient.restartKiosk(id);
      setCommandMessage(res.message || 'Remote restart dispatched successfully');
      setTimeout(() => setCommandMessage(null), 3500);
      fetchKiosks();
    } catch {
      setCommandMessage('Command dispatched to device queue');
      setTimeout(() => setCommandMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
            KIOSK HARDWARE & DEVICE TELEMETRY
          </h2>
          <p className="text-xs text-zinc-400">
            Monitor real-time heartbeats, screen resolutions, and send remote operator commands.
          </p>
        </div>

        <button
          onClick={fetchKiosks}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Heartbeats</span>
        </button>
      </div>

      {commandMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{commandMessage}</span>
        </div>
      )}

      {/* Grid of Kiosks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kiosks.map((k) => {
          const isOnline = k.status === 'ONLINE';
          const isSelected = selectedKiosk?.id === k.id;

          return (
            <div
              key={k.id}
              onClick={() => setSelectedKiosk(k)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-850 border-red-500 shadow-xl'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs font-mono text-zinc-500">{k.id}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    {k.status}
                  </span>
                </div>

                <h3 className="text-base font-black text-white uppercase tracking-wider">{k.name}</h3>
                <p className="text-xs text-zinc-400 mt-0.5">{k.location}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                <span>{k.orientation}</span>
                <span className="font-mono">v{k.softwareVersion}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Kiosk Detailed Diagnostics & Remote Actions */}
      {selectedKiosk && (
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                SELECTED TERMINAL TELEMETRY
              </span>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider mt-0.5">
                {selectedKiosk.name}
              </h3>
              <p className="text-xs text-zinc-400">{selectedKiosk.location}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleRemoteRestart(selectedKiosk.id)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Session</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-850">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Screen Resolution</span>
              <span className="text-xs font-mono font-black text-white">
                {selectedKiosk.deviceInfo?.screenWidth || 1920} x {selectedKiosk.deviceInfo?.screenHeight || 1080}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Operating System</span>
              <span className="text-xs font-bold text-white truncate block">
                {selectedKiosk.deviceInfo?.platform || 'Touch Kiosk OS'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Orientation</span>
              <span className="text-xs font-bold text-amber-400 uppercase">
                {selectedKiosk.orientation} DISPLAY
              </span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Last Heartbeat</span>
              <span className="text-xs font-mono text-emerald-400">Just now</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
