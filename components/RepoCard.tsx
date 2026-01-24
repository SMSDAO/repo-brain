
import React, { useState } from 'react';
import { Diagnosis } from '../types';
import StatusBadge from './StatusBadge';
import { RepoBrainAI } from '../services/geminiService';

interface Props {
  repo: Diagnosis;
  onViewLogs: (logs: string[]) => void;
}

const RepoCard: React.FC<Props> = ({ repo, onViewLogs }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    const ai = new RepoBrainAI();
    const result = await ai.analyzeRepo(repo);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="group bg-slate-900/40 border border-slate-800/80 rounded-3xl p-7 hover:border-blue-500/50 hover:bg-slate-900/60 transition-all duration-500 flex flex-col shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/5">
            {repo.languages.includes('solidity') ? '⛓️' : repo.languages.includes('python') ? '🐍' : '📦'}
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">{repo.repo}</h3>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
              {repo.framework !== 'none' ? repo.framework : 'Standalone'} Node
            </p>
          </div>
        </div>
        <StatusBadge status={repo.status} />
      </div>

      <p className="text-slate-400 text-sm mb-6 font-medium leading-relaxed">{repo.reason}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-black mb-2">Stack Genome</p>
          <div className="flex flex-wrap gap-2">
            {repo.languages.map(l => (
              <span key={l} className="text-[9px] text-blue-400 font-mono font-bold px-2 py-0.5 bg-blue-500/5 rounded border border-blue-500/10 uppercase">{l}</span>
            ))}
          </div>
        </div>
        <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-black mb-2">Active Jobs</p>
          <p className="text-[10px] text-slate-400 font-mono truncate">
            {repo.workflows?.join(' • ') || 'No CI detected'}
          </p>
        </div>
      </div>

      {repo.aiGuardComments && repo.aiGuardComments.length > 0 && (
        <div className="mb-6 animate-pulse">
          <p className="text-[10px] uppercase tracking-[0.3em] text-rose-500 font-black mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> AI Guard Alerts
          </p>
          <div className="space-y-2">
            {repo.aiGuardComments.map((comment, i) => (
              <div key={i} className="text-[10px] text-rose-300 bg-rose-500/5 border border-rose-500/20 p-3 rounded-xl font-semibold">
                {comment}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-slate-800/50">
        <div className="flex gap-3">
          <button
            onClick={fetchInsight}
            disabled={loading}
            className="flex-1 py-3 bg-blue-600/90 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
          >
            {loading ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : '✨ Brain Insight'}
          </button>
          <button
            onClick={() => onViewLogs(repo.lastRunLogs || [])}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
          >
            📟 Logs
          </button>
        </div>
        
        {insight && (
          <div className="bg-slate-950/80 border border-blue-500/30 p-4 rounded-2xl text-[11px] text-slate-300 leading-relaxed font-medium italic animate-in fade-in slide-in-from-top-2">
            <div className="font-black text-blue-400 mb-2 flex items-center gap-2 uppercase tracking-[0.2em]">
              <span className="text-sm">🧠</span> Strategic Advisory
            </div>
            {insight}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoCard;
