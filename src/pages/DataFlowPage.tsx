import { useState } from 'react';

type FlowType = 'auth' | 'sqli' | 'session' | 'cookie';

export function DataFlowPage() {
  const [activeFlow, setActiveFlow] = useState<FlowType>('auth');

  const flows: Record<FlowType, { title: string; description: string; steps: { label: string; detail: string; color: string }[] }> = {
    auth: {
      title: 'Authentication Flow',
      description: 'How user login flows through the application',
      steps: [
        { label: 'User Input', detail: 'Username + Password submitted via form', color: 'blue' },
        { label: 'HTTP Request', detail: 'POST /login with form data', color: 'blue' },
        { label: 'Route Handler', detail: 'auth.login() receives request', color: 'emerald' },
        { label: 'Input Validation', detail: 'Check required fields, sanitize', color: 'emerald' },
        { label: 'Database Query', detail: 'SELECT user WHERE username = ?', color: 'purple' },
        { label: 'Password Verification', detail: 'bcrypt.checkpw(input, stored_hash)', color: 'emerald' },
        { label: 'Session Creation', detail: 'Generate secure session ID, set cookie', color: 'green' },
        { label: 'Log Entry', detail: 'Record login attempt in login_logs', color: 'orange' },
        { label: 'Redirect', detail: '→ /dashboard or error page', color: 'blue' },
      ],
    },
    sqli: {
      title: 'SQL Injection Attack Flow',
      description: 'How SQL injection works in the vulnerable implementation',
      steps: [
        { label: 'User Input', detail: 'Attacker enters: \' OR 1=1 --', color: 'red' },
        { label: 'HTTP Request', detail: 'POST /lab/vulnerable-login', color: 'blue' },
        { label: 'Route Handler', detail: 'vulnerable.login() receives request', color: 'emerald' },
        { label: 'String Concatenation', detail: 'query = f"SELECT * FROM users WHERE username=\'{input}\'"', color: 'red' },
        { label: 'Resulting Query', detail: 'SELECT * FROM users WHERE username=\'\' OR 1=1 --\'', color: 'red' },
        { label: 'Database Execution', detail: 'Query returns ALL rows (1=1 is always true)', color: 'purple' },
        { label: 'Authentication Bypass', detail: 'Application logs in as first returned user', color: 'red' },
        { label: 'Impact', detail: 'Unauthorized access without valid credentials', color: 'red' },
      ],
    },
    session: {
      title: 'Session Lifecycle Flow',
      description: 'How sessions are created, maintained, and destroyed',
      steps: [
        { label: 'Login Success', detail: 'Authentication verified', color: 'green' },
        { label: 'Session ID Generation', detail: 'secrets.token_hex(32) — 64 char hex', color: 'emerald' },
        { label: 'Store in DB', detail: 'INSERT INTO sessions (user_id, session_identifier, expires_at)', color: 'purple' },
        { label: 'Set Cookie', detail: 'Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=Lax', color: 'emerald' },
        { label: 'Subsequent Requests', detail: 'Browser sends cookie with each request', color: 'blue' },
        { label: 'Session Lookup', detail: 'SELECT * FROM sessions WHERE session_identifier = ? AND expires_at > now', color: 'purple' },
        { label: 'Session Valid', detail: 'User authenticated, request processed', color: 'green' },
        { label: 'Logout', detail: 'UPDATE sessions SET invalidated_at = now WHERE session_identifier = ?', color: 'emerald' },
        { label: 'Cookie Cleared', detail: 'Set-Cookie: session_id=; Max-Age=0', color: 'emerald' },
      ],
    },
    cookie: {
      title: 'Cookie Security Flow',
      description: 'How cookie flags affect security',
      steps: [
        { label: 'Server Sets Cookie', detail: 'Set-Cookie header in HTTP response', color: 'emerald' },
        { label: 'Browser Stores', detail: 'Cookie stored with associated flags', color: 'blue' },
        { label: 'HttpOnly Flag', detail: 'JavaScript cannot access via document.cookie', color: 'green' },
        { label: 'Secure Flag', detail: 'Cookie only sent over HTTPS connections', color: 'green' },
        { label: 'SameSite=Lax', detail: 'Cookie not sent with cross-site POST requests', color: 'green' },
        { label: 'XSS Attack Attempt', detail: 'Attacker tries: document.cookie → blocked by HttpOnly', color: 'red' },
        { label: 'CSRF Attack Attempt', detail: 'Cross-site form submit → blocked by SameSite', color: 'red' },
        { label: 'MITM Attack Attempt', detail: 'HTTP interception → blocked by Secure flag', color: 'red' },
      ],
    },
  };

  const currentFlow = flows[activeFlow];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Data Flow Diagrams</h1>
        <p className="text-gray-400 mt-1">Visualize how data moves through the application</p>
      </div>

      {/* Flow Selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(flows) as [FlowType, typeof flows[FlowType]][]).map(([key, flow]) => (
          <button
            key={key}
            onClick={() => setActiveFlow(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFlow === key
                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50'
                : 'bg-gray-900 text-gray-400 hover:text-gray-200 border border-gray-800'
            }`}
          >
            {flow.title}
          </button>
        ))}
      </div>

      {/* Flow Description */}
      <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
        <h2 className="text-lg font-semibold text-white">{currentFlow.title}</h2>
        <p className="text-sm text-gray-400 mt-1">{currentFlow.description}</p>
      </div>

      {/* Flow Diagram */}
      <div className="space-y-3">
        {currentFlow.steps.map((step, i) => {
          const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
            blue: { bg: 'bg-blue-900/10', border: 'border-blue-800/30', text: 'text-blue-300', dot: 'bg-blue-500' },
            emerald: { bg: 'bg-emerald-900/10', border: 'border-emerald-800/30', text: 'text-emerald-300', dot: 'bg-emerald-500' },
            green: { bg: 'bg-green-900/10', border: 'border-green-800/30', text: 'text-green-300', dot: 'bg-green-500' },
            purple: { bg: 'bg-purple-900/10', border: 'border-purple-800/30', text: 'text-purple-300', dot: 'bg-purple-500' },
            orange: { bg: 'bg-orange-900/10', border: 'border-orange-800/30', text: 'text-orange-300', dot: 'bg-orange-500' },
            red: { bg: 'bg-red-900/10', border: 'border-red-800/30', text: 'text-red-300', dot: 'bg-red-500' },
          };
          const colors = colorMap[step.color] || colorMap.blue;

          return (
            <div key={i} className="flex items-stretch gap-3">
              {/* Step number and connector */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full ${colors.dot} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {i + 1}
                </div>
                {i < currentFlow.steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gray-700 my-1" />
                )}
              </div>

              {/* Step content */}
              <div className={`flex-1 p-3 rounded-lg ${colors.bg} border ${colors.border} mb-1`}>
                <div className={`font-semibold text-sm ${colors.text}`}>{step.label}</div>
                <div className="text-xs text-gray-400 mt-0.5 font-mono">{step.detail}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SQL Injection Comparison */}
      {activeFlow === 'sqli' && (
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-red-900/5 border border-red-800/30">
            <h3 className="text-sm font-bold text-red-400 mb-2">❌ Vulnerable Code</h3>
            <pre className="text-xs text-gray-300 font-mono overflow-x-auto">{`# VULNERABLE
# ROOT CAUSE: String concatenation
# WHY THIS IS DANGEROUS: User input
# becomes part of the SQL command

query = f"""
  SELECT * FROM users
  WHERE username = '{username}'
  AND password = '{password}'
"""
cursor.execute(query)`}</pre>
          </div>
          <div className="p-4 rounded-xl bg-green-900/5 border border-green-800/30">
            <h3 className="text-sm font-bold text-green-400 mb-2">✅ Secure Code</h3>
            <pre className="text-xs text-gray-300 font-mono overflow-x-auto">{`# SECURE
# MITIGATION: Parameterized query
# WHY PARAMETERIZATION WORKS:
# Input is treated as data, not code

cursor.execute(
  """SELECT * FROM users
     WHERE username = ?""",
  (username,)
)
# Password verified separately with bcrypt`}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
