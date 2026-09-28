import { useState } from 'react';
import { Check, X, Circle } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  category: string;
  details?: string;
}

const checklistItems: ChecklistItem[] = [
  // Application
  { id: 'factory', text: 'Application factory works (create_app)', category: 'Application', details: 'Flask app created via factory pattern with test_config support' },
  { id: 'blueprints', text: 'Blueprints registered correctly', category: 'Application', details: 'main_bp, auth_bp, lab_bp all registered' },
  { id: 'config', text: 'Configuration from environment variables', category: 'Application', details: 'SECRET_KEY, DATABASE_PATH, HOST, PORT from .env' },
  { id: 'instance', text: 'Instance folder created automatically', category: 'Application', details: 'os.makedirs(app.instance_path, exist_ok=True)' },

  // Database
  { id: 'sqlite', text: 'SQLite database works', category: 'Database', details: 'lab.db created in instance/ directory' },
  { id: 'schema', text: 'Schema applied correctly', category: 'Database', details: 'users and login_logs tables created with proper constraints' },
  { id: 'indexes', text: 'Indexes created for performance', category: 'Database', details: 'idx_users_username, idx_login_logs_username, idx_login_logs_created' },

  // Registration
  { id: 'register_form', text: 'Register form displays correctly', category: 'Registration', details: 'GET /register renders template with form fields' },
  { id: 'register_process', text: 'Register processes input correctly', category: 'Registration', details: 'POST /register validates, hashes, and stores user' },
  { id: 'register_validation', text: 'Input validation works', category: 'Registration', details: 'Username length, password length, password match checks' },
  { id: 'register_duplicate', text: 'Duplicate username rejected', category: 'Registration', details: 'Parameterized query checks existing username' },

  // Login
  { id: 'login_form', text: 'Login form displays correctly', category: 'Login', details: 'GET /login renders template' },
  { id: 'login_process', text: 'Login verifies credentials', category: 'Login', details: 'POST /login uses bcrypt.checkpw for verification' },
  { id: 'login_parameterized', text: 'SQL uses parameterized queries', category: 'Login', details: 'SELECT ... WHERE username = ? — no string concatenation' },
  { id: 'login_generic_error', text: 'Generic error messages (no info leakage)', category: 'Login', details: '"Invalid username or password" for all failures' },

  // Password Security
  { id: 'bcrypt', text: 'Passwords hashed with bcrypt', category: 'Password Security', details: 'bcrypt.hashpw with 12 rounds' },
  { id: 'no_plaintext', text: 'No plaintext passwords stored', category: 'Password Security', details: 'Only password_hash column, never password' },
  { id: 'no_password_log', text: 'Passwords never logged', category: 'Password Security', details: 'login_logs stores username, endpoint, success — not password' },

  // Session
  { id: 'session_set', text: 'Session set on successful login', category: 'Session', details: 'session["user_id"] and session["username"] stored' },
  { id: 'session_clear', text: 'Session cleared on logout', category: 'Session', details: 'session.clear() removes all session data' },
  { id: 'login_required', text: 'Dashboard requires authentication', category: 'Session', details: '@login_required decorator checks session["user_id"]' },

  // Dashboard
  { id: 'dashboard_display', text: 'Dashboard shows user info', category: 'Dashboard', details: 'Username, User ID, Login Status displayed' },
  { id: 'dashboard_no_secrets', text: 'No secrets displayed on dashboard', category: 'Dashboard', details: 'No password, hash, SECRET_KEY, or session secret shown' },

  // Logging
  { id: 'log_success', text: 'Successful login logged', category: 'Logging', details: 'log_login_attempt(username, "/login", True)' },
  { id: 'log_failure', text: 'Failed login logged', category: 'Logging', details: 'log_login_attempt(username, "/login", False)' },
  { id: 'log_no_sensitive', text: 'No sensitive data in logs', category: 'Logging', details: 'Only username, endpoint, success — no passwords or tokens' },

  // Tests
  { id: 'test_register', text: 'Registration tests pass', category: 'Tests', details: 'test_register_success, test_register_duplicate_username, test_register_missing_input' },
  { id: 'test_login', text: 'Login tests pass', category: 'Tests', details: 'test_login_success, test_login_invalid_password, test_login_unknown_user' },
  { id: 'test_dashboard', text: 'Dashboard tests pass', category: 'Tests', details: 'test_dashboard_requires_login, test_dashboard_authenticated' },
  { id: 'test_logout', text: 'Logout test passes', category: 'Tests', details: 'test_logout verifies session cleared' },
  { id: 'test_db', text: 'Database tests pass', category: 'Tests', details: 'test_user_stored_with_hashed_password, test_login_log_stored' },
  { id: 'test_isolation', text: 'Tests use isolated database', category: 'Tests', details: 'tempfile.mkstemp() creates temporary DB per test' },

  // Scripts
  { id: 'init_db', text: 'init_db.py creates database', category: 'Scripts', details: 'Creates DB file and applies schema' },
  { id: 'seed_data', text: 'seed_data.py creates lab users', category: 'Scripts', details: 'Creates student and admin accounts with hashed passwords' },
  { id: 'reset_lab', text: 'reset_lab.py resets environment', category: 'Scripts', details: 'Removes DB, recreates schema, seeds users' },

  // Docker
  { id: 'dockerfile', text: 'Dockerfile builds successfully', category: 'Docker', details: 'Python 3.11-slim, installs deps, initializes DB' },
  { id: 'docker_compose', text: 'docker-compose.yml works', category: 'Docker', details: 'docker compose up --build starts app on port 5000' },

  // Documentation
  { id: 'readme', text: 'README complete and accurate', category: 'Documentation', details: 'Overview, install, run, test, docker instructions' },
  { id: 'architecture_doc', text: 'Architecture documentation exists', category: 'Documentation', details: 'docs/ARCHITECTURE.md with flow diagrams' },

  // Security
  { id: 'no_vuln_phase2', text: 'No Phase 3 vulnerabilities implemented', category: 'Security', details: 'No SQLi, no insecure cookies, no session fixation' },
  { id: 'security_banner', text: 'Security banner displayed', category: 'Security', details: 'Warning shown on all pages about educational use only' },
  { id: 'banner_template', text: 'Security banner in base template', category: 'Security', details: 'All pages inherit the warning via base.html' },
];

