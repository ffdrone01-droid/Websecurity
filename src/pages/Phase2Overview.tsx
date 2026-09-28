import type { Page } from '../App';
import { Code2, FileText, PlayCircle, CheckSquare, Database, Shield, FlaskConical, Server } from 'lucide-react';

interface Props {
  onNavigate: (page: Page) => void;
}

export function Phase2Overview({ onNavigate }: Props) {
  const features = [
    { title: 'Flask Application Factory', desc: 'Modular create_app() pattern for testability', icon: <FlaskConical className="w-5 h-5" /> },
    { title: 'SQLite Database', desc: 'users + login_logs tables with proper schema', icon: <Database className="w-5 h-5" /> },
    { title: 'Secure Registration', desc: 'bcrypt password hashing, input validation', icon: <Shield className="w-5 h-5" /> },
    { title: 'Secure Login', desc: 'Parameterized queries, generic error messages', icon: <Shield className="w-5 h-5" /> },
    { title: 'Session Management', desc: 'Flask secure sessions with login_required decorator', icon: <Server className="w-5 h-5" /> },
    { title: 'Automated Tests', desc: 'pytest suite with isolated test database', icon: <FlaskConical className="w-5 h-5" /> },
  ];

  const routes = [
    { method: 'GET', path: '/', handler: 'main.index', auth: false },
    { method: 'GET/POST', path: '/register', handler: 'auth.register', auth: false },
    { method: 'GET/POST', path: '/login', handler: 'auth.login', auth: false },
    { method: 'POST', path: '/logout', handler: 'auth.logout', auth: true },
    { method: 'GET', path: '/dashboard', handler: 'main.dashboard', auth: true },
    { method: 'GET', path: '/labs', handler: 'lab.labs', auth: false },
  ];

  const seedUsers = [
    { username: 'student', password: 'StudentLab123!' },
    { username: 'admin', password: 'AdminLab123!' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/40 via-gray-900 to-gray-900 border border-emerald-800/30 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-400 text-xs font-bold border border-emerald-700/50">PHASE 2</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Core Application Foundation</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Secure Flask application with authentication, database, session management,
            and automated testing — the foundation for Phase 3 security labs.
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid md:grid-cols-4 gap-3">
        {[
          { page: 'source' as Page, label: 'Source Code', icon: <Code2 className="w-5 h-5" />, desc: 'Browse all files' },
          { page: 'docs' as Page, label: 'Documentation', icon: <FileText className="w-5 h-5" />, desc: 'README & Architecture' },
          { page: 'demo' as Page, label: 'Interactive Demo', icon: <PlayCircle className="w-5 h-5" />, desc: 'Try the app flow' },
          { page: 'validation' as Page, label: 'Validation', icon: <CheckSquare className="w-5 h-5" />, desc: 'Checklist & report' },
        ].map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className="group p-4 rounded-xl bg-gray-900/50 border border-gray-800/50 hover:border-emerald-700/50 hover:bg-emerald-900/10 transition-all text-left"
          >
            <div className="text-emerald-400 mb-2">{item.icon}</div>
            <h3 className="font-semibold text-gray-200 text-sm group-hover:text-emerald-300 transition-colors">{item.label}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Features */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Implemented Features</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
              <div className="text-emerald-400 mt-0.5">{f.icon}</div>
              <div>
                <h3 className="font-medium text-gray-200 text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Routes */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Routes</h2>
        <div className="rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900/80 border-b border-gray-800">
                <th className="px-4 py-2.5 text-left text-gray-400 font-medium">Method</th>
                <th className="px-4 py-2.5 text-left text-gray-400 font-medium">Path</th>
                <th className="px-4 py-2.5 text-left text-gray-400 font-medium">Handler</th>
                <th className="px-4 py-2.5 text-left text-gray-400 font-medium">Auth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {routes.map((r, i) => (
                <tr key={i} className="hover:bg-gray-900/30">
                  <td className="px-4 py-2">
                    <span className="px-2 py-0.5 rounded bg-blue-900/30 text-blue-300 text-xs font-bold">{r.method}</span>
                  </td>
                  <td className="px-4 py-2 font-mono text-emerald-300 text-xs">{r.path}</td>
                  <td className="px-4 py-2 font-mono text-gray-400 text-xs">{r.handler}</td>
                  <td className="px-4 py-2">
                    {r.auth ? (
                      <span className="px-2 py-0.5 rounded bg-yellow-900/30 text-yellow-300 text-xs">Required</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-500 text-xs">Public</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seed Credentials */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Lab Credentials</h2>
        <div className="p-4 rounded-xl bg-yellow-900/10 border border-yellow-800/30 mb-3">
          <p className="text-sm text-yellow-200/70">
            ⚠ These credentials are for <strong>LOCAL LAB USE ONLY</strong>. Do not use in production.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {seedUsers.map((u) => (
            <div key={u.username} className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
              <div className="font-mono text-sm">
                <span className="text-gray-500">username:</span>{' '}
                <span className="text-emerald-300">{u.username}</span>
              </div>
              <div className="font-mono text-sm mt-1">
                <span className="text-gray-500">password:</span>{' '}
                <span className="text-emerald-300">{u.password}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Run Instructions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Quick Start</h2>
        <div className="rounded-xl bg-gray-900/80 border border-gray-800 p-5">
          <div className="font-mono text-sm space-y-2">
            <div className="text-gray-500"># Windows PowerShell</div>
            <div><span className="text-emerald-400">$</span> <span className="text-gray-300">python -m venv .venv</span></div>
            <div><span className="text-emerald-400">$</span> <span className="text-gray-300">.\\.venv\\Scripts\\Activate.ps1</span></div>
            <div><span className="text-emerald-400">$</span> <span className="text-gray-300">pip install -r requirements.txt</span></div>
            <div><span className="text-emerald-400">$</span> <span className="text-gray-300">python scripts\\reset_lab.py</span></div>
            <div><span className="text-emerald-400">$</span> <span className="text-gray-300">python run.py</span></div>
            <div className="text-gray-500 mt-3"># Open browser: http://127.0.0.1:5000</div>
            <div className="text-gray-500 mt-2"># Run tests:</div>
            <div><span className="text-emerald-400">$</span> <span className="text-gray-300">pytest -v</span></div>
          </div>
        </div>
      </div>

      {/* Phase 3 Preview */}
      <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-800">
        <h2 className="text-lg font-bold text-white mb-3">Phase 3 Preview</h2>
        <p className="text-sm text-gray-400 mb-3">
          Phase 3 will add intentionally vulnerable implementations for hands-on learning:
        </p>
        <div className="grid md:grid-cols-3 gap-2">
          {['SQL Injection Lab', 'Cookie Security Lab', 'Session Security Lab'].map((lab) => (
            <div key={lab} className="px-3 py-2 rounded-lg bg-red-900/10 border border-red-800/20 text-sm text-red-300">
              🔓 {lab}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
