import React, { useState } from 'react';
import { BookOpen, ExternalLink, ChevronRight, Terminal, Globe, Shield, Cpu, Activity } from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  description: string;
  articles: { title: string; path: string }[];
}

const REPO = 'https://github.com/SMSDAO/repo-brain/blob/main';

const sections: DocSection[] = [
  {
    id: 'architecture',
    title: 'Architecture',
    icon: Cpu,
    color: 'from-blue-600 to-indigo-600',
    description: 'System design, module relationships, and data flow.',
    articles: [
      { title: 'System Overview', path: `${REPO}/docs/architecture.md` },
      { title: 'MERMEDA Protocol', path: `${REPO}/docs/MERMEDA.md` },
      { title: 'Database Schema', path: `${REPO}/src/lib/supabase-schema.sql` },
      { title: 'Brain Scripts Pipeline', path: `${REPO}/docs/pipeline.md` },
    ],
  },
  {
    id: 'deployment',
    title: 'Deployment',
    icon: Globe,
    color: 'from-emerald-600 to-teal-600',
    description: 'Deploy to Vercel, configure environment variables, and manage releases.',
    articles: [
      { title: 'Vercel Deployment', path: `${REPO}/vercel.json` },
      { title: 'Environment Variables', path: `${REPO}/.env.example` },
      { title: 'CI/CD Pipelines', path: `${REPO}/docs/developer-guide.md` },
      { title: 'Release Management', path: `${REPO}/CHANGELOG.md` },
    ],
  },
  {
    id: 'user-guide',
    title: 'User Guide',
    icon: BookOpen,
    color: 'from-purple-600 to-pink-600',
    description: 'How to use the dashboard, run brain scans, and interpret results.',
    articles: [
      { title: 'Getting Started', path: `${REPO}/README.md` },
      { title: 'Dashboard Overview', path: `${REPO}/docs/USER_GUIDE.md` },
      { title: 'Running Brain Scans', path: `${REPO}/docs/USER_GUIDE.md` },
      { title: 'Alerts & Reports', path: `${REPO}/docs/USER_GUIDE.md` },
    ],
  },
  {
    id: 'admin-guide',
    title: 'Admin Guide',
    icon: Shield,
    color: 'from-red-600 to-rose-600',
    description: 'User management, role assignment, and system configuration.',
    articles: [
      { title: 'User Management', path: `${REPO}/docs/admin-guide.md` },
      { title: 'Role & Permissions', path: `${REPO}/docs/admin-guide.md` },
      { title: 'Audit Logs', path: `${REPO}/docs/admin-guide.md` },
      { title: 'System Configuration', path: `${REPO}/docs/admin-guide.md` },
    ],
  },
  {
    id: 'developer-guide',
    title: 'Developer Guide',
    icon: Terminal,
    color: 'from-amber-500 to-orange-600',
    description: 'API reference, brain script development, and integration testing.',
    articles: [
      { title: 'CLI Reference', path: `${REPO}/docs/cli.md` },
      { title: 'Brain Script API', path: `${REPO}/docs/developer-guide.md` },
      { title: 'REST API Reference', path: `${REPO}/docs/developer-guide.md` },
      { title: 'Integration Testing', path: `${REPO}/docs/developer-guide.md` },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    icon: Activity,
    color: 'from-cyan-600 to-blue-600',
    description: 'Security posture, RBAC enforcement, and hardening guidelines.',
    articles: [
      { title: 'Security Overview', path: `${REPO}/docs/SPECS.md` },
      { title: 'Secret Management', path: `${REPO}/docs/SPECS.md` },
      { title: 'Rate Limiting', path: `${REPO}/docs/SPECS.md` },
      { title: 'Incident Response', path: `${REPO}/docs/SPECS.md` },
    ],
  },
];

const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredSections = sections.filter(s =>
    search === '' ||
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.articles.some(a => a.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 text-2xl">
          📖
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-2">Documentation</h1>
        <p className="text-slate-400 text-sm">
          Architecture, deployment, user guides, and developer references.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto relative">
        <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search documentation..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Sections grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSections.map((section) => {
          const Icon = section.icon;
          const isOpen = activeSection === section.id;
          return (
            <div
              key={section.id}
              className="bg-slate-900/50 border border-slate-800 hover:border-slate-600 rounded-xl overflow-hidden transition-all duration-200"
            >
              <button
                className="w-full p-5 text-left"
                onClick={() => setActiveSection(isOpen ? null : section.id)}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-3`}>
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="text-white font-bold mb-1">{section.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{section.description}</p>
              </button>

              {isOpen && (
                <div className="border-t border-slate-800 divide-y divide-slate-800">
                  {section.articles.map((article) => (
                    <a
                      key={article.title}
                      href={article.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-5 py-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors group"
                    >
                      <span className="flex items-center gap-2">
                        <ChevronRight size={12} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                        {article.title}
                      </span>
                      <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-800/30 rounded-xl p-6">
        <h3 className="text-white font-bold mb-4">Quick References</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'README', href: `${REPO}/README.md`, icon: '📄' },
            { label: 'CHANGELOG', href: `${REPO}/CHANGELOG.md`, icon: '📝' },
            { label: 'Architecture', href: `${REPO}/docs/architecture.md`, icon: '🏗️' },
            { label: 'UI/UX Guide', href: `${REPO}/docs/ui-ux.md`, icon: '🎨' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 rounded-lg text-xs text-slate-400 hover:text-white transition-all"
            >
              <span>{link.icon}</span>
              <span className="font-mono">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
