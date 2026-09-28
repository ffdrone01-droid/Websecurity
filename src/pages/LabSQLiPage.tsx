import { useState } from 'react';
import { AlertTriangle, Shield, Database, Check, X } from 'lucide-react';

export function LabSQLiPage() {
  const [vulnUsername, setVulnUsername] = useState('');
  const [vulnPassword, setVulnPassword] = useState('');
  const [vulnResult, setVulnResult] = useState<{ success: boolean; message: string; query: string } | null>(null);

  const [secUsername, setSecUsername] = useState('');
  const [secPassword, setSecPassword] = useState('');
  const [secResult, setSecResult] = useState<{ success: boolean; message: string } | null>(null);

  // Simulated database
  const users = [
    { id: 1, username: 'student', password: 'StudentLab123!' },
    { id: 2, username: 'admin', password: 'AdminLab123!' },
  ];

  // Vulnerable login simulation (string concatenation)
  const vulnerableLogin = () => {
    // VULNERABLE: String concatenation
    const query = `SELECT * FROM users WHERE username='${vulnUsername}' AND password='${vulnPassword}'`;
    
    // Simulate SQL execution
    try {
      // Check for common SQL injection patterns
      if (vulnUsername.includes("' OR ") || vulnUsername.includes("' or ") || vulnUsername === "' OR 1=1 --") {
        setVulnResult({
          success: true,
          message: `⚠️ SQL INJECTION SUCCESSFUL! Bypassed authentication. Logged in as: ${users[0].username}`,
          query: query,
        });
      } else {
        const user = users.find(u => u.username === vulnUsername && u.password === vulnPassword);
        if (user) {
          setVulnResult({
            success: true,
            message: `✓ Login successful. Welcome, ${user.username}!`,
            query: query,
          });
        } else {
          setVulnResult({
            success: false,
            message: '✗ Invalid username or password.',
            query: query,
          });
        }
      }
    } catch (e) {
      setVulnResult({
        success: false,
        message: '✗ SQL Error: ' + (e as Error).message,
        query: query,
      });
    }
  };

  // Secure login simulation (parameterized query)
  const secureLogin = () => {
    // SECURE: Parameterized query
    const user = users.find(u => u.username === secUsername);
    
    if (user && user.password === secPassword) {
      setSecResult({
        success: true,
        message: `✓ Login successful. Welcome, ${user.username}!`,
      });
    } else {
      setSecResult({
        success: false,
        message: '✗ Invalid username or password.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 text-xs font-bold">LAB 01</span>
        </div>
        <h1 className="text-3xl font-bold text-white">SQL Injection</h1>
        <p className="text-gray-400 mt-2">Understanding how user input can manipulate SQL queries</p>
      </div>

      {/* Warning */}
      <div className="p-4 rounded-lg bg-red-900/20 border border-red-800/30">
        <p className="text-sm text-red-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Educational Warning:</strong> This lab contains intentionally vulnerable code.
            Use only in isolated environments. The vulnerable implementation demonstrates why string
            concatenation in SQL queries is dangerous.
          </span>
        </p>
      </div>

      {/* Objective */}
      <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-800">
        <h2 className="text-lg font-bold text-white mb-3">Objective</h2>
        <p className="text-sm text-gray-300 mb-2">
          Understand how SQL injection works when applications build SQL queries using string concatenation
          instead of parameterized queries.
        </p>
        <div className="mt-4 p-3 rounded-lg bg-gray-950 font-mono text-xs text-gray-400">
          <div className="text-gray-500 mb-1">Attack Flow:</div>
          <div>User Input → Flask Route → SQL Query (string concat) → SQLite → Auth Bypass</div>
        </div>
      </div>

      {/* Vulnerable Implementation */}
      <div className="rounded-xl border border-red-800/30 overflow-hidden">
        <div className="px-5 py-3 bg-red-900/10 border-b border-red-800/30 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h3 className="font-bold text-red-300">Vulnerable Implementation</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-lg bg-gray-950 font-mono text-xs">
            <div className="text-gray-500 mb-2"># VULNERABLE: String concatenation</div>
            <div className="text-red-300">query = f"SELECT * FROM users WHERE username='{`{username}`}' AND password='{`{password}`}'"</div>
            <div className="text-gray-400 mt-2">cursor.execute(query)</div>
          </div>

          <div className="p-4 rounded-lg bg-yellow-900/10 border border-yellow-800/30">
            <h4 className="text-sm font-semibold text-yellow-300 mb-2">Root Cause</h4>
            <p className="text-xs text-yellow-200/80">
              User-controlled input is directly incorporated into the SQL query string without sanitization
              or parameterization. This allows attackers to manipulate the query structure.
            </p>
          </div>

          {/* Interactive Demo */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-white mb-3">Try It: Vulnerable Login</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Username</label>
                  <input
                    type="text"
                    value={vulnUsername}
                    onChange={e => setVulnUsername(e.target.value)}
                    placeholder="Try: ' OR 1=1 --"
                    className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm text-gray-200 focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Password</label>
                  <input
                    type="text"
                    value={vulnPassword}
                    onChange={e => setVulnPassword(e.target.value)}
                    placeholder="Any value"
                    className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm text-gray-200 focus:border-red-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={vulnerableLogin}
                  className="w-full py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
                >
                  Login (Vulnerable)
                </button>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-gray-500">Test Credentials:</div>
                <div className="text-xs font-mono text-gray-400">student / StudentLab123!</div>
                <div className="text-xs font-mono text-gray-400">admin / AdminLab123!</div>
                <div className="mt-3 text-xs text-gray-500">SQL Injection Payloads:</div>
                <div className="text-xs font-mono text-red-300">' OR 1=1 --</div>
                <div className="text-xs font-mono text-red-300">' OR '1'='1</div>
                <div className="text-xs font-mono text-red-300">admin' --</div>
              </div>
            </div>

            {vulnResult && (
              <div className={`mt-4 p-3 rounded-lg ${
                vulnResult.success ? 'bg-emerald-900/20 border border-emerald-800/30' : 'bg-red-900/20 border border-red-800/30'
              }`}>
                <div className="text-sm font-medium mb-2">{vulnResult.message}</div>
                <div className="text-xs text-gray-500 mb-1">Generated SQL Query:</div>
                <div className="p-2 rounded bg-gray-950 font-mono text-xs text-gray-400 overflow-x-auto">
                  {vulnResult.query}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secure Implementation */}
      <div className="rounded-xl border border-emerald-800/30 overflow-hidden">
        <div className="px-5 py-3 bg-emerald-900/10 border-b border-emerald-800/30 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-emerald-300">Secure Implementation</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-lg bg-gray-950 font-mono text-xs">
            <div className="text-gray-500 mb-2"># SECURE: Parameterized query</div>
            <div className="text-emerald-300">cursor.execute("SELECT * FROM users WHERE username = ?", (username,))</div>
            <div className="text-gray-400 mt-2">user = cursor.fetchone()</div>
            <div className="text-gray-400">if user and bcrypt.checkpw(password.encode(), user['password_hash']):</div>
          </div>

          <div className="p-4 rounded-lg bg-emerald-900/10 border border-emerald-800/30">
            <h4 className="text-sm font-semibold text-emerald-300 mb-2">Mitigation</h4>
            <p className="text-xs text-emerald-200/80">
              Parameterized queries treat user input as data, not as part of the SQL command structure.
              The database driver properly escapes special characters, preventing query manipulation.
            </p>
          </div>

          {/* Interactive Demo */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-white mb-3">Try It: Secure Login</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Username</label>
                  <input
                    type="text"
                    value={secUsername}
                    onChange={e => setSecUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Password</label>
                  <input
                    type="password"
                    value={secPassword}
                    onChange={e => setSecPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={secureLogin}
                  className="w-full py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
                >
                  Login (Secure)
                </button>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-gray-500">Try SQL Injection:</div>
                <div className="text-xs font-mono text-gray-400">' OR 1=1 --</div>
                <div className="text-xs text-gray-500 mt-2">Result:</div>
                <div className="text-xs text-emerald-300">✓ Injection blocked — treated as literal string</div>
              </div>
            </div>

            {secResult && (
              <div className={`mt-4 p-3 rounded-lg ${
                secResult.success ? 'bg-emerald-900/20 border border-emerald-800/30' : 'bg-red-900/20 border border-red-800/30'
              }`}>
                <div className="text-sm font-medium">{secResult.message}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Impact & Mitigation */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-red-900/10 border border-red-800/30">
          <h3 className="font-bold text-red-300 mb-3">Impact</h3>
          <ul className="space-y-2 text-sm text-red-200/80">
            <li className="flex items-start gap-2">
              <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Authentication bypass without valid credentials</span>
            </li>
            <li className="flex items-start gap-2">
              <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Unauthorized data access (UNION-based attacks)</span>
            </li>
            <li className="flex items-start gap-2">
              <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Data manipulation (INSERT/UPDATE/DELETE)</span>
            </li>
            <li className="flex items-start gap-2">
              <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Database structure disclosure</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-xl bg-emerald-900/10 border border-emerald-800/30">
          <h3 className="font-bold text-emerald-300 mb-3">Mitigation</h3>
          <ul className="space-y-2 text-sm text-emerald-200/80">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Use parameterized queries (prepared statements)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Input validation and sanitization</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Principle of least privilege (database permissions)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Web Application Firewall (WAF) as additional layer</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Retest */}
      <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-800">
        <h3 className="font-bold text-white mb-3">Retest After Mitigation</h3>
        <p className="text-sm text-gray-400 mb-3">
          After implementing parameterized queries, verify that SQL injection payloads are treated as literal strings:
        </p>
        <div className="p-3 rounded-lg bg-gray-950 font-mono text-xs text-gray-400">
          <div>Input: <span className="text-red-300">' OR 1=1 --</span></div>
          <div className="mt-1">Query: <span className="text-emerald-300">SELECT * FROM users WHERE username = ?</span></div>
          <div className="mt-1">Result: <span className="text-emerald-300">No user found (literal string match)</span></div>
        </div>
      </div>
    </div>
  );
}
