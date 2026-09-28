export interface SourceFile {
  path: string;
  language: string;
  content: string;
  category: 'core' | 'routes' | 'models' | 'security' | 'templates' | 'static' | 'tests' | 'scripts' | 'config' | 'docker';
  description: string;
}

export const sourceFiles: SourceFile[] = [
  // ===== CORE =====
  {
    path: 'run.py',
    language: 'python',
    category: 'core',
    description: 'Application entry point',
    content: `"""
Web Application Security Vulnerable Lab
Application Entry Point

Usage:
    python run.py

The application will be available at http://127.0.0.1:5000
"""
import os
from app import create_app

app = create_app()

if __name__ == '__main__':
    host = os.environ.get('HOST', '127.0.0.1')
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'

    print(f"""
╔══════════════════════════════════════════════════════╗
║     Web Application Security Vulnerable Lab          ║
║                                                      ║
║     ⚠  EDUCATIONAL PURPOSE ONLY                      ║
║     ⚠  Run only in isolated lab environment          ║
║                                                      ║
║     Running at: http://{host}:{port}              ║
╚══════════════════════════════════════════════════════╝
    """)

    app.run(host=host, port=port, debug=debug)`
  },
  {
    path: 'app/__init__.py',
    language: 'python',
    category: 'core',
    description: 'Application factory and configuration',
    content: `"""
Flask Application Factory

Creates and configures the Flask application instance.
Uses the application factory pattern for testability.
"""
import os
from flask import Flask
from dotenv import load_dotenv


def create_app(test_config=None):
    """
    Create and configure the Flask application.

    Args:
        test_config: Optional dictionary of test configuration overrides.

    Returns:
        Flask: Configured Flask application instance.
    """
    load_dotenv()

    app = Flask(
        __name__,
        instance_relative_config=True,
        template_folder='templates',
        static_folder='static'
    )

    # Default configuration
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev-secret-key-DO-NOT-USE-IN-PRODUCTION'),
        DATABASE_PATH=os.environ.get('DATABASE_PATH',
            os.path.join(app.instance_path, 'lab.db')),
        SESSION_COOKIE_NAME='session_id',
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE='Lax',
        PERMANENT_SESSION_LIFETIME=1800,  # 30 minutes
    )

    # Apply test configuration if provided
    if test_config is not None:
        app.config.from_mapping(test_config)

    # Ensure instance folder exists
    os.makedirs(app.instance_path, exist_ok=True)

    # Initialize database
    from app.models.database import init_db
    with app.app_context():
        init_db(app)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.main import main_bp
    from app.routes.lab import lab_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(lab_bp)

    # Security banner context processor
    @app.context_processor
    def inject_security_banner():
        return {
            'security_warning': True,
            'app_name': 'Web Security Lab'
        }

    return app`
  },

  // ===== ROUTES =====
  {
    path: 'app/routes/auth.py',
    language: 'python',
    category: 'routes',
    description: 'Authentication routes: register, login, logout',
    content: `"""
Authentication Routes

Handles user registration, login, and logout.
SECURE implementation using:
- Parameterized queries
- Password hashing (bcrypt)
- Proper session management
- Input validation
- Secure error messages
"""
import bcrypt
from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from app.models.database import get_db, log_login_attempt

auth_bp = Blueprint('auth', __name__)


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.

    Args:
        password: Plain text password.

    Returns:
        str: Hashed password string.
    """
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def verify_password(password: str, password_hash: str) -> bool:
    """
    Verify a password against its hash.

    Args:
        password: Plain text password to verify.
        password_hash: Stored bcrypt hash.

    Returns:
        bool: True if password matches.
    """
    return bcrypt.checkpw(
        password.encode('utf-8'),
        password_hash.encode('utf-8')
    )


@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    """
    Handle user registration.

    GET: Display registration form.
    POST: Process registration with validation and password hashing.
    """
    if request.method == 'GET':
        return render_template('register.html')

    # POST - Process registration
    username = request.form.get('username', '').strip()
    password = request.form.get('password', '')
    confirm_password = request.form.get('confirm_password', '')

    # Validation
    errors = []

    if not username:
        errors.append('Username is required.')
    elif len(username) < 3:
        errors.append('Username must be at least 3 characters.')
    elif len(username) > 50:
        errors.append('Username must be at most 50 characters.')

    if not password:
        errors.append('Password is required.')
    elif len(password) < 8:
        errors.append('Password must be at least 8 characters.')

    if password != confirm_password:
        errors.append('Passwords do not match.')

    if errors:
        for error in errors:
            flash(error, 'error')
        return render_template('register.html', username=username)

    # Check if username already exists (parameterized query)
    db = get_db()
    existing = db.execute(
        'SELECT id FROM users WHERE username = ?',
        (username,)
    ).fetchone()

    if existing:
        flash('Username already exists. Please choose another.', 'error')
        return render_template('register.html', username=username)

    # Hash password and create user
    password_hash = hash_password(password)

    db.execute(
        'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        (username, password_hash)
    )
    db.commit()

    flash('Registration successful! Please log in.', 'success')
    return redirect(url_for('auth.login'))


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """
    Handle user login.

    GET: Display login form.
    POST: Verify credentials and create session.
    """
    if request.method == 'GET':
        return render_template('login.html')

    # POST - Process login
    username = request.form.get('username', '').strip()
    password = request.form.get('password', '')

    if not username or not password:
        flash('Please enter both username and password.', 'error')
        log_login_attempt(username or '(empty)', '/login', False)
        return render_template('login.html')

    # Look up user (parameterized query - SECURE)
    db = get_db()
    user = db.execute(
        'SELECT id, username, password_hash FROM users WHERE username = ?',
        (username,)
    ).fetchone()

    if user and verify_password(password, user['password_hash']):
        # Login successful
        session.permanent = True
        session['user_id'] = user['id']
        session['username'] = user['username']

        log_login_attempt(username, '/login', True)
        flash(f'Welcome back, {username}!', 'success')
        return redirect(url_for('main.dashboard'))
    else:
        # Login failed - generic error message (no information leakage)
        log_login_attempt(username, '/login', False)
        flash('Invalid username or password.', 'error')
        return render_template('login.html')


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    Handle user logout.

    Clears session data and redirects to login page.
    """
    username = session.get('username', 'unknown')
    session.clear()
    flash(f'Goodbye, {username}. You have been logged out.', 'success')
    return redirect(url_for('auth.login'))`
  },
  {
    path: 'app/routes/main.py',
    language: 'python',
    category: 'routes',
    description: 'Main routes: home, dashboard',
    content: `"""
Main Routes

Handles the landing page and authenticated dashboard.
"""
from functools import wraps
from flask import Blueprint, render_template, session, redirect, url_for, flash

main_bp = Blueprint('main', __name__)


def login_required(f):
    """
    Decorator to require authentication for a route.

    Redirects to login page if user is not authenticated.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'error')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function


@main_bp.route('/')
def index():
    """Landing page - public access."""
    return render_template('index.html')


@main_bp.route('/dashboard')
@login_required
def dashboard():
    """
    User dashboard - requires authentication.

    Displays user information and navigation to labs.
    """
    return render_template(
        'dashboard.html',
        username=session.get('username'),
        user_id=session.get('user_id')
    )`
  },
  {
    path: 'app/routes/lab.py',
    language: 'python',
    category: 'routes',
    description: 'Lab listing route (placeholder for Phase 3)',
    content: `"""
Lab Routes

Lists available security laboratories.
Phase 2: Labs are listed as "Coming Soon"
Phase 3: Labs will be fully implemented
"""
from flask import Blueprint, render_template

lab_bp = Blueprint('lab', __name__)


@lab_bp.route('/labs')
def labs():
    """
    Display list of available security labs.

    In Phase 2, labs are listed as coming soon.
    In Phase 3, each lab will have vulnerable and secure implementations.
    """
    labs_data = [
        {
            'id': 'sqli',
            'name': 'SQL Injection Lab',
            'status': 'Coming in Phase 3',
            'description': 'Learn how SQL injection works through string concatenation vulnerabilities.',
            'difficulty': 'Intermediate',
            'topics': ['SQL Injection', 'Parameterized Queries', 'Input Validation'],
        },
        {
            'id': 'cookies',
            'name': 'Cookie Security Lab',
            'status': 'Coming in Phase 3',
            'description': 'Understand cookie security flags: HttpOnly, Secure, SameSite.',
            'difficulty': 'Intermediate',
            'topics': ['Cookie Flags', 'XSS Prevention', 'CSRF Protection'],
        },
        {
            'id': 'session',
            'name': 'Session Security Lab',
            'status': 'Coming in Phase 3',
            'description': 'Learn session fixation, regeneration, and proper invalidation.',
            'difficulty': 'Advanced',
            'topics': ['Session Fixation', 'Session Regeneration', 'Session Invalidation'],
        },
        {
            'id': 'auth',
            'name': 'Authentication Security Lab',
            'status': 'Coming in Phase 3',
            'description': 'Compare weak and secure authentication implementations.',
            'difficulty': 'Intermediate',
            'topics': ['Password Hashing', 'Authentication Flow', 'Brute Force'],
        },
        {
            'id': 'mitigation',
            'name': 'Mitigation & Retest Lab',
            'status': 'Coming in Phase 3',
            'description': 'Practice fixing vulnerabilities and verifying the fixes.',
            'difficulty': 'Advanced',
            'topics': ['Secure Coding', 'Retesting', 'Documentation'],
        },
    ]

    return render_template('labs.html', labs=labs_data)`
  },
  {
    path: 'app/routes/vulnerable.py',
    language: 'python',
    category: 'routes',
    description: 'Placeholder for Phase 3 vulnerable routes',
    content: `"""
Vulnerable Routes — PLACEHOLDER

This file will contain intentionally vulnerable endpoints
for Phase 3 security lab demonstrations.

Phase 3 will implement:
- SQL Injection vulnerable login
- Insecure cookie configuration
- Weak session management

DO NOT implement vulnerabilities in Phase 2.
"""
# This file is intentionally minimal in Phase 2.
# Phase 3 will add vulnerable lab endpoints here.`
  },
  {
    path: 'app/routes/secure.py',
    language: 'python',
    category: 'routes',
    description: 'Placeholder for Phase 3 secure routes',
    content: `"""
Secure Routes — PLACEHOLDER

This file will contain secure implementations
for Phase 3 security lab comparisons.

Phase 3 will implement:
- Parameterized query login
- Secure cookie configuration
- Proper session management

DO NOT implement vulnerabilities in Phase 2.
"""
# This file is intentionally minimal in Phase 2.
# Phase 3 will add secure lab endpoints here.`
  },

  // ===== MODELS =====
  {
    path: 'app/models/database.py',
    language: 'python',
    category: 'models',
    description: 'Database connection and helper functions',
    content: `"""
Database Module

Handles SQLite database connection, initialization, and helper functions.
Uses Flask's application context for connection management.
"""
import os
import sqlite3
from flask import g, current_app


def get_db():
    """
    Get database connection for the current application context.

    Creates a new connection if one doesn't exist for this context.
    Connection is stored in Flask's 'g' object.

    Returns:
        sqlite3.Connection: Database connection with row_factory set.
    """
    if 'db' not in g:
        db_path = current_app.config['DATABASE_PATH']
        g.db = sqlite3.connect(db_path)
        g.db.row_factory = sqlite3.Row
        g.db.execute('PRAGMA journal_mode=WAL')
    return g.db


def close_db(e=None):
    """
    Close database connection at end of request.

    Registered as a teardown function.
    """
    db = g.pop('db', None)
    if db is not None:
        db.close()


def init_db(app):
    """
    Initialize the database with schema.

    Creates tables if they don't exist.
    Called during application factory setup.

    Args:
        app: Flask application instance.
    """
    db_path = app.config['DATABASE_PATH']

    # Ensure directory exists
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

    conn = sqlite3.connect(db_path)

    # Read and execute schema
    schema_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        'schema.sql'
    )

    with open(schema_path, 'r') as f:
        conn.executescript(f.read())

    conn.close()


def log_login_attempt(username: str, endpoint: str, success: bool):
    """
    Log a login attempt to the database.

    SECURITY: Never log passwords, tokens, or secrets.

    Args:
        username: The username attempted (may be invalid).
        endpoint: The endpoint that was accessed.
        success: Whether the login was successful.
    """
    try:
        db = get_db()
        db.execute(
            'INSERT INTO login_logs (username, endpoint, success) VALUES (?, ?, ?)',
            (username, endpoint, success)
        )
        db.commit()
    except Exception:
        # Logging should never break the application
        pass


# Register teardown handler
# This will be called when the app is created
def register_teardown(app):
    """Register the close_db teardown handler."""
    app.teardown_appcontext(close_db)`
  },
  {
    path: 'app/models/schema.sql',
    language: 'sql',
    category: 'models',
    description: 'Database schema definition',
    content: `-- Web Application Security Vulnerable Lab
-- Database Schema
--
-- Tables:
--   users        - User accounts with hashed passwords
--   login_logs   - Authentication audit trail
--
-- Security Notes:
--   - Passwords are NEVER stored in plaintext
--   - Passwords are NEVER logged
--   - Session secrets are NEVER stored in this database

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

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_login_logs_username ON login_logs(username);
CREATE INDEX IF NOT EXISTS idx_login_logs_created ON login_logs(created_at);`
  },

  // ===== SECURITY (Placeholders for Phase 3) =====
  {
    path: 'app/security/vulnerable_auth.py',
    language: 'python',
    category: 'security',
    description: 'Placeholder — Phase 3 will add vulnerable auth',
    content: `"""
Vulnerable Authentication — PLACEHOLDER

This file will contain intentionally vulnerable authentication code
for Phase 3 SQL Injection lab demonstration.

Planned vulnerabilities (Phase 3):
- SQL query built with string concatenation
- Weak password comparison
- Verbose error messages

DO NOT implement vulnerabilities in Phase 2.
"""
# Placeholder for Phase 3`
  },
  {
    path: 'app/security/secure_auth.py',
    language: 'python',
    category: 'security',
    description: 'Placeholder — Phase 3 will add enhanced secure auth',
    content: `"""
Secure Authentication — PLACEHOLDER

This file will contain enhanced secure authentication code
for Phase 3 comparison with vulnerable implementation.

Phase 2 authentication (in routes/auth.py) is already secure.
Phase 3 will add additional security features here:
- Rate limiting
- Account lockout
- Enhanced logging
- CSRF protection

DO NOT implement vulnerabilities in Phase 2.
"""
# Placeholder for Phase 3`
  },
  {
    path: 'app/security/vulnerable_session.py',
    language: 'python',
    category: 'security',
    description: 'Placeholder — Phase 3 will add vulnerable session',
    content: `"""
Vulnerable Session Management — PLACEHOLDER

This file will contain intentionally weak session management
for Phase 3 Session Security lab demonstration.

Planned vulnerabilities (Phase 3):
- Predictable session identifiers
- No session regeneration after login
- No session invalidation on logout
- Excessively long session lifetime

DO NOT implement vulnerabilities in Phase 2.
"""
# Placeholder for Phase 3`
  },
  {
    path: 'app/security/secure_session.py',
    language: 'python',
    category: 'security',
    description: 'Placeholder — Phase 3 will add enhanced secure session',
    content: `"""
Secure Session Management — PLACEHOLDER

This file will contain enhanced secure session management
for Phase 3 comparison with vulnerable implementation.

Phase 3 will add:
- Cryptographic session identifiers
- Session regeneration after authentication
- Proper invalidation on logout
- Configurable expiration
- Secure cookie flags

DO NOT implement vulnerabilities in Phase 2.
"""
# Placeholder for Phase 3`
  },

  // ===== TEMPLATES =====
  {
    path: 'app/templates/base.html',
    language: 'html',
    category: 'templates',
    description: 'Base template with layout and security banner',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}{{ app_name }}{% endblock %}</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
</head>
<body>
    <!-- Security Warning Banner -->
    <div class="security-banner">
        <div class="banner-content">
            <span class="banner-icon">⚠</span>
            <strong>WARNING:</strong>
            This application is designed for cybersecurity education.
            Run only in an isolated laboratory environment.
            Do not expose this application to the public Internet.
        </div>
    </div>

    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="{{ url_for('main.index') }}" class="nav-brand">
                🛡️ {{ app_name }}
            </a>
            <div class="nav-links">
                <a href="{{ url_for('main.index') }}">Home</a>
                <a href="{{ url_for('lab.labs') }}">Labs</a>
                {% if session.get('user_id') %}
                    <a href="{{ url_for('main.dashboard') }}">Dashboard</a>
                    <form action="{{ url_for('auth.logout') }}" method="POST" class="nav-logout-form">
                        <button type="submit" class="nav-logout-btn">Logout</button>
                    </form>
                {% else %}
                    <a href="{{ url_for('auth.login') }}">Login</a>
                    <a href="{{ url_for('auth.register') }}">Register</a>
                {% endif %}
            </div>
        </div>
    </nav>

    <!-- Flash Messages -->
    {% with messages = get_flashed_messages(with_categories=true) %}
        {% if messages %}
            <div class="flash-container">
                {% for category, message in messages %}
                    <div class="flash flash-{{ category }}">
                        {{ message }}
                    </div>
                {% endfor %}
            </div>
        {% endif %}
    {% endwith %}

    <!-- Main Content -->
    <main class="container">
        {% block content %}{% endblock %}
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>Web Application Security Vulnerable Lab — Educational Use Only</p>
        </div>
    </footer>

    <script src="{{ url_for('static', filename='js/app.js') }}"></script>
</body>
</html>`
  },
  {
    path: 'app/templates/index.html',
    language: 'html',
    category: 'templates',
    description: 'Landing page',
    content: `{% extends "base.html" %}

{% block title %}Web Security Lab — Home{% endblock %}

{% block content %}
<div class="hero">
    <h1>Web Application Security Vulnerable Lab</h1>
    <p class="hero-subtitle">Educational Cybersecurity Laboratory</p>
    <p class="hero-description">
        Learn web application security through hands-on practice with
        intentionally vulnerable and secure implementations.
    </p>

    <div class="hero-actions">
        {% if session.get('user_id') %}
            <a href="{{ url_for('main.dashboard') }}" class="btn btn-primary">Dashboard</a>
            <a href="{{ url_for('lab.labs') }}" class="btn btn-secondary">Security Labs</a>
        {% else %}
            <a href="{{ url_for('auth.login') }}" class="btn btn-primary">Login</a>
            <a href="{{ url_for('auth.register') }}" class="btn btn-secondary">Register</a>
            <a href="{{ url_for('lab.labs') }}" class="btn btn-outline">Security Labs</a>
        {% endif %}
    </div>
</div>

<div class="features">
    <div class="feature-card">
        <div class="feature-icon">🔓</div>
        <h3>Vulnerable Labs</h3>
        <p>Study real-world vulnerabilities in a controlled environment.</p>
    </div>
    <div class="feature-card">
        <div class="feature-icon">🔒</div>
        <h3>Secure Implementations</h3>
        <p>Compare with properly secured code and learn mitigation.</p>
    </div>
    <div class="feature-card">
        <div class="feature-icon">📝</div>
        <h3>Documentation</h3>
        <p>Detailed explanations of root causes and fixes.</p>
    </div>
    <div class="feature-card">
        <div class="feature-icon">🧪</div>
        <h3>Automated Tests</h3>
        <p>Verify your fixes with pytest test suites.</p>
    </div>
</div>
{% endblock %}`
  },
  {
    path: 'app/templates/login.html',
    language: 'html',
    category: 'templates',
    description: 'Login form template',
    content: `{% extends "base.html" %}

{% block title %}Login — Web Security Lab{% endblock %}

{% block content %}
<div class="auth-container">
    <div class="auth-card">
        <h2>Login</h2>
        <p class="auth-subtitle">Enter your credentials to access the lab.</p>

        <form method="POST" action="{{ url_for('auth.login') }}" class="auth-form">
            <div class="form-group">
                <label for="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    required
                    autocomplete="username"
                >
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    autocomplete="current-password"
                >
            </div>

            <button type="submit" class="btn btn-primary btn-full">Login</button>
        </form>

        <p class="auth-footer">
            Don't have an account?
            <a href="{{ url_for('auth.register') }}">Register here</a>
        </p>
    </div>
</div>
{% endblock %}`
  },
  {
    path: 'app/templates/register.html',
    language: 'html',
    category: 'templates',
    description: 'Registration form template',
    content: `{% extends "base.html" %}

{% block title %}Register — Web Security Lab{% endblock %}

{% block content %}
<div class="auth-container">
    <div class="auth-card">
        <h2>Register</h2>
        <p class="auth-subtitle">Create a new lab account.</p>

        <form method="POST" action="{{ url_for('auth.register') }}" class="auth-form">
            <div class="form-group">
                <label for="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Choose a username (min 3 chars)"
                    required
                    minlength="3"
                    maxlength="50"
                    value="{{ username or '' }}"
                    autocomplete="username"
                >
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Choose a password (min 8 chars)"
                    required
                    minlength="8"
                    autocomplete="new-password"
                >
            </div>

            <div class="form-group">
                <label for="confirm_password">Confirm Password</label>
                <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    placeholder="Repeat your password"
                    required
                    autocomplete="new-password"
                >
            </div>

            <button type="submit" class="btn btn-primary btn-full">Register</button>
        </form>

        <p class="auth-footer">
            Already have an account?
            <a href="{{ url_for('auth.login') }}">Login here</a>
        </p>
    </div>
</div>
{% endblock %}`
  },
  {
    path: 'app/templates/dashboard.html',
    language: 'html',
    category: 'templates',
    description: 'Authenticated user dashboard',
    content: `{% extends "base.html" %}

{% block title %}Dashboard — Web Security Lab{% endblock %}

{% block content %}
<div class="dashboard">
    <div class="dashboard-header">
        <h1>Welcome, {{ username }}</h1>
        <p class="dashboard-subtitle">Your security lab dashboard</p>
    </div>

    <div class="dashboard-info">
        <div class="info-card">
            <div class="info-label">Username</div>
            <div class="info-value">{{ username }}</div>
        </div>
        <div class="info-card">
            <div class="info-label">User ID</div>
            <div class="info-value">{{ user_id }}</div>
        </div>
        <div class="info-card">
            <div class="info-label">Login Status</div>
            <div class="info-value status-authenticated">✓ Authenticated</div>
        </div>
    </div>

    <div class="dashboard-actions">
        <a href="{{ url_for('lab.labs') }}" class="btn btn-primary">
            🔬 Security Labs
        </a>
        <form action="{{ url_for('auth.logout') }}" method="POST" class="inline-form">
            <button type="submit" class="btn btn-danger">
                🚪 Logout
            </button>
        </form>
    </div>

    <div class="dashboard-note">
        <p><strong>Note:</strong> Security labs are coming in Phase 3.
        The current phase provides the secure foundation for authentication.</p>
    </div>
</div>
{% endblock %}`
  },
  {
    path: 'app/templates/labs.html',
    language: 'html',
    category: 'templates',
    description: 'Labs listing page',
    content: `{% extends "base.html" %}

{% block title %}Security Labs — Web Security Lab{% endblock %}

{% block content %}
<div class="labs-page">
    <h1>Security Laboratories</h1>
    <p class="page-subtitle">Hands-on security labs for learning web application vulnerabilities and mitigations.</p>

    <div class="labs-grid">
        {% for lab in labs %}
        <div class="lab-card">
            <div class="lab-header">
                <h3>{{ lab.name }}</h3>
                <span class="lab-status {% if 'Coming' in lab.status %}status-coming{% else %}status-available{% endif %}">
                    {{ lab.status }}
                </span>
            </div>
            <p class="lab-description">{{ lab.description }}</p>
            <div class="lab-meta">
                <span class="lab-difficulty">Difficulty: {{ lab.difficulty }}</span>
            </div>
            <div class="lab-topics">
                {% for topic in lab.topics %}
                    <span class="lab-topic">{{ topic }}</span>
                {% endfor %}
            </div>
        </div>
        {% endfor %}
    </div>
</div>
{% endblock %}`
  },
  {
    path: 'app/templates/comparison.html',
    language: 'html',
    category: 'templates',
    description: 'Placeholder for Phase 4 comparison page',
    content: `{% extends "base.html" %}

{% block title %}Comparison — Web Security Lab{% endblock %}

{% block content %}
<div class="comparison-page">
    <h1>Vulnerable vs Secure Comparison</h1>
    <p class="page-subtitle">This page will be available in Phase 4.</p>
    <p>Coming soon: Side-by-side comparison of vulnerable and secure implementations.</p>
</div>
{% endblock %}`
  },
  {
    path: 'app/templates/reports.html',
    language: 'html',
    category: 'templates',
    description: 'Placeholder for reports page',
    content: `{% extends "base.html" %}

{% block title %}Reports — Web Security Lab{% endblock %}

{% block content %}
<div class="reports-page">
    <h1>Lab Reports</h1>
    <p class="page-subtitle">This page will be available in Phase 4.</p>
    <p>Coming soon: Login logs and lab activity reports.</p>
</div>
{% endblock %}`
  },

  // ===== STATIC =====
  {
    path: 'app/static/css/style.css',
    language: 'css',
    category: 'static',
    description: 'Main stylesheet',
    content: `/* Web Application Security Vulnerable Lab - Stylesheet */

/* === Reset & Base === */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

:root {
    --color-bg: #0f172a;
    --color-surface: #1e293b;
    --color-border: #334155;
    --color-text: #e2e8f0;
    --color-text-muted: #94a3b8;
    --color-primary: #10b981;
    --color-primary-hover: #059669;
    --color-danger: #ef4444;
    --color-warning: #f59e0b;
    --color-info: #3b82f6;
    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-mono: 'Courier New', Courier, monospace;
}

body {
    font-family: var(--font-family);
    background-color: var(--color-bg);
    color: var(--color-text);
    line-height: 1.6;
    min-height: 100vh;
}

a {
    color: var(--color-primary);
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

/* === Security Banner === */
.security-banner {
    background-color: #7f1d1d;
    border-bottom: 2px solid #991b1b;
    padding: 10px 20px;
    text-align: center;
}

.banner-content {
    max-width: 900px;
    margin: 0 auto;
    font-size: 0.85rem;
    color: #fecaca;
}

.banner-icon {
    font-size: 1.1rem;
    margin-right: 4px;
}

/* === Navigation === */
.navbar {
    background-color: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    padding: 0 20px;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
}

.nav-brand {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-primary) !important;
    text-decoration: none !important;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 20px;
}

.nav-links a {
    color: var(--color-text-muted);
    font-size: 0.9rem;
    transition: color 0.2s;
}

.nav-links a:hover {
    color: var(--color-text);
    text-decoration: none;
}

.nav-logout-form {
    display: inline;
}

.nav-logout-btn {
    background: none;
    border: 1px solid var(--color-danger);
    color: var(--color-danger);
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
}

.nav-logout-btn:hover {
    background-color: var(--color-danger);
    color: white;
}

/* === Container === */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
}

