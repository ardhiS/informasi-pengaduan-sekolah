# Panduan Akses Publik Internet

## Website Pengaduan SMP PLUS AT-THAHIRIN

### 🌐 Cara Membuat Aplikasi Dapat Diakses dari Internet

---

## 🚀 Metode 1: Tunneling Services (Paling Mudah untuk Testing)

### A. Menggunakan Ngrok (Gratis & Mudah)

#### 1. Install Ngrok

```bash
# Download dari https://ngrok.com/download
# Atau install via npm
npm install -g ngrok

# Daftar akun gratis di ngrok.com untuk mendapatkan authtoken
ngrok authtoken YOUR_AUTHTOKEN
```

#### 2. Expose Backend

```bash
# Jalankan backend di port 5000
cd "c:\Users\Lenovo\OneDrive\Desktop\informasi-pengaduan-sekolah-1"
npm start

# Di terminal baru, expose port 5000
ngrok http 5000
```

#### 3. Expose Frontend

```bash
# Jalankan frontend di port 3000
cd "c:\Users\Lenovo\OneDrive\Desktop\informasi-pengaduan-sekolah-1\frontend"
npm run dev

# Di terminal baru, expose port 3000
ngrok http 3000
```

#### 4. Konfigurasi Frontend untuk Menggunakan Backend Ngrok URL

```javascript
// frontend/src/services/api.js
const API_BASE_URL = 'https://your-backend-ngrok-url.ngrok.io';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Contoh URL yang dihasilkan:**

- Frontend: `https://abc123.ngrok.io`
- Backend: `https://def456.ngrok.io`

### B. Menggunakan Localtunnel (Alternatif Gratis)

#### 1. Install Localtunnel

```bash
npm install -g localtunnel
```

#### 2. Expose Services

```bash
# Expose backend
lt --port 5000 --subdomain school-api-backend

# Expose frontend
lt --port 3000 --subdomain school-frontend
```

### C. Menggunakan Serveo (SSH Tunneling)

```bash
# Expose backend
ssh -R 80:localhost:5000 serveo.net

# Expose frontend
ssh -R 80:localhost:3000 serveo.net
```

---

## 🏠 Metode 2: Port Forwarding Router (Untuk Akses Lokal/Regional)

### 1. Konfigurasi Router

#### A. Akses Router Admin Panel

```
1. Buka browser, akses IP gateway (biasanya 192.168.1.1 atau 192.168.0.1)
2. Login dengan username/password admin
3. Cari menu "Port Forwarding" atau "Virtual Server"
```

#### B. Setup Port Forwarding

```
Frontend:
- External Port: 80 atau 8080
- Internal Port: 3000
- Internal IP: IP komputer Anda (misal: 192.168.1.100)
- Protocol: TCP

Backend:
- External Port: 5000
- Internal Port: 5000
- Internal IP: IP komputer Anda
- Protocol: TCP
```

#### C. Cari IP Publik

```bash
# Cari IP publik Anda
curl ifconfig.me
# atau
curl ipecho.net/plain
```

### 2. Konfigurasi Aplikasi

```javascript
// frontend/src/services/api.js
const API_BASE_URL = 'http://YOUR_PUBLIC_IP:5000';
```

### 3. Akses Aplikasi

```
Frontend: http://YOUR_PUBLIC_IP:8080
Backend API: http://YOUR_PUBLIC_IP:5000
```

---

## ☁️ Metode 3: Cloud Hosting (Production Ready)

### A. Heroku (Mudah & Gratis Tier)

#### 1. Persiapan

```bash
# Install Heroku CLI
# Download dari: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login
```

#### 2. Deploy Backend

```bash
cd "c:\Users\Lenovo\OneDrive\Desktop\informasi-pengaduan-sekolah-1"

# Init git jika belum
git init
git add .
git commit -m "Initial commit"

# Create Heroku app
heroku create school-complaints-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set PGHOST=your-db-host
heroku config:set PGUSER=your-db-user
heroku config:set PGPASSWORD=your-db-password
heroku config:set PGDATABASE=your-db-name
heroku config:set ACCESS_TOKEN_KEY=your-secret-key
heroku config:set REFRESH_TOKEN_KEY=your-refresh-key

# Deploy
git push heroku main
```

#### 3. Deploy Frontend

```bash
cd frontend

# Build for production
npm run build

# Create separate Heroku app for frontend
heroku create school-complaints-frontend

# Update API URL in build
# Edit dist/assets/*.js files or rebuild with production API URL

# Deploy static files (gunakan buildpack static)
heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git

# Create static.json
echo '{"root": "dist/", "routes": {"/**": "index.html"}}' > static.json

git add .
git commit -m "Deploy frontend"
git push heroku main
```

### B. Railway (Mudah & Modern)

#### 1. Deploy via GitHub

```
1. Push code ke GitHub repository
2. Kunjungi railway.app
3. Connect GitHub account
4. Deploy from repository
5. Set environment variables di dashboard
```

### C. Vercel (Untuk Frontend) + Railway/Heroku (Backend)

#### 1. Deploy Frontend ke Vercel

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts untuk setup
```

#### 2. Update API URLs

```javascript
// frontend/src/services/api.js
const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://your-backend-app.railway.app'
    : 'http://localhost:5000';
