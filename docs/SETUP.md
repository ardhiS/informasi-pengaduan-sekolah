# 🚀 Setup Guide - School Complaints System v2.0

## 📋 Prerequisites

- **Node.js** v14 or higher
- **PostgreSQL** 12 or higher
- **Git** (for cloning repository)
- **npm** or **yarn** package manager

## ⚡ Quick Setup (5 minutes)

### 1. Clone Repository

```bash
git clone <repository-url>
cd school-complaints-system
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database configuration
```

### 3. Database Configuration

Edit `.env` file:

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

### 4. Install Dependencies

#### Backend Setup

```bash
cd backend
npm install
```

#### Frontend Setup

```bash
cd frontend
npm install
```

### 5. Database Migration

```bash
cd backend
npm run migrate:up
```

### 6. Start Development Servers

#### Option A: Start Both Servers (Recommended)

```bash
# From root directory
node start.js
```

#### Option B: Start Individually

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌐 Access Points

After successful setup:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/documentation

## 🧪 Test Installation

### Test Backend API

```bash
# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test Frontend

Open http://localhost:3000 in your browser

## 🛠️ Development Commands

### Backend Commands

```bash
cd backend

npm run dev              # Start development server
npm start               # Start production server
npm run migrate:up      # Run database migrations
npm run migrate:down    # Rollback migrations
npm run lint           # Run code linting
npm test               # Run tests
```

### Frontend Commands

```bash
cd frontend

npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm test               # Run tests
npm run lint           # Run code linting
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL service
sudo service postgresql status

# Check database exists
psql -h localhost -U your_username -l
```

### Port Already in Use

```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <process_id> /F

# Kill process (Linux/Mac)
kill -9 <process_id>
```

### Migration Errors

```bash
# Reset migrations
cd backend
npm run migrate:down
npm run migrate:up
```

### Node Modules Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📁 Project Structure

```
school-complaints-system/
├── 📂 backend/                    # Backend API Server
│   ├── src/
│   │   ├── api/                   # API Routes & Handlers
│   │   │   ├── auth/              # Authentication
│   │   │   ├── users/             # User Management
│   │   │   ├── complaints/        # Complaints
│   │   │   └── data/              # Subjects & Classes
│   │   ├── services/              # Business Logic
│   │   ├── utils/                 # Utilities
│   │   ├── exceptions/            # Custom Errors
│   │   ├── validator/             # Input Validation
│   │   └── server.js              # Main Server File
│   ├── migrations/                # Database Migrations
│   └── package.json
├── 📂 frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/            # Reusable Components
│   │   ├── pages/                 # Application Pages
│   │   ├── services/              # API Services
│   │   ├── hooks/                 # Custom Hooks
│   │   ├── utils/                 # Utilities
│   │   └── context/               # State Management
│   └── package.json
├── 📄 README.md                   # Main Documentation
├── 📄 SETUP.md                    # This Setup Guide
└── 🛠️ start.js                    # Development Starter
```

## ✅ Success Checklist

- [ ] Database connected successfully
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Can login through frontend
- [ ] API endpoints responding correctly
- [ ] No console errors in browser

## 🆘 Need Help?

1. **Check logs** - Look at console output for error messages
2. **Verify environment** - Ensure `.env` file is configured correctly
3. **Database status** - Confirm PostgreSQL is running
4. **Port conflicts** - Check if ports 3000/5000 are available
5. **Dependencies** - Try reinstalling node_modules

## 🎯 Next Steps

After successful setup:

1. **Create admin user** via API or migration
2. **Import sample data** for testing
3. **Configure authentication** settings
4. **Customize frontend** branding and styling
5. **Set up production** environment

---

**Setup completed successfully! 🎉**
