import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { sourceFiles } from '../data/sourceFiles';

export const downloadProjectAsZip = async () => {
  const zip = new JSZip();
  
  // Group files by category for better organization
  const categories = {
    core: 'app/',
    routes: 'app/routes/',
    models: 'app/models/',
    security: 'app/security/',
    templates: 'app/templates/',
    static: 'app/static/',
    tests: 'tests/',
    scripts: 'scripts/',
    config: '',
    docker: ''
  };

  // Add all source files to zip
  sourceFiles.forEach(file => {
    const folder = categories[file.category as keyof typeof categories] || '';
    const path = folder + file.path;
    zip.file(path, file.content);
  });

  // Add README if not exists
  const hasReadme = sourceFiles.some(f => f.path === 'README.md');
  if (!hasReadme) {
    zip.file('README.md', `# Web Security Vulnerable Lab

## Phase 2 & 3 Complete

A comprehensive web application security training platform with:
- Secure authentication system (Phase 2)
- SQL Injection lab (Phase 3)
- Cookie Security lab (Phase 3)
- Session Security lab (Phase 3)

## Quick Start

\`\`\`bash
# Install dependencies
pip install -r requirements.txt

# Initialize database
python scripts/init_db.py

# Run the application
python run.py
\`\`\`

## Lab Credentials
- Username: student
- Password: StudentLab123!

- Username: admin  
- Password: AdminLab123!

## Important
⚠️ This is an educational security lab. Run only in isolated environments.
`);
  }

  // Add lab templates
  zip.file('app/templates/labs/sqli_vulnerable.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SQL Injection Lab - Vulnerable</title>
</head>
<body>
    <h1>SQL Injection Lab - Vulnerable Implementation</h1>
    <form method="POST">
        <input type="text" name="username" placeholder="Username">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Login</button>
    </form>
</body>
</html>`);

  zip.file('app/templates/labs/sqli_secure.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SQL Injection Lab - Secure</title>
</head>
<body>
    <h1>SQL Injection Lab - Secure Implementation</h1>
    <form method="POST">
        <input type="text" name="username" placeholder="Username">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Login</button>
    </form>
</body>
</html>`);

  zip.file('app/templates/labs/cookies_vulnerable.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Cookie Security Lab - Vulnerable</title>
</head>
<body>
    <h1>Cookie Security Lab - Vulnerable Configuration</h1>
    <button onclick="fetch('/lab/cookies/vulnerable', {method: 'POST'})">Set Vulnerable Cookie</button>
</body>
</html>`);

  zip.file('app/templates/labs/cookies_secure.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Cookie Security Lab - Secure</title>
</head>
<body>
    <h1>Cookie Security Lab - Secure Configuration</h1>
    <button onclick="fetch('/lab/cookies/secure', {method: 'POST'})">Set Secure Cookie</button>
</body>
</html>`);

  zip.file('app/templates/labs/session_vulnerable.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Session Security Lab - Vulnerable</title>
</head>
<body>
    <h1>Session Security Lab - Vulnerable Implementation</h1>
    <form method="POST">
        <input type="hidden" name="action" value="login">
        <input type="text" name="username" placeholder="Username">
        <button type="submit">Login</button>
    </form>
</body>
</html>`);

  zip.file('app/templates/labs/session_secure.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Session Security Lab - Secure</title>
</head>
<body>
    <h1>Session Security Lab - Secure Implementation</h1>
    <form method="POST">
        <input type="hidden" name="action" value="login">
        <input type="text" name="username" placeholder="Username">
        <button type="submit">Login</button>
    </form>
</body>
</html>`);

  // Add documentation files
  zip.file('docs/SQL_INJECTION.md', `# SQL Injection Lab

## Objective
Understand how SQL injection works and how to prevent it.

## Vulnerable Implementation
The vulnerable version uses string concatenation to build SQL queries.

## Secure Implementation
The secure version uses parameterized queries.

## Testing
Try these payloads on the vulnerable endpoint:
- ' OR '1'='1
- admin' --
`);

  zip.file('docs/COOKIE_SECURITY.md', `# Cookie Security Lab

## Objective
Understand cookie security flags and their implications.

## Vulnerable Configuration
Missing HttpOnly, Secure, and SameSite flags.

## Secure Configuration
All security flags properly set.
`);

  zip.file('docs/SESSION_SECURITY.md', `# Session Security Lab

## Objective
Understand session management vulnerabilities.

## Vulnerable Implementation
No session regeneration after login.

## Secure Implementation
Session regeneration and proper invalidation.
`);

  // Generate and download zip
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'web-security-lab-phase2-3.zip');
};

export const downloadSingleFile = (file: { path: string; content: string }) => {
  const blob = new Blob([file.content], { type: 'text/plain' });
  saveAs(blob, file.path.split('/').pop() || 'file.txt');
};