/* === Flash Messages === */
.flash-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 15px 20px 0;
}

.flash {
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 10px;
    font-size: 0.9rem;
}

.flash-error {
    background-color: #7f1d1d;
    border: 1px solid #991b1b;
    color: #fecaca;
}

.flash-success {
    background-color: #064e3b;
    border: 1px solid #065f46;
    color: #a7f3d0;
}

/* === Hero Section === */
.hero {
    text-align: center;
    padding: 60px 20px;
}

.hero h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: var(--color-text);
}

.hero-subtitle {
    font-size: 1.2rem;
    color: var(--color-primary);
    margin-bottom: 15px;
}

.hero-description {
    color: var(--color-text-muted);
    max-width: 600px;
    margin: 0 auto 30px;
}

.hero-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
}

/* === Buttons === */
.btn {
    display: inline-block;
    padding: 10px 24px;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 500;
    text-decoration: none !important;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
}

.btn-primary {
    background-color: var(--color-primary);
    color: white;
}

.btn-primary:hover {
    background-color: var(--color-primary-hover);
}

.btn-secondary {
    background-color: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
}

.btn-secondary:hover {
    background-color: var(--color-border);
}

.btn-outline {
    background: transparent;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
}

.btn-outline:hover {
    background-color: var(--color-primary);
    color: white;
}

