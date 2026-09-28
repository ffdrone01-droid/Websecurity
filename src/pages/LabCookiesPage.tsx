import { useState } from 'react';
import { AlertTriangle, Shield, Check, X } from 'lucide-react';

export function LabCookiesPage() {
  const [vulnDemo, setVulnDemo] = useState(false);
  const [secDemo, setSecDemo] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded bg-orange-600/20 text-orange-400 text-xs font-bold">LAB 02</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Cookie Security</h1>
        <p className="text-gray-400 mt-2">Understanding cookie flags and their security implications</p>
      </div>

      {/* Warning */}
      <div className="p-4 rounded-lg bg-orange-900/20 border border-orange-800/30">
        <p className="text-sm text-orange-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Educational Warning:</strong> This lab demonstrates cookie security flags.
            The vulnerable configuration shows weak settings for learning purposes only.
          </span>
        </p>
      </div>

      {/* Objective */}
      <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-800">
        <h2 className="text-lg font-bold text-white mb-3">Objective</h2>
        <p className="text-sm text-gray-300">
          Understand HTTP cookie security attributes: HttpOnly, Secure, SameSite, and how they protect
          against XSS, CSRF, and man-in-the-middle attacks.
        </p>
      </div>

      {/* Cookie Attributes Explanation */}
      <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-800">
        <h2 className="text-lg font-bold text-white mb-4">Cookie Security Attributes</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'HttpOnly', desc: 'Prevents JavaScript access via document.cookie', protection: 'XSS attacks' },
            { name: 'Secure', desc: 'Cookie only sent over HTTPS connections', protection: 'Man-in-the-middle attacks' },
            { name: 'SameSite', desc: 'Controls when cookies are sent with cross-site requests', protection: 'CSRF attacks' },
            { name: 'Path', desc: 'Restricts cookie to specific URL path', protection: 'Scope limitation' },
            { name: 'Domain', desc: 'Restricts cookie to specific domain', protection: 'Subdomain isolation' },
            { name: 'Max-Age/Expires', desc: 'Sets cookie expiration time', protection: 'Session lifetime control' },
          ].map((attr) => (
            <div key={attr.name} className="p-3 rounded-lg bg-gray-950 border border-gray-800">
              <div className="font-mono text-sm text-emerald-300 mb-1">{attr.name}</div>
              <div className="text-xs text-gray-400">{attr.desc}</div>
              <div className="text-xs text-gray-500 mt-1">Protection: {attr.protection}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vulnerable Configuration */}
      <div className="rounded-xl border border-red-800/30 overflow-hidden">
        <div className="px-5 py-3 bg-red-900/10 border-b border-red-800/30 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h3 className="font-bold text-red-300">Vulnerable Cookie Configuration</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-lg bg-gray-950 font-mono text-xs">
            <div className="text-gray-500 mb-2"># VULNERABLE: Weak cookie flags</div>
            <div className="text-red-300">response.set_cookie(</div>
            <div className="text-red-300 pl-4">'session_id', session_token,</div>
            <div className="text-red-300 pl-4">httponly=False,  # ⚠ JavaScript can access</div>
            <div className="text-red-300 pl-4">secure=False,    # ⚠ Sent over HTTP</div>
            <div className="text-red-300 pl-4">samesite=None    # ⚠ Sent with cross-site requests</div>
            <div className="text-red-300">)</div>
          </div>

          <div className="p-4 rounded-lg bg-yellow-900/10 border border-yellow-800/30">
            <h4 className="text-sm font-semibold text-yellow-300 mb-2">Risks</h4>
            <ul className="space-y-1 text-xs text-yellow-200/80">
              <li>• <strong>HttpOnly=False:</strong> XSS attacks can steal session cookies</li>
              <li>• <strong>Secure=False:</strong> Cookies sent over unencrypted HTTP</li>
              <li>• <strong>SameSite=None:</strong> Vulnerable to CSRF attacks</li>
            </ul>
          </div>

          <button
            onClick={() => setVulnDemo(!vulnDemo)}
            className="w-full py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
          >
            {vulnDemo ? 'Hide' : 'Show'} Cookie Inspection
          </button>

          {vulnDemo && (
            <div className="p-4 rounded-lg bg-gray-950 border border-gray-800">
              <div className="text-xs text-gray-500 mb-2">Set-Cookie Header (Vulnerable):</div>
              <div className="font-mono text-xs text-red-300 break-all">
                session_id=abc123; Path=/; SameSite=None
              </div>
              <div className="mt-3 text-xs text-gray-500">Missing attributes:</div>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-red-900/30 text-red-300 text-xs">❌ HttpOnly</span>
                <span className="px-2 py-0.5 rounded bg-red-900/30 text-red-300 text-xs">❌ Secure</span>
                <span className="px-2 py-0.5 rounded bg-yellow-900/30 text-yellow-300 text-xs">⚠ SameSite=None</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Secure Configuration */}
      <div className="rounded-xl border border-emerald-800/30 overflow-hidden">
        <div className="px-5 py-3 bg-emerald-900/10 border-b border-emerald-800/30 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-emerald-300">Secure Cookie Configuration</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-lg bg-gray-950 font-mono text-xs">
            <div className="text-gray-500 mb-2"># SECURE: Strong cookie flags</div>
            <div className="text-emerald-300">response.set_cookie(</div>
            <div className="text-emerald-300 pl-4">'session_id', session_token,</div>
            <div className="text-emerald-300 pl-4">httponly=True,   # ✓ JavaScript cannot access</div>
            <div className="text-emerald-300 pl-4">secure=True,     # ✓ HTTPS only (when available)</div>
            <div className="text-emerald-300 pl-4">samesite='Lax'   # ✓ CSRF protection</div>
            <div className="text-emerald-300">)</div>
          </div>

          <div className="p-4 rounded-lg bg-emerald-900/10 border border-emerald-800/30">
            <h4 className="text-sm font-semibold text-emerald-300 mb-2">Protections</h4>
            <ul className="space-y-1 text-xs text-emerald-200/80">
              <li>• <strong>HttpOnly=True:</strong> Prevents XSS cookie theft</li>
              <li>• <strong>Secure=True:</strong> Prevents MITM attacks (use with HTTPS)</li>
              <li>• <strong>SameSite=Lax:</strong> Prevents CSRF attacks</li>
            </ul>
          </div>

          <button
            onClick={() => setSecDemo(!secDemo)}
            className="w-full py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
          >
            {secDemo ? 'Hide' : 'Show'} Cookie Inspection
          </button>

          {secDemo && (
            <div className="p-4 rounded-lg bg-gray-950 border border-gray-800">
              <div className="text-xs text-gray-500 mb-2">Set-Cookie Header (Secure):</div>
              <div className="font-mono text-xs text-emerald-300 break-all">
                session_id=xyz789; Path=/; HttpOnly; Secure; SameSite=Lax
              </div>
              <div className="mt-3 text-xs text-gray-500">Security attributes:</div>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-emerald-900/30 text-emerald-300 text-xs">✓ HttpOnly</span>
                <span className="px-2 py-0.5 rounded bg-emerald-900/30 text-emerald-300 text-xs">✓ Secure</span>
                <span className="px-2 py-0.5 rounded bg-emerald-900/30 text-emerald-300 text-xs">✓ SameSite=Lax</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Attack Scenarios */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-red-900/10 border border-red-800/30">
          <h3 className="font-bold text-red-300 mb-2 text-sm">XSS Attack</h3>
          <p className="text-xs text-red-200/80 mb-2">
            Attacker injects: <code className="text-red-300">document.cookie</code>
          </p>
          <div className="text-xs">
            <div className="text-gray-500">Without HttpOnly:</div>
            <div className="text-red-300">✗ Cookie stolen</div>
            <div className="text-gray-500 mt-1">With HttpOnly:</div>
            <div className="text-emerald-300">✓ Access denied</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-red-900/10 border border-red-800/30">
          <h3 className="font-bold text-red-300 mb-2 text-sm">MITM Attack</h3>
          <p className="text-xs text-red-200/80 mb-2">
            Attacker intercepts HTTP traffic
          </p>
          <div className="text-xs">
            <div className="text-gray-500">Without Secure:</div>
            <div className="text-red-300">✗ Cookie visible</div>
            <div className="text-gray-500 mt-1">With Secure:</div>
            <div className="text-emerald-300">✓ HTTPS only</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-red-900/10 border border-red-800/30">
          <h3 className="font-bold text-red-300 mb-2 text-sm">CSRF Attack</h3>
          <p className="text-xs text-red-200/80 mb-2">
            Attacker forges cross-site request
          </p>
          <div className="text-xs">
            <div className="text-gray-500">Without SameSite:</div>
            <div className="text-red-300">✗ Cookie sent</div>
            <div className="text-gray-500 mt-1">With SameSite=Lax:</div>
            <div className="text-emerald-300">✓ Blocked</div>
          </div>
        </div>
      </div>

      {/* Retest */}
      <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-800">
        <h3 className="font-bold text-white mb-3">Retest After Mitigation</h3>
        <p className="text-sm text-gray-400 mb-3">
          Verify cookie attributes using browser developer tools or curl:
        </p>
        <div className="p-3 rounded-lg bg-gray-950 font-mono text-xs text-gray-400">
          <div className="text-gray-500"># Check response headers</div>
          <div>curl -I http://localhost:5000/login</div>
          <div className="mt-2 text-gray-500"># Expected (Secure):</div>
          <div className="text-emerald-300">Set-Cookie: session_id=...; HttpOnly; Secure; SameSite=Lax</div>
        </div>
      </div>
    </div>
  );
}
