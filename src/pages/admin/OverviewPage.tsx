import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Brain as BrainIcon, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { Brain, Alert, AlertSeverity } from '../../types/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const OverviewPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [brains, setBrains] = useState<Brain[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState({
    totalBrains: 0,
    greenBrains: 0,
    redBrains: 0,
    autoFixableBrains: 0,
    criticalAlerts: 0,
    unresolvedAlerts: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [brainsRes, alertsRes] = await Promise.all([
        supabase.from('brains').select('*').order('created_at', { ascending: false }),
        supabase.from('alerts').select('*').order('created_at', { ascending: false }).limit(50),
      ]);

      if (brainsRes.error) throw brainsRes.error;
      if (alertsRes.error) throw alertsRes.error;

      const brainsData = brainsRes.data || [];
      const alertsData = alertsRes.data || [];

      setBrains(brainsData);
      setAlerts(alertsData);

      setStats({
        totalBrains: brainsData.length,
        greenBrains: brainsData.filter((b) => b.status === 'green').length,
        redBrains: brainsData.filter((b) => b.status === 'red').length,
        autoFixableBrains: brainsData.filter((b) => b.status === 'auto_fixable').length,
        criticalAlerts: alertsData.filter((a) => a.severity === 'critical').length,
        unresolvedAlerts: alertsData.filter((a) => !a.resolved).length,
      });
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const alertsBySeverity = [
    { name: 'Critical', value: alerts.filter((a) => a.severity === 'critical').length, color: '#f43f5e' },
    { name: 'Pathological', value: alerts.filter((a) => a.severity === 'pathological').length, color: '#f59e0b' },
    { name: 'Warning', value: alerts.filter((a) => a.severity === 'warning').length, color: '#fbbf24' },
  ].filter((d) => d.value > 0);

  const recentActivity = alerts.slice(0, 10);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-mono uppercase tracking-widest">Loading Oracle Data...</p>
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
            Admin <span className="text-blue-600">Overview</span>
          </h1>
          <p className="text-sm text-slate-500 font-mono uppercase tracking-widest">Mission Control Dashboard</p>
        </div>
        <button
          onClick={fetchData}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<BrainIcon size={32} />}
          label="Total Brains"
          value={stats.totalBrains}
          color="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        <StatCard
          icon={<Activity size={32} />}
          label="Green Status"
          value={stats.greenBrains}
          color="text-emerald-500"
          bgColor="bg-emerald-500/10"
        />
        <StatCard
          icon={<TrendingUp size={32} />}
          label="Auto-Fixable"
          value={stats.autoFixableBrains}
          color="text-amber-500"
          bgColor="bg-amber-500/10"
        />
        <StatCard
          icon={<AlertTriangle size={32} />}
          label="Critical Alerts"
          value={stats.criticalAlerts}
          color="text-rose-500"
          bgColor="bg-rose-500/10"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alerts by Severity */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <h2 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-3">
            <AlertTriangle size={24} className="text-rose-500" />
            Alerts by Severity
          </h2>
          {alertsBySeverity.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={alertsBySeverity}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {alertsBySeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-600">
              <p className="font-mono uppercase tracking-wider">No alerts recorded</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <h2 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-3">
            <Activity size={24} className="text-blue-500" />
            Recent Activity
          </h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <SeverityBadge severity={alert.severity} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 font-medium truncate">{alert.message}</p>
                      <p className="text-xs text-slate-500 font-mono mt-1">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-600 font-mono uppercase tracking-wider py-8">
                No recent activity
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Health Distribution */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
        <h2 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-3">
          <BrainIcon size={24} className="text-blue-500" />
          Brain Health Distribution
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <HealthCard label="Green" count={stats.greenBrains} color="emerald" />
          <HealthCard label="Auto-Fixable" count={stats.autoFixableBrains} color="amber" />
          <HealthCard label="Red" count={stats.redBrains} color="rose" />
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}> = ({ icon, label, value, color, bgColor }) => (
  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
    <div className={`${bgColor} ${color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <div className={`text-4xl font-black ${color} mb-2`}>{value}</div>
    <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">{label}</div>
  </div>
);

const SeverityBadge: React.FC<{ severity: AlertSeverity }> = ({ severity }) => {
  const colors = {
    critical: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
    pathological: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  };

  return (
    <span
      className={`shrink-0 px-2 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${colors[severity]}`}
    >
      {severity}
    </span>
  );
};

const HealthCard: React.FC<{ label: string; count: number; color: string }> = ({ label, count, color }) => {
  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-500/5',
      border: 'border-emerald-500/20',
      text: 'text-emerald-500',
      subtext: 'text-emerald-400'
    },
    amber: {
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/20',
      text: 'text-amber-500',
      subtext: 'text-amber-400'
    },
    rose: {
      bg: 'bg-rose-500/5',
      border: 'border-rose-500/20',
      text: 'text-rose-500',
      subtext: 'text-rose-400'
    }
  };

  const classes = colorClasses[color as keyof typeof colorClasses];

  return (
    <div className={`${classes.bg} border ${classes.border} rounded-2xl p-6 text-center`}>
      <div className={`text-5xl font-black ${classes.text} mb-2`}>{count}</div>
      <div className={`text-sm ${classes.subtext} font-bold uppercase tracking-wider`}>{label}</div>
    </div>
  );
};

export default OverviewPage;
