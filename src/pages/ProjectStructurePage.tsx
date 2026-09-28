import { useState } from 'react';

interface TreeNode {
  name: string;
  type: 'folder' | 'file';
  description?: string;
  children?: TreeNode[];
  highlight?: 'vulnerable' | 'secure' | 'config' | 'test' | 'doc';
}

const projectTree: TreeNode = {
  name: 'web-security-lab/',
  type: 'folder',
  children: [
    {
      name: 'app/',
      type: 'folder',
      description: 'Main application package',
      children: [
        { name: '__init__.py', type: 'file', description: 'App factory, config loading' },
        {
          name: 'routes/',
          type: 'folder',
          description: 'Route handlers (Blueprints)',
          children: [
            { name: 'auth.py', type: 'file', description: '/register, /login, /logout', highlight: 'secure' },
            { name: 'vulnerable.py', type: 'file', description: 'Vulnerable lab endpoints', highlight: 'vulnerable' },
            { name: 'secure.py', type: 'file', description: 'Secure lab endpoints', highlight: 'secure' },
            { name: 'lab.py', type: 'file', description: 'Lab listing & management' },
            { name: 'main.py', type: 'file', description: 'Home, dashboard, comparison' },
          ],
        },
        {
          name: 'models/',
          type: 'folder',
          description: 'Database layer',
          children: [
            { name: 'database.py', type: 'file', description: 'DB connection & queries', highlight: 'config' },
            { name: 'schema.sql', type: 'file', description: 'Table definitions', highlight: 'config' },
          ],
        },
        {
          name: 'security/',
          type: 'folder',
          description: 'Security implementations',
          children: [
            { name: 'vulnerable_auth.py', type: 'file', description: 'Intentionally weak auth', highlight: 'vulnerable' },
            { name: 'secure_auth.py', type: 'file', description: 'Secure authentication', highlight: 'secure' },
            { name: 'vulnerable_session.py', type: 'file', description: 'Weak session management', highlight: 'vulnerable' },
            { name: 'secure_session.py', type: 'file', description: 'Secure session management', highlight: 'secure' },
          ],
        },
        {
          name: 'templates/',
          type: 'folder',
          description: 'Jinja2 HTML templates',
          children: [
            { name: 'base.html', type: 'file', description: 'Base template with layout' },
            { name: 'index.html', type: 'file', description: 'Home page' },
            { name: 'login.html', type: 'file', description: 'Login form' },
            { name: 'register.html', type: 'file', description: 'Registration form' },
            { name: 'dashboard.html', type: 'file', description: 'User dashboard' },
            { name: 'labs.html', type: 'file', description: 'Lab listing' },
            { name: 'comparison.html', type: 'file', description: 'Vulnerable vs Secure' },
            { name: 'reports.html', type: 'file', description: 'Lab reports' },
          ],
        },
        {
          name: 'static/',
          type: 'folder',
          description: 'Static assets',
          children: [
            { name: 'css/', type: 'folder', description: 'Stylesheets', children: [
              { name: 'style.css', type: 'file', description: 'Main stylesheet' },
            ]},
            { name: 'js/', type: 'folder', description: 'JavaScript files', children: [
              { name: 'app.js', type: 'file', description: 'Client-side logic' },
            ]},
          ],
        },
      ],
    },
    {
      name: 'tests/',
      type: 'folder',
      description: 'Automated test suite (pytest)',
      children: [
        { name: 'test_auth.py', type: 'file', description: 'Auth flow tests', highlight: 'test' },
        { name: 'test_sqli.py', type: 'file', description: 'SQL injection tests', highlight: 'test' },
        { name: 'test_cookie.py', type: 'file', description: 'Cookie security tests', highlight: 'test' },
        { name: 'test_session.py', type: 'file', description: 'Session security tests', highlight: 'test' },
      ],
    },
    {
      name: 'docs/',
      type: 'folder',
      description: 'Documentation',
      children: [
        { name: 'README.md', type: 'file', description: 'Project overview', highlight: 'doc' },
        { name: 'ARCHITECTURE.md', type: 'file', description: 'System architecture', highlight: 'doc' },
        { name: 'SQL_INJECTION.md', type: 'file', description: 'SQLi lab documentation', highlight: 'doc' },
        { name: 'COOKIE_SECURITY.md', type: 'file', description: 'Cookie lab documentation', highlight: 'doc' },
        { name: 'SESSION_SECURITY.md', type: 'file', description: 'Session lab documentation', highlight: 'doc' },
        { name: 'MITIGATION.md', type: 'file', description: 'Mitigation guide', highlight: 'doc' },
        { name: 'PRACTICUM.md', type: 'file', description: 'Practicum module', highlight: 'doc' },
        { name: 'INSTRUCTOR_GUIDE.md', type: 'file', description: 'Instructor guide', highlight: 'doc' },
      ],
    },
    {
      name: 'scripts/',
      type: 'folder',
      description: 'Utility scripts',
      children: [
        { name: 'init_db.py', type: 'file', description: 'Initialize database', highlight: 'config' },
        { name: 'seed_data.py', type: 'file', description: 'Seed lab users', highlight: 'config' },
        { name: 'reset_lab.py', type: 'file', description: 'Reset lab to initial state', highlight: 'config' },
      ],
    },
    { name: 'screenshots/', type: 'folder', description: 'Lab screenshots' },
    { name: 'Dockerfile', type: 'file', description: 'Docker image definition', highlight: 'config' },
    { name: 'docker-compose.yml', type: 'file', description: 'Docker Compose config', highlight: 'config' },
    { name: 'requirements.txt', type: 'file', description: 'Python dependencies', highlight: 'config' },
    { name: '.env.example', type: 'file', description: 'Environment variable template', highlight: 'config' },
    { name: '.gitignore', type: 'file', description: 'Git ignore rules', highlight: 'config' },
    { name: 'run.py', type: 'file', description: 'Application entry point', highlight: 'config' },
    { name: 'README.md', type: 'file', description: 'Project README', highlight: 'doc' },
  ],
};

