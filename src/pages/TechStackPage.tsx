export function TechStackPage() {
  const categories = [
    {
      name: 'Backend',
      icon: '🐍',
      items: [
        { name: 'Python 3.x', version: '3.10+', purpose: 'Core language', link: 'https://python.org' },
        { name: 'Flask', version: '3.x', purpose: 'Web framework — lightweight, extensible', link: 'https://flask.palletsprojects.com' },
        { name: 'Werkzeug', version: '3.x', purpose: 'WSGI utility library (Flask dependency)', link: 'https://werkzeug.palletsprojects.com' },
        { name: 'Jinja2', version: '3.x', purpose: 'Template engine for HTML rendering', link: 'https://jinja.palletsprojects.com' },
        { name: 'bcrypt', version: '4.x', purpose: 'Password hashing (secure implementation)', link: 'https://github.com/pyca/bcrypt' },
      ],
    },
    {
      name: 'Database',
      icon: '🗄️',
      items: [
        { name: 'SQLite3', version: '3.x', purpose: 'Embedded database — zero config, file-based', link: 'https://sqlite.org' },
        { name: 'sqlite3 (stdlib)', version: '—', purpose: 'Python built-in SQLite interface', link: 'https://docs.python.org/3/library/sqlite3.html' },
      ],
    },
    {
      name: 'Frontend',
      icon: '🌐',
      items: [
        { name: 'HTML5', version: '—', purpose: 'Structure and semantics', link: '' },
        { name: 'CSS3', version: '—', purpose: 'Styling and layout', link: '' },
        { name: 'JavaScript (Vanilla)', version: 'ES6+', purpose: 'Client-side interactivity', link: '' },
      ],
    },
    {
      name: 'Testing',
      icon: '🧪',
      items: [
        { name: 'pytest', version: '7.x+', purpose: 'Test framework — fixtures, parametrize', link: 'https://pytest.org' },
        { name: 'pytest-flask', version: '1.x', purpose: 'Flask test client integration', link: 'https://pytest-flask.readthedocs.io' },
      ],
    },
    {
      name: 'Environment',
      icon: '🐳',
      items: [
        { name: 'Docker', version: '24+', purpose: 'Containerization for reproducibility', link: 'https://docker.com' },
        { name: 'Docker Compose', version: '2.x', purpose: 'Multi-container orchestration', link: 'https://docs.docker.com/compose' },
        { name: 'Python venv', version: '—', purpose: 'Virtual environment (non-Docker setup)', link: '' },
      ],
    },
    {
      name: 'Security Libraries',
      icon: '🔒',
      items: [
        { name: 'secrets (stdlib)', version: '—', purpose: 'Cryptographically secure random tokens', link: 'https://docs.python.org/3/library/secrets.html' },
        { name: 'hashlib (stdlib)', version: '—', purpose: 'Hash functions for verification', link: 'https://docs.python.org/3/library/hashlib.html' },
        { name: 'hmac (stdlib)', version: '—', purpose: 'HMAC for session integrity', link: 'https://docs.python.org/3/library/hmac.html' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Technology Stack</h1>
        <p className="text-gray-400 mt-1">Tools, frameworks, and libraries used in the project</p>
      </div>

      {/* Stack Overview Diagram */}
      <div className="p-6 rounded-xl bg-gray-900/80 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Stack Layers</h3>
        <div className="space-y-2">
          {[
            { layer: 'Presentation', tech: 'HTML5 + CSS3 + JavaScript', color: 'blue' },
            { layer: 'Template Engine', tech: 'Jinja2', color: 'purple' },
            { layer: 'Web Framework', tech: 'Flask + Werkzeug', color: 'emerald' },
            { layer: 'Security', tech: 'bcrypt + secrets + hmac', color: 'green' },
            { layer: 'Database', tech: 'SQLite3', color: 'orange' },
            { layer: 'Testing', tech: 'pytest', color: 'yellow' },
            { layer: 'Deployment', tech: 'Docker + Docker Compose', color: 'cyan' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-32 text-right">
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  item.color === 'blue' ? 'bg-blue-900/30 text-blue-300' :
                  item.color === 'purple' ? 'bg-purple-900/30 text-purple-300' :
                  item.color === 'emerald' ? 'bg-emerald-900/30 text-emerald-300' :
                  item.color === 'green' ? 'bg-green-900/30 text-green-300' :
                  item.color === 'orange' ? 'bg-orange-900/30 text-orange-300' :
                  item.color === 'yellow' ? 'bg-yellow-900/30 text-yellow-300' :
                  'bg-cyan-900/30 text-cyan-300'
                }`}>
                  {item.layer}
                </span>
              </div>
              <div className="flex-1 h-8 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center px-4">
                <span className="text-sm text-gray-300">{item.tech}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Categories */}
      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.name} className="p-5 rounded-xl bg-gray-900/50 border border-gray-800">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <span>{cat.icon}</span>
              {cat.name}
            </h3>
            <div className="space-y-3">
              {cat.items.map((item) => (
                <div key={item.name} className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-200">{item.name}</span>
                      {item.version && item.version !== '—' && (
                        <span className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 text-[10px]">
                          {item.version}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Requirements.txt Preview */}
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800">
          <h3 className="font-bold text-white">requirements.txt</h3>
        </div>
        <div className="p-4 bg-gray-950 font-mono text-sm">
          <pre className="text-gray-300">{`flask>=3.0.0
werkzeug>=3.0.0
jinja2>=3.1.0
bcrypt>=4.0.0
pytest>=7.0.0
pytest-flask>=1.3.0`}</pre>
        </div>
      </div>

      {/* Environment Variables */}
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800">
          <h3 className="font-bold text-white">.env.example</h3>
        </div>
        <div className="p-4 bg-gray-950 font-mono text-sm">
          <pre className="text-gray-300">{`# Application
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=change-this-in-production

# Database
DATABASE_PATH=lab.db

# Session
SESSION_LIFETIME_MINUTES=30
SESSION_COOKIE_NAME=session_id

# Lab
LAB_MODE=enabled
SEED_USERS=true

# Server
HOST=127.0.0.1
PORT=5000`}</pre>
        </div>
      </div>
    </div>
  );
}
