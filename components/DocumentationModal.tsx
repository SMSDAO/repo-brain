
import React from 'react';

interface Props {
  onClose: () => void;
}

const DocumentationModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-[3rem] overflow-hidden flex flex-col h-[90vh]">
        <div className="bg-slate-800/30 px-10 py-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-4">
            <span className="text-3xl">📜</span>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">MERMEDA v1.1.0 Canonical Spec</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-2xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar text-slate-300 font-medium leading-relaxed">
          <section className="space-y-6">
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic border-b border-slate-800 pb-4">1. Vision & Governance</h3>
            <p>
              The `.repo-brain` is a living, autonomous governance engine designed to enforce structural integrity and security across a fleet of polyglot repositories. 
              It operates on the principle of <strong>Plumbing First, Intent Second</strong> — automatically fixing configuration and CI drift while strictly preserving business logic.
            </p>
          </section>

          <section className="space-y-6">
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase border-l-4 border-blue-600 pl-6">2. 15-Phase Orchestration Loop</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'P1-3: Detection', desc: 'Auto-detecting languages, frameworks, and existing CI setups.' },
                { title: 'P4-7: Mapping', desc: 'Correlating tech genome to expected CI/CD command matrix.' },
                { title: 'P8: Normalization', desc: 'Syncing workflow templates and structure from brain core.' },
                { title: 'P9: Diagnosis', desc: 'Evaluating health state into GREEN, AUTO_FIXABLE, or RED.' },
                { title: 'P10: Safe Fixes', desc: 'Applying non-logic patches (permissions, missing gitignores).' },
                { title: 'P11: Verification', desc: 'Executing actual build/test commands to confirm sanity.' },
                { title: 'P12: AI Guard', desc: 'Security scanning for leaked secrets and unsafe subprocesses.' },
                { title: 'P13: Greenlock', desc: 'Integrity locking of green states to prevent local drift.' },
                { title: 'P14-15: Fleet', desc: 'Aggregating results into fleet telemetry for Mission Control.' },
              ].map(p => (
                <div key={p.title} className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <h4 className="text-blue-400 font-black uppercase text-xs mb-2 tracking-widest">{p.title}</h4>
                  <p className="text-xs text-slate-400">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
             <h3 className="text-2xl font-black text-white tracking-tighter uppercase border-l-4 border-emerald-600 pl-6">3. Operational Integrity Tools</h3>
             <ul className="space-y-4">
               <li><strong>brain.doctor.sh</strong>: Validates the health of the management scripts themselves (jq, node fallback, permissions).</li>
               <li><strong>brain.autopsy.sh</strong>: Captures forensic execution traces (`set -x`) for deep failure debugging.</li>
               <li><strong>brain.genome.sh</strong>: Compares management versions to map the evolution of the governance logic.</li>
               <li><strong>brain.immunizer.sh</strong>: SHA-256 integrity check to ensure no manual mutations have occurred in core scripts.</li>
             </ul>
          </section>

          <section className="space-y-6">
             <h3 className="text-2xl font-black text-white tracking-tighter uppercase border-l-4 border-rose-600 pl-6">4. Safety & Security Rules</h3>
             <div className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-3xl">
                <p className="text-rose-400 font-black uppercase text-xs mb-4 tracking-widest">Mandatory Constraints:</p>
                <ul className="list-disc list-inside space-y-2 text-xs text-rose-300 font-semibold italic">
                  <li>Never modify business logic, tests, or domain code.</li>
                  <li>No silent dependency upgrades.</li>
                  <li>Always use JQ with Node fallback for cross-platform stability.</li>
                  <li>Phase 12 (AI Guard) must flag subprocess/os.system and hardcoded secrets.</li>
                </ul>
             </div>
          </section>
        </div>

        <div className="p-10 bg-slate-800/20 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-2xl transition-all uppercase tracking-widest shadow-2xl shadow-blue-500/30"
          >
            Acknowledge Spec
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentationModal;
