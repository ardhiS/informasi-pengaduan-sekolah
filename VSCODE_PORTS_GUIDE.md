# 🚀 CARA MENGGUNAKAN PORT FORWARDING DI VS CODE

## Metode Termudah: VS Code Port Forwarding (Built-in)

### 📋 Langkah-langkah Detail:

#### 1. Pastikan VS Code Terbaru

```bash
# Pastikan VS Code versi terbaru (fitur port forwarding built-in)
# Download dari: https://code.visualstudio.com/
```

#### 2. Start Aplikasi di Terminal VS Code

**Terminal 1 - Backend:**

```bash
# Di VS Code, buka terminal (Ctrl + `)
# Jalankan backend
npm start
```

**Terminal 2 - Frontend:**

```bash
# Buka terminal baru di VS Code (Ctrl + Shift + `)
cd frontend
npm run dev
```

#### 3. Menggunakan Port Forwarding VS Code

**Cara 1: Via Command Palette**

1. Tekan `Ctrl + Shift + P`
2. Ketik: `Ports: Focus on Ports View`
3. Klik "Forward a Port"
4. Masukkan port `5000` untuk backend
5. Klik "Forward a Port" lagi
6. Masukkan port `3000` untuk frontend

**Cara 2: Via Ports Panel**

1. Di VS Code, lihat panel bawah
2. Klik tab "PORTS" (sebelah TERMINAL)
3. Klik tombol "Forward a Port" (ikon +)
4. Masukkan `5000`, tekan Enter
5. Ulangi untuk port `3000`

**Cara 3: Via Terminal (Otomatis)**

```bash
# VS Code akan otomatis detect ports yang sedang running
# Lihat notifikasi popup "Your application running on port 3000 is available"
# Klik "Open in Browser" atau "Make Public"
```

#### 4. Membuat Port Public

**Setelah port di-forward:**

1. Di panel PORTS, klik kanan pada port yang sudah di-forward
2. Pilih "Port Visibility" → "Public"
3. Copy URL yang diberikan

**Contoh URL yang dihasilkan:**

- Frontend: `https://3000-username-reponame-abc123.github.codespaces.io`
- Backend: `https://5000-username-reponame-abc123.github.codespaces.io`

#### 5. Update API Configuration

Edit file `frontend/src/services/api.js`:

```javascript
// Ganti dari:
const API_BASE_URL = 'http://localhost:5000';

// Menjadi (gunakan URL backend dari VS Code):
const API_BASE_URL =
  'https://5000-username-reponame-abc123.github.codespaces.io';
```

#### 6. Restart Frontend & Share!

```bash
# Di terminal frontend, restart:
# Tekan Ctrl + C, lalu:
npm run dev

# Share URL frontend ke siapa saja!
```

---

## 🔧 Metode Alternatif di VS Code

### A. Menggunakan Live Server Extension

#### 1. Install Extension

```
1. Buka Extensions (Ctrl + Shift + X)
2. Cari "Live Server"
3. Install extension by Ritwick Dey
```

#### 2. Setup untuk Frontend

```bash
# Build frontend untuk production
cd frontend
npm run build

# Buka folder dist di VS Code
# Klik kanan pada index.html
# Pilih "Open with Live Server"
```

### B. Menggunakan VS Code Tunnels

#### 1. Enable Tunnels

```bash
# Di terminal VS Code
code tunnel

# Follow setup instructions
# Login dengan GitHub/Microsoft account
```

#### 2. Access via Browser

```
# VS Code akan memberikan URL seperti:
# https://vscode.dev/tunnel/your-machine-name
```

---

## 📱 Step-by-Step dengan Screenshots

### 1. Start Both Services

```bash
# Terminal 1
npm start

# Terminal 2
cd frontend && npm run dev
```

### 2. Access Ports Panel

- Look for "PORTS" tab next to "TERMINAL" in bottom panel
- If not visible: `View` → `Open View` → `Ports`

### 3. Forward Ports

- Click "Forward a Port" button (+ icon)
- Enter `5000` for backend
- Enter `3000` for frontend

### 4. Make Public

- Right-click each forwarded port
- Select "Port Visibility" → "Public"
- Copy the generated URLs

### 5. Update Config & Share

```javascript
// frontend/src/services/api.js
const API_BASE_URL = 'YOUR_BACKEND_URL_FROM_VSCODE';
```

---

## 🚀 Quick Commands untuk VS Code

```bash
# Open ports panel
Ctrl + Shift + P → "Ports: Focus on Ports View"

# Forward port via command
Ctrl + Shift + P → "Ports: Forward a Port"

# Make port public
Ctrl + Shift + P → "Ports: Change Port Visibility"

# Open forwarded port in browser
Ctrl + Shift + P → "Ports: Open in Browser"
```

---

## 🔧 Troubleshooting VS Code Ports

### Port tidak muncul otomatis

```bash
# Pastikan aplikasi sudah running
# Refresh ports panel (reload button)
# Manual forward: klik "Forward a Port"
```

### "Port not available" error

```bash
# Pastikan port tidak digunakan aplikasi lain
# Coba port berbeda
# Restart VS Code
```

### URL tidak bisa diakses public

```bash
# Pastikan port visibility = "Public"
# Check firewall/antivirus
# Pastikan VS Code update terbaru
```

### Frontend tidak bisa connect ke backend

```bash
# Pastikan API_BASE_URL sudah diupdate
# Pastikan backend port juga di-forward dan public
# Check CORS settings di backend
```

---

## ⚡ Pro Tips VS Code

- **Auto-forward**: VS Code otomatis detect running ports
- **Port labels**: Beri nama port untuk mudah identify
- **Private vs Public**: Private hanya untuk Anda, Public bisa diakses siapa saja
- **HTTPS**: VS Code forwarded ports otomatis menggunakan HTTPS
- **Multiple ports**: Bisa forward banyak port sekaligus

### Labels untuk Ports

```
Port 3000: "Frontend - React App"
Port 5000: "Backend - API Server"
```

---

## 📋 Checklist Sharing dengan VS Code

- [ ] Backend running di port 5000
- [ ] Frontend running di port 3000
- [ ] Both ports forwarded di VS Code
- [ ] Both ports set to "Public"
- [ ] API_BASE_URL updated di frontend
- [ ] Frontend restarted setelah config change
- [ ] Test akses URL dari browser
- [ ] Share frontend URL ke orang lain

**URL untuk sharing:** `https://3000-username-reponame-abc123.github.codespaces.io`

**Selamat sharing dengan VS Code! 🎉**
