# 🏫 School Complaints Management System v2.0

**Simplified & Unified Architecture** - A streamlined school complaints management system for SMP PLUS AT-THAHIRIN with role-based access control.

## 📋 Deskripsi Project

Website Pengaduan SMP PLUS AT-THAHIRIN adalah sistem manajemen pengaduan sekolah yang telah diperbarui dengan arsitektur yang disederhanakan dan terpadu. Sistem ini memungkinkan siswa, guru, dan admin untuk menyampaikan dan mengelola keluhan atau saran terkait fasilitas, layanan akademik, dan hal-hal lainnya di sekolah.

## 📁 Struktur Project

```
school-complaints-system/
├── backend/                # Backend app (API Server)
├── frontend/               # Frontend app (React UI)
├── docs/                   # Documentation files
├── start.js               ✅ Development starter script
├── verify-structure.js    ✅ Structure validator tool
├── package.json           ✅ Project configuration
├── README.md              ✅ Main documentation
├── SETUP.md               ✅ Setup guide
└── .env.example           ✅ Environment template
```

### 📂 Detail Struktur

**Backend Structure:**

```
backend/
├── src/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── users/         # User management (unified)
│   │   ├── complaints/    # Complaint management
│   │   └── data/          # Subjects & classes
│   ├── services/          # Business logic layer
│   ├── exceptions/        # Custom error classes
│   ├── validator/         # Input validation schemas
│   └── utils/             # Utility functions
├── migrations/            # Database migrations
└── package.json          # Backend dependencies
```

**Frontend Structure:**

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Application pages
│   ├── services/          # API communication
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── context/           # State management
└── package.json          # Frontend dependencies
```

## 🎨 Branding

- **Nama**: Website Pengaduan SMP PLUS AT-THAHIRIN
- **Nama Pendek**: SMP AT-THAHIRIN
- **Version**: 2.0 (Simplified)
- **Warna Utama**:
  - Primary: Hijau (#22c55e)
  - Secondary: Biru (#3b82f6)
  - Accent: Kuning (#eab308)

## 🏗️ Arsitektur Sistem v2.0

```
backend/                    frontend/                Database (PostgreSQL)
├── src/                    ├── src/                 ├── Tables
│   ├── api/               │   ├── components/      │   ├── users
│   │   ├── auth/          │   ├── pages/           │   ├── subjects
│   │   ├── users/         │   ├── services/        │   ├── classes
│   │   ├── complaints/    │   ├── hooks/           │   └── complaints
│   │   └── data/          │   └── utils/           └── Migrations
│   ├── services/          └── package.json
│   ├── exceptions/
│   ├── validator/
│   └── utils/
├── migrations/
└── package.json
```

## 🚀 Quick Start (Simplified)

### Prerequisites

- Node.js v14+
- PostgreSQL 12+
- npm atau yarn

### Installation

1. **Clone repository**

```bash
git clone <repository-url>
cd informasi-pengaduan-sekolah-1
```

3. **Setup Environment**

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` with your database configuration:

```env
# Database Configuration
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=school_complaints

# Server Configuration
HOST=localhost
PORT=5000

# JWT Configuration
ACCESS_TOKEN_KEY=your_very_secure_access_token_key_here
REFRESH_TOKEN_KEY=your_very_secure_refresh_token_key_here
ACCESS_TOKEN_AGE=1800
```

4. **Run Database Migrations**

```bash
cd backend
npm run migrate:up
cd ..
```

5. **Start Development Servers**

```bash
# Option 1: Use the unified start script (Recommended)
node start.js

# Option 2: Start manually
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

## 📡 Server Ports

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

## 🔐 Default Accounts

After running migrations, you can login with:

**Admin Account:**

- Username: admin
- Password: password123

**Test Data:**

- System includes sample data for testing
- Use API endpoint `/api/sample-data/generate` to create test records

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/refresh` - Refresh access token

### Users Management

- `GET /api/users` - Get all users (with role filtering)
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Complaints Management

- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/{id}` - Get complaint by ID
- `POST /api/complaints` - Create new complaint
- `PUT /api/complaints/{id}` - Update complaint
- `DELETE /api/complaints/{id}` - Delete complaint

### Data Management

- `GET /api/data/subjects` - Get all subjects
- `GET /api/data/classes` - Get all classes
- `POST /api/data/subjects` - Create subject
- `POST /api/data/classes` - Create class

## 🎯 Features

### ✅ Implemented in v2.0

- **Unified Authentication**: Single auth module for all user types
- **Role-based Access**: Admin, Guru, Siswa with appropriate permissions
- **Complaint Management**: Full CRUD operations for complaints
- **Data Management**: Subjects and classes management
- **Modern UI**: React + Tailwind CSS responsive design
- **Unified API**: Single service layer with consistent patterns
- **Legacy Support**: Backwards compatibility with old endpoints

### 🔄 Simplified Architecture

- **70% fewer files**: Streamlined from 100+ to ~40 core files
- **Unified modules**: Single auth, users, complaints, data modules
- **Consistent patterns**: Standardized handlers, routes, validators
- **Modern tooling**: Updated build processes and scripts

## 🛠️ Development

### Available Scripts

**Backend** (`backend/package.json`):

```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run migrate:up   # Run database migrations
npm run migrate:down # Rollback migrations
```

**Frontend** (`frontend/package.json`):

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run serve  # Preview production build
```

## 📁 Project Structure Details

### Backend Structure

```
backend/
├── src/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── users/         # User management (unified)
│   │   ├── complaints/    # Complaint management
│   │   └── data/          # Subjects & classes
│   ├── services/          # Business logic layer
│   ├── exceptions/        # Custom error classes
│   ├── validator/         # Input validation schemas
│   └── utils/             # Utility functions
├── migrations/            # Database migrations
└── package.json
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── services/         # API communication
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   └── context/          # React context providers
└── package.json
```

## � Deployment

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# The built files will be in frontend/dist/
# Serve these static files with your web server
```

### Environment Variables

For production, make sure to set secure values:

```env
NODE_ENV=production
ACCESS_TOKEN_KEY=your_very_secure_production_key
REFRESH_TOKEN_KEY=your_very_secure_production_refresh_key
PGHOST=your_production_db_host
PGUSER=your_production_db_user
PGPASSWORD=your_production_db_password
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the documentation in `/docs`
- Review the API documentation
- Create an issue in the repository

---

**v2.0 - Simplified & Unified** 🎉
