
import React, { useState } from 'react';
import { AutopsyReport } from '../types';
import { RepoBrainAI } from '../services/geminiService';

interface Props {
  report: AutopsyReport;
  onClose: () => void;
}

const AutopsyModal: React.FC<Props> = ({ report, onClose }) => {
  const [selectedTrace, setSelectedTrace] = useState<string | null>(Object.keys(report.traces)[0]);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getInsight = async () => {
    setLoading(true);
    const ai = new RepoBrainAI();
    const res = await ai.analyzeAutopsy(report);
    setInsight(res);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[90vh]">
        <div className="bg-slate-800/50 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔪</span>
            <h2 className="text-lg font-black text-white tracking-tight uppercase italic">Brain Autopsy: {report.runId}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">✕</button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-slate-800 flex flex-col p-4 space-y-6 overflow-y-auto">
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Snapshots</h3>
              <div className="space-y-1">
                 {report.treeSnapshot.map(f => (
                   <div key={f} className="text-[10px] font-mono text-slate-400 truncate">{f}</div>
                 ))}
              </div>
            </section>
            
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Captured Logs</h3>
              <div className="space-y-1">
                {Object.keys(report.traces).map(name => (
                  <button 
                    key={name}
                    onClick={() => setSelectedTrace(name)}
                    className={`w-full text-left px-2 py-1.5 rounded text-[10px] font-mono transition-colors ${selectedTrace === name ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-auto pt-4 border-t border-slate-800">
               <button 
                onClick={getInsight}
                disabled={loading}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
               >
                 {loading ? 'Analyzing...' : 'Perform AI Autopsy'}
               </button>
            </section>
          </div>

          {/* Trace Content */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            {insight && (
              <div className="p-4 bg-emerald-500/5 border-b border-emerald-500/20 text-[11px] text-emerald-400 italic">
                <strong>Brain AI:</strong> {insight}
              </div>
            )}
            <div className="flex-1 p-6 font-mono text-xs overflow-y-auto custom-scrollbar text-slate-400 whitespace-pre">
               {selectedTrace ? (
                 <div className="animate-in fade-in duration-300">
                    <span className="text-blue-500"># Tracing {selectedTrace} execution flow...</span>
                    <br/><br/>
                    {report.traces[selectedTrace]}
                 </div>
               ) : (
                 <div className="h-full flex items-center justify-center text-slate-600 uppercase tracking-widest">Select a trace to begin analysis</div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutopsyModal;