.btn-danger {
    background-color: var(--color-danger);
    color: white;
}

.btn-danger:hover {
    background-color: #dc2626;
}

.btn-full {
    width: 100%;
}

/* === Features Grid === */
.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 40px;
}

.feature-card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 24px;
    text-align: center;
}

.feature-icon {
    font-size: 2rem;
    margin-bottom: 12px;
}

.feature-card h3 {
    margin-bottom: 8px;
    color: var(--color-text);
}

.feature-card p {
    color: var(--color-text-muted);
    font-size: 0.9rem;
}

/* === Auth Forms === */
.auth-container {
    display: flex;
    justify-content: center;
    padding: 40px 0;
}

.auth-card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 40px;
    width: 100%;
    max-width: 420px;
}

.auth-card h2 {
    margin-bottom: 8px;
}

.auth-subtitle {
    color: var(--color-text-muted);
    margin-bottom: 24px;
    font-size: 0.9rem;
}

.form-group {
    margin-bottom: 18px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    font-size: 0.9rem;
    color: var(--color-text-muted);
}

.form-group input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background-color: var(--color-bg);
    color: var(--color-text);
    font-size: 0.95rem;
}

.form-group input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.auth-footer {
    text-align: center;
    margin-top: 20px;
    font-size: 0.9rem;
    color: var(--color-text-muted);
}

