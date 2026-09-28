export function DatabaseSchemaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Database Schema</h1>
        <p className="text-gray-400 mt-1">SQLite database design for the security lab</p>
      </div>

      {/* Database Info */}
      <div className="p-4 rounded-xl bg-purple-900/10 border border-purple-800/30">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 text-xs font-medium">SQLite</span>
          <span className="text-sm text-gray-400">Database file: <code className="text-purple-300">lab.db</code></span>
        </div>
      </div>

      {/* Tables */}
      <div className="grid md:grid-cols-1 gap-6">
        {/* users table */}
        <div className="rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              users
            </h3>
            <span className="text-xs text-gray-500">Primary user data</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="px-4 py-2 text-left text-gray-400 font-medium">Column</th>
                  <th className="px-4 py-2 text-left text-gray-400 font-medium">Type</th>
                  <th className="px-4 py-2 text-left text-gray-400 font-medium">Constraints</th>
                  <th className="px-4 py-2 text-left text-gray-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                <tr>
                  <td className="px-4 py-2.5 font-mono text-blue-300">id</td>
                  <td className="px-4 py-2.5 text-gray-400">INTEGER</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-yellow-900/30 text-yellow-300 text-xs">PRIMARY KEY</span> <span className="px-2 py-0.5 rounded bg-blue-900/30 text-blue-300 text-xs">AUTOINCREMENT</span></td>
                  <td className="px-4 py-2.5 text-gray-500">Unique user identifier</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-blue-300">username</td>
                  <td className="px-4 py-2.5 text-gray-400">TEXT</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-red-900/30 text-red-300 text-xs">NOT NULL</span> <span className="px-2 py-0.5 rounded bg-emerald-900/30 text-emerald-300 text-xs">UNIQUE</span></td>
                  <td className="px-4 py-2.5 text-gray-500">User login name</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-blue-300">password_hash</td>
                  <td className="px-4 py-2.5 text-gray-400">TEXT</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-red-900/30 text-red-300 text-xs">NOT NULL</span></td>
                  <td className="px-4 py-2.5 text-gray-500">Hashed password (bcrypt)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-blue-300">created_at</td>
                  <td className="px-4 py-2.5 text-gray-400">DATETIME</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-xs">DEFAULT CURRENT_TIMESTAMP</span></td>
                  <td className="px-4 py-2.5 text-gray-500">Registration timestamp</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* login_logs table */}
        <div className="rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              login_logs
            </h3>
            <span className="text-xs text-gray-500">Authentication audit trail</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="px-4 py-2 text-left text-gray-400 font-medium">Column</th>
                  <th className="px-4 py-2 text-left text-gray-400 font-medium">Type</th>
                  <th className="px-4 py-2 text-left text-gray-400 font-medium">Constraints</th>
                  <th className="px-4 py-2 text-left text-gray-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                <tr>
                  <td className="px-4 py-2.5 font-mono text-orange-300">id</td>
                  <td className="px-4 py-2.5 text-gray-400">INTEGER</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-yellow-900/30 text-yellow-300 text-xs">PRIMARY KEY</span> <span className="px-2 py-0.5 rounded bg-blue-900/30 text-blue-300 text-xs">AUTOINCREMENT</span></td>
                  <td className="px-4 py-2.5 text-gray-500">Log entry identifier</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-orange-300">username</td>
                  <td className="px-4 py-2.5 text-gray-400">TEXT</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-red-900/30 text-red-300 text-xs">NOT NULL</span></td>
                  <td className="px-4 py-2.5 text-gray-500">Attempted username</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-orange-300">endpoint</td>
                  <td className="px-4 py-2.5 text-gray-400">TEXT</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-red-900/30 text-red-300 text-xs">NOT NULL</span></td>
                  <td className="px-4 py-2.5 text-gray-500">Which endpoint was used</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-orange-300">success</td>
                  <td className="px-4 py-2.5 text-gray-400">BOOLEAN</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-red-900/30 text-red-300 text-xs">NOT NULL</span></td>
                  <td className="px-4 py-2.5 text-gray-500">Whether authentication succeeded</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-orange-300">created_at</td>
                  <td className="px-4 py-2.5 text-gray-400">DATETIME</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-xs">DEFAULT CURRENT_TIMESTAMP</span></td>
                  <td className="px-4 py-2.5 text-gray-500">Timestamp of attempt</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* sessions table */}
        <div className="rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              sessions
            </h3>
            <span className="text-xs text-gray-500">Session tracking for labs</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="px-4 py-2 text-left text-gray-400 font-medium">Column</th>
                  <th className="px-4 py-2 text-left text-gray-400 font-medium">Type</th>
                  <th className="px-4 py-2 text-left text-gray-400 font-medium">Constraints</th>
                  <th className="px-4 py-2 text-left text-gray-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                <tr>
                  <td className="px-4 py-2.5 font-mono text-green-300">id</td>
                  <td className="px-4 py-2.5 text-gray-400">INTEGER</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-yellow-900/30 text-yellow-300 text-xs">PRIMARY KEY</span> <span className="px-2 py-0.5 rounded bg-blue-900/30 text-blue-300 text-xs">AUTOINCREMENT</span></td>
                  <td className="px-4 py-2.5 text-gray-500">Session record identifier</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-green-300">user_id</td>
                  <td className="px-4 py-2.5 text-gray-400">INTEGER</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-red-900/30 text-red-300 text-xs">NOT NULL</span> <span className="px-2 py-0.5 rounded bg-purple-900/30 text-purple-300 text-xs">FK → users.id</span></td>
                  <td className="px-4 py-2.5 text-gray-500">Associated user</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-green-300">session_identifier</td>
                  <td className="px-4 py-2.5 text-gray-400">TEXT</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-red-900/30 text-red-300 text-xs">NOT NULL</span> <span className="px-2 py-0.5 rounded bg-emerald-900/30 text-emerald-300 text-xs">UNIQUE</span></td>
                  <td className="px-4 py-2.5 text-gray-500">Cryptographic session token</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-green-300">created_at</td>
                  <td className="px-4 py-2.5 text-gray-400">DATETIME</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-xs">DEFAULT CURRENT_TIMESTAMP</span></td>
                  <td className="px-4 py-2.5 text-gray-500">Session creation time</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-green-300">expires_at</td>
                  <td className="px-4 py-2.5 text-gray-400">DATETIME</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-red-900/30 text-red-300 text-xs">NOT NULL</span></td>
                  <td className="px-4 py-2.5 text-gray-500">Session expiration time</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-green-300">invalidated_at</td>
                  <td className="px-4 py-2.5 text-gray-400">DATETIME</td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-xs">NULLABLE</span></td>
                  <td className="px-4 py-2.5 text-gray-500">When session was invalidated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SQL Schema */}
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800">
          <h3 className="font-bold text-white">SQL Schema Definition</h3>
        </div>
        <div className="p-4 bg-gray-950 font-mono text-sm overflow-x-auto">
          <pre className="text-gray-300">{`-- File: app/models/schema.sql

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS login_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    success BOOLEAN NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_identifier TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    invalidated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_sessions_identifier ON sessions(session_identifier);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_username ON login_logs(username);`}</pre>
        </div>
      </div>

      {/* Seed Data */}
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-5 py-3 bg-gray-900/80 border-b border-gray-800">
          <h3 className="font-bold text-white">Seed Data</h3>
        </div>
        <div className="p-4 bg-gray-950 font-mono text-sm overflow-x-auto">
          <pre className="text-gray-300">{`-- File: scripts/seed_data.py
-- Lab credentials (LOCAL ONLY — never use in production)

INSERT INTO users (username, password_hash) VALUES
    ('student', '$2b$12$LJ3m4ys3Lg0VQ...hashed_password'),
    ('admin',   '$2b$12$Kx9sN7vR2mH1e...hashed_password');

-- Lab credentials:
--   student / student123
--   admin   / admin_secure_pass`}</pre>
        </div>
      </div>

      {/* Security Notes */}
      <div className="p-5 rounded-xl bg-yellow-900/10 border border-yellow-800/30">
        <h3 className="font-semibold text-yellow-300 mb-2">⚠ Security Notes</h3>
        <ul className="space-y-1 text-sm text-yellow-200/70">
          <li>• Never store plaintext passwords — always use bcrypt or argon2</li>
          <li>• Never log passwords, session secrets, or authentication tokens</li>
          <li>• Seed credentials are for local lab use only</li>
          <li>• The sessions table is used for educational demonstration of session lifecycle</li>
        </ul>
      </div>
    </div>
  );
}