function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const paddingLeft = depth * 20;

  const highlightColors: Record<string, string> = {
    vulnerable: 'text-red-400',
    secure: 'text-green-400',
    config: 'text-yellow-400',
    test: 'text-blue-400',
    doc: 'text-purple-400',
  };

  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 w-full text-left py-1 hover:bg-gray-800/30 rounded px-1 transition-colors"
          style={{ paddingLeft: `${paddingLeft + 4}px` }}
        >
          <span className="text-gray-500 text-xs w-4">{expanded ? '▼' : '▶'}</span>
          <span className="text-yellow-400 text-sm">📁</span>
          <span className="text-gray-200 text-sm font-medium">{node.name}</span>
          {node.description && (
            <span className="text-gray-600 text-xs ml-2">{node.description}</span>
          )}
        </button>
        {expanded && node.children && (
          <div>
            {node.children.map((child, i) => (
              <TreeItem key={i} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 py-1 px-1 hover:bg-gray-800/30 rounded transition-colors"
      style={{ paddingLeft: `${paddingLeft + 24}px` }}
    >
      <span className="text-gray-500 text-sm">📄</span>
      <span className={`text-sm font-mono ${node.highlight ? highlightColors[node.highlight] : 'text-gray-300'}`}>
        {node.name}
      </span>
      {node.description && (
        <span className="text-gray-600 text-xs ml-2">{node.description}</span>
      )}
    </div>
  );
}

export function ProjectStructurePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Project Structure</h1>
        <p className="text-gray-400 mt-1">File and folder organization of the security lab</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
        <span className="text-xs text-gray-400 font-medium">Legend:</span>
        <span className="flex items-center gap-1.5 text-xs">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-red-400">Vulnerable</span>
        </span>
        <span className="flex items-center gap-1.5 text-xs">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-green-400">Secure</span>
        </span>
        <span className="flex items-center gap-1.5 text-xs">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-yellow-400">Config</span>
        </span>
        <span className="flex items-center gap-1.5 text-xs">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-blue-400">Test</span>
        </span>
        <span className="flex items-center gap-1.5 text-xs">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-purple-400">Documentation</span>
        </span>
      </div>

      {/* Tree */}
      <div className="p-6 rounded-xl bg-gray-900/80 border border-gray-800 font-mono">
        <TreeItem node={projectTree} />
      </div>

      {/* Key Directories */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
          <h3 className="font-semibold text-white mb-2">Key Separation Points</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-red-400">•</span>
              <span><code className="text-red-300">vulnerable_*.py</code> — Intentionally weak implementations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">•</span>
              <span><code className="text-green-300">secure_*.py</code> — Properly secured implementations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">•</span>
              <span><code className="text-yellow-300">scripts/</code> — Lab management utilities</span>
            </li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
          <h3 className="font-semibold text-white mb-2">Design Rationale</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Routes separated by concern (auth, lab, main)</li>
            <li>• Security logic isolated in security/ module</li>
            <li>• Templates use Jinja2 inheritance (base.html)</li>
            <li>• Tests mirror the module structure</li>
            <li>• Documentation in dedicated docs/ folder</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
