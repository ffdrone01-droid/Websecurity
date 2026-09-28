import { useState } from 'react';
import { sourceFiles } from '../data/sourceFiles';

type DocSection = 'readme' | 'architecture' | 'powershell' | 'docker' | 'testing';

export function DocumentationPage() {
  const [activeSection, setActiveSection] = useState<DocSection>('readme');

  const readmeFile = sourceFiles.find(f => f.path === 'README.md');
  const archFile = sourceFiles.find(f => f.path === 'docs/ARCHITECTURE.md');

  const sections: { id: DocSection; label: string }[] = [
    { id: 'readme', label: 'README' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'powershell', label: 'PowerShell Setup' },
    { id: 'docker', label: 'Docker' },
    { id: 'testing', label: 'Testing Guide' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Documentation</h1>
        <p className="text-gray-400 mt-1">Complete project documentation and guides</p>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-3">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSection === s.id
                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50'
                : 'text-gray-400 hover:text-gray-200 bg-gray-900'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* README */}
      {activeSection === 'readme' && readmeFile && (
        <div className="rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800">
            <h3 className="font-bold text-white">README.md</h3>
          </div>
          <div className="p-6 prose prose-invert max-w-none">
            <div className="space-y-4 text-sm text-gray-300">
              <h2 className="text-2xl font-bold text-white">Web Application Security Vulnerable Lab</h2>
              <div className="p-4 rounded-lg bg-red-900/10 border border-red-800/30 text-red-200 text-sm">
                ⚠ <strong>WARNING</strong>: This application intentionally contains vulnerable components for security education.
                Run only in an isolated laboratory environment. Do not expose to the public Internet.
              </div>
              <h3 className="text-lg font-semibold text-white mt-6">Overview</h3>
              <p>An educational cybersecurity training platform for learning web application security through hands-on practice with vulnerable and secure implementations.</p>
              <h3 className="text-lg font-semibold text-white mt-6">Educational Purpose</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>SQL Injection</li>
                <li>Cookie Security</li>
                <li>Session Security</li>
                <li>Authentication Security</li>
                <li>Secure Coding Practices</li>
                <li>Vulnerability Mitigation</li>
                <li>Retesting</li>
              </ul>
              <h3 className="text-lg font-semibold text-white mt-6">Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>Python 3.10+</li>
                <li>pip</li>
                <li>(Optional) Docker & Docker Compose</li>
              </ul>
              <h3 className="text-lg font-semibold text-white mt-6">Current Phase</h3>
              <p><strong className="text-emerald-400">Phase 2 — Core Application Foundation ✓</strong></p>
              <h3 className="text-lg font-semibold text-white mt-6">Planned Phase 3</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>SQL Injection Lab (vulnerable + secure)</li>
                <li>Cookie Security Lab (vulnerable + secure)</li>
                <li>Session Security Lab (vulnerable + secure)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Architecture */}
      {activeSection === 'architecture' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800">
              <h3 className="font-bold text-white">docs/ARCHITECTURE.md</h3>
            </div>
            <div className="p-6 space-y-6 text-sm text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">System Overview</h3>
                <div className="p-4 rounded-lg bg-gray-950 font-mono text-xs text-gray-400">
                  <pre>{`Browser (Client)
    ↓ HTTP Request
Flask Application
    ↓
Routes (Blueprints)
    ↓
Database Layer
    ↓
SQLite (lab.db)`}</pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Authentication Flow — Registration</h3>
                <div className="p-4 rounded-lg bg-gray-950 font-mono text-xs text-gray-400">
                  <pre>{`User fills form
    ↓
POST /register
    ↓
Input validation
    ↓
Check username exists (parameterized query)
    ↓
Hash password (bcrypt, 12 rounds)
    ↓
INSERT INTO users
    ↓
Redirect to /login with success message`}</pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Authentication Flow — Login</h3>
                <div className="p-4 rounded-lg bg-gray-950 font-mono text-xs text-gray-400">
                  <pre>{`User submits credentials
    ↓
POST /login
    ↓
SELECT user WHERE username = ? (parameterized)
    ↓
bcrypt.checkpw(password, stored_hash)
    ↓
[Success]                    [Failure]
    ↓                            ↓
Set session                  Log failure
Log success                  Generic error message
    ↓                            ↓
Redirect /dashboard          Stay on /login`}</pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Security Measures (Phase 2)</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { title: 'Password Hashing', desc: 'bcrypt with 12 rounds' },
                    { title: 'Parameterized Queries', desc: 'All SQL uses ? placeholders' },
                    { title: 'Generic Error Messages', desc: '"Invalid username or password"' },
                    { title: 'Session Security', desc: 'Flask secure session cookies' },
                    { title: 'Input Validation', desc: 'Length checks, required fields' },
                    { title: 'No Info Leakage', desc: 'No stack traces or DB errors shown' },
                    { title: 'Login Logging', desc: 'Audit trail without sensitive data' },
                    { title: 'Application Factory', desc: 'Testable, configurable pattern' },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-lg bg-emerald-900/10 border border-emerald-800/20">
                      <div className="font-medium text-emerald-300 text-xs">{item.title}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PowerShell Setup */}
      {activeSection === 'powershell' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800">
              <h3 className="font-bold text-white">Windows PowerShell Setup Guide</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-2">Step 1: Create Virtual Environment</h4>
                <div className="p-3 rounded-lg bg-gray-950 font-mono text-sm">
                  <span className="text-emerald-400">PS&gt;</span> <span className="text-gray-300">python -m venv .venv</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Step 2: Activate Virtual Environment</h4>
                <div className="p-3 rounded-lg bg-gray-950 font-mono text-sm">
                  <span className="text-emerald-400">PS&gt;</span> <span className="text-gray-300">.\.venv\Scripts\Activate.ps1</span>
                </div>
                <div className="mt-2 p-3 rounded-lg bg-yellow-900/10 border border-yellow-800/30 text-xs text-yellow-200/80">
                  <strong>If you get an execution policy error:</strong><br/>
                  Run this to allow scripts for current user only (temporary):<br/>
                  <code className="text-yellow-300">Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned</code><br/>
                  This only affects YOUR user account, not the system.
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Step 3: Install Dependencies</h4>
                <div className="p-3 rounded-lg bg-gray-950 font-mono text-sm">
                  <span className="text-emerald-400">PS&gt;</span> <span className="text-gray-300">pip install -r requirements.txt</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Step 4: Initialize Database</h4>
                <div className="p-3 rounded-lg bg-gray-950 font-mono text-sm">
                  <span className="text-emerald-400">PS&gt;</span> <span className="text-gray-300">python scripts\reset_lab.py</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">This creates the database, applies schema, and seeds lab users.</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Step 5: Run Application</h4>
                <div className="p-3 rounded-lg bg-gray-950 font-mono text-sm">
                  <span className="text-emerald-400">PS&gt;</span> <span className="text-gray-300">python run.py</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Open browser: <code className="text-emerald-300">http://127.0.0.1:5000</code></p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Step 6: Run Tests</h4>
                <div className="p-3 rounded-lg bg-gray-950 font-mono text-sm">
                  <span className="text-emerald-400">PS&gt;</span> <span className="text-gray-300">pytest -v</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Docker */}
      {activeSection === 'docker' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800">
              <h3 className="font-bold text-white">Docker Setup</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-lg bg-gray-950 font-mono text-sm space-y-2">
                <div className="text-gray-500"># Build and start</div>
                <div><span className="text-emerald-400">$</span> <span className="text-gray-300">docker compose up --build</span></div>
                <div className="text-gray-500 mt-2"># Access application</div>
                <div className="text-gray-300">http://localhost:5000</div>
                <div className="text-gray-500 mt-2"># Stop containers</div>
                <div><span className="text-emerald-400">$</span> <span className="text-gray-300">docker compose down</span></div>
                <div className="text-gray-500 mt-2"># Stop and remove volumes</div>
                <div><span className="text-emerald-400">$</span> <span className="text-gray-300">docker compose down -v</span></div>
              </div>

              <div className="p-4 rounded-lg bg-blue-900/10 border border-blue-800/30 text-sm text-blue-200/80">
                <strong>Docker Configuration:</strong>
                <ul className="mt-2 space-y-1 text-xs">
                  <li>• Base image: python:3.11-slim</li>
                  <li>• Port: 5000 (mapped to host 5000)</li>
                  <li>• Database: Persistent volume (lab-data)</li>
                  <li>• Auto-initialization: Database seeded on build</li>
                  <li>• No external network dependencies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testing Guide */}
      {activeSection === 'testing' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800">
              <h3 className="font-bold text-white">Testing Guide</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Test Categories</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { name: 'Registration', tests: ['test_register_success', 'test_register_duplicate_username', 'test_register_missing_input', 'test_register_password_mismatch', 'test_register_short_password'] },
                    { name: 'Login', tests: ['test_login_success', 'test_login_invalid_password', 'test_login_unknown_user', 'test_login_empty_fields'] },
                    { name: 'Dashboard', tests: ['test_dashboard_requires_login', 'test_dashboard_authenticated'] },
                    { name: 'Logout', tests: ['test_logout'] },
                    { name: 'Database', tests: ['test_user_stored_with_hashed_password', 'test_login_log_stored'] },
                  ].map((cat) => (
                    <div key={cat.name} className="p-3 rounded-lg bg-gray-900/50 border border-gray-800">
                      <h5 className="font-medium text-emerald-300 text-sm mb-2">{cat.name}</h5>
                      <ul className="space-y-1">
                        {cat.tests.map((t) => (
                          <li key={t} className="text-xs text-gray-400 font-mono">• {t}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Test Isolation</h4>
                <div className="p-4 rounded-lg bg-gray-950 text-sm text-gray-300">
                  <p>Each test uses a <strong className="text-emerald-300">temporary database</strong> created via <code className="text-yellow-300">tempfile.mkstemp()</code>. This ensures:</p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-400">
                    <li>• Tests don't affect development database</li>
                    <li>• Tests can run in parallel</li>
                    <li>• Each test starts with a clean state</li>
                    <li>• Temporary files are cleaned up after tests</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Run Commands</h4>
                <div className="p-4 rounded-lg bg-gray-950 font-mono text-sm space-y-2">
                  <div><span className="text-emerald-400">$</span> <span className="text-gray-300">pytest</span> <span className="text-gray-500"># Run all tests</span></div>
                  <div><span className="text-emerald-400">$</span> <span className="text-gray-300">pytest -v</span> <span className="text-gray-500"># Verbose output</span></div>
                  <div><span className="text-emerald-400">$</span> <span className="text-gray-300">pytest tests/test_auth.py</span> <span className="text-gray-500"># Specific file</span></div>
                  <div><span className="text-emerald-400">$</span> <span className="text-gray-300">pytest -k "test_login"</span> <span className="text-gray-500"># Filter by name</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