/* === Dashboard === */
.dashboard-header {
    margin-bottom: 30px;
}

.dashboard-header h1 {
    font-size: 2rem;
}

.dashboard-subtitle {
    color: var(--color-text-muted);
}

.dashboard-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 30px;
}

.info-card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 20px;
}

.info-label {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
}

.info-value {
    font-size: 1.1rem;
    font-weight: 600;
}

.status-authenticated {
    color: var(--color-primary);
}

.dashboard-actions {
    display: flex;
    gap: 12px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.inline-form {
    display: inline;
}

.dashboard-note {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 16px;
    font-size: 0.9rem;
    color: var(--color-text-muted);
}

/* === Labs Page === */
.labs-page h1 {
    margin-bottom: 8px;
}

.page-subtitle {
    color: var(--color-text-muted);
    margin-bottom: 30px;
}

.labs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
}

.lab-card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 24px;
}

.lab-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
}

.lab-header h3 {
    font-size: 1.1rem;
}

.lab-status {
    font-size: 0.75rem;
    padding: 3px 8px;
    border-radius: 4px;
    white-space: nowrap;
}

.status-coming {
    background-color: #78350f;
    color: #fbbf24;
}

.status-available {
    background-color: #064e3b;
    color: #6ee7b7;
}

.lab-description {
    color: var(--color-text-muted);
    font-size: 0.9rem;
    margin-bottom: 12px;
}

