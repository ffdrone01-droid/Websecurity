import { AlertTriangle, Shield, Check, X } from 'lucide-react';

export function ComparisonPage() {
  const comparisons = [
    {
      category: 'SQL Query Construction',
      vulnerable: {
        code: `query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"`,
        issue: 'String concatenation allows query manipulation',
        risk: 'Authentication bypass, data theft, data manipulation',
      },
      secure: {
        code: `cursor.execute("SELECT * FROM users WHERE username = ?", (username,))`,
        mitigation: 'Parameterized queries treat input as data, not code',
        protection: 'SQL injection prevented',
      },
    },
    {
      category: 'Password Storage',
      vulnerable: {
        code: `# Plaintext comparison (hypothetical vulnerable code)
if user.password == input_password:
    login_success()`,
        issue: 'Passwords stored or compared in plaintext',
        risk: 'Database breach exposes all passwords',
      },
      secure: {
        code: `# bcrypt hashing
password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(12))
bcrypt.checkpw(input_password.encode(), stored_hash)`,
        mitigation: 'Cryptographic hashing with salt',
        protection: 'Passwords never stored in recoverable form',
      },
    },
    {
      category: 'Cookie Configuration',
      vulnerable: {
        code: `response.set_cookie('session_id', token,
    httponly=False,
    secure=False,
    samesite=None)`,
        issue: 'Missing security flags',
        risk: 'XSS cookie theft, MITM attacks, CSRF',
      },
      secure: {
        code: `response.set_cookie('session_id', token,
    httponly=True,
    secure=True,
    samesite='Lax')`,
        mitigation: 'Security flags prevent common attacks',
        protection: 'XSS, MITM, CSRF protection',
      },
    },
    {
      category: 'Session Management',
      vulnerable: {
        code: `# No session regeneration
session['user_id'] = user.id
# Session ID stays the same after login`,
        issue: 'Session fixation, no regeneration',
        risk: 'Session fixation attacks',
      },
      secure: {
        code: `# Regenerate session after authentication
session.clear()
session['user_id'] = user.id
session['username'] = user.username`,
        mitigation: 'Session regeneration prevents fixation',
        protection: 'Session fixation prevented',
      },
    },
    {
      category: 'Logout Handling',
      vulnerable: {
        code: `# Partial session cleanup
session.pop('user_id', None)
# Session ID still valid!`,
        issue: 'Incomplete session invalidation',
        risk: 'Session reuse after logout',
      },
      secure: {
        code: `# Complete session destruction
session.clear()
# Entire session invalidated`,
        mitigation: 'Full session destruction on logout',
        protection: 'No session reuse possible',
      },
    },
    {
      category: 'Error Messages',
      vulnerable: {
        code: `except Exception as e:
    return f"Database error: {str(e)}"`,
        issue: 'Verbose errors leak system information',
        risk: 'Information disclosure, attack surface expansion',
      },
      secure: {
        code: `except Exception as e:
    app.logger.error(f"Login error: {e}")
    return "Invalid username or password"`,
        mitigation: 'Generic error messages, detailed logging',
        protection: 'No information leakage',
      },
    },
    {
      category: 'Input Validation',
      vulnerable: {
        code: `# No validation
username = request.form['username']
password = request.form['password']
# Use directly in query`,
        issue: 'No input validation or sanitization',
        risk: 'Injection attacks, unexpected behavior',
      },
      secure: {
        code: `# Validate input
username = request.form.get('username', '').strip()
if not username or len(username) < 3:
    flash('Invalid input')
    return redirect(url_for('login'))`,
        mitigation: 'Input validation and sanitization',
        protection: 'Malformed input rejected',
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Vulnerable vs Secure Comparison</h1>
        <p className="text-gray-400 mt-1">Side-by-side comparison of vulnerable and secure implementations</p>
      </div>

      {/* Summary Table */}
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800">
          <h3 className="font-bold text-white">Comparison Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900/50 border-b border-gray-800">
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Category</th>
                <th className="px-4 py-3 text-left text-red-400 font-medium">Vulnerable</th>
                <th className="px-4 py-3 text-left text-emerald-400 font-medium">Secure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {comparisons.map((comp, i) => (
                <tr key={i} className="hover:bg-gray-900/30">
                  <td className="px-4 py-3 font-medium text-gray-200">{comp.category}</td>
                  <td className="px-4 py-3 text-xs text-red-300">{comp.vulnerable.issue}</td>
                  <td className="px-4 py-3 text-xs text-emerald-300">{comp.secure.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Comparisons */}
      <div className="space-y-4">
        {comparisons.map((comp, i) => (
          <div key={i} className="rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800">
              <h3 className="font-bold text-white">{comp.category}</h3>
            </div>
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-800">
              {/* Vulnerable */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h4 className="font-semibold text-red-300 text-sm">Vulnerable</h4>
                </div>
                <div className="p-3 rounded-lg bg-gray-950 font-mono text-xs text-red-300 mb-3 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{comp.vulnerable.code}</pre>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-500">Issue:</span>{' '}
                    <span className="text-red-200">{comp.vulnerable.issue}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Risk:</span>{' '}
                    <span className="text-red-200">{comp.vulnerable.risk}</span>
                  </div>
                </div>
              </div>

              {/* Secure */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-semibold text-emerald-300 text-sm">Secure</h4>
                </div>
                <div className="p-3 rounded-lg bg-gray-950 font-mono text-xs text-emerald-300 mb-3 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{comp.secure.code}</pre>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-500">Mitigation:</span>{' '}
                    <span className="text-emerald-200">{comp.secure.mitigation}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Protection:</span>{' '}
                    <span className="text-emerald-200">{comp.secure.protection}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Takeaways */}
      <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-800">
        <h3 className="font-bold text-white mb-3">Key Takeaways</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { title: 'Never Trust User Input', desc: 'Always validate and use parameterized queries' },
            { title: 'Defense in Depth', desc: 'Multiple layers of security controls' },
            { title: 'Secure by Default', desc: 'Configure security flags properly from the start' },
            { title: 'Session Lifecycle', desc: 'Regenerate, invalidate, and expire sessions properly' },
            { title: 'Error Handling', desc: 'Generic messages to users, detailed logging internally' },
            { title: 'Continuous Testing', desc: 'Verify fixes with automated tests' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-200">{item.title}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
