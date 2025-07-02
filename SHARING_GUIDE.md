# 🌐 CARA MUDAH SHARING LINK UNTUK AKSES INTERNET

## Metode Termudah: VS Code Port Forwarding (RECOMMENDED!)

### 🚀 VS Code Built-in Port Forwarding

#### 1. Start Aplikasi di VS Code Terminal

```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
cd frontend && npm run dev
```

#### 2. Forward Ports di VS Code

1. **Buka panel PORTS** (sebelah tab TERMINAL di bawah)
2. **Klik "Forward a Port"** (tombol +)
3. **Masukkan port 5000** (untuk backend)
4. **Masukkan port 3000** (untuk frontend)
5. **Klik kanan setiap port** → "Port Visibility" → "**Public**"

#### 3. Copy URLs & Update Config

1. **Copy backend URL** dari panel PORTS (contoh: `https://5000-user-repo-abc.github.codespaces.io`)
2. **Edit file**: `frontend/src/services/api.js`
3. **Update API_BASE_URL**:

```javascript
const API_BASE_URL = 'https://5000-user-repo-abc.github.codespaces.io';
```

4. **Restart frontend** (Ctrl+C → `npm run dev`)

#### 4. Share Frontend Link!

**Copy frontend URL** dari panel PORTS dan share ke siapa saja!
Contoh: `https://3000-user-repo-abc.github.codespaces.io`

---

## Metode Alternatif: Ngrok (Jika VS Code tidak tersedia)

### 📋 Langkah-langkah:

#### 1. Install Ngrok

```bash
# Cara 1: Download dan install dari website
# Kunjungi: https://ngrok.com/download
# Download, extract, dan tambahkan ke PATH

# Cara 2: Install via npm (lebih mudah)
npm install -g ngrok
```

#### 2. Daftar Akun Gratis Ngrok

```
1. Kunjungi: https://ngrok.com/signup
2. Daftar dengan email
3. Copy authtoken dari dashboard
4. Jalankan: ngrok authtoken YOUR_AUTHTOKEN_HERE
```

#### 3. Start Aplikasi + Sharing (OTOMATIS)

**Windows:**

```bash
# Double-click file ini di Windows Explorer:
start-public-access.bat
```

**Linux/Mac:**

```bash
# Jalankan script ini:
./start-public-access.sh
```

#### 4. Setup Manual (jika script tidak jalan)

**Terminal 1 - Backend:**

```bash
cd "c:\Users\Lenovo\OneDrive\Desktop\informasi-pengaduan-sekolah-1"
npm start
```

**Terminal 2 - Frontend:**

```bash
cd "c:\Users\Lenovo\OneDrive\Desktop\informasi-pengaduan-sekolah-1\frontend"
npm run dev
```

**Terminal 3 - Expose Backend:**

```bash
ngrok http 5000
```

**Terminal 4 - Expose Frontend:**

```bash
ngrok http 3000
```

#### 5. Update API Configuration

1. Dari terminal ngrok backend, copy URL (contoh: `https://abc123.ngrok.io`)
2. Edit file: `frontend/src/services/api.js`
3. Ganti baris ini:

```javascript
// Ganti dari:
const API_BASE_URL = 'http://localhost:5000';

// Menjadi:
const API_BASE_URL = 'https://abc123.ngrok.io'; // URL ngrok backend Anda
```

4. Save file dan restart frontend (Ctrl+C lalu `npm run dev` lagi)

#### 6. Share Link!

1. Copy URL ngrok frontend (contoh: `https://def456.ngrok.io`)
2. Share URL ini ke siapa saja
3. Mereka bisa akses dari browser manapun di internet!

---

## 🚀 Alternatif Lain (Tanpa Install)

### Localtunnel (Tidak perlu daftar)

```bash
# Install
npm install -g localtunnel

# Expose frontend
lt --port 3000 --subdomain school-demo

# Expose backend
lt --port 5000 --subdomain school-api

# URL akan jadi: https://school-demo.loca.lt dan https://school-api.loca.lt
```

### Serveo (SSH Tunneling)

```bash
# Frontend
ssh -R 80:localhost:3000 serveo.net

# Backend
ssh -R 80:localhost:5000 serveo.net
```

---

## 🔧 Troubleshooting

### Error: "command not found: ngrok"

```bash
# Install ulang dengan npm
npm install -g ngrok

# Atau download manual dari https://ngrok.com/download
# Extract ke folder, tambahkan ke sistem PATH
```

### Error: "authentication failed"

```bash
# Daftar gratis di ngrok.com
# Copy authtoken dari dashboard
ngrok authtoken YOUR_AUTHTOKEN_HERE
```

### Frontend tidak bisa akses backend

```bash
# Pastikan API_BASE_URL sudah diupdate dengan URL ngrok backend
# Restart frontend setelah edit file api.js
```

### Koneksi lambat/putus

```bash
# Ngrok gratis ada limitasi
# Upgrade ke paid plan untuk performa lebih baik
# Atau gunakan alternatif lain seperti localtunnel
```

---

## 📱 Demo Quick Start

**Untuk demo cepat (5 menit):**

1. **Download & install ngrok** → https://ngrok.com/download
2. **Daftar gratis** → https://ngrok.com/signup
3. **Set authtoken** → `ngrok authtoken YOUR_TOKEN`
4. **Double-click** → `start-public-access.bat` (Windows)
5. **Update API URL** → Edit `frontend/src/services/api.js`
6. **Share link** → Copy ngrok frontend URL dan share!

**URL yang bisa dishare:** `https://random123.ngrok.io`

---

## ⚡ Pro Tips

- **Keep terminals open** - Jangan tutup terminal ngrok
- **URLs berubah** - Setiap restart ngrok, URL baru
- **Free limitations** - Ngrok gratis: 1 process, limited connections
- **Paid version** - $5/month untuk multiple tunnels & custom domains
- **Mobile testing** - Perfect untuk test di HP dari internet

**Selamat sharing! 🎉**
