import { useState } from 'react';
import { sourceFiles } from '../data/sourceFiles';

type DocSection = 'readme' | 'architecture' | 'sqli' | 'cookies' | 'session' | 'powershell' | 'docker' | 'testing';

export function DocumentationPage() {
  const [activeSection, setActiveSection] = useState<DocSection>('readme');

  const readmeFile = sourceFiles.find(f => f.path === 'README.md');
  const archFile = sourceFiles.find(f => f.path === 'docs/ARCHITECTURE.md');

  const sections: { id: DocSection; label: string }[] = [
    { id: 'readme', label: 'README' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'sqli', label: 'SQL Injection' },
    { id: 'cookies', label: 'Cookie Security' },
    { id: 'session', label: 'Session Security' },
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

      {/* SQL Injection Documentation */}
      {activeSection === 'sqli' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800">
              <h3 className="font-bold text-white">docs/SQL_INJECTION.md</h3>
            </div>
            <div className="p-6 space-y-4 text-sm text-gray-300">
              <h3 className="text-lg font-semibold text-white">What is SQL Injection?</h3>
              <p>SQL Injection (SQLi) is a code injection technique that exploits vulnerabilities in an application's SQL query construction. When user input is directly concatenated into SQL queries without proper sanitization, attackers can manipulate the query structure to bypass authentication, access unauthorized data, or modify database contents.</p>

              <h3 className="text-lg font-semibold text-white mt-4">Root Cause</h3>
              <p>The root cause is using string concatenation or formatting to build SQL queries with user-controlled input:</p>
              <div className="p-3 rounded-lg bg-gray-950 font-mono text-xs text-red-300">
                query = f"SELECT * FROM users WHERE username='{'{username}'}' AND password='{'{password}'}'"
              </div>

              <h3 className="text-lg font-semibold text-white mt-4">Data Flow</h3>
              <div className="p-3 rounded-lg bg-gray-950 font-mono text-xs text-gray-400">
                <pre>{`User Input (username, password)
    ↓
Flask Route Handler
    ↓
String Concatenation (VULNERABLE)
    ↓
SQL Query sent to SQLite
    ↓
Authentication Decision`}</pre>
              </div>

              <h3 className="text-lg font-semibold text-white mt-4">Controlled Testing</h3>
              <p>Test payloads (in isolated lab environment only):</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-400">
                <li><code className="text-red-300">' OR 1=1 --</code> — Authentication bypass</li>
                <li><code className="text-red-300">' OR '1'='1</code> — Always-true condition</li>
                <li><code className="text-red-300">admin' --</code> — Comment out password check</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-4">Impact</h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-400">
                <li>Authentication bypass without valid credentials</li>
                <li>Unauthorized data access (UNION-based attacks)</li>
                <li>Data manipulation (INSERT/UPDATE/DELETE)</li>
                <li>Database structure disclosure</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-4">Mitigation: Parameterized Queries</h3>
              <div className="p-3 rounded-lg bg-gray-950 font-mono text-xs text-emerald-300">
                cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
              </div>
              <p className="mt-2">Parameterized queries treat user input as data, not as part of the SQL command structure. The database driver properly escapes special characters.</p>

              <h3 className="text-lg font-semibold text-white mt-4">Retesting</h3>
              <p>After implementing parameterized queries, verify that SQL injection payloads are treated as literal strings and do not alter query behavior.</p>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Security Documentation */}
      {activeSection === 'cookies' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800">
              <h3 className="font-bold text-white">docs/COOKIE_SECURITY.md</h3>
            </div>
            <div className="p-6 space-y-4 text-sm text-gray-300">
              <h3 className="text-lg font-semibold text-white">What are HTTP Cookies?</h3>
              <p>HTTP cookies are small pieces of data stored by the browser and sent with each request to the server. Authentication cookies maintain user sessions across requests.</p>

              <h3 className="text-lg font-semibold text-white mt-4">Cookie Security Attributes</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gray-950">
                  <div className="font-mono text-sm text-emerald-300 mb-1">HttpOnly</div>
                  <div className="text-xs text-gray-400">Prevents JavaScript access via document.cookie. Protects against XSS cookie theft.</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-950">
                  <div className="font-mono text-sm text-emerald-300 mb-1">Secure</div>
                  <div className="text-xs text-gray-400">Cookie only sent over HTTPS connections. Protects against man-in-the-middle attacks.</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-950">
                  <div className="font-mono text-sm text-emerald-300 mb-1">SameSite</div>
                  <div className="text-xs text-gray-400">Controls when cookies are sent with cross-site requests. Values: Strict, Lax, None. Protects against CSRF.</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-950">
                  <div className="font-mono text-sm text-emerald-300 mb-1">Path / Domain</div>
                  <div className="text-xs text-gray-400">Restricts cookie scope to specific paths and domains.</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-950">
                  <div className="font-mono text-sm text-emerald-300 mb-1">Max-Age / Expires</div>
                  <div className="text-xs text-gray-400">Sets cookie expiration time. Limits session lifetime.</div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mt-4">Vulnerable Configuration</h3>
              <div className="p-3 rounded-lg bg-gray-950 font-mono text-xs text-red-300">
                <pre>{`response.set_cookie('session_id', token,
    httponly=False,   # XSS can steal cookie
    secure=False,     # Sent over HTTP
    samesite=None)    # CSRF possible`}</pre>
              </div>

              <h3 className="text-lg font-semibold text-white mt-4">Secure Configuration</h3>
              <div className="p-3 rounded-lg bg-gray-950 font-mono text-xs text-emerald-300">
                <pre>{`response.set_cookie('session_id', token,
    httponly=True,    # XSS protected
    secure=True,      # HTTPS only
    samesite='Lax')   # CSRF protected`}</pre>
              </div>

              <h3 className="text-lg font-semibold text-white mt-4">Retesting</h3>
              <p>Use browser developer tools or curl to verify cookie attributes in response headers.</p>
            </div>
          </div>
        </div>
      )}

      {/* Session Security Documentation */}
      {activeSection === 'session' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800">
              <h3 className="font-bold text-white">docs/SESSION_SECURITY.md</h3>
            </div>
            <div className="p-6 space-y-4 text-sm text-gray-300">
              <h3 className="text-lg font-semibold text-white">What is a Session?</h3>
              <p>A session is a server-side mechanism to maintain state across HTTP requests. Sessions use a unique identifier (session ID) stored in a cookie to associate requests with user data.</p>

              <h3 className="text-lg font-semibold text-white mt-4">Session Identifier</h3>
              <p>The session ID must be:</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-400">
                <li>Cryptographically random (use secrets module)</li>
                <li>Sufficiently long (at least 128 bits)</li>
                <li>Unpredictable</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-4">Session Fixation</h3>
              <p>Session fixation occurs when an attacker sets a known session ID before authentication. After the victim logs in, the attacker can use the same session ID to access the authenticated session.</p>
              <div className="p-3 rounded-lg bg-red-900/10 border border-red-800/30 text-xs text-red-200">
                <strong>Attack:</strong> Attacker → sets session_id=fixed → Victim logs in → Attacker uses fixed session → Access granted!
              </div>

              <h3 className="text-lg font-semibold text-white mt-4">Session Regeneration</h3>
              <p>After successful authentication, generate a new session ID to prevent fixation:</p>
              <div className="p-3 rounded-lg bg-gray-950 font-mono text-xs text-emerald-300">
                <pre>{`session.clear()  # Destroy old session
session['user_id'] = user.id  # Create new session`}</pre>
              </div>

              <h3 className="text-lg font-semibold text-white mt-4">Logout Invalidation</h3>
              <p>On logout, completely destroy the session:</p>
              <div className="p-3 rounded-lg bg-gray-950 font-mono text-xs text-emerald-300">
                session.clear()  # Not just session.pop()!
              </div>

              <h3 className="text-lg font-semibold text-white mt-4">Session Timeout</h3>
              <p>Configure session expiration to limit the attack window:</p>
              <div className="p-3 rounded-lg bg-gray-950 font-mono text-xs text-emerald-300">
                <pre>{`app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
session.permanent = True`}</pre>
              </div>

              <h3 className="text-lg font-semibold text-white mt-4">Vulnerable Implementation</h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-red-300">
                <li>No session regeneration after login</li>
                <li>Partial session cleanup on logout</li>
                <li>Predictable session identifiers</li>
                <li>No expiration configured</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-4">Secure Implementation</h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-emerald-300">
                <li>Session regeneration after authentication</li>
                <li>Complete session.clear() on logout</li>
                <li>Cryptographically secure session IDs</li>
                <li>Configurable expiration</li>
                <li>Secure cookie flags</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-4">Retesting</h3>
              <p>Verify that session ID changes after login, logout invalidates the session, and expired sessions are rejected.</p>
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
