import { Shield, Network, Database, Route, GitBranch, FolderTree, Layers, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'home' | 'architecture' | 'database' | 'routes' | 'dataflow' | 'structure' | 'techstack') => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const phases = [
    { phase: 1, title: 'Architecture', desc: 'System design, structure, schemas, route maps, data flow', status: 'current' },
    { phase: 2, title: 'Core Application', desc: 'Flask app, database, register, login, logout, dashboard', status: 'pending' },
    { phase: 3, title: 'Security Labs', desc: 'SQL Injection, Cookie Security, Session Security labs', status: 'pending' },
    { phase: 4, title: 'Secure Implementation', desc: 'Secure implementations, mitigation, comparison', status: 'pending' },
    { phase: 5, title: 'Testing & Docker', desc: 'pytest, reset lab, seed data, Docker environment', status: 'pending' },
    { phase: 6, title: 'Documentation', desc: 'README, Practicum, Worksheet, Instructor Guide, Rubric', status: 'pending' },
  ];

  const objectives = [
    'SQL Injection — Understanding string concatenation in queries',
    'Cookie Security — HttpOnly, Secure, SameSite flags',
    'Session Security — Fixation, regeneration, invalidation',
    'Authentication Security — Password hashing, flow, state',
    'Mitigation — Secure coding practices',
    'Retesting — Verifying fixes work correctly',
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/40 via-gray-900 to-gray-900 border border-emerald-800/30 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-emerald-400" />
            <h1 className="text-3xl font-bold text-white">Web Security Vulnerable Lab</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl">
            A cybersecurity training platform for learning web application security through
            hands-on vulnerable and secure implementations.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-900/50 text-emerald-300 text-xs font-medium border border-emerald-800/50">
              Phase 1 — Architecture
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-900/50 text-blue-300 text-xs font-medium border border-blue-800/50">
              Python + Flask
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-900/50 text-purple-300 text-xs font-medium border border-purple-800/50">
              SQLite
            </span>
            <span className="px-3 py-1 rounded-full bg-orange-900/50 text-orange-300 text-xs font-medium border border-orange-800/50">
              Docker
            </span>
          </div>
        </div>
      </div>

      {/* Development Phases */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Development Phases</h2>
        <div className="grid gap-3">
          {phases.map((p) => (
            <div
              key={p.phase}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                p.status === 'current'
                  ? 'bg-emerald-900/20 border-emerald-700/50 shadow-lg shadow-emerald-900/20'
                  : 'bg-gray-900/50 border-gray-800/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                p.status === 'current'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-500'
              }`}>
                {p.phase}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${p.status === 'current' ? 'text-emerald-300' : 'text-gray-400'}`}>
                  {p.title}
                </h3>
                <p className="text-sm text-gray-500">{p.desc}</p>
              </div>
              {p.status === 'current' && (
                <span className="px-2 py-1 rounded bg-emerald-600/20 text-emerald-400 text-xs font-medium">
                  IN PROGRESS
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security Objectives */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Security Lab Objectives</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {objectives.map((obj, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
              <span className="w-6 h-6 rounded bg-red-900/30 text-red-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-gray-300">{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Phase 1 — Architecture Documentation</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { id: 'architecture' as const, label: 'System Architecture', icon: <Network className="w-5 h-5" />, desc: 'Component diagram & design' },
            { id: 'structure' as const, label: 'Project Structure', icon: <FolderTree className="w-5 h-5" />, desc: 'File & folder organization' },
            { id: 'database' as const, label: 'Database Schema', icon: <Database className="w-5 h-5" />, desc: 'Tables, relations, constraints' },
            { id: 'routes' as const, label: 'Route Map', icon: <Route className="w-5 h-5" />, desc: 'Endpoints & handlers' },
            { id: 'dataflow' as const, label: 'Data Flow', icon: <GitBranch className="w-5 h-5" />, desc: 'Request/response lifecycle' },
            { id: 'techstack' as const, label: 'Technology Stack', icon: <Layers className="w-5 h-5" />, desc: 'Tools & frameworks' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="group p-5 rounded-xl bg-gray-900/50 border border-gray-800/50 hover:border-emerald-700/50 hover:bg-emerald-900/10 transition-all text-left"
            >
              <div className="text-emerald-400 mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-200 group-hover:text-emerald-300 transition-colors">
                {item.label}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-emerald-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Learning Flow */}
      <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800/50">
        <h2 className="text-xl font-bold text-white mb-4">Learning Flow</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {['Vulnerability', 'Root Cause', 'Controlled Testing', 'Impact', 'Mitigation', 'Retesting', 'Secure Implementation'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 border border-gray-700">
                {step}
              </span>
              {i < 6 && <span className="text-gray-600">→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
