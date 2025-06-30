# Development Setup Guide

## Website Pengaduan SMP PLUS AT-THAHIRIN

### 🚀 Quick Start for Developers

#### Prerequisites

- Node.js v16+
- PostgreSQL 12+
- Git
- Code Editor (VS Code recommended)

#### 1. Clone & Setup

```bash
git clone <repository-url>
cd informasi-pengaduan-sekolah-1

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

#### 2. Database Setup

```bash
# Create database
createdb school_management

# Copy environment file
cp .env.example .env

# Edit .env with your database configuration
# PGHOST=localhost
# PGPORT=5432
# PGUSER=postgres
# PGPASSWORD=your_password
# PGDATABASE=school_management

# Run migrations
npm run migrate up
```

#### 3. Start Development

```bash
# Terminal 1: Backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

#### 4. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

### 📁 Project Structure

```
informasi-pengaduan-sekolah-1/
├── src/                           # Backend source
│   ├── api/                       # API endpoints
│   │   ├── complaints/            # Complaints API
│   │   ├── guru/                  # Guru API
│   │   ├── siswa/                 # Siswa API
│   │   └── auth/                  # Authentication API
│   ├── services/postgres/         # Database services
│   ├── validator/                 # Request validators
│   ├── exceptions/                # Custom errors
│   └── server.js                  # Main server
├── frontend/                      # Frontend source
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API services
│   │   └── utils/                 # Utilities
│   ├── public/                    # Static assets
│   └── package.json
├── migrations/                    # Database migrations
├── docs/                          # Documentation
├── testing/                       # Test files
└── package.json                   # Backend dependencies
```

---

### 🔧 Development Tools

#### Backend Development

```bash
# Start with auto-reload
npm run start:dev

# Run linting
npm run lint

# Run tests
npm run test

# Migration commands
npm run migrate up
npm run migrate down
npm run migrate create <migration_name>
```

#### Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking (if using TypeScript)
npm run type-check
```

---

### 🐛 Debugging

#### Backend Debugging

```javascript
// Add debug logging
console.log('Debug:', { data, request: request.payload });

// Use debugger
debugger;

// Environment-specific logging
if (process.env.NODE_ENV === 'development') {
  console.log('Dev only log');
}
```

#### Frontend Debugging

```javascript
// React DevTools
// Install browser extension

// Console debugging
console.log('Component state:', state);

// React strict mode (already enabled)
<React.StrictMode>
  <App />
</React.StrictMode>;
```

---

### 🧪 Testing

#### Backend Tests

```bash
# Run API tests with Newman
npm run test

# Generate test report
npm run test:report
```

#### Frontend Tests (Setup needed)

```bash
cd frontend

# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test
```

---

### 🔐 Environment Variables

#### Backend (.env)

```env
# Database
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=school_management

# Server
HOST=localhost
PORT=5000

# JWT
ACCESS_TOKEN_KEY=your_very_long_secret_key_minimum_256_bits
REFRESH_TOKEN_KEY=your_refresh_token_secret_key
ACCESS_TOKEN_AGE=1800

# Environment
NODE_ENV=development
```

#### Frontend (.env.local)

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME="Website Pengaduan SMP AT-THAHIRIN"
VITE_ENVIRONMENT=development
```

---

### 📝 Code Standards

#### Backend Standards

```javascript
// Use async/await
const getData = async () => {
  try {
    const result = await service.getData();
    return result;
  } catch (error) {
    throw new Error(`Failed: ${error.message}`);
  }
};

// Proper error handling
const handler = async (request, h) => {
  try {
    // Handler logic
    return { status: 'success', data };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new Error('Internal server error');
  }
};

// Use proper HTTP status codes
return h.response(data).code(201); // Created
return h.response(error).code(400); // Bad Request
```

#### Frontend Standards

```javascript
// Component naming: PascalCase
const ComplaintForm = () => {};

// File naming: PascalCase for components
ComplaintForm.jsx;
Header.jsx;

// Hooks naming: camelCase starting with 'use'
const useComplaints = () => {};

// Props destructuring
const Component = ({ title, onSubmit, isLoading }) => {};

// Use proper state management
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

---

### 🎨 Styling Guidelines

#### TailwindCSS Usage

```javascript
// Consistent spacing classes
const spacing = {
  xs: 'p-2 m-2',
  sm: 'p-4 m-4',
  md: 'p-6 m-6',
  lg: 'p-8 m-8'
};

// Color system usage
const colors = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600',
  secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  success: 'bg-green-500 text-white hover:bg-green-600'
};

// Responsive design
<div className="
  p-4 md:p-6 lg:p-8
  text-sm md:text-base lg:text-lg
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
```

---

### 🔄 Git Workflow

#### Branch Naming

```bash
# Feature branches
feature/add-complaint-form
feature/update-user-dashboard

# Bug fixes
bugfix/fix-login-validation
bugfix/resolve-api-timeout

# Hotfixes
hotfix/security-patch
hotfix/critical-bug-fix
```

#### Commit Messages

```bash
# Format: type(scope): description

# Examples
feat(complaints): add complaint creation form
fix(auth): resolve JWT token validation issue
docs(api): update endpoints documentation
style(ui): improve responsive design
refactor(services): optimize database queries
test(api): add complaint service tests
```

#### Pull Request Process

1. Create feature branch from `main`
2. Make changes with proper commits
3. Test all functionality
4. Update documentation if needed
5. Create pull request with clear description
6. Request code review
7. Merge after approval

---

### 🚀 Deployment

#### Production Build

```bash
# Backend
NODE_ENV=production npm start

# Frontend
cd frontend
npm run build
```

#### Environment Setup

```bash
# Production environment variables
NODE_ENV=production
PGHOST=production-db-host
PORT=80
ACCESS_TOKEN_KEY=super_secure_production_key
```

#### Docker Setup (Optional)

```dockerfile
# Backend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

### 📊 Performance Tips

#### Backend Performance

```javascript
// Use connection pooling
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Use pagination
const getComplaints = async (limit = 20, offset = 0) => {
  const query = `
    SELECT * FROM complaints 
    ORDER BY created_at DESC 
    LIMIT $1 OFFSET $2
  `;
  return await pool.query(query, [limit, offset]);
};

// Cache frequently accessed data
const cache = new Map();
const getCachedData = async (key) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const data = await fetchData(key);
  cache.set(key, data);
  return data;
};
```

#### Frontend Performance

```javascript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* rendering */}</div>;
});

// Use useMemo for expensive calculations
const computedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

// Use useCallback for stable references
const handleClick = useCallback(() => {
  doSomething(prop);
}, [prop]);

// Lazy load components
const LazyComponent = lazy(() => import('./LazyComponent'));
```

---

### 🔍 Troubleshooting

#### Common Issues

**1. Database Connection Error**

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -h localhost -U postgres -d school_management
```

**2. Migration Errors**

```bash
# Check migration status
npm run migrate list

# Reset migrations (development only)
npm run migrate down --count=10
npm run migrate up
```

**3. Frontend Build Errors**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check
```

**4. CORS Issues**

```javascript
// Update CORS settings in server.js
routes: {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true
  }
}
```

---

### 📚 Learning Resources

#### Backend (Hapi.js)

- [Hapi.js Documentation](https://hapi.dev/api/)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)
- [JWT Authentication Guide](https://jwt.io/introduction)

#### Frontend (React)

- [React Documentation](https://reactjs.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

#### Tools

- [VS Code Extensions](https://marketplace.visualstudio.com/)
- [Postman API Testing](https://www.postman.com/)
- [Git Documentation](https://git-scm.com/doc)
