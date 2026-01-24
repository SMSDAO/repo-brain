
import React, { useState, useMemo } from 'react';
import { RepoStatus, Diagnosis } from './types';
import { FLEET_SUMMARY, MOCK_HEALTH_REPORT, MOCK_GENOME, MOCK_AUTOPSY, MOCK_IMMUNIZER, MOCK_VITALS, MOCK_BLACKBOX, MOCK_FIREWALL } from './constants';
import RepoCard from './components/RepoCard';
import Terminal from './components/Terminal';
import HealthReportModal from './components/HealthReportModal';
import GenomeModal from './components/GenomeModal';
import AutopsyModal from './components/AutopsyModal';
import ImmunizerModal from './components/ImmunizerModal';
import DocumentationModal from './components/DocumentationModal';
import VitalsModal from './components/VitalsModal';
import BlackboxModal from './components/BlackboxModal';
import FirewallModal from './components/FirewallModal';
import ScanBox from './components/ScanBox';
import { RepoBrainAI } from './services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const App: React.FC = () => {
  const [fleet] = useState(FLEET_SUMMARY.repos);
  const [filter, setFilter] = useState<RepoStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [fleetStrategy, setFleetStrategy] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeLogs, setActiveLogs] = useState<string[] | null>(null);

  // Modals state
  const [showHealth, setShowHealth] = useState(false);
  const [showGenome, setShowGenome] = useState(false);
  const [showAutopsy, setShowAutopsy] = useState(false);
  const [showImmunizer, setShowImmunizer] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [showVitals, setShowVitals] = useState(false);
  const [showBlackbox, setShowBlackbox] = useState(false);
  const [showFirewall, setShowFirewall] = useState(false);

  const counts = useMemo(() => ({
    [RepoStatus.GREEN]: fleet.filter(r => r.status === RepoStatus.GREEN).length,
    [RepoStatus.AUTO_FIXABLE]: fleet.filter(r => r.status === RepoStatus.AUTO_FIXABLE).length,
    [RepoStatus.RED]: fleet.filter(r => r.status === RepoStatus.RED).length,
    [RepoStatus.UNKNOWN]: fleet.filter(r => r.status === RepoStatus.UNKNOWN).length,
  }), [fleet]);

  const chartData = useMemo(() => [
    { name: 'Nominal', value: counts[RepoStatus.GREEN], color: '#10b981' },
    { name: 'Drifted', value: counts[RepoStatus.AUTO_FIXABLE], color: '#f59e0b' },
    { name: 'Critical', value: counts[RepoStatus.RED], color: '#f43f5e' },
    { name: 'Unknown', value: counts[RepoStatus.UNKNOWN], color: '#64748b' },
  ].filter(d => d.value > 0), [counts]);

  const filteredRepos = useMemo(() => {
    return fleet.filter(r => {
      const matchesFilter = filter === 'ALL' || r.status === filter;
      const matchesSearch = r.repo.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [fleet, filter, search]);

  const handleFleetAnalysis = async () => {
    setIsAnalyzing(true);
    const ai = new RepoBrainAI();
    const strategy = await ai.getFleetHealthOverview(fleet);
    setFleetStrategy(strategy);
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-12 lg:px-16 bg-slate-950 min-h-screen text-slate-100 font-inter selection:bg-blue-500/30 overflow-x-hidden">
      {/* Overlays */}
      {activeLogs && <Terminal logs={activeLogs} onClose={() => setActiveLogs(null)} />}
      {showHealth && <HealthReportModal report={MOCK_HEALTH_REPORT} onClose={() => setShowHealth(false)} />}
      {showGenome && <GenomeModal report={MOCK_GENOME} onClose={() => setShowGenome(false)} />}
      {showAutopsy && <AutopsyModal report={MOCK_AUTOPSY} onClose={() => setShowAutopsy(false)} />}
      {showImmunizer && <ImmunizerModal report={MOCK_IMMUNIZER} onClose={() => setShowImmunizer(false)} />}
      {showDocs && <DocumentationModal onClose={() => setShowDocs(false)} />}
      {showVitals && <VitalsModal vitals={MOCK_VITALS} onClose={() => setShowVitals(false)} />}
      {showBlackbox && <BlackboxModal recording={MOCK_BLACKBOX} onClose={() => setShowBlackbox(false)} />}
      {showFirewall && <FirewallModal report={MOCK_FIREWALL} onClose={() => setShowFirewall(false)} />}

      <header className="mb-20 flex flex-col lg:flex-row lg:items-center justify-between gap-12 border-b border-slate-900 pb-12">
        <div className="flex items-center gap-10">
          <div className="relative group cursor-pointer" onClick={() => setShowDocs(true)}>
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-blue-800 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl shadow-blue-500/40 group-hover:scale-105 transition-all duration-700 border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-10 animate-pulse"></div>
              🧠
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-950 animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.8)]"></div>
          </div>
          <div>
            <h1 className="text-7xl font-black tracking-tighter text-white uppercase italic leading-none drop-shadow-2xl">CAST BRAIN</h1>
            <div className="flex items-center gap-5 mt-5 text-[12px] text-slate-500 font-mono tracking-[0.5em] font-bold uppercase">
              <span className="text-blue-500 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                CyberAI Network
              </span>
              <span className="opacity-20">/</span>
              <span className="text-emerald-400">Hospital_Command_v1.1</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <a href="https://github.com/SolanaRemix/repo-brain" target="_blank" rel="noopener noreferrer" className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-[2rem] px-8 py-7 flex items-center gap-4 transition-all group">
            <span className="text-2xl">🐙</span>
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white">GitHub Source</span>
          </a>
          <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] px-10 py-7 flex items-center justify-center backdrop-blur-3xl shadow-2xl border-white/5">
             <div className="text-center">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-1 opacity-40">Security Status</p>
                <span className="text-emerald-500 font-mono font-black text-xs uppercase">Firewall Shield Active</span>
             </div>
          </div>
        </div>
      </header>

      {/* Hero: Grid Admission Scan */}
      <section className="mb-24">
        <ScanBox onScanTrigger={(logs) => setActiveLogs(logs)} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-24">
        {/* Telemetry */}
        <div className="lg:col-span-3 bg-slate-900/40 border border-slate-800 rounded-[3.5rem] p-12 flex flex-col items-center justify-center backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-500 mb-12 w-full text-center relative z-10">Fleet Telemetry</h2>
          <div className="h-64 w-full relative z-10">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-3">
              <span className="text-8xl font-black text-white tracking-tighter drop-shadow-2xl">{fleet.length}</span>
              <span className="text-[12px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2">Endpoints</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={90} outerRadius={115} paddingAngle={15} dataKey="value" stroke="none">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-14 w-full border-t border-slate-800/50 pt-10 relative z-10">
            {chartData.map(item => (
              <div key={item.name} className="flex flex-col items-center">
                <span className="text-[10px] text-slate-600 font-black uppercase mb-3 tracking-widest">{item.name}</span>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-2xl text-white font-mono font-black">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Grid */}
        <div className="lg:col-span-6 bg-slate-900/40 border border-slate-800 rounded-[3.5rem] p-16 backdrop-blur-2xl flex flex-col shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none select-none">
            <span className="text-[20rem] font-black italic tracking-tighter uppercase">CAST</span>
          </div>
          <div className="flex items-center justify-between mb-16 relative z-10">
            <div className="flex flex-col">
              <h2 className="text-[14px] font-black uppercase tracking-[0.6em] text-slate-500 flex items-center gap-6">
                <span className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] animate-pulse"></span>
                Operational Control Plane
              </h2>
              <p className="text-[16px] text-slate-400 mt-5 font-bold tracking-tight opacity-70 italic">Execute autonomous governance modules.</p>
            </div>
            <button 
              onClick={() => setActiveLogs([
                '🧠 [CAST BRAIN] Full Orchestration sequence initiated...',
                '📡 Synchronizing fleet nodes...',
                '🛠️ Repairing known drift in 3 repos...',
                '✅ Sequential healing completed.'
              ])}
              className="bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-black uppercase tracking-[0.3em] px-12 py-6 rounded-[2rem] shadow-2xl shadow-blue-500/40 transition-all active:scale-95 border border-blue-400/30"
            >
              Orchestrate
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
            {[
              { label: 'Doctor', icon: '🩺', desc: 'Health Audit', action: () => setShowHealth(true) },
              { label: 'Firewall', icon: '🔥', desc: 'Commit Guard', action: () => setShowFirewall(true) },
              { label: 'Blackbox', icon: '📼', desc: 'Trace Replay', action: () => setShowBlackbox(true) },
              { label: 'Vitals', icon: '📊', desc: 'Performance', action: () => setShowVitals(true) },
              { label: 'Autopsy', icon: '🔪', desc: 'Forensic Log', action: () => setShowAutopsy(true) },
              { label: 'Genome', icon: '🧬', desc: 'Logic Diff', action: () => setShowGenome(true) },
              { label: 'Integrity', icon: '🛡️', desc: 'Lock Core', action: () => setShowImmunizer(true) },
              { label: 'Surgeon', icon: '💉', desc: 'Repair Module', action: () => {} },
              { label: 'Spec', icon: '📜', desc: 'MERMEDA v1.1', action: () => setShowDocs(true) }
            ].map((op) => (
              <button
                key={op.label}
                onClick={op.action}
                className="flex flex-col items-center justify-center text-center gap-3 p-8 bg-slate-950/70 border border-slate-800 rounded-[2.5rem] hover:border-blue-500/60 hover:bg-slate-950/90 transition-all group active:scale-95 shadow-inner"
              >
                <span className="text-4xl group-hover:scale-125 transition-transform duration-700">{op.icon}</span>
                <div className="space-y-1">
                  <span className="block text-[12px] font-black uppercase tracking-[0.4em] text-slate-100">{op.label}</span>
                  <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">{op.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Neural Hub */}
        <div className="lg:col-span-3 bg-slate-900/40 border border-slate-800 rounded-[3.5rem] p-12 backdrop-blur-2xl flex flex-col relative overflow-hidden shadow-2xl group">
          <div className="absolute -right-16 -bottom-16 opacity-[0.05] pointer-events-none select-none group-hover:scale-110 transition-transform duration-1000">
            <span className="text-[18rem] font-black italic tracking-tighter uppercase text-blue-500">AI</span>
          </div>
          <h2 className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-500 mb-12 flex items-center justify-between">
            <span>Neural Hub</span>
            <button 
              onClick={handleFleetAnalysis} 
              disabled={isAnalyzing} 
              className="text-blue-500 hover:text-blue-400 text-[11px] font-black transition-all hover:underline underline-offset-[16px] uppercase tracking-widest"
            >
              {isAnalyzing ? '...' : 'TRANSMIT'}
            </button>
          </h2>
          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            {fleetStrategy ? (
              <div className="text-slate-300 leading-relaxed font-bold italic animate-in fade-in zoom-in duration-700 text-sm bg-slate-950/80 p-10 rounded-[4rem] border border-white/5 shadow-inner relative">
                <span className="absolute -top-4 -left-2 text-4xl text-blue-500/20 font-serif">"</span>
                {fleetStrategy}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-12 border-4 border-dashed border-slate-800/80 rounded-[5rem] transition-all group-hover:border-blue-500/20">
                <span className="text-8xl mb-8 group-hover:animate-pulse">📡</span>
                <p className="text-[12px] font-black uppercase tracking-[0.4em]">Listening for Neural Command signal...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Browser */}
      <section className="mb-48">
        <div className="flex flex-col md:flex-row gap-8 mb-20 items-end">
          <div className="flex-1 relative group w-full">
            <label className="block text-[11px] font-black uppercase tracking-[0.6em] text-slate-600 mb-4 ml-8 italic uppercase tracking-widest opacity-50">Grid Discovery</label>
            <div className="relative">
              <span className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors text-4xl">🔍</span>
              <input 
                type="text" 
                placeholder="Query repo endpoints..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full bg-slate-900/70 border border-slate-800 rounded-[3rem] py-10 pl-24 pr-12 focus:ring-[24px] focus:ring-blue-500/5 focus:border-blue-500/80 outline-none transition-all placeholder:text-slate-700 font-black text-2xl shadow-2xl backdrop-blur-xl" 
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <label className="block text-[11px] font-black uppercase tracking-[0.6em] text-slate-600 mb-4 ml-8 italic uppercase tracking-widest opacity-50">State Filter</label>
            <div className="flex gap-4 p-5 bg-slate-900/70 border border-slate-800 rounded-[3rem] overflow-x-auto no-scrollbar shadow-2xl backdrop-blur-xl">
              {(['ALL', ...Object.values(RepoStatus)] as const).map(s => (
                <button 
                  key={s} 
                  onClick={() => setFilter(s)} 
                  className={`px-12 py-6 rounded-[2.5rem] text-[13px] font-black uppercase tracking-[0.4em] transition-all whitespace-nowrap ${
                    filter === s ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/50' : 'text-slate-500 hover:text-slate-100 hover:bg-slate-800/80'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredRepos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-24 duration-1000">
            {filteredRepos.map(repo => <RepoCard key={repo.repo} repo={repo} onViewLogs={(logs) => setActiveLogs(logs)} />)}
          </div>
        ) : (
          <div className="text-center py-72 bg-slate-900/20 rounded-[10rem] border-8 border-dashed border-slate-800/60 backdrop-blur-3xl">
            <div className="text-9xl mb-16 opacity-10 select-none">🛸</div>
            <p className="text-slate-600 font-black uppercase tracking-[1em] text-2xl">Telemetry Lost</p>
          </div>
        )}
      </section>

      {/* Active PRs & Workflows Table */}
      <section className="mb-48 bg-slate-900/20 border border-slate-800/50 rounded-[4rem] p-16 backdrop-blur-2xl">
        <h2 className="text-4xl font-black text-white tracking-tighter mb-12 uppercase italic flex items-center gap-6">
          <span className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-xl not-italic shadow-lg shadow-emerald-500/30">🚀</span>
          Active Hospital Operations
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-black uppercase tracking-[0.6em] text-slate-600">
                <th className="pb-8 px-6">ID</th>
                <th className="pb-8 px-6">Operation</th>
                <th className="pb-8 px-6">Target Repo</th>
                <th className="pb-8 px-6">Bot Assignee</th>
                <th className="pb-8 px-6">Progress</th>
                <th className="pb-8 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {[
                { id: 'PR-9921', op: 'Workflow Repair', target: 'nexus-api', bot: 'Surgeon', progress: 85, color: 'bg-emerald-500' },
                { id: 'JOB-442', op: 'Security Sanitization', target: 'vault-service', bot: 'AI Guard', progress: 40, color: 'bg-blue-500' },
                { id: 'DR-101', op: 'Genome Upgrade', target: 'contracts-core', bot: 'Genome', progress: 100, color: 'bg-emerald-500' },
              ].map(row => (
                <tr key={row.id} className="group hover:bg-white/5 transition-all">
                  <td className="py-10 px-6 font-mono font-bold text-blue-400">{row.id}</td>
                  <td className="py-10 px-6 font-black uppercase text-xs text-white tracking-widest">{row.op}</td>
                  <td className="py-10 px-6 text-slate-400 font-bold">{row.target}</td>
                  <td className="py-10 px-6">
                    <span className="px-4 py-2 bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-700">{row.bot}</span>
                  </td>
                  <td className="py-10 px-6">
                    <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${row.color}`} style={{ width: `${row.progress}%` }}></div>
                    </div>
                  </td>
                  <td className="py-10 px-6">
                    <button className="text-[11px] font-black text-blue-500 uppercase hover:text-white transition-colors tracking-widest">DETAILS</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="pt-32 pb-48 border-t border-slate-900 text-center flex flex-col items-center gap-12">
        <div className="flex gap-20 grayscale hover:grayscale-0 transition-all duration-1000">
           <a href="https://cyberai.network" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 bg-slate-800 rounded-[1.5rem] border border-slate-700 shadow-xl flex items-center justify-center font-black text-xs text-blue-400">CYBERAI</div>
           </a>
           <a href="https://github.com/SolanaRemix/repo-brain" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 bg-slate-800 rounded-full border border-slate-700 shadow-xl scale-110 flex items-center justify-center text-2xl">🐙</div>
           </a>
           <div className="w-16 h-16 bg-slate-800 rounded-[1.5rem] border border-slate-700 shadow-xl rotate-45 flex items-center justify-center -rotate-45 font-black text-xs text-emerald-400">SOLANA</div>
        </div>
        <div className="space-y-4 opacity-30">
          <p className="text-slate-600 text-[13px] font-black uppercase tracking-[1.5em]">CAST BRAIN GOVERNANCE SYSTEM</p>
          <p className="text-slate-800 text-[13px] font-mono italic font-bold">Autonomous Repository Orchestration • CyberAI Network Protocol.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