.lab-meta {
    margin-bottom: 12px;
}

.lab-difficulty {
    font-size: 0.8rem;
    color: var(--color-text-muted);
}

.lab-topics {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.lab-topic {
    font-size: 0.75rem;
    padding: 3px 8px;
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text-muted);
}

/* === Footer === */
.footer {
    border-top: 1px solid var(--color-border);
    padding: 20px;
    text-align: center;
    color: var(--color-text-muted);
    font-size: 0.85rem;
    margin-top: 40px;
}`
  },
  {
    path: 'app/static/js/app.js',
    language: 'javascript',
    category: 'static',
    description: 'Client-side JavaScript',
    content: `/**
 * Web Application Security Vulnerable Lab
 * Client-side JavaScript
 *
 * Phase 2: Minimal JavaScript
 * Phase 3+: Will add lab-specific interactivity
 */

document.addEventListener('DOMContentLoaded', function() {
    // Auto-dismiss flash messages after 5 seconds
    const flashMessages = document.querySelectorAll('.flash');
    flashMessages.forEach(function(flash) {
        setTimeout(function() {
            flash.style.transition = 'opacity 0.5s';
            flash.style.opacity = '0';
            setTimeout(function() {
                flash.remove();
            }, 500);
        }, 5000);
    });

    // Form validation feedback
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            const password = form.querySelector('input[name="password"]');
            const confirm = form.querySelector('input[name="confirm_password"]');

            if (password && confirm && password.value !== confirm.value) {
                e.preventDefault();
                alert('Passwords do not match.');
                confirm.focus();
            }
        });
    });
});`
  },

  // ===== TESTS =====
  {
    path: 'tests/test_auth.py',
    language: 'python',
    category: 'tests',
    description: 'Authentication tests (register, login, logout, dashboard)',
    content: `"""
Authentication Tests

Tests for registration, login, logout, and dashboard access.
Uses a temporary database to ensure test isolation.
"""
import os
import sys
import pytest
import tempfile

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.models.database import get_db


@pytest.fixture
def app():
    """Create a test application instance with temporary database."""
    # Create temporary file for test database
    db_fd, db_path = tempfile.mkstemp(suffix='.db')

    app = create_app({
        'TESTING': True,
        'DATABASE_PATH': db_path,
        'SECRET_KEY': 'test-secret-key',
        'WTF_CSRF_ENABLED': False,
    })

    yield app

    # Cleanup
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def client(app):
    """Create a test client."""
    return app.test_client()


@pytest.fixture
def app_context(app):
    """Provide application context."""
    with app.app_context():
        yield app


# =====================
# Registration Tests
# =====================

class TestRegistration:
    """Tests for user registration."""

    def test_register_success(self, client):
        """Test successful user registration."""
        response = client.post('/register', data={
            'username': 'testuser',
            'password': 'TestPass123!',
            'confirm_password': 'TestPass123!'
        }, follow_redirects=True)

        assert response.status_code == 200
        # Should redirect to login page after successful registration
        assert b'Login' in response.data
        assert b'Registration successful' in response.data

    def test_register_duplicate_username(self, client):
        """Test registration with existing username fails."""
        # Register first user
        client.post('/register', data={
            'username': 'duplicate',
            'password': 'TestPass123!',
            'confirm_password': 'TestPass123!'
        })

        # Try to register same username
        response = client.post('/register', data={
            'username': 'duplicate',
            'password': 'AnotherPass123!',
            'confirm_password': 'AnotherPass123!'
        }, follow_redirects=True)

        assert b'Username already exists' in response.data

    def test_register_missing_input(self, client):
        """Test registration with missing fields fails."""
        response = client.post('/register', data={
            'username': '',
            'password': '',
            'confirm_password': ''
        }, follow_redirects=True)

        assert response.status_code == 200
        assert b'required' in response.data.lower() or b'Username' in response.data

    def test_register_password_mismatch(self, client):
        """Test registration with mismatched passwords fails."""
        response = client.post('/register', data={
            'username': 'testuser',
            'password': 'TestPass123!',
            'confirm_password': 'DifferentPass!'
        }, follow_redirects=True)

        assert b'do not match' in response.data

    def test_register_short_password(self, client):
        """Test registration with short password fails."""
        response = client.post('/register', data={
            'username': 'testuser',
            'password': 'short',
            'confirm_password': 'short'
        }, follow_redirects=True)

        assert b'at least 8' in response.data


