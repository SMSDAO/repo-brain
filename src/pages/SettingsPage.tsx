import React, { useState } from 'react';
import { Settings, Bell, Shield, User, Key, Globe, Save, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRequireAuth } from '../hooks/useRequireAuth';

const SettingsPage: React.FC = () => {
  useRequireAuth();

  const { userProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'appearance'>('profile');

  const [form, setForm] = useState({
    displayName: userProfile?.email?.split('@')[0] ?? '',
    email: userProfile?.email ?? '',
    notifyAlerts: true,
    notifyRuns: false,
    notifySystem: true,
    theme: 'dark',
    language: 'en',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-widest">Settings</h1>
        <p className="text-slate-500 text-sm font-mono mt-1">Configure your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800">
        {([
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'appearance', label: 'Appearance', icon: Globe },
        ] as const).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
        {activeTab === 'profile' && (
          <>
            <h2 className="text-white font-bold flex items-center gap-2">
              <User size={16} className="text-blue-400" /> Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Display Name</label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Role</label>
                <div className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-400 font-mono">
                  {userProfile?.role ?? 'viewer'}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'notifications' && (
          <>
            <h2 className="text-white font-bold flex items-center gap-2">
              <Bell size={16} className="text-amber-400" /> Notifications
            </h2>
            <div className="space-y-4">
              {[
                { key: 'notifyAlerts', label: 'Security Alerts', description: 'Get notified when critical vulnerabilities are detected' },
                { key: 'notifyRuns', label: 'Run Completions', description: 'Notify when brain runs complete or fail' },
                { key: 'notifySystem', label: 'System Updates', description: 'Platform announcements and maintenance windows' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                  <div>
                    <p className="text-sm text-slate-300 font-medium">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                  <button
                    onClick={() => setForm(f => ({ ...f, [item.key]: !f[item.key as keyof typeof f] }))}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      form[item.key as keyof typeof form] ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      form[item.key as keyof typeof form] ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'security' && (
          <>
            <h2 className="text-white font-bold flex items-center gap-2">
              <Key size={16} className="text-red-400" /> Security
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-900/10 border border-blue-800/30 rounded-lg p-4 text-sm text-blue-400">
                Password changes are managed securely through Supabase Auth. Use the link below to reset your password.
              </div>
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 font-mono transition-colors">
                Send Password Reset Email
              </button>
              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-white text-sm font-bold mb-3">Active Sessions</h3>
                <div className="bg-slate-800/50 rounded-lg p-3 text-xs font-mono text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Current session (this device)</span>
                    <span className="text-emerald-400">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'appearance' && (
          <>
            <h2 className="text-white font-bold flex items-center gap-2">
              <Settings size={16} className="text-purple-400" /> Appearance
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Theme</label>
                <div className="flex gap-3">
                  {['dark', 'darker'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm(f => ({ ...f, theme: t }))}
                      className={`px-4 py-2 rounded-lg border text-sm font-mono transition-colors ${
                        form.theme === t
                          ? 'border-blue-500 bg-blue-600/10 text-blue-400'
                          : 'border-slate-700 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {t === 'dark' ? 'Neo Dark' : 'Abyss'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Language</label>
                <select
                  value={form.language}
                  onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Save button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
            }`}
          >
            {saved ? <Check size={14} /> : <Save size={14} />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