```

---

## 🔧 Metode 4: VPS/Cloud Server (Profesional)

### A. Setup di VPS (DigitalOcean, Linode, AWS, dll)

#### 1. Persiapan Server

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

#### 2. Upload dan Setup Aplikasi

```bash
# Clone atau upload aplikasi
git clone your-repo.git /var/www/school-app
cd /var/www/school-app

# Install dependencies
npm ci --only=production

# Build frontend
cd frontend
npm ci --only=production
npm run build
cd ..

# Setup environment
sudo nano .env
# Isi dengan konfigurasi production

# Start dengan PM2
pm2 start src/server.js --name school-api
pm2 startup
pm2 save
```

#### 3. Konfigurasi Nginx

```bash
sudo nano /etc/nginx/sites-available/school-app
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend static files
    location / {
        root /var/www/school-app/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/school-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. Setup Domain & SSL

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

---

## 📱 Metode 5: Development/Testing Cepat

### A. Setup untuk Testing Cepat dengan Ngrok

#### 1. Script Otomatis

```bash
# Buat file start-public.bat di Windows
@echo off
echo Starting School Complaints System for Public Access...

:: Start Backend
start "Backend" cmd /k "cd /d c:\Users\Lenovo\OneDrive\Desktop\informasi-pengaduan-sekolah-1 && npm start"

:: Wait for backend to start
timeout /t 10

:: Start Frontend
start "Frontend" cmd /k "cd /d c:\Users\Lenovo\OneDrive\Desktop\informasi-pengaduan-sekolah-1\frontend && npm run dev"

:: Wait for frontend to start
timeout /t 10

:: Start Ngrok for backend
start "Ngrok Backend" cmd /k "ngrok http 5000"

:: Start Ngrok for frontend
start "Ngrok Frontend" cmd /k "ngrok http 3000"

echo All services started! Check ngrok windows for public URLs.
pause
```

### B. Environment Switching

```javascript
// frontend/src/config/api.js
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://your-production-api.com';
  }

  if (process.env.REACT_APP_USE_NGROK === 'true') {
    return process.env.REACT_APP_NGROK_API_URL || 'http://localhost:5000';
  }

  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiUrl();
```

```bash
# .env file untuk development dengan ngrok
REACT_APP_USE_NGROK=true
REACT_APP_NGROK_API_URL=https://your-ngrok-url.ngrok.io
```

---

## 🔒 Keamanan untuk Akses Publik

### 1. Environment Variables

```env
# Gunakan secret yang kuat untuk production
ACCESS_TOKEN_KEY=super_long_and_secure_secret_key_here_at_least_256_bits
REFRESH_TOKEN_KEY=another_super_long_and_secure_secret_for_refresh_tokens

# Database dengan akses terbatas
PGUSER=limited_user
PGPASSWORD=very_secure_password

# Rate limiting
ENABLE_RATE_LIMIT=true
MAX_REQUESTS_PER_MINUTE=60
```

### 2. CORS Configuration

```javascript
// src/server.js
const corsOptions = {
  origin: [
    'https://your-frontend-domain.com',
    'https://your-ngrok-url.ngrok.io',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200,
};

server.register({
  plugin: require('@hapi/cors'),
  options: corsOptions,
});
```

### 3. Security Headers

```javascript
// src/server.js
server.ext('onPreResponse', (request, h) => {
  const response = request.response;

  if (response.isBoom) {
    return h.continue;
  }

  response.header('X-Frame-Options', 'DENY');
  response.header('X-XSS-Protection', '1; mode=block');
  response.header('X-Content-Type-Options', 'nosniff');
  response.header('Referrer-Policy', 'strict-origin-when-cross-origin');

  return h.continue;
});
```

---

## 📋 Checklist untuk Go Live

### Pre-Production

- [ ] Database dengan user terbatas
- [ ] Environment variables secure
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Error handling complete
- [ ] Logging configured
- [ ] Security headers added

### Testing

- [ ] Test dari perangkat berbeda
- [ ] Test dari jaringan berbeda
- [ ] Test semua fitur utama
- [ ] Test performa dengan multiple users
- [ ] Test keamanan dasar

### Monitoring

- [ ] Health check endpoint
- [ ] Error monitoring
- [ ] Performance monitoring
- [ ] Backup strategy
- [ ] Update strategy

---

## 🎯 Rekomendasi Berdasarkan Kebutuhan

### Untuk Testing/Demo Cepat:

✅ **Ngrok** - Paling mudah dan cepat

### Untuk Development Tim:

✅ **Port Forwarding** - Akses lokal tanpa biaya

### Untuk Production Kecil:

✅ **Heroku/Railway** - Mudah deploy, maintenance minimal

### Untuk Production Serius:

✅ **VPS + Domain + SSL** - Kontrol penuh, performa terbaik

### Script Quick Start untuk Demo:

```bash
# 1. Start services
npm start &
cd frontend && npm run dev &

# 2. Expose with ngrok
ngrok http 5000 &
ngrok http 3000 &

# 3. Update frontend API URL dengan ngrok backend URL
# 4. Share ngrok frontend URL
```

Pilih metode yang sesuai dengan kebutuhan dan budget Anda!
