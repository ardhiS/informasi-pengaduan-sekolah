# Website Pengaduan SMP PLUS AT-THAHIRIN

## 📋 Deskripsi Project

Website Pengaduan SMP PLUS AT-THAHIRIN adalah sistem manajemen pengaduan sekolah yang memungkinkan siswa, guru, dan orang tua untuk menyampaikan keluhan atau saran terkait fasilitas, layanan akademik, dan hal-hal lainnya di sekolah.

## 🎨 Branding

- **Nama**: Website Pengaduan SMP PLUS AT-THAHIRIN
- **Nama Pendek**: SMP AT-THAHIRIN
- **Warna Utama**:
  - Primary: Hijau (#22c55e)
  - Secondary: Biru (#3b82f6)
  - Accent: Kuning (#eab308)

## 🏗️ Arsitektur Sistem

```
Frontend (React + Vite)     Backend (Hapi.js)        Database (PostgreSQL)
├── Components              ├── API Routes           ├── Tables
├── Pages                   ├── Services             │   ├── users
├── Services                ├── Handlers             │   ├── guru
└── Utils                   └── Validators           │   ├── siswa
                                                     │   └── complaints
                                                     └── Migrations
```

## 🚀 Quick Start

### Prerequisites

- Node.js v16+
- PostgreSQL 12+
- npm atau yarn

### Installation

1. **Clone repository**

```bash
git clone <repository-url>
cd informasi-pengaduan-sekolah-1
```

2. **Setup Backend**

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan konfigurasi database Anda

# Run migrations
npm run migrate up

# Start backend server
npm run start:dev
```

3. **Setup Frontend**

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

```env
# Database Configuration
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=school_management

# Server Configuration
HOST=localhost
PORT=5000

# JWT Configuration
ACCESS_TOKEN_KEY=your_access_token_secret
REFRESH_TOKEN_KEY=your_refresh_token_secret
ACCESS_TOKEN_AGE=1800
```

## 📁 Struktur Project

### Backend

```
src/
├── api/
│   ├── complaints/          # API Pengaduan
│   ├── guru/               # API Guru
│   ├── siswa/              # API Siswa
│   └── auth/               # API Authentication
├── services/
│   └── postgres/           # Database Services
├── validator/              # Request Validators
├── exceptions/             # Custom Exceptions
└── utils/                  # Utilities
```

### Frontend

```
src/
├── components/
│   ├── Layout/             # Layout Components
│   └── AtThahirinLogo.jsx  # Logo Component
├── pages/
│   ├── Complaints.jsx      # Halaman Pengaduan
│   └── Welcome.jsx         # Landing Page
├── services/               # API Services
└── utils/                  # Utilities
```

## 🔗 API Endpoints

### Authentication

- `POST /auth/login` - Login user
- `POST /auth/register` - Register user
- `DELETE /auth/logout` - Logout user

### Complaints (Pengaduan)

- `GET /complaints` - List semua pengaduan
- `GET /complaints/stats` - Statistik pengaduan
- `POST /complaints` - Buat pengaduan baru
- `GET /complaints/{id}` - Detail pengaduan
- `PUT /complaints/{id}` - Update pengaduan
- `DELETE /complaints/{id}` - Hapus pengaduan

### Guru & Siswa

- `GET /guru` - List guru
- `GET /siswa` - List siswa
- `POST /guru` - Tambah guru baru
- `POST /siswa` - Tambah siswa baru

## 👥 Tim Development

### Frontend Team

- Teknologi: React 18, Vite, TailwindCSS
- Dokumentasi: [Frontend Documentation](./docs/FRONTEND.md)

### Backend Team

- Teknologi: Hapi.js, PostgreSQL, JWT
- Dokumentasi: [Backend Documentation](./docs/BACKEND.md)

## 📚 Dokumentasi Lengkap

- [Frontend Documentation](./docs/FRONTEND.md)
- [Backend Documentation](./docs/BACKEND.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)

## 🐛 Bug Reports & Feature Requests

Silakan buat issue di repository ini untuk melaporkan bug atau request fitur baru.

## 📄 License

MIT License - lihat file [LICENSE](./LICENSE) untuk detail.