# =====================
# Login Tests
# =====================

class TestLogin:
    """Tests for user login."""

    def _register_user(self, client, username='testuser', password='TestPass123!'):
        """Helper to register a user for login tests."""
        client.post('/register', data={
            'username': username,
            'password': password,
            'confirm_password': password
        })

    def test_login_success(self, client):
        """Test successful login."""
        self._register_user(client)

        response = client.post('/login', data={
            'username': 'testuser',
            'password': 'TestPass123!'
        }, follow_redirects=True)

        assert response.status_code == 200
        assert b'Dashboard' in response.data or b'Welcome' in response.data

    def test_login_invalid_password(self, client):
        """Test login with wrong password fails."""
        self._register_user(client)

        response = client.post('/login', data={
            'username': 'testuser',
            'password': 'WrongPassword!'
        }, follow_redirects=True)

        assert b'Invalid username or password' in response.data

    def test_login_unknown_user(self, client):
        """Test login with non-existent user fails."""
        response = client.post('/login', data={
            'username': 'nonexistent',
            'password': 'SomePassword!'
        }, follow_redirects=True)

        assert b'Invalid username or password' in response.data

    def test_login_empty_fields(self, client):
        """Test login with empty fields fails."""
        response = client.post('/login', data={
            'username': '',
            'password': ''
        }, follow_redirects=True)

        assert response.status_code == 200


# =====================
# Dashboard Tests
# =====================

class TestDashboard:
    """Tests for dashboard access."""

    def test_dashboard_requires_login(self, client):
        """Test that dashboard redirects unauthenticated users."""
        response = client.get('/dashboard', follow_redirects=True)

        assert b'Please log in' in response.data or b'Login' in response.data

    def test_dashboard_authenticated(self, client):
        """Test that authenticated users can access dashboard."""
        # Register and login
        client.post('/register', data={
            'username': 'dashuser',
            'password': 'TestPass123!',
            'confirm_password': 'TestPass123!'
        })
        client.post('/login', data={
            'username': 'dashuser',
            'password': 'TestPass123!'
        })

        response = client.get('/dashboard')

        assert response.status_code == 200
        assert b'dashuser' in response.data
        assert b'Authenticated' in response.data


# =====================
# Logout Tests
# =====================

class TestLogout:
    """Tests for logout functionality."""

    def test_logout(self, client):
        """Test that logout clears session and redirects."""
        # Register and login
        client.post('/register', data={
            'username': 'logoutuser',
            'password': 'TestPass123!',
            'confirm_password': 'TestPass123!'
        })
        client.post('/login', data={
            'username': 'logoutuser',
            'password': 'TestPass123!'
        })

        # Verify logged in
        response = client.get('/dashboard')
        assert b'logoutuser' in response.data

        # Logout
        response = client.post('/logout', follow_redirects=True)
        assert response.status_code == 200

        # Verify logged out - dashboard should redirect
        response = client.get('/dashboard', follow_redirects=True)
        assert b'Please log in' in response.data or b'Login' in response.data


# =====================
# Database Tests
# =====================