export function ValidationChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>('all');

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categories = [...new Set(checklistItems.map(i => i.category))];
  const filteredItems = filter === 'all' ? checklistItems : checklistItems.filter(i => i.category === filter);
  const progress = Math.round((checked.size / checklistItems.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Validation Checklist</h1>
        <p className="text-gray-400 mt-1">Verify all Phase 2 requirements are met</p>
      </div>

      {/* Progress */}
      <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-bold text-emerald-400">{checked.size}/{checklistItems.length} ({progress}%)</span>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filter === 'all' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50' : 'bg-gray-900 text-gray-400 hover:text-gray-200'
          }`}
        >
          All ({checklistItems.length})
        </button>
        {categories.map((cat) => {
          const count = checklistItems.filter(i => i.category === cat).length;
          const checkedCount = checklistItems.filter(i => i.category === cat && checked.has(i.id)).length;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === cat ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50' : 'bg-gray-900 text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat} ({checkedCount}/{count})
            </button>
          );
        })}
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {categories
          .filter(cat => filter === 'all' || cat === filter)
          .map((cat) => {
            const items = checklistItems.filter(i => i.category === cat);
            const catChecked = items.filter(i => checked.has(i.id)).length;
            return (
              <div key={cat} className="rounded-xl border border-gray-800 overflow-hidden">
                <div className="px-4 py-2 bg-gray-900/80 border-b border-gray-800 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">{cat}</h3>
                  <span className="text-xs text-gray-500">{catChecked}/{items.length}</span>
                </div>
                <div className="divide-y divide-gray-800/30">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all ${
                        checked.has(item.id) ? 'bg-emerald-900/10' : 'hover:bg-gray-900/30'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        checked.has(item.id) ? 'bg-emerald-600' : 'border border-gray-600'
                      }`}>
                        {checked.has(item.id) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm ${checked.has(item.id) ? 'text-emerald-300 line-through' : 'text-gray-300'}`}>
                          {item.text}
                        </span>
                        {item.details && (
                          <p className="text-xs text-gray-600 mt-0.5">{item.details}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
      </div>

      {/* Phase Completion Report */}
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800">
          <h3 className="font-bold text-white">Phase 2 Completion Report</h3>
        </div>
        <div className="p-5 space-y-4 text-sm">
          <div>
            <h4 className="font-semibold text-emerald-400 mb-2">✅ Implemented</h4>
            <ul className="space-y-1 text-gray-400 text-xs">
              <li>• Flask application factory pattern</li>
              <li>• SQLite database with users and login_logs tables</li>
              <li>• User registration with bcrypt password hashing</li>
              <li>• Secure login with parameterized queries</li>
              <li>• Session-based authentication</li>
              <li>• Protected dashboard with @login_required</li>
              <li>• Login attempt logging (no sensitive data)</li>
              <li>• 14 automated pytest tests with isolated DB</li>
              <li>• Database init, seed, and reset scripts</li>
              <li>• Docker and Docker Compose configuration</li>
              <li>• Complete README and architecture docs</li>
              <li>• Security banner on all pages</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-yellow-400 mb-2">📋 Phase 3 Preparation (Integration Points)</h4>
            <ul className="space-y-1 text-gray-400 text-xs">
              <li>• <code className="text-yellow-300">app/routes/vulnerable.py</code> — Will add SQLi vulnerable login endpoint</li>
              <li>• <code className="text-yellow-300">app/routes/secure.py</code> — Will add secure comparison endpoint</li>
              <li>• <code className="text-yellow-300">app/security/vulnerable_auth.py</code> — Will add string concatenation SQL</li>
              <li>• <code className="text-yellow-300">app/security/vulnerable_session.py</code> — Will add weak session management</li>
              <li>• <code className="text-yellow-300">tests/test_sqli.py</code> — Will add SQLi test cases</li>
              <li>• <code className="text-yellow-300">tests/test_cookie.py</code> — Will add cookie flag tests</li>
              <li>• <code className="text-yellow-300">tests/test_session.py</code> — Will add session lifecycle tests</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-400 mb-2">ℹ️ Known Limitations</h4>
            <ul className="space-y-1 text-gray-500 text-xs">
              <li>• Cannot verify Python execution in this environment (React/Vite frontend only)</li>
              <li>• All source code is provided for copy-paste into local Python environment</li>
              <li>• Tests should be run locally with: pytest -v</li>
              <li>• Docker build should be verified locally with: docker compose up --build</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
