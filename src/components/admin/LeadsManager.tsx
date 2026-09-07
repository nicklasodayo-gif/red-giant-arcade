import React, { useState, useEffect } from 'react';
import { Lead } from '../../types';
import { ApiClient } from '../../services/api';
import { Users, Download, Search, CheckCircle2, ShieldCheck } from 'lucide-react';

export const LeadsManager: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeads = async () => {
    try {
      const data = await ApiClient.getLeads();
      setLeads(data);
    } catch {}
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filtered = leads.filter((l) => {
    const term = searchTerm.toLowerCase();
    return (
      (l.name && l.name.toLowerCase().includes(term)) ||
      (l.playerAlias && l.playerAlias.toLowerCase().includes(term)) ||
      (l.phone && l.phone.includes(term)) ||
      (l.normalizedPhone && l.normalizedPhone.includes(term))
    );
  });

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ['ID', 'Alias', 'Name', 'Phone', 'Normalized Phone', 'Email', 'Score', 'Consent', 'Created At'];
    const rows = filtered.map((l) => [
      l.id,
      `"${l.playerAlias || ''}"`,
      `"${l.name || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.normalizedPhone || ''}"`,
      `"${l.email || ''}"`,
      l.scoreAchieved,
      l.consentGiven ? 'TRUE' : 'FALSE',
      `"${l.createdAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
            LEADS & CRM REPOSITORY
          </h2>
          <p className="text-xs text-zinc-400">
            Export opt-in participant records with verified Kenyan (+254) numbers and consent audit timestamps.
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={filtered.length === 0}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV ({filtered.length})</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, handle, or mobile number..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white outline-none focus:border-red-500"
          />
        </div>
        <span className="text-xs text-zinc-500 font-mono font-bold">
          {filtered.length} lead(s) loaded
        </span>
      </div>

      {/* Leads Table */}
      <div className="w-full rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3.5">Alias / Handle</th>
                <th className="px-5 py-3.5">Full Name</th>
                <th className="px-5 py-3.5">Normalized Phone (KE)</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Score Achieved</th>
                <th className="px-5 py-3.5">Consent Audit</th>
                <th className="px-5 py-3.5">Recorded At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-zinc-500 font-bold">
                    No leads matching search query
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-850/60 transition-colors">
                    <td className="px-5 py-4 font-mono font-black text-white">{lead.playerAlias}</td>
                    <td className="px-5 py-4 font-bold text-zinc-200">{lead.name || '—'}</td>
                    <td className="px-5 py-4 font-mono text-emerald-400 font-bold">
                      {lead.normalizedPhone || lead.phone || '—'}
                    </td>
                    <td className="px-5 py-4 text-zinc-400">{lead.email || '—'}</td>
                    <td className="px-5 py-4 font-mono text-amber-400 font-black">{lead.scoreAchieved} pts</td>
                    <td className="px-5 py-4">
                      {lead.consentGiven ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Opted In
                        </span>
                      ) : (
                        <span className="text-zinc-600">None</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-zinc-500 font-mono text-[11px]">
                      {new Date(lead.createdAt).toLocaleDateString()}
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
