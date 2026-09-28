import { useState } from 'react';

type RouteCategory = 'main' | 'auth' | 'vulnerable' | 'secure' | 'lab';

interface RouteEntry {
  method: string;
  path: string;
  handler: string;
  description: string;
  auth: boolean;
  category: RouteCategory;
}

const routes: RouteEntry[] = [
  // Main routes
  { method: 'GET', path: '/', handler: 'main.index', description: 'Home page / landing', auth: false, category: 'main' },
  { method: 'GET', path: '/dashboard', handler: 'main.dashboard', description: 'User dashboard after login', auth: true, category: 'main' },
  { method: 'GET', path: '/comparison', handler: 'main.comparison', description: 'Vulnerable vs Secure comparison table', auth: false, category: 'main' },
  { method: 'GET', path: '/reports', handler: 'main.reports', description: 'Lab reports and login logs', auth: true, category: 'main' },

  // Auth routes
  { method: 'GET', path: '/register', handler: 'auth.register_form', description: 'Registration form', auth: false, category: 'auth' },
  { method: 'POST', path: '/register', handler: 'auth.register', description: 'Process registration', auth: false, category: 'auth' },
  { method: 'GET', path: '/login', handler: 'auth.login_form', description: 'Login form', auth: false, category: 'auth' },
  { method: 'POST', path: '/login', handler: 'auth.login', description: 'Process login (secure)', auth: false, category: 'auth' },
  { method: 'POST', path: '/logout', handler: 'auth.logout', description: 'Logout and invalidate session', auth: true, category: 'auth' },

  // Vulnerable lab routes
  { method: 'GET', path: '/lab/vulnerable-login', handler: 'vulnerable.login_form', description: 'Vulnerable login form (SQLi demo)', auth: false, category: 'vulnerable' },
  { method: 'POST', path: '/lab/vulnerable-login', handler: 'vulnerable.login', description: 'Vulnerable login processing', auth: false, category: 'vulnerable' },
  { method: 'GET', path: '/labs/sqli', handler: 'vulnerable.sqli_lab', description: 'SQL Injection lab page', auth: false, category: 'vulnerable' },
  { method: 'GET', path: '/labs/cookies', handler: 'vulnerable.cookies_lab', description: 'Cookie security lab page', auth: false, category: 'vulnerable' },
  { method: 'GET', path: '/labs/session', handler: 'vulnerable.session_lab', description: 'Session security lab page', auth: false, category: 'vulnerable' },

  // Secure lab routes
  { method: 'GET', path: '/lab/secure-login', handler: 'secure.login_form', description: 'Secure login form', auth: false, category: 'secure' },
  { method: 'POST', path: '/lab/secure-login', handler: 'secure.login', description: 'Secure login processing', auth: false, category: 'secure' },
  { method: 'GET', path: '/lab/secure-cookies', handler: 'secure.cookies_demo', description: 'Secure cookie configuration demo', auth: false, category: 'secure' },
  { method: 'GET', path: '/lab/secure-session', handler: 'secure.session_demo', description: 'Secure session management demo', auth: false, category: 'secure' },

  // Lab management routes
  { method: 'GET', path: '/labs', handler: 'lab.list_labs', description: 'List all available labs', auth: false, category: 'lab' },
  { method: 'GET', path: '/labs/auth', handler: 'lab.auth_lab', description: 'Authentication security lab', auth: false, category: 'lab' },
  { method: 'GET', path: '/labs/mitigation', handler: 'lab.mitigation_lab', description: 'Mitigation and retest lab', auth: false, category: 'lab' },
];

const categoryConfig: Record<RouteCategory, { label: string; color: string; bgColor: string }> = {
  main: { label: 'Main', color: 'text-blue-300', bgColor: 'bg-blue-900/20' },
  auth: { label: 'Authentication', color: 'text-emerald-300', bgColor: 'bg-emerald-900/20' },
  vulnerable: { label: 'Vulnerable Lab', color: 'text-red-300', bgColor: 'bg-red-900/20' },
  secure: { label: 'Secure Lab', color: 'text-green-300', bgColor: 'bg-green-900/20' },
  lab: { label: 'Lab Management', color: 'text-purple-300', bgColor: 'bg-purple-900/20' },
};

export function RouteMapPage() {
  const [filter, setFilter] = useState<RouteCategory | 'all'>('all');

  const filteredRoutes = filter === 'all' ? routes : routes.filter(r => r.category === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Route Map</h1>
        <p className="text-gray-400 mt-1">All application endpoints and their handlers</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filter === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-900 text-gray-400 hover:text-gray-200'
          }`}
        >
          All ({routes.length})
        </button>
        {(Object.entries(categoryConfig) as [RouteCategory, typeof categoryConfig[RouteCategory]][]).map(([key, config]) => {
          const count = routes.filter(r => r.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === key ? `${config.bgColor} ${config.color} border border-current` : 'bg-gray-900 text-gray-400 hover:text-gray-200'
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Route Table */}
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900/80 border-b border-gray-800">
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Method</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Path</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Handler</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Description</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Auth</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredRoutes.map((route, i) => {
                const catConfig = categoryConfig[route.category];
                return (
                  <tr key={i} className="hover:bg-gray-900/30 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        route.method === 'GET' ? 'bg-blue-900/30 text-blue-300' : 'bg-green-900/30 text-green-300'
                      }`}>
                        {route.method}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-emerald-300 text-xs">{route.path}</td>
                    <td className="px-4 py-2.5 font-mono text-gray-400 text-xs">{route.handler}</td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs">{route.description}</td>
                    <td className="px-4 py-2.5">
                      {route.auth ? (
                        <span className="px-2 py-0.5 rounded bg-yellow-900/30 text-yellow-300 text-xs">Required</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-500 text-xs">Public</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-xs ${catConfig.bgColor} ${catConfig.color}`}>
                        {catConfig.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Route Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
          <div className="text-2xl font-bold text-white">{routes.length}</div>
          <div className="text-sm text-gray-400">Total Endpoints</div>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
          <div className="text-2xl font-bold text-white">{routes.filter(r => r.auth).length}</div>
          <div className="text-sm text-gray-400">Authenticated Routes</div>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
          <div className="text-2xl font-bold text-white">{routes.filter(r => r.category === 'vulnerable').length}</div>
          <div className="text-sm text-gray-400">Vulnerable Lab Routes</div>
        </div>
      </div>
    </div>
  );
}
