# Fitur Download ZIP

## Cara Menggunakan

Aplikasi Web Security Lab sekarang memiliki fitur download ZIP yang memungkinkan Anda mengunduh seluruh source code Phase 2 dan Phase 3 sebagai file ZIP.

### Tombol Download

Terdapat beberapa tempat untuk mengakses fitur download:

1. **Top Bar** - Tombol "Download ZIP" di pojok kanan atas setiap halaman
2. **Phase 3 Overview** - Tombol download besar di halaman utama Phase 3
3. **Source Code Page** - Tombol download untuk setiap file individual

### Isi File ZIP

File ZIP yang diunduh berisi struktur project lengkap:

```
web-security-lab-phase2-3.zip
├── app/
│   ├── __init__.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── main.py
│   │   ├── vulnerable.py
│   │   └── secure.py
│   ├── models/
│   │   ├── database.py
│   │   └── schema.sql
│   ├── security/
│   │   ├── vulnerable_auth.py
│   │   ├── secure_auth.py
│   │   ├── vulnerable_session.py
│   │   └── secure_session.py
│   ├── templates/
│   │   ├── base.html
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── dashboard.html
│   │   ├── labs.html
│   │   └── labs/
│   │       ├── sqli_vulnerable.html
│   │       ├── sqli_secure.html
│   │       ├── cookies_vulnerable.html
│   │       ├── cookies_secure.html
│   │       ├── session_vulnerable.html
│   │       └── session_secure.html
│   └── static/
│       ├── css/
│       │   └── style.css
│       └── js/
│           └── app.js
├── tests/
│   ├── test_auth.py
│   ├── test_sqli.py
│   ├── test_cookie.py
│   └── test_session.py
├── scripts/
│   ├── init_db.py
│   ├── seed_data.py
│   └── reset_lab.py
├── docs/
│   ├── SQL_INJECTION.md
│   ├── COOKIE_SECURITY.md
│   └── SESSION_SECURITY.md
├── requirements.txt
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── run.py
└── README.md
```

### Setelah Download

1. Extract file ZIP
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Initialize database:
   ```bash
   python scripts/init_db.py
   ```
4. Run the application:
   ```bash
   python run.py
   ```
5. Access at: http://127.0.0.1:5000

### Lab Credentials

- **Username:** student  
  **Password:** StudentLab123!

- **Username:** admin  
  **Password:** AdminLab123!

### Download Individual Files

Di halaman Source Code, Anda juga bisa download file individual:
- Klik tombol download (icon) di sebelah setiap file di list
- Atau buka file terlebih dahulu, lalu klik tombol "Download" di header

### Catatan Penting

⚠️ **Peringatan Keamanan**: Aplikasi ini mengandung kode yang sengaja vulnerable untuk tujuan edukasi. Jalankan hanya di environment terisolasi (localhost, Docker, VM). Jangan deploy ke production atau expose ke internet publik.

### Troubleshooting

Jika download gagal:
1. Pastikan browser Anda mendukung download file
2. Cek apakah ada popup blocker yang aktif
3. Coba refresh halaman dan download ulang
4. Gunakan browser modern (Chrome, Firefox, Edge)

### Teknologi yang Digunakan

- **JSZip** - Library untuk membuat file ZIP di browser
- **FileSaver.js** - Library untuk save file di browser
- Struktur folder mengikuti best practices Flask application
