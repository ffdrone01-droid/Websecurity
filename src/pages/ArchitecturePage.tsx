import { useState } from 'react';

export function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'separation'>('overview');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Architecture</h1>
        <p className="text-gray-400 mt-1">High-level design of the Web Security Lab application</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-2">
        {(['overview', 'components', 'separation'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab === 'overview' ? 'Overview' : tab === 'components' ? 'Components' : 'Vulnerable vs Secure Separation'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Architecture Diagram */}
          <div className="p-6 rounded-xl bg-gray-900/80 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Architecture Diagram</h3>
            <div className="font-mono text-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Client Layer */}
                <div className="p-4 rounded-lg border border-blue-800/50 bg-blue-900/10">
                  <h4 className="text-blue-400 font-bold mb-2 text-center">CLIENT LAYER</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded bg-blue-900/20 border border-blue-800/30 text-center">Browser</div>
                    <div className="text-center text-gray-500">↓ HTTP Request</div>
                    <div className="p-2 rounded bg-blue-900/20 border border-blue-800/30 text-center">HTML Templates (Jinja2)</div>
                    <div className="p-2 rounded bg-blue-900/20 border border-blue-800/30 text-center">Static Assets (CSS/JS)</div>
                  </div>
                </div>

                {/* Application Layer */}
                <div className="p-4 rounded-lg border border-emerald-800/50 bg-emerald-900/10">
                  <h4 className="text-emerald-400 font-bold mb-2 text-center">APPLICATION LAYER</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded bg-emerald-900/20 border border-emerald-800/30 text-center">Flask App (run.py)</div>
                    <div className="p-2 rounded bg-emerald-900/20 border border-emerald-800/30 text-center">Routes (auth, lab, main)</div>
                    <div className="p-2 rounded bg-emerald-900/20 border border-emerald-800/30 text-center">Security Module</div>
                    <div className="text-center text-gray-500">↓ SQL Query</div>
                    <div className="p-2 rounded bg-red-900/20 border border-red-800/30 text-center text-red-300">Vulnerable Auth</div>
                    <div className="p-2 rounded bg-green-900/20 border border-green-800/30 text-center text-green-300">Secure Auth</div>
                  </div>
                </div>

                {/* Data Layer */}
                <div className="p-4 rounded-lg border border-purple-800/50 bg-purple-900/10">
                  <h4 className="text-purple-400 font-bold mb-2 text-center">DATA LAYER</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded bg-purple-900/20 border border-purple-800/30 text-center">SQLite (lab.db)</div>
                    <div className="p-2 rounded bg-purple-900/20 border border-purple-800/30 text-center">users table</div>
                    <div className="p-2 rounded bg-purple-900/20 border border-purple-800/30 text-center">login_logs table</div>
                    <div className="p-2 rounded bg-purple-900/20 border border-purple-800/30 text-center">sessions table</div>
                    <div className="p-2 rounded bg-purple-900/20 border border-purple-800/30 text-center">Seed Data</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Principles */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-800">
              <h3 className="font-semibold text-white mb-3">Design Principles</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>Clear separation between vulnerable and secure implementations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>Self-contained — no external targets or network attacks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>Reproducible via reset mechanism</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>Modular code with meaningful separation of concerns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>Configuration via environment variables</span>
                </li>
              </ul>
            </div>
            <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-800">
              <h3 className="font-semibold text-white mb-3">Constraints</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span>No attacking external websites</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span>No internet scanning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span>No stealing real credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span>No sending data to external servers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span>No persistence on victim systems</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'components' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-gray-900/80 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Component Breakdown</h3>
            <div className="space-y-4">
              {[
                { name: 'app/__init__.py', role: 'Application factory, configuration loading, extension initialization', color: 'emerald' },
                { name: 'app/routes/auth.py', role: 'Authentication endpoints: /register, /login, /logout', color: 'blue' },
                { name: 'app/routes/vulnerable.py', role: 'Vulnerable lab endpoints with intentional weaknesses', color: 'red' },
                { name: 'app/routes/secure.py', role: 'Secure lab endpoints with proper mitigations', color: 'green' },
                { name: 'app/routes/lab.py', role: 'Lab management: listing, starting, documentation', color: 'purple' },
                { name: 'app/routes/main.py', role: 'Main pages: home, dashboard, comparison, reports', color: 'orange' },
                { name: 'app/models/database.py', role: 'Database connection, query execution, schema management', color: 'purple' },
                { name: 'app/security/vulnerable_auth.py', role: 'Intentionally weak authentication (string concat SQL)', color: 'red' },
                { name: 'app/security/secure_auth.py', role: 'Secure authentication (parameterized queries, hashing)', color: 'green' },
                { name: 'app/security/vulnerable_session.py', role: 'Weak session management for demonstration', color: 'red' },
                { name: 'app/security/secure_session.py', role: 'Secure session management (regeneration, invalidation)', color: 'green' },
              ].map((comp) => (
                <div key={comp.name} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
                  <code className={`text-xs px-2 py-1 rounded font-mono whitespace-nowrap ${
                    comp.color === 'red' ? 'bg-red-900/30 text-red-300' :
                    comp.color === 'green' ? 'bg-green-900/30 text-green-300' :
                    comp.color === 'blue' ? 'bg-blue-900/30 text-blue-300' :
                    comp.color === 'purple' ? 'bg-purple-900/30 text-purple-300' :
                    comp.color === 'orange' ? 'bg-orange-900/30 text-orange-300' :
                    'bg-emerald-900/30 text-emerald-300'
                  }`}>
                    {comp.name}
                  </code>
                  <span className="text-sm text-gray-400">{comp.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'separation' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-gray-900/80 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Vulnerable vs Secure Separation Strategy</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg border border-red-800/50 bg-red-900/5">
                <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  VULNERABLE Implementation
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• SQL query via string concatenation</li>
                  <li>• Plaintext or weak password comparison</li>
                  <li>• No HttpOnly on cookies</li>
                  <li>• Predictable session identifiers</li>
                  <li>• No session regeneration after login</li>
                  <li>• Session not invalidated on logout</li>
                  <li>• Verbose error messages</li>
                  <li>• No rate limiting</li>
                </ul>
                <div className="mt-4 p-3 rounded bg-red-900/20 border border-red-800/30">
                  <p className="text-xs text-red-300">
                    Commented with: VULNERABLE, ROOT CAUSE, WHY THIS IS DANGEROUS
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-green-800/50 bg-green-900/5">
                <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  SECURE Implementation
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Parameterized queries (prepared statements)</li>
                  <li>• bcrypt/argon2 password hashing</li>
                  <li>• HttpOnly + Secure + SameSite cookies</li>
                  <li>• Cryptographically secure session IDs</li>
                  <li>• Session regeneration after authentication</li>
                  <li>• Proper invalidation on logout</li>
                  <li>• Generic error messages</li>
                  <li>• Rate limiting & account lockout</li>
                </ul>
                <div className="mt-4 p-3 rounded bg-green-900/20 border border-green-800/30">
                  <p className="text-xs text-green-300">
                    Commented with: SECURE, MITIGATION, WHY PARAMETERIZATION WORKS
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gray-900/80 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Separation Principle</h3>
            <div className="font-mono text-sm p-4 rounded-lg bg-gray-950 border border-gray-800 overflow-x-auto">
              <pre className="text-gray-300">{`
┌─────────────────────────────────────────────────────┐
│                    ROUTE LAYER                        │
│  /lab/vulnerable-login    /lab/secure-login          │
└──────────┬──────────────────────────┬────────────────┘
           │                          │
           ▼                          ▼
┌─────────────────────┐   ┌─────────────────────────┐
│  vulnerable_auth.py │   │    secure_auth.py        │
│                     │   │                          │
│  # VULNERABLE       │   │  # SECURE                │
│  # ROOT CAUSE       │   │  # MITIGATION            │
│  # WHY DANGEROUS    │   │  # WHY IT WORKS          │
│                     │   │                          │
│  query = f"SELECT.. │   │  cursor.execute(         │
│  ..{user_input}.."  │   │    "SELECT ... WHERE ... │
│                     │   │    username = ?", (user,) │
└──────────┬──────────┘   └──────────┬───────────────┘
           │                          │
           ▼                          ▼
┌─────────────────────────────────────────────────────┐
│                   DATABASE (lab.db)                   │
│              Same database, same tables               │
└─────────────────────────────────────────────────────┘
`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
