import { useState } from 'react';
import { AlertTriangle, Shield, RefreshCw, XCircle } from 'lucide-react';

export function LabSessionPage() {
  const [vulnSession, setVulnSession] = useState<string | null>(null);
  const [vulnAuth, setVulnAuth] = useState(false);
  const [secSession, setSecSession] = useState<string | null>(null);
  const [secAuth, setSecAuth] = useState(false);

  const simulateVulnLogin = () => {
    if (!vulnSession) setVulnSession('sess_fixed_12345');
    setVulnAuth(true);
  };

  const simulateVulnLogout = () => {
    setVulnAuth(false);
    // VULNERABLE: Session ID stays the same!
  };

  const simulateSecLogin = () => {
    const oldSession = secSession;
    setSecSession('sess_' + Math.random().toString(36).substr(2, 16));
    setSecAuth(true);
  };

  const simulateSecLogout = () => {
    setSecSession(null);
    setSecAuth(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded bg-purple-600/20 text-purple-400 text-xs font-bold">LAB 03</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Session Security</h1>
        <p className="text-gray-400 mt-2">Understanding session lifecycle, fixation, regeneration, and invalidation</p>
      </div>

      {/* Warning */}
      <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-800/30">
        <p className="text-sm text-purple-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Educational Warning:</strong> This lab demonstrates session management vulnerabilities.
            All demonstrations are self-contained within the lab environment.
          </span>
        </p>
      </div>

      {/* Objective */}
      <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-800">
        <h2 className="text-lg font-bold text-white mb-3">Objective</h2>
        <p className="text-sm text-gray-300">
          Understand session lifecycle management: session fixation, session regeneration after authentication,
          proper session invalidation on logout, and session expiration.
        </p>
        <div className="mt-4 p-3 rounded-lg bg-gray-950 font-mono text-xs text-gray-400">
          <div className="text-gray-500 mb-1">Secure Session Lifecycle:</div>
          <div>Anonymous → Login → <span className="text-emerald-300">Regenerate Session</span> → Authenticated → Logout → <span className="text-emerald-300">Invalidate Session</span> → Anonymous</div>
        </div>
      </div>

      {/* Vulnerable Session */}
      <div className="rounded-xl border border-red-800/30 overflow-hidden">
        <div className="px-5 py-3 bg-red-900/10 border-b border-red-800/30 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h3 className="font-bold text-red-300">Vulnerable Session Management</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-lg bg-gray-950 font-mono text-xs">
            <div className="text-gray-500 mb-2"># VULNERABLE: No session regeneration</div>
            <div className="text-red-300"># Session ID stays the same after login</div>
            <div className="text-gray-400">session['user_id'] = user.id</div>
            <div className="text-gray-400">session['username'] = user.username</div>
            <div className="text-red-300 mt-2"># VULNERABLE: No proper invalidation on logout</div>
            <div className="text-gray-400">session.pop('user_id', None)</div>
            <div className="text-red-300"># Session ID still valid!</div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-red-900/10 border border-red-800/20">
              <h4 className="text-xs font-semibold text-red-300 mb-1">Session Fixation</h4>
              <p className="text-[10px] text-red-200/70">Session ID doesn't change after authentication</p>
            </div>
            <div className="p-3 rounded-lg bg-red-900/10 border border-red-800/20">
              <h4 className="text-xs font-semibold text-red-300 mb-1">Weak Logout</h4>
              <p className="text-[10px] text-red-200/70">Session ID remains valid after logout</p>
            </div>
            <div className="p-3 rounded-lg bg-red-900/10 border border-red-800/20">
              <h4 className="text-xs font-semibold text-red-300 mb-1">No Expiration</h4>
              <p className="text-[10px] text-red-200/70">Session never expires</p>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="mt-4 p-4 rounded-lg bg-gray-950 border border-gray-800">
            <h4 className="text-sm font-semibold text-white mb-3">Session State (Vulnerable)</h4>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Session ID:</span>
                <span className={vulnSession ? 'text-red-300' : 'text-gray-600'}>
                  {vulnSession || '(none)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Authenticated:</span>
                <span className={vulnAuth ? 'text-emerald-300' : 'text-gray-600'}>
                  {vulnAuth ? 'true' : 'false'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Session Regenerated:</span>
                <span className="text-red-300">false ⚠</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={simulateVulnLogin}
                className="px-3 py-1.5 rounded bg-red-600 text-white text-xs hover:bg-red-700"
              >
                Login
              </button>
              <button
                onClick={simulateVulnLogout}
                className="px-3 py-1.5 rounded bg-gray-700 text-gray-300 text-xs hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
            {vulnAuth && (
              <div className="mt-2 p-2 rounded bg-red-900/20 text-[10px] text-red-300">
                ⚠ Notice: Session ID stayed the same after login (session fixation vulnerability)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secure Session */}
      <div className="rounded-xl border border-emerald-800/30 overflow-hidden">
        <div className="px-5 py-3 bg-emerald-900/10 border-b border-emerald-800/30 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-emerald-300">Secure Session Management</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-lg bg-gray-950 font-mono text-xs">
            <div className="text-gray-500 mb-2"># SECURE: Session regeneration after login</div>
            <div className="text-emerald-300">session.clear()  # Clear old session</div>
            <div className="text-gray-400">session['user_id'] = user.id</div>
            <div className="text-gray-400">session['username'] = user.username</div>
            <div className="text-emerald-300 mt-2"># SECURE: Proper invalidation on logout</div>
            <div className="text-emerald-300">session.clear()  # Destroy entire session</div>
            <div className="text-gray-500 mt-2"># Additional security:</div>
            <div className="text-gray-400">session.permanent = True</div>
            <div className="text-gray-400">app.permanent_session_lifetime = timedelta(minutes=30)</div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-emerald-900/10 border border-emerald-800/20">
              <h4 className="text-xs font-semibold text-emerald-300 mb-1 flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Regeneration
              </h4>
              <p className="text-[10px] text-emerald-200/70">New session ID after authentication</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-900/10 border border-emerald-800/20">
              <h4 className="text-xs font-semibold text-emerald-300 mb-1 flex items-center gap-1">
                <XCircle className="w-3 h-3" /> Invalidation
              </h4>
              <p className="text-[10px] text-emerald-200/70">Complete session destruction on logout</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-900/10 border border-emerald-800/20">
              <h4 className="text-xs font-semibold text-emerald-300 mb-1">Expiration</h4>
              <p className="text-[10px] text-emerald-200/70">Configurable session timeout</p>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="mt-4 p-4 rounded-lg bg-gray-950 border border-gray-800">
            <h4 className="text-sm font-semibold text-white mb-3">Session State (Secure)</h4>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Session ID:</span>
                <span className={secSession ? 'text-emerald-300' : 'text-gray-600'}>
                  {secSession || '(none)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Authenticated:</span>
                <span className={secAuth ? 'text-emerald-300' : 'text-gray-600'}>
                  {secAuth ? 'true' : 'false'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Session Regenerated:</span>
                <span className="text-emerald-300">true ✓</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={simulateSecLogin}
                className="px-3 py-1.5 rounded bg-emerald-600 text-white text-xs hover:bg-emerald-700"
              >
                Login (Regenerate)
              </button>
              <button
                onClick={simulateSecLogout}
                className="px-3 py-1.5 rounded bg-gray-700 text-gray-300 text-xs hover:bg-gray-600"
              >
                Logout (Invalidate)
              </button>
            </div>
            {secAuth && (
              <div className="mt-2 p-2 rounded bg-emerald-900/20 text-[10px] text-emerald-300">
                ✓ Session ID changed after login (fixation prevented)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attack Scenarios */}
      <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-800">
        <h3 className="font-bold text-white mb-3">Session Attack Scenarios</h3>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-red-900/10 border border-red-800/20">
            <h4 className="text-sm font-semibold text-red-300 mb-1">Session Fixation Attack</h4>
            <p className="text-xs text-gray-400 mb-2">
              Attacker sets a known session ID, then waits for victim to authenticate with that same session.
            </p>
            <div className="font-mono text-[10px] text-gray-500">
              Attacker → sets session_id=fixed123 → Victim logs in → Attacker uses fixed123 → Access granted!
            </div>
            <div className="mt-2 text-xs text-emerald-300">
              ✓ Mitigation: Regenerate session ID after successful authentication
            </div>
          </div>

          <div className="p-3 rounded-lg bg-red-900/10 border border-red-800/20">
            <h4 className="text-sm font-semibold text-red-300 mb-1">Session Hijacking</h4>
            <p className="text-xs text-gray-400 mb-2">
              Attacker steals a valid session ID (via XSS, network sniffing) and uses it to impersonate the user.
            </p>
            <div className="mt-2 text-xs text-emerald-300">
              ✓ Mitigation: HttpOnly + Secure cookies, short session lifetime
            </div>
          </div>
        </div>
      </div>

      {/* Retest */}
      <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-800">
        <h3 className="font-bold text-white mb-3">Retest After Mitigation</h3>
        <p className="text-sm text-gray-400 mb-3">
          Verify session behavior after implementing secure session management:
        </p>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span className="text-gray-300">Session ID changes after login</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span className="text-gray-300">Old session ID is invalidated</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span className="text-gray-300">Logout completely destroys session</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span className="text-gray-300">Session expires after configured timeout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
