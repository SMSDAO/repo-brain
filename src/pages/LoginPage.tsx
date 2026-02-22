import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="w-full">
      {/* Logo Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 via-blue-600 to-emerald-600 rounded-3xl mb-4 animate-pulse shadow-2xl shadow-blue-500/30">
          <span className="text-5xl">🧠</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic mb-2">
          HOSPITAL <span className="text-blue-600">V2.2</span>
        </h1>
        <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">
          CyberAI Oracle Access
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              <AlertCircle size={20} className="text-rose-500 shrink-0" />
              <p className="text-sm text-rose-300 font-medium">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all text-sm font-medium placeholder:text-slate-700"
                placeholder="operator@cyberai.network"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">
              Access Key
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all text-sm font-medium placeholder:text-slate-700"
                placeholder="Enter secure access key"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-500/20 text-sm"
          >
            {loading ? 'Authenticating...' : 'Initialize Access'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-600 font-mono uppercase tracking-wider">
            Secured by <span className="text-blue-500">MERMEDA Protocol</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-700 font-mono uppercase tracking-widest">
          Repo Brain Hospital • V2.2.0 • CyberAI Network
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
