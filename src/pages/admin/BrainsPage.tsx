import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, Eye, Activity, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { Brain } from '../../types/supabase';

const BrainsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [brains, setBrains] = useState<Brain[]>([]);
  const [filteredBrains, setFilteredBrains] = useState<Brain[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchBrains();
  }, []);

  useEffect(() => {
    filterBrains();
  }, [brains, search, statusFilter]);

  const fetchBrains = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('brains')
        .select('*')
        .order('last_scan_at', { ascending: false, nullsFirst: false });

      if (error) throw error;
      setBrains(data || []);
    } catch (error) {
      console.error('Error fetching brains:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBrains = () => {
    let filtered = brains;

    if (search) {
      filtered = filtered.filter((brain) =>
        brain.repo.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((brain) => brain.status === statusFilter);
    }

    setFilteredBrains(filtered);
  };

  const handleRescan = async (brainId: string) => {
    alert(`Triggering re-scan for brain ${brainId} (feature coming soon)`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      case 'auto_fixable':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'red':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/30';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-rose-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-emerald-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-mono uppercase tracking-widest">Loading Brains...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tight text-white mb-2">
            Brain <span className="text-blue-600">Registry</span>
          </h1>
          <p className="text-sm text-slate-500 font-mono uppercase tracking-widest">
            {filteredBrains.length} of {brains.length} Brains
          </p>
        </div>
        <button
          onClick={fetchBrains}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
              Search Repos
            </label>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by repository name..."
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all text-sm font-medium placeholder:text-slate-700"
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-blue-500/50 transition-all text-sm font-bold uppercase cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="green">Green</option>
              <option value="auto_fixable">Auto-Fixable</option>
              <option value="red">Red</option>
            </select>
          </div>
        </div>
      </div>

      {/* Brains Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                  Repository
                </th>
                <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                  Risk Score
                </th>
                <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                  Framework
                </th>
                <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                  Last Scan
                </th>
                <th className="text-right px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBrains.length > 0 ? (
                filteredBrains.map((brain) => (
                  <tr
                    key={brain.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm font-bold text-slate-200">{brain.repo}</div>
                      {brain.languages && brain.languages.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {brain.languages.slice(0, 3).map((lang, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded font-mono"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-lg border text-xs font-black uppercase tracking-wider ${getStatusColor(
                          brain.status
                        )}`}
                      >
                        {brain.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-2xl font-black ${getRiskColor(brain.risk_score)}`}>
                        {brain.risk_score}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400 font-mono">
                        {brain.framework || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500 font-mono">
                        {brain.last_scan_at
                          ? new Date(brain.last_scan_at).toLocaleString()
                          : 'Never'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRescan(brain.id)}
                          className="p-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 rounded-lg transition-colors"
                          title="Trigger Re-scan"
                        >
                          <Activity size={16} className="text-blue-500" />
                        </button>
                        <button
                          className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} className="text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <AlertCircle size={48} className="mx-auto mb-4 text-slate-700" />
                    <p className="text-slate-600 font-mono uppercase tracking-wider">
                      No brains found matching your filters
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BrainsPage;
