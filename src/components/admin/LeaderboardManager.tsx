import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../../types';
import { ApiClient } from '../../services/api';
import { GameRegistry } from '../../games/registry';
import { Trophy, RefreshCw, Filter } from 'lucide-react';

export const LeaderboardManager: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>('all');
  const games = GameRegistry.getAllDefinitions();

  const fetchScores = async () => {
    try {
      const data = await ApiClient.getLeaderboard(selectedGameId === 'all' ? undefined : selectedGameId);
      setEntries(data);
    } catch {}
  };

  useEffect(() => {
    fetchScores();
  }, [selectedGameId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
            GLOBAL LEADERBOARDS & SCORES
          </h2>
          <p className="text-xs text-zinc-400">
            Audit competitive standings, filter by arcade trial, and inspect player scores.
          </p>
        </div>

        <button
          onClick={fetchScores}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Scores</span>
        </button>
      </div>

      {/* Game Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedGameId('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap ${
            selectedGameId === 'all' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          All Games
        </button>
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGameId(g.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap ${
              selectedGameId === g.id ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="w-full rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3.5">Rank</th>
                <th className="px-5 py-3.5">Player Alias</th>
                <th className="px-5 py-3.5">Arcade Game</th>
                <th className="px-5 py-3.5">Score</th>
                <th className="px-5 py-3.5">Difficulty</th>
                <th className="px-5 py-3.5">Achieved At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500 font-bold">
                    No scores recorded yet
                  </td>
                </tr>
              ) : (
                entries.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-zinc-850/60 transition-colors">
                    <td className="px-5 py-4 font-mono font-black">
                      {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                    </td>
                    <td className="px-5 py-4 font-mono font-black text-white">{item.playerAlias}</td>
                    <td className="px-5 py-4 uppercase font-bold text-zinc-300">
                      {item.gameId.replace('-', ' ')}
                    </td>
                    <td className="px-5 py-4 font-mono text-amber-400 font-black text-sm">
                      {item.score} pts
                    </td>
                    <td className="px-5 py-4 font-bold text-zinc-400">{item.difficulty || 'MEDIUM'}</td>
                    <td className="px-5 py-4 text-zinc-500 font-mono text-[11px]">
                      {new Date(item.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