class TestDatabase:
    """Tests for database operations."""

    def test_user_stored_with_hashed_password(self, app_context):
        """Test that passwords are stored as hashes, not plaintext."""
        import bcrypt

        with app_context.app_context():
            db = get_db()

            # Register a user
            password = 'SecurePassword123!'
            password_hash = bcrypt.hashpw(
                password.encode('utf-8'),
                bcrypt.gensalt()
            ).decode('utf-8')

            db.execute(
                'INSERT INTO users (username, password_hash) VALUES (?, ?)',
                ('hashtest', password_hash)
            )
            db.commit()

            # Verify stored hash is not plaintext
            user = db.execute(
                'SELECT password_hash FROM users WHERE username = ?',
                ('hashtest',)
            ).fetchone()

            assert user is not None
            assert user['password_hash'] != password
            assert user['password_hash'] != 'SecurePassword123!'
            assert user['password_hash'].startswith('$2')  # bcrypt hash prefix

    def test_login_log_stored(self, app_context):
        """Test that login attempts are logged."""
        from app.models.database import log_login_attempt

        with app_context.app_context():
            log_login_attempt('testlog', '/login', True)
            log_login_attempt('baduser', '/login', False)

            db = get_db()
            logs = db.execute(
                'SELECT * FROM login_logs ORDER BY id DESC LIMIT 2'
            ).fetchall()

            assert len(logs) >= 2
            assert logs[0]['username'] == 'baduser'
            assert logs[0]['success'] == 0
            assert logs[1]['username'] == 'testlog'
            assert logs[1]['success'] == 1`
  },
  {
    path: 'tests/test_sqli.py',
    language: 'python',
    category: 'tests',
    description: 'Placeholder for Phase 3 SQL injection tests',
    content: `"""
SQL Injection Tests — PLACEHOLDER

Phase 3 will implement tests for:
- Vulnerable endpoint behavior with SQL injection payloads
- Secure endpoint rejection of injection attempts
- Parameterized query verification

DO NOT implement in Phase 2.
"""
# Placeholder for Phase 3`
  },
  {
    path: 'tests/test_cookie.py',
    language: 'python',
    category: 'tests',
    description: 'Placeholder for Phase 3 cookie tests',
    content: `"""
Cookie Security Tests — PLACEHOLDER

Phase 3 will implement tests for:
- HttpOnly flag verification
- Secure flag verification
- SameSite attribute verification

DO NOT implement in Phase 2.
"""
# Placeholder for Phase 3`
  },
  {
    path: 'tests/test_session.py',
    language: 'python',
    category: 'tests',
    description: 'Placeholder for Phase 3 session tests',
    content: `"""
Session Security Tests — PLACEHOLDER

Phase 3 will implement tests for:
- Session creation verification
- Session regeneration after login
- Session invalidation on logout
- Session expiration

DO NOT implement in Phase 2.
"""
# Placeholder for Phase 3`
  },

  // ===== SCRIPTS =====
  {
    path: 'scripts/init_db.py',
    language: 'python',
    category: 'scripts',
    description: 'Initialize empty database',
    content: `"""
Database Initialization Script

Creates the database file and applies the schema.
Does not add any seed data.

Usage:
    python scripts/init_db.py
"""
import os
import sys
import sqlite3

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


def init_database():
    """Create database and apply schema."""
    # Determine database path
    db_path = os.environ.get(
        'DATABASE_PATH',
        os.path.join(os.path.dirname(os.path.dirname(__file__)), 'instance', 'lab.db')
    )

    # Ensure directory exists
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

    # Read schema
    schema_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        'app', 'models', 'schema.sql'
    )

    print(f"Initializing database at: {db_path}")

    conn = sqlite3.connect(db_path)

    with open(schema_path, 'r') as f:
        conn.executescript(f.read())

    conn.close()

    print("✓ Database initialized successfully.")
    print(f"  Location: {db_path}")


if __name__ == '__main__':
    init_database()`
  },
  {
    path: 'scripts/seed_data.py',
    language: 'python',
    category: 'scripts',
    description: 'Seed lab users into database',
    content: `"""
Seed Data Script

Creates lab user accounts for educational purposes.

⚠ WARNING: These credentials are for LOCAL LAB USE ONLY.
   Do NOT use these passwords in production.
   Do NOT use these passwords for any real accounts.

Lab Credentials:
    username: student  |  password: StudentLab123!
    username: admin    |  password: AdminLab123!

Usage:
    python scripts/seed_data.py
"""
import os
import sys
import sqlite3
import bcrypt

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


# Lab credentials — LOCAL USE ONLY
SEED_USERS = [
    {'username': 'student', 'password': 'StudentLab123!'},
    {'username': 'admin', 'password': 'AdminLab123!'},
]


def seed_database():
    """Insert seed users into the database."""
    db_path = os.environ.get(
        'DATABASE_PATH',
        os.path.join(os.path.dirname(os.path.dirname(__file__)), 'instance', 'lab.db')
    )

    if not os.path.exists(db_path):
        print(f"Error: Database not found at {db_path}")
        print("Run 'python scripts/init_db.py' first.")
        sys.exit(1)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    for user in SEED_USERS:
        # Check if user already exists
        cursor.execute(
            'SELECT id FROM users WHERE username = ?',
            (user['username'],)
        )
        if cursor.fetchone():
            print(f"  User '{user['username']}' already exists, skipping.")
            continue

        # Hash password
        password_hash = bcrypt.hashpw(
            user['password'].encode('utf-8'),
            bcrypt.gensalt(rounds=12)
        ).decode('utf-8')

        # Insert user
        cursor.execute(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)',
            (user['username'], password_hash)
        )
        print(f"  ✓ Created user: {user['username']}")

    conn.commit()
    conn.close()

    print("\\n✓ Seed data inserted successfully.")
    print("\\nLab Credentials:")
    for user in SEED_USERS:
        print(f"  {user['username']} / {user['password']}")
    print("\\n⚠ These are LOCAL LAB credentials only. Do not use in production.")


if __name__ == '__main__':
    print("=" * 50)
    print("  Web Security Lab — Seed Data")
    print("=" * 50)
    print()
    seed_database()`
  },
  {
    path: 'scripts/reset_lab.py',
    language: 'python',
    category: 'scripts',
    description: 'Reset lab to initial state',
    content: `"""
Lab Reset Script

Completely resets the lab environment:
1. Removes existing database
2. Creates fresh database
3. Applies schema
4. Inserts seed users
5. Reports success

Usage:
    python scripts/reset_lab.py
"""
import os
import sys
import sqlite3
import bcrypt

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


# Lab credentials — LOCAL USE ONLY
SEED_USERS = [
    {'username': 'student', 'password': 'StudentLab123!'},
    {'username': 'admin', 'password': 'AdminLab123!'},
]


def reset_lab():
    """Reset the entire lab environment."""
    db_path = os.environ.get(
        'DATABASE_PATH',
        os.path.join(os.path.dirname(os.path.dirname(__file__)), 'instance', 'lab.db')
    )

    print("=" * 50)
    print("  Web Security Lab — Reset")
    print("=" * 50)
    print()

    # Step 1: Remove existing database
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"✓ Removed existing database: {db_path}")
    else:
        print(f"  No existing database found at: {db_path}")

    # Step 2: Ensure directory exists
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

    # Step 3: Create database and apply schema
    schema_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        'app', 'models', 'schema.sql'
    )

    conn = sqlite3.connect(db_path)

    with open(schema_path, 'r') as f:
        conn.executescript(f.read())

    print("✓ Created fresh database with schema")

    # Step 4: Insert seed users
    for user in SEED_USERS:
        password_hash = bcrypt.hashpw(
            user['password'].encode('utf-8'),
            bcrypt.gensalt(rounds=12)
        ).decode('utf-8')

        conn.execute(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)',
            (user['username'], password_hash)
        )
        print(f"✓ Created seed user: {user['username']}")

    conn.commit()
    conn.close()

    print()
    print("=" * 50)
    print("  Lab Reset Complete!")
    print("=" * 50)
    print()
    print(f"Database: {db_path}")
    print()
    print("Lab Credentials:")
    for user in SEED_USERS:
        print(f"  {user['username']} / {user['password']}")
    print()
    print("⚠ These are LOCAL LAB credentials only.")
    print("  Do not use in production environments.")
    print()
    print("Start the application:")
    print("  python run.py")


if __name__ == '__main__':
    reset_lab()`
  },

  // ===== CONFIG =====
  {
    path: 'requirements.txt',
    language: 'text',
    category: 'config',
    description: 'Python dependencies',
    content: `Flask>=3.0.0
python-dotenv>=1.0.0
bcrypt>=4.0.0
pytest>=7.4.0`
  },
  {
    path: '.env.example',
    language: 'text',
    category: 'config',
    description: 'Environment variable template',
    content: `# Web Application Security Vulnerable Lab
# Environment Configuration
#
# Copy this file to .env and modify as needed:
#   cp .env.example .env
#
# ⚠ NEVER commit .env to version control

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1

# ⚠ CHANGE THIS in any non-development environment
# This is a development-only fallback secret
SECRET_KEY=dev-secret-key-DO-NOT-USE-IN-PRODUCTION

# Database
DATABASE_PATH=instance/lab.db

# Server
HOST=127.0.0.1
PORT=5000`
  },
  {
    path: '.gitignore',
    language: 'text',
    category: 'config',
    description: 'Git ignore rules',
    content: `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python

# Virtual Environment
.venv/
venv/
ENV/

# Environment Variables
.env

# Database
instance/
*.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
.pytest_cache/
htmlcov/
.coverage

# Distribution
dist/
build/
*.egg-info/

# Screenshots (keep directory, ignore files)
screenshots/*.png
screenshots/*.jpg`
  },

  // ===== DOCKER =====
  {
    path: 'Dockerfile',
    language: 'dockerfile',
    category: 'docker',
    description: 'Docker image definition',
    content: `# Web Application Security Vulnerable Lab
# Docker Image Definition
#
# Build: docker build -t web-security-lab .
# Run:   docker run -p 5000:5000 web-security-lab

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create instance directory for database
RUN mkdir -p /app/instance

# Initialize database with seed data
RUN python scripts/reset_lab.py

# Expose port
EXPOSE 5000

# Set environment variables
ENV FLASK_ENV=production
ENV HOST=0.0.0.0
ENV PORT=5000

# Run the application
CMD ["python", "run.py"]`
  },
  {
    path: 'docker-compose.yml',
    language: 'yaml',
    category: 'docker',
    description: 'Docker Compose configuration',
    content: `# Web Application Security Vulnerable Lab
# Docker Compose Configuration
#
# Usage:
#   docker compose up --build
#   docker compose down
#
# Access: http://localhost:5000

version: '3.8'

services:
  web-security-lab:
    build: .
    container_name: web-security-lab
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=development
      - HOST=0.0.0.0
      - PORT=5000
      - SECRET_KEY=docker-dev-secret-CHANGE-IN-PRODUCTION
      - DATABASE_PATH=/app/instance/lab.db
    volumes:
      - lab-data:/app/instance
    restart: unless-stopped

volumes:
  lab-data:`
  },

  // ===== DOCUMENTATION =====
  {
    path: 'README.md',
    language: 'markdown',
    category: 'config',
    description: 'Project README',
    content: `# Web Application Security Vulnerable Lab

> ⚠ **WARNING**: This application intentionally contains vulnerable components for security education.
> Run only in an isolated laboratory environment. Do not expose to the public Internet.

## Overview

An educational cybersecurity training platform for learning web application security through
hands-on practice with vulnerable and secure implementations.

## Educational Purpose

This lab teaches:
- SQL Injection
- Cookie Security
- Session Security
- Authentication Security
- Secure Coding Practices
- Vulnerability Mitigation
- Retesting

## Security Warning

- Run ONLY on localhost, Docker container, or isolated VM
- NEVER deploy to production
- NEVER expose to the public Internet
- Seed credentials are for local lab use only

## Requirements

- Python 3.10+
- pip
- (Optional) Docker & Docker Compose

## Installation (Windows PowerShell)

\`\`\`powershell
# Clone or download the project
cd web-security-lab

# Create virtual environment
python -m venv .venv

# Activate virtual environment
.\\.venv\\Scripts\\Activate.ps1

# If you get an execution policy error, use:
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# Install dependencies
pip install -r requirements.txt

# Initialize database with seed data
python scripts\\reset_lab.py

# Run the application
python run.py
\`\`\`

Access: http://127.0.0.1:5000

## Seed Credentials

| Username | Password        | Note                    |
|----------|-----------------|-------------------------|
| student  | StudentLab123!  | Lab student account     |
| admin    | AdminLab123!    | Lab admin account       |

⚠ These are LOCAL LAB credentials only. Do not use in production.

## Running Tests

\`\`\`powershell
# Activate virtual environment first
.\\.venv\\Scripts\\Activate.ps1

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_auth.py
\`\`\`

## Docker

\`\`\`bash
# Build and run
docker compose up --build

# Access: http://localhost:5000

# Stop
docker compose down
\`\`\`

## Project Structure

\`\`\`
web-security-lab/
├── app/
│   ├── __init__.py          # Application factory
│   ├── routes/              # Route handlers
│   ├── models/              # Database layer
│   ├── security/            # Security implementations
│   ├── templates/           # HTML templates
│   └── static/              # CSS, JS
├── tests/                   # pytest test suite
├── docs/                    # Documentation
├── scripts/                 # Utility scripts
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── run.py
\`\`\`

## Current Phase

**Phase 2 — Core Application Foundation** ✓

Implemented:
- Flask application with factory pattern
- SQLite database with schema
- User registration with password hashing
- Secure login with bcrypt verification
- Session-based authentication
- Dashboard with login requirement
- Login logging
- Automated tests with pytest
- Database reset script
- Docker configuration

## Planned Phase 3

- SQL Injection Lab (vulnerable + secure)
- Cookie Security Lab (vulnerable + secure)
- Session Security Lab (vulnerable + secure)
- Authentication Security Lab
- Mitigation & Retest Lab

## License

Educational use only. Not for production deployment.`
  },
  {
    path: 'docs/ARCHITECTURE.md',
    language: 'markdown',
    category: 'config',
    description: 'Architecture documentation',
    content: `# Architecture Documentation

## System Overview

\`\`\`
Browser (Client)
    ↓ HTTP Request
Flask Application
    ↓
Routes (Blueprints)
    ↓
Database Layer
    ↓
SQLite (lab.db)
\`\`\`

## Application Factory Pattern

The application uses Flask's application factory pattern:

\`\`\`python
# app/__init__.py
def create_app(test_config=None):
    app = Flask(__name__)
    # Configure
    # Initialize DB
    # Register Blueprints
    return app
\`\`\`

This enables:
- Test isolation (each test gets fresh app instance)
- Configuration flexibility
- Multiple app instances if needed

## Authentication Flow

### Registration

\`\`\`
User fills form
    ↓
POST /register
    ↓
Input validation
    ↓
Check username exists (parameterized query)
    ↓
Hash password (bcrypt, 12 rounds)
    ↓
INSERT INTO users
    ↓
Redirect to /login with success message
\`\`\`

### Login

\`\`\`
User submits credentials
    ↓
POST /login
    ↓
SELECT user WHERE username = ? (parameterized)
    ↓
bcrypt.checkpw(password, stored_hash)
    ↓
[Success]                    [Failure]
    ↓                            ↓
Set session                  Log failure
Log success                  Generic error message
    ↓                            ↓
Redirect /dashboard          Stay on /login
\`\`\`

### Dashboard Access

\`\`\`
GET /dashboard
    ↓
@login_required decorator
    ↓
Check session['user_id'] exists
    ↓
[Authenticated]            [Not Authenticated]
    ↓                            ↓
Render dashboard            Flash message
                            Redirect /login
\`\`\`

### Logout

\`\`\`
POST /logout
    ↓
session.clear()
    ↓
Redirect /login
\`\`\`

## Data Flow

\`\`\`
Request → Flask → Route Handler → Database Query → Response
                  ↓
              Validation
                  ↓
              Business Logic
                  ↓
              Session/DB Update
                  ↓
              Template Render
\`\`\`

## Security Measures (Phase 2)

1. **Password Hashing**: bcrypt with 12 rounds
2. **Parameterized Queries**: All SQL uses ? placeholders
3. **Generic Error Messages**: "Invalid username or password"
4. **Session Security**: Flask secure session cookies
5. **Input Validation**: Length checks, required fields
6. **No Information Leakage**: No stack traces, no DB errors shown
7. **Login Logging**: Audit trail without sensitive data

## Database Design

- **users**: User accounts with hashed passwords
- **login_logs**: Authentication audit trail
- No passwords stored in plaintext
- No secrets stored in database

## Testing Strategy

- Temporary database per test (isolation)
- Application factory with test config
- Test client for HTTP testing
- Direct database verification for data integrity`
  },
];

export const fileCategories = [
  { id: 'core', label: 'Core Application', icon: '🏗️' },
  { id: 'routes', label: 'Routes', icon: '🔀' },
  { id: 'models', label: 'Models & Database', icon: '🗄️' },
  { id: 'security', label: 'Security (Phase 3)', icon: '🔐' },
  { id: 'templates', label: 'Templates', icon: '📄' },
  { id: 'static', label: 'Static Assets', icon: '🎨' },
  { id: 'tests', label: 'Tests', icon: '🧪' },
  { id: 'scripts', label: 'Scripts', icon: '⚙️' },
  { id: 'config', label: 'Configuration', icon: '📋' },
  { id: 'docker', label: 'Docker', icon: '🐳' },
];
