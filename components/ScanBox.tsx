
import React, { useState } from 'react';

interface Props {
  onScanTrigger: (logs: string[]) => void;
}

const ScanBox: React.FC<Props> = ({ onScanTrigger }) => {
  const [repoPath, setRepoPath] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const startScan = (type: 'REPO' | 'PR') => {
    setIsScanning(true);
    
    const logs = type === 'REPO' ? [
      '🧠 [CAST BRAIN] Initiating grid discovery for: ' + (repoPath || './local-repo'),
      '📡 Phase 1: Environmental Check... OK',
      '🧬 Phase 2: Tech Stack Genome Identification...',
      '🧬 Detected: Node.js (v20), Hardhat (Solidity), TypeScript',
      '🛡️ Phase 3: Security Policy Enforcement...',
      '🛠️ Phase 8: Normalizing infrastructure configuration...',
      '✅ Phase 15: Local repository admission complete.',
      '📊 Generation complete. 100% MERMEDA alignment.'
    ] : [
      '🤖 [PR BOT] Intercepting Pull Request hook...',
      '🔍 Scanning diff for security regressions...',
      '⚠️ Warning: Potential subprocess pattern in src/runner.js',
      '🛠️ Auto-repairing workflow drift in PR branch...',
      '✅ PR Sanitization complete. Approval status: GRANTED.'
    ];

    setTimeout(() => {
      onScanTrigger(logs);
      setIsScanning(false);
      setRepoPath('');
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950/20 border-4 border-slate-800 rounded-[4rem] p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] select-none pointer-events-none group-hover:opacity-10 transition-opacity">
        <span className="text-[15rem] font-black italic tracking-tighter uppercase">ADMISSION</span>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-4 px-8 py-3 bg-blue-600/10 border border-blue-500/20 rounded-full mb-10">
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-400">Hospital Admission Portal</span>
        </div>
        
        <h2 className="text-6xl font-black text-white tracking-tighter mb-8 uppercase italic leading-[1.1]">
          Scan Repo for <br/><span className="text-blue-500">Full Governance Report</span>
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <input 
            type="text" 
            placeholder="Enter repo path or PR identifier..." 
            value={repoPath}
            onChange={(e) => setRepoPath(e.target.value)}
            className="flex-1 bg-slate-950/80 border-2 border-slate-800 rounded-[2.5rem] px-12 py-8 text-2xl font-bold text-white outline-none focus:border-blue-500/50 focus:ring-[20px] focus:ring-blue-500/5 transition-all placeholder:opacity-30"
          />
          <div className="flex gap-4">
            <button 
              onClick={() => startScan('REPO')}
              disabled={isScanning}
              className="bg-white text-slate-950 text-xs font-black uppercase tracking-widest px-12 py-8 rounded-[2.5rem] hover:bg-blue-400 transition-all active:scale-95 shadow-2xl disabled:opacity-50"
            >
              Scan Repo
            </button>
            <button 
              onClick={() => startScan('PR')}
              disabled={isScanning}
              className="bg-slate-800 text-white text-xs font-black uppercase tracking-widest px-12 py-8 rounded-[2.5rem] hover:bg-slate-700 transition-all active:scale-95 border border-slate-700 disabled:opacity-50"
            >
              Scan PR
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Auto-Fix', icon: '🛠️', status: 'Ready' },
            { label: 'Security', icon: '🛡️', status: 'Active' },
            { label: 'CI Repair', icon: '🚀', status: 'Ready' },
            { label: 'Forensics', icon: '🔍', status: 'Enabled' },
          ].map(bot => (
            <div key={bot.label} className="p-6 bg-slate-950/40 border border-slate-800/50 rounded-3xl flex flex-col items-center gap-2">
              <span className="text-3xl">{bot.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-100">{bot.label}</span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-500">{bot.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScanBox;
