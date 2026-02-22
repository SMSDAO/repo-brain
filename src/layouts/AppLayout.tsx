import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, LayoutDashboard, Activity, Shield, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, signOut, isAdmin } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, requireAdmin: false },
    ...(isAdmin ? [
      { path: '/admin/overview', label: 'Admin Overview', icon: Activity, requireAdmin: true },
      { path: '/admin/brains', label: 'Brains', icon: Brain, requireAdmin: true },
      { path: '/admin/alerts', label: 'Alerts', icon: Shield, requireAdmin: true },
      { path: '/admin/settings', label: 'Settings', icon: Settings, requireAdmin: true },
    ] : [])
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-inter">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-900">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-blue-600 to-emerald-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                🧠
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight uppercase italic">
                  HOSPITAL <span className="text-blue-600">V2.2</span>
                </h1>
                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">CyberAI Oracle</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-300">{userProfile?.email}</span>
              <span className="text-xs text-slate-500 uppercase font-mono tracking-widest">{userProfile?.role}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm font-bold uppercase tracking-wider"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-[73px] left-0 bottom-0 w-64 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800 transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm uppercase tracking-wider ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-[73px] min-h-screen">
        <div className="p-4 sm:p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
