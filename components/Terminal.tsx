
import React, { useEffect, useRef } from 'react';

interface Props {
  logs: string[];
  onClose: () => void;
}

const Terminal: React.FC<Props> = ({ logs, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col h-[500px]">
        <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <span className="text-xs font-mono text-slate-400">brain.run.sh — execution output</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div 
          ref={scrollRef}
          className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar bg-slate-950 text-emerald-400 space-y-1"
        >
          {logs.map((log, i) => (
            <div key={i} className={log.includes('⚠️') ? 'text-amber-400' : log.includes('✅') ? 'text-emerald-300 font-bold' : ''}>
              {log}
            </div>
          ))}
          <div className="animate-pulse inline-block w-2 h-4 bg-emerald-400 ml-1 translate-y-1"></div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
