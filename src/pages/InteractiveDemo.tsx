import { useState } from 'react';
import { Shield, User, Lock, LogIn, LogOut, LayoutDashboard, AlertTriangle, Check } from 'lucide-react';

type DemoPage = 'landing' | 'register' | 'login' | 'dashboard' | 'labs';

interface UserAccount {
  username: string;
  passwordHash: string;
  id: number;
}

interface LogEntry {
  timestamp: string;
  username: string;
  endpoint: string;
  success: boolean;
}

// Simulate bcrypt (simplified for demo)
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `$2b$12$${Math.abs(hash).toString(36).padStart(22, '0')}`;
}

export function InteractiveDemo() {
  const [currentPage, setCurrentPage] = useState<DemoPage>('landing');
  const [users, setUsers] = useState<UserAccount[]>([
    { username: 'student', passwordHash: simpleHash('StudentLab123!'), id: 1 },
    { username: 'admin', passwordHash: simpleHash('AdminLab123!'), id: 2 },
  ]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [flashMessage, setFlashMessage] = useState<{ type: string; text: string } | null>(null);

  // Form states
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const addLog = (username: string, endpoint: string, success: boolean) => {
    setLogs(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      username,
      endpoint,
      success,
    }]);
  };

  const showFlash = (type: string, text: string) => {
    setFlashMessage({ type, text });
    setTimeout(() => setFlashMessage(null), 4000);
  };

  const handleRegister = () => {
    const username = regUsername.trim();

    if (!username) {
      showFlash('error', 'Username is required.');
      return;
    }
    if (username.length < 3) {
      showFlash('error', 'Username must be at least 3 characters.');
      return;
    }
    if (!regPassword) {
      showFlash('error', 'Password is required.');
      return;
    }
    if (regPassword.length < 8) {
      showFlash('error', 'Password must be at least 8 characters.');
      return;
    }
    if (regPassword !== regConfirm) {
      showFlash('error', 'Passwords do not match.');
      return;
    }
    if (users.find(u => u.username === username)) {
      showFlash('error', 'Username already exists. Please choose another.');
      return;
    }

    const newUser: UserAccount = {
      username,
      passwordHash: simpleHash(regPassword),
      id: users.length + 1,
    };
    setUsers(prev => [...prev, newUser]);
    setRegUsername('');
    setRegPassword('');
    setRegConfirm('');
    showFlash('success', 'Registration successful! Please log in.');
    setCurrentPage('login');
  };

  const handleLogin = () => {
    const username = loginUsername.trim();
    if (!username || !loginPassword) {
      showFlash('error', 'Please enter both username and password.');
      addLog(username || '(empty)', '/login', false);
      return;
    }

    const user = users.find(u => u.username === username);
    if (user && user.passwordHash === simpleHash(loginPassword)) {
      setCurrentUser(user);
      addLog(username, '/login', true);
      showFlash('success', `Welcome back, ${username}!`);
      setLoginUsername('');
      setLoginPassword('');
      setCurrentPage('dashboard');
    } else {
      addLog(username, '/login', false);
      showFlash('error', 'Invalid username or password.');
    }
  };

  const handleLogout = () => {
    const name = currentUser?.username || 'unknown';
    setCurrentUser(null);
    showFlash('success', `Goodbye, ${name}. You have been logged out.`);
    setCurrentPage('login');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Interactive Demo</h1>
        <p className="text-gray-400 mt-1">Simulated Flask application — try the authentication flow</p>
      </div>

      {/* Security Banner */}
      <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/30 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
        <span className="text-xs text-red-300">
          This is a simulation. The actual Flask app runs on localhost with real bcrypt hashing.
        </span>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Simulated Browser */}
        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            {/* Browser Chrome */}
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 px-3 py-1 rounded bg-gray-900 text-xs text-gray-400 font-mono">
                http://127.0.0.1:5000{currentPage === 'landing' ? '/' : currentPage === 'dashboard' ? '/dashboard' : currentPage === 'labs' ? '/labs' : `/${currentPage}`}
              </div>
            </div>

            {/* Security Banner (simulated) */}
            <div className="px-3 py-2 bg-red-900/60 border-b border-red-800/50 text-center">
              <span className="text-[10px] text-red-200">
                ⚠ WARNING: This application is designed for cybersecurity education.
                Run only in an isolated laboratory environment.
              </span>
            </div>

            {/* Navigation (simulated) */}
            <div className="px-4 py-2 bg-gray-900/80 border-b border-gray-800 flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-400">🛡️ Web Security Lab</span>
              <div className="flex gap-3 text-xs">
                <button onClick={() => setCurrentPage('landing')} className="text-gray-400 hover:text-white">Home</button>
                <button onClick={() => setCurrentPage('labs')} className="text-gray-400 hover:text-white">Labs</button>
                {currentUser ? (
                  <>
                    <button onClick={() => setCurrentPage('dashboard')} className="text-gray-400 hover:text-white">Dashboard</button>
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-300">Logout</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setCurrentPage('login')} className="text-gray-400 hover:text-white">Login</button>
                    <button onClick={() => setCurrentPage('register')} className="text-gray-400 hover:text-white">Register</button>
                  </>
                )}
              </div>
            </div>

            {/* Flash Message */}
            {flashMessage && (
              <div className={`px-4 py-2 text-sm ${
                flashMessage.type === 'error'
                  ? 'bg-red-900/30 text-red-200 border-b border-red-800/30'
                  : 'bg-green-900/30 text-green-200 border-b border-green-800/30'
              }`}>
                {flashMessage.text}
              </div>
            )}

            {/* Page Content */}
            <div className="p-6 min-h-[400px] bg-gray-950/50">
              {currentPage === 'landing' && (
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Web Application Security Vulnerable Lab</h2>
                  <p className="text-emerald-400 mb-4">Educational Cybersecurity Laboratory</p>
                  <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                    Learn web application security through hands-on practice with intentionally vulnerable and secure implementations.
                  </p>
                  <div className="flex gap-3 justify-center">
                    {!currentUser ? (
                      <>
                        <button onClick={() => setCurrentPage('login')} className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">Login</button>
                        <button onClick={() => setCurrentPage('register')} className="px-5 py-2 rounded-lg bg-gray-800 text-gray-200 text-sm font-medium border border-gray-700 hover:bg-gray-700">Register</button>
                      </>
                    ) : (
                      <button onClick={() => setCurrentPage('dashboard')} className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">Dashboard</button>
                    )}
                    <button onClick={() => setCurrentPage('labs')} className="px-5 py-2 rounded-lg border border-emerald-600 text-emerald-400 text-sm font-medium hover:bg-emerald-900/30">Security Labs</button>
                  </div>
                </div>
              )}

              {currentPage === 'register' && (
                <div className="max-w-sm mx-auto">
                  <h2 className="text-xl font-bold text-white mb-1">Register</h2>
                  <p className="text-gray-500 text-sm mb-4">Create a new lab account.</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Username</label>
                      <input
                        type="text"
                        value={regUsername}
                        onChange={e => setRegUsername(e.target.value)}
                        placeholder="Choose a username"
                        className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Password</label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Confirm Password</label>
                      <input
                        type="password"
                        value={regConfirm}
                        onChange={e => setRegConfirm(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <button onClick={handleRegister} className="w-full py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">Register</button>
                    <p className="text-center text-xs text-gray-500">
                      Already have an account?{' '}
                      <button onClick={() => setCurrentPage('login')} className="text-emerald-400 hover:underline">Login here</button>
                    </p>
                  </div>
                </div>
              )}

              {currentPage === 'login' && (
                <div className="max-w-sm mx-auto">
                  <h2 className="text-xl font-bold text-white mb-1">Login</h2>
                  <p className="text-gray-500 text-sm mb-4">Enter your credentials to access the lab.</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Username</label>
                      <input
                        type="text"
                        value={loginUsername}
                        onChange={e => setLoginUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Password</label>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm text-gray-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <button onClick={handleLogin} className="w-full py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">Login</button>
                    <p className="text-center text-xs text-gray-500">
                      Don't have an account?{' '}
                      <button onClick={() => setCurrentPage('register')} className="text-emerald-400 hover:underline">Register here</button>
                    </p>
                    <div className="mt-3 p-2 rounded bg-gray-900/50 border border-gray-800 text-[10px] text-gray-500">
                      Hint: Try student / StudentLab123! or admin / AdminLab123!
                    </div>
                  </div>
                </div>
              )}

              {currentPage === 'dashboard' && currentUser && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Welcome, {currentUser.username}</h2>
                  <p className="text-gray-500 text-sm mb-6">Your security lab dashboard</p>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-gray-900/80 border border-gray-800">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">Username</div>
                      <div className="text-sm font-semibold text-white mt-1">{currentUser.username}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-900/80 border border-gray-800">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">User ID</div>
                      <div className="text-sm font-semibold text-white mt-1">{currentUser.id}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-900/80 border border-gray-800">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">Status</div>
                      <div className="text-sm font-semibold text-emerald-400 mt-1">✓ Authenticated</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setCurrentPage('labs')} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700">🔬 Security Labs</button>
                    <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700">🚪 Logout</button>
                  </div>
                </div>
              )}

              {currentPage === 'labs' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Security Laboratories</h2>
                  <p className="text-gray-500 text-sm mb-4">Hands-on security labs for learning web application vulnerabilities.</p>
                  <div className="grid gap-3">
                    {['SQL Injection Lab', 'Cookie Security Lab', 'Session Security Lab', 'Authentication Security Lab', 'Mitigation & Retest Lab'].map((lab) => (
                      <div key={lab} className="p-4 rounded-lg bg-gray-900/80 border border-gray-800">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-200 text-sm">{lab}</h3>
                          <span className="px-2 py-0.5 rounded bg-yellow-900/30 text-yellow-300 text-[10px]">Coming in Phase 3</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Server Logs Panel */}
        <div className="col-span-12 lg:col-span-4">
          <div className="rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-4 py-2 bg-gray-900/80 border-b border-gray-800 flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400">📋 Server Logs</span>
              <span className="text-[10px] text-gray-600">(login_logs table)</span>
            </div>
            <div className="p-3 max-h-[500px] overflow-y-auto bg-gray-950">
              {logs.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-4">No log entries yet. Try logging in or registering.</p>
              ) : (
                <div className="space-y-2">
                  {logs.slice().reverse().map((log, i) => (
                    <div key={i} className="p-2 rounded bg-gray-900/50 border border-gray-800/50 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{log.timestamp}</span>
                        {log.success ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-red-400" />
                        )}
                      </div>
                      <div className="mt-1 font-mono">
                        <span className="text-gray-400">user:</span> <span className="text-blue-300">{log.username}</span>
                      </div>
                      <div className="font-mono">
                        <span className="text-gray-400">endpoint:</span> <span className="text-emerald-300">{log.endpoint}</span>
                      </div>
                      <div className="font-mono">
                        <span className="text-gray-400">success:</span>{' '}
                        <span className={log.success ? 'text-emerald-300' : 'text-red-300'}>{log.success ? 'true' : 'false'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Database State */}
          <div className="rounded-xl border border-gray-800 overflow-hidden mt-4">
            <div className="px-4 py-2 bg-gray-900/80 border-b border-gray-800">
              <span className="text-xs font-medium text-gray-400">🗄️ Database (users table)</span>
            </div>
            <div className="p-3 bg-gray-950">
              <div className="space-y-1">
                {users.map((u) => (
                  <div key={u.id} className="p-2 rounded bg-gray-900/50 text-[11px] font-mono">
                    <span className="text-gray-500">id:</span> <span className="text-white">{u.id}</span>{' '}
                    <span className="text-gray-500">user:</span> <span className="text-blue-300">{u.username}</span>{' '}
                    <span className="text-gray-500">hash:</span> <span className="text-gray-600">{u.passwordHash.substring(0, 15)}...</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Session State */}
          <div className="rounded-xl border border-gray-800 overflow-hidden mt-4">
            <div className="px-4 py-2 bg-gray-900/80 border-b border-gray-800">
              <span className="text-xs font-medium text-gray-400">🔑 Session State</span>
            </div>
            <div className="p-3 bg-gray-950">
              {currentUser ? (
                <div className="space-y-1 text-[11px] font-mono">
                  <div><span className="text-gray-500">user_id:</span> <span className="text-emerald-300">{currentUser.id}</span></div>
                  <div><span className="text-gray-500">username:</span> <span className="text-emerald-300">{currentUser.username}</span></div>
                  <div><span className="text-gray-500">authenticated:</span> <span className="text-emerald-300">true</span></div>
                </div>
              ) : (
                <p className="text-[11px] text-gray-600 text-center">No active session</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
