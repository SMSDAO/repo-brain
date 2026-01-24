
import React, { useState } from 'react';
import { BlackboxRecording } from '../types';
import { RepoBrainAI } from '../services/geminiService';

interface Props {
  recording: BlackboxRecording;
  onClose: () => void;
}

const BlackboxModal: React.FC<Props> = ({ recording, onClose }) => {
  const [activeTab, setActiveTab] = useState<'trace' | 'env' | 'git'>('trace');
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getInsight = async () => {
    setLoading(true);
    const ai = new RepoBrainAI();
    const res = await ai.analyzeBlackbox(recording);
    setInsight(res);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col h-[90vh]">
        <div className="bg-slate-800/50 px-8 py-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-4">
            <span className="text-3xl">📼</span>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase italic">Blackbox Recording</h2>
              <p className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase mt-1">ID: {recording.runId} • Captured: {new Date(recording.timestamp).toLocaleString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl">✕</button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Navigation */}
          <div className="w-56 border-r border-slate-800 p-6 flex flex-col gap-3 bg-slate-900/50">
            <button 
              onClick={() => setActiveTab('trace')}
              className={`px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'trace' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:bg-slate-800'}`}
            >
              Trace Log
            </button>
            <button 
              onClick={() => setActiveTab('env')}
              className={`px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'env' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:bg-slate-800'}`}
            >
              Env Snapshot
            </button>
            <button 
              onClick={() => setActiveTab('git')}
              className={`px-4 py-3 rounded-xl text-left text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'git' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:bg-slate-800'}`}
            >
              Git State
            </button>

            <div className="mt-auto pt-6 border-t border-slate-800">
              <button 
                onClick={getInsight}
                disabled={loading}
                className="w-full py-4 bg-slate-950 border border-slate-800 hover:border-blue-500/50 text-slate-400 hover:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all"
              >
                {loading ? 'Replaying...' : 'AI Forensic Replay'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            {insight && (
              <div className="p-6 bg-blue-500/5 border-b border-blue-500/20 text-xs text-blue-300 font-medium italic animate-in fade-in slide-in-from-top-4">
                <span className="font-black text-blue-500 uppercase not-italic mr-2">Advisory:</span>
                {insight}
              </div>
            )}
            <div className="flex-1 p-8 font-mono text-[13px] overflow-y-auto custom-scrollbar text-emerald-500/80 whitespace-pre leading-relaxed">
              {activeTab === 'trace' && <div className="animate-in fade-in duration-300"><span className="text-emerald-300 font-bold">$ set -x; ./brain.run.sh</span><br/><br/>{recording.trace}</div>}
              {activeTab === 'env' && <div className="animate-in fade-in duration-300 text-slate-400">{recording.env}</div>}
              {activeTab === 'git' && (
                <div className="animate-in fade-in duration-300 space-y-8">
                  <div>
                    <span className="text-blue-400 font-black uppercase tracking-widest text-[10px] mb-4 block">Status</span>
                    <div className="text-slate-400">{recording.gitStatus}</div>
                  </div>
                  <div>
                    <span className="text-blue-400 font-black uppercase tracking-widest text-[10px] mb-4 block">Recent History</span>
                    <div className="text-slate-500">{recording.gitLog}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlackboxModal;
