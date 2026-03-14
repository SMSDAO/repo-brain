import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Shield, Activity, Zap, GitBranch, BarChart2, Lock, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SYSTEM_VERSION } from '../constants';

const HomePage: React.FC = () => {
  const { userProfile } = useAuth();

  const features = [
    {
      icon: Brain,
      title: 'Autonomous Governance',
      description: 'AI-powered repository analysis, diagnosis, and self-healing workflows.',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      icon: Shield,
      title: 'Security Hardening',
      description: 'Continuous vulnerability scanning, secret detection, and audit logs.',
      color: 'from-emerald-600 to-teal-600',
    },
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description: 'Live health metrics, vitals, and CI/CD pipeline status across your fleet.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: GitBranch,
      title: 'CI/CD Automation',
      description: 'Automated pipeline repair, dependency updates, and release preparation.',
      color: 'from-purple-600 to-pink-600',
    },
    {
      icon: BarChart2,
      title: 'Analytics Dashboard',
      description: 'Deep insights into repository health, risk scores, and remediation trends.',
      color: 'from-cyan-600 to-blue-600',
    },
    {
      icon: Lock,
      title: 'RBAC Access Control',
      description: 'Role-based access for Admin, Developer, User, and Auditor roles.',
      color: 'from-red-600 to-rose-600',
    },
  ];

  return (
    <div className="min-h-full bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest mb-8">
            <Zap size={12} className="animate-pulse" />
            Repo Brain Hospital {SYSTEM_VERSION} · CyberAI Oracle
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6">
            Enterprise{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Repository
            </span>{' '}
            Governance
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Autonomous diagnosis, security hardening, and self-healing for your entire GitHub fleet.
            From CI failures to vulnerabilities — detected, analyzed, and resolved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
            >
              <LayoutDashboardIcon size={18} />
              Open Dashboard
            </Link>
            {userProfile?.role === 'admin' && (
              <Link
                to="/admin/overview"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white font-bold uppercase tracking-wider transition-all duration-200"
              >
                <Shield size={18} />
                Admin Console
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Status banner */}
      <section className="px-6 mb-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'System Status', value: 'Operational', color: 'text-emerald-400' },
            { label: 'Version', value: SYSTEM_VERSION, color: 'text-blue-400' },
            { label: 'Logged in as', value: userProfile?.role?.toUpperCase() ?? 'Guest', color: 'text-indigo-400' },
            { label: 'Protocol', value: 'MERMEDA v2.0', color: 'text-amber-400' },
          ].map((item) => (
            <div key={item.label} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500 uppercase font-mono tracking-widest mb-1">{item.label}</p>
              <p className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-white text-center uppercase tracking-widest mb-2">
            Platform Capabilities
          </h2>
          <p className="text-slate-500 text-center text-sm font-mono mb-10">
            Enterprise-grade repository intelligence
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group bg-slate-900/50 border border-slate-800 hover:border-slate-600 rounded-xl p-6 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto border-t border-slate-800 pt-10">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link to="/docs" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <Globe size={14} />
              Documentation
            </Link>
            <Link to="/developer" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <Activity size={14} />
              Developer Tools
            </Link>
            <Link to="/settings" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <Shield size={14} />
              Settings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Inline icon to avoid extra import
const LayoutDashboardIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

export default HomePage;
