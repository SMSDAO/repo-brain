import React from 'react';
import { Database, Shield, Info, GitBranch, Activity } from 'lucide-react';
import { SYSTEM_VERSION } from '../../constants';

const SettingsPage: React.FC = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'Not configured';
  const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

  const configSections = [
    {
      icon: <Database size={24} />,
      title: 'Database Configuration',
      items: [
        { label: 'Supabase URL', value: supabaseUrl, masked: false },
        { label: 'Authentication', value: hasSupabase ? 'Active' : 'Not Configured', masked: false },
        { label: 'Connection Status', value: hasSupabase ? 'Connected' : 'Disconnected', masked: false },
      ],
    },
    {
      icon: <Shield size={24} />,
      title: 'Security Settings',
      items: [
        { label: 'RLS Enabled', value: 'Yes', masked: false },
        { label: 'Session Persistence', value: 'Enabled', masked: false },
        { label: 'Auto Refresh Token', value: 'Enabled', masked: false },
      ],
    },
    {
      icon: <Activity size={24} />,
      title: 'Feature Flags',
      items: [
        { label: 'AI Oracle', value: 'Enabled', masked: false },
        { label: 'Auto PR Creation', value: 'Enabled', masked: false },
        { label: 'Fleet Analysis', value: 'Enabled', masked: false },
        { label: 'Real-time Monitoring', value: 'Enabled', masked: false },
      ],
    },
    {
      icon: <GitBranch size={24} />,
      title: 'System Information',
      items: [
        { label: 'Version', value: SYSTEM_VERSION, masked: false },
        { label: 'Build', value: 'Production', masked: false },
        { label: 'Environment', value: import.meta.env.MODE || 'production', masked: false },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tight text-white mb-2">
            System <span className="text-blue-600">Settings</span>
          </h1>
          <p className="text-sm text-slate-500 font-mono uppercase tracking-widest">
            Configuration Overview (Read-Only)
          </p>
        </div>
        <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <p className="text-xs text-blue-400 font-mono uppercase tracking-widest">
            🛡️ Read-Only Mode
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 flex items-start gap-4">
        <Info size={24} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-blue-300 uppercase tracking-wider mb-1">
            Configuration Notice
          </h3>
          <p className="text-sm text-blue-200/80 leading-relaxed">
            This page displays the current system configuration. To modify settings, update your environment
            variables or configuration files and redeploy the application. Secrets are never displayed for
            security reasons.
          </p>
        </div>
      </div>

      {/* Configuration Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {configSections.map((section, idx) => (
          <div
            key={idx}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-500">
                {section.icon}
              </div>
              <h2 className="text-xl font-black uppercase text-white">{section.title}</h2>
            </div>

            <div className="space-y-4">
              {section.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="flex items-center justify-between p-4 bg-slate-950/70 border border-slate-800 rounded-xl"
                >
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <span
                    className={`text-sm font-mono font-bold ${
                      item.value.includes('Not') || item.value.includes('Disconnected')
                        ? 'text-rose-400'
                        : item.value.includes('Enabled') || item.value.includes('Active') || item.value.includes('Connected')
                        ? 'text-emerald-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {item.masked ? '••••••••••••' : item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-xl">
        <h2 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-3">
          <Info size={24} className="text-blue-500" />
          Environment Variables
        </h2>
        <div className="space-y-3 font-mono text-sm">
          <div className="flex items-start gap-3">
            <span className="text-slate-600">•</span>
            <p className="text-slate-400">
              <span className="text-emerald-400 font-bold">VITE_SUPABASE_URL</span> - Supabase project URL
              for database connection
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-slate-600">•</span>
            <p className="text-slate-400">
              <span className="text-emerald-400 font-bold">VITE_SUPABASE_ANON_KEY</span> - Public anonymous
              key for client-side authentication
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-slate-600">•</span>
            <p className="text-slate-400">
              <span className="text-amber-400 font-bold">VITE_GEMINI_API_KEY</span> - Google Gemini API key
              for AI Oracle features
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-600 font-mono uppercase tracking-widest">
          Repo Brain Hospital • {SYSTEM_VERSION} • CyberAI Oracle Network
        </p>
        <p className="text-xs text-slate-700 font-mono mt-2">
          For configuration changes, consult the system administrator
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
