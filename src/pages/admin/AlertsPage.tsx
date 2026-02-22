import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { Alert, AlertSeverity, Brain } from '../../types/supabase';

interface AlertWithBrain extends Alert {
  brain?: Brain;
}

const AlertsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<AlertWithBrain[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<AlertWithBrain[]>([]);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [resolvedFilter, setResolvedFilter] = useState<string>('all');

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, search, severityFilter, resolvedFilter]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          brain:brains(repo)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const alertsWithBrain = (data || []).map((alert: any) => ({
        ...alert,
        brain: alert.brain,
      }));

      setAlerts(alertsWithBrain);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = alerts;

    if (search) {
      filtered = filtered.filter(
        (alert) =>
          alert.message.toLowerCase().includes(search.toLowerCase()) ||
          alert.file?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter((alert) => alert.severity === severityFilter);
    }

    if (resolvedFilter !== 'all') {
      const isResolved = resolvedFilter === 'resolved';
      filtered = filtered.filter((alert) => alert.resolved === isResolved);
    }

    setFilteredAlerts(filtered);
  };

  const handleResolve = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ resolved: true })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts((prev) =>
        prev.map((alert) => (alert.id === alertId ? { ...alert, resolved: true } : alert))
      );
    } catch (error) {
      console.error('Error resolving alert:', error);
      alert('Failed to resolve alert');
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/30';
      case 'pathological':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-mono uppercase tracking-widest">Loading Alerts...</p>
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
            Alert <span className="text-blue-600">Monitor</span>
          </h1>
          <p className="text-sm text-slate-500 font-mono uppercase tracking-widest">
            {filteredAlerts.length} of {alerts.length} Alerts
          </p>
        </div>
        <button
          onClick={fetchAlerts}
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
              Search Alerts
            </label>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by message or file..."
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all text-sm font-medium placeholder:text-slate-700"
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
              Severity
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-blue-500/50 transition-all text-sm font-bold uppercase cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="pathological">Pathological</option>
              <option value="warning">Warning</option>
            </select>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
              Status
            </label>
            <select
              value={resolvedFilter}
              onChange={(e) => setResolvedFilter(e.target.value)}
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-blue-500/50 transition-all text-sm font-bold uppercase cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-slate-900/60 border backdrop-blur-xl shadow-xl rounded-2xl p-6 transition-all ${
                alert.resolved ? 'border-slate-800 opacity-60' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-lg border text-xs font-black uppercase tracking-wider ${getSeverityColor(
                      alert.severity
                    )}`}
                  >
                    {alert.severity}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="text-sm font-medium text-slate-200 leading-relaxed">{alert.message}</p>
                    {!alert.resolved && (
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="shrink-0 flex items-center gap-2 px-4 py-2 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 rounded-lg transition-colors text-emerald-500 text-xs font-bold uppercase tracking-wider"
                      >
                        <CheckCircle size={14} />
                        Resolve
                      </button>
                    )}
                    {alert.resolved && (
                      <span className="shrink-0 flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle size={14} />
                        Resolved
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-mono">
                    {alert.brain && (
                      <span className="flex items-center gap-1">
                        <span className="text-slate-600">Brain:</span>
                        <span className="text-blue-400">{alert.brain.repo}</span>
                      </span>
                    )}
                    {alert.file && (
                      <span className="flex items-center gap-1">
                        <span className="text-slate-600">File:</span>
                        <span className="text-slate-400">{alert.file}</span>
                        {alert.line && <span className="text-slate-600">:{alert.line}</span>}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <span className="text-slate-600">Created:</span>
                      <span className="text-slate-400">{new Date(alert.created_at).toLocaleString()}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-16 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-slate-700" />
            <p className="text-slate-600 font-mono uppercase tracking-wider">
              No alerts found matching your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
