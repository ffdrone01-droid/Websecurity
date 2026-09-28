import type { Page } from '../App';
import { Database, Shield, Server, AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  onNavigate: (page: Page) => void;
}

export function Phase3Overview({ onNavigate }: Props) {
  const labs = [
    {
      id: 'sqli' as Page,
      title: 'LAB 01: SQL Injection',
      icon: <Database className="w-6 h-6" />,
      description: 'Understand how user input can manipulate SQL queries through string concatenation',
      endpoints: ['/lab/sqli/vulnerable', '/lab/sqli/secure', '/labs/sqli'],
      color: 'red',
    },
    {
      id: 'cookies' as Page,
      title: 'LAB 02: Cookie Security',
      icon: <Shield className="w-6 h-6" />,
      description: 'Learn about HttpOnly, Secure, SameSite flags and their security implications',
      endpoints: ['/lab/cookies/vulnerable', '/lab/cookies/secure', '/labs/cookies'],
      color: 'orange',
    },
    {
      id: 'session' as Page,
      title: 'LAB 03: Session Security',
      icon: <Server className="w-6 h-6" />,
      description: 'Explore session fixation, regeneration, invalidation, and proper lifecycle management',
      endpoints: ['/lab/session/vulnerable', '/lab/session/secure', '/labs/session'],
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-900/40 via-gray-900 to-gray-900 border border-red-800/30 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 text-xs font-bold border border-red-700/50">PHASE 3</span>
            <span className="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-400 text-xs font-bold border border-emerald-700/50">VULNERABILITY LABS</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Vulnerability Laboratories</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Three hands-on labs demonstrating real-world web vulnerabilities with vulnerable and secure implementations.
          </p>
          <div className="mt-4 p-3 rounded-lg bg-red-900/20 border border-red-800/30">
            <p className="text-sm text-red-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                <strong>WARNING:</strong> These labs contain intentionally vulnerable code for educational purposes.
                Run only in isolated environments (localhost, Docker, VM). Never deploy to production.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Labs Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Available Laboratories</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {labs.map((lab) => (
            <button
              key={lab.id}
              onClick={() => onNavigate(lab.id)}
              className="group p-6 rounded-xl bg-gray-900/50 border border-gray-800/50 hover:border-emerald-700/50 hover:bg-emerald-900/10 transition-all text-left"
            >
              <div className={`mb-3 ${
                lab.color === 'red' ? 'text-red-400' :
                lab.color === 'orange' ? 'text-orange-400' :
                'text-purple-400'
              }`}>
                {lab.icon}
              </div>
              <h3 className="font-bold text-gray-200 group-hover:text-emerald-300 transition-colors mb-2">
                {lab.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{lab.description}</p>
              <div className="space-y-1">
                {lab.endpoints.map((ep) => (
                  <div key={ep} className="text-xs font-mono text-gray-600">{ep}</div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-1 text-emerald-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Open Lab</span>
                <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Learning Flow */}
      <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
        <h2 className="text-lg font-bold text-white mb-4">Learning Flow</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {['Vulnerable Implementation', 'Controlled Testing', 'Root Cause Analysis', 'Impact Assessment', 'Mitigation', 'Secure Implementation', 'Retesting'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 border border-gray-700">
                {step}
              </span>
              {i < 6 && <span className="text-gray-600">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Phase 3 Features */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Phase 3 Features</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { title: 'Vulnerable Implementations', desc: 'Intentionally weak code for learning', icon: <AlertTriangle className="w-5 h-5 text-red-400" /> },
            { title: 'Secure Implementations', desc: 'Properly secured code for comparison', icon: <CheckCircle className="w-5 h-5 text-emerald-400" /> },
            { title: 'Interactive Demos', desc: 'Try vulnerabilities in controlled environment', icon: <Database className="w-5 h-5 text-blue-400" /> },
            { title: 'Automated Tests', desc: 'Verify vulnerable vs secure behavior', icon: <Shield className="w-5 h-5 text-purple-400" /> },
            { title: 'LAB_MODE Safety', desc: 'Vulnerable routes only active in lab mode', icon: <Server className="w-5 h-5 text-orange-400" /> },
            { title: 'Complete Documentation', desc: 'Root cause, impact, mitigation guides', icon: <Shield className="w-5 h-5 text-cyan-400" /> },
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
              <div className="mt-0.5">{feature.icon}</div>
              <div>
                <h3 className="font-medium text-gray-200 text-sm">{feature.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Quick Navigation</h2>
        <div className="grid md:grid-cols-4 gap-3">
          {[
            { page: 'comparison' as Page, label: 'Comparison', desc: 'Vulnerable vs Secure' },
            { page: 'source' as Page, label: 'Source Code', desc: 'Browse all files' },
            { page: 'docs' as Page, label: 'Documentation', desc: 'Lab guides' },
            { page: 'validation' as Page, label: 'Validation', desc: 'Checklist' },
          ].map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className="p-4 rounded-xl bg-gray-900/50 border border-gray-800/50 hover:border-emerald-700/50 hover:bg-emerald-900/10 transition-all text-left"
            >
              <h3 className="font-semibold text-gray-200 text-sm group-hover:text-emerald-300">{item.label}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
