# 🛠️ Implementation Guide: Project Simplification

## 🚀 STEP-BY-STEP IMPLEMENTATION

### Phase 1: Backend Consolidation (START HERE)

#### 1.1 Merge Authentication Modules

**Current Problem:** Duplicate auth logic in `/auth` and `/authentications`

**Solution:** Create unified auth module

```javascript
// NEW: src/api/auth/handler.js
const authHandler = {
  // Login (from authentications)
  loginHandler: async (request, h) => {
    const { username, password } = request.payload;
    // Login logic here
  },

  // Register (from auth)
  registerHandler: async (request, h) => {
    const userData = request.payload;
    // Registration logic here
  },

  // Logout (from authentications)
  logoutHandler: async (request, h) => {
    const { refreshToken } = request.payload;
    // Logout logic here
  },

  // Refresh Token (from authentications)
  refreshHandler: async (request, h) => {
    const { refreshToken } = request.payload;
    // Refresh logic here
  },
};

module.exports = authHandler;
```

**Routes Consolidation:**

```javascript
// NEW: src/api/auth/routes.js
const routes = [
  {
    method: 'POST',
    path: '/api/auth/register',
    handler: handler.registerHandler,
    options: { auth: false },
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    handler: handler.loginHandler,
    options: { auth: false },
  },
  {
    method: 'DELETE',
    path: '/api/auth/logout',
    handler: handler.logoutHandler,
  },
  {
    method: 'PUT',
    path: '/api/auth/refresh',
    handler: handler.refreshHandler,
  },
];

module.exports = routes;
```

#### 1.2 Consolidate User Management

**Current Problem:** Separate APIs for users, guru, siswa

**Solution:** Role-based user management

```javascript
// NEW: src/api/users/handler.js
const usersHandler = {
  // Get users with role filtering
  getUsersHandler: async (request, h) => {
    const { role, page = 1, limit = 10 } = request.query;
    const users = await usersService.getUsers({ role, page, limit });
    return { status: 'success', data: { users } };
  },

  // Create user (any role)
  addUserHandler: async (request, h) => {
    const userData = request.payload;
    const userId = await usersService.addUser(userData);
    return { status: 'success', data: { userId } };
  },

  // Update user
  putUserHandler: async (request, h) => {
    const { id } = request.params;
    const userData = request.payload;
    await usersService.editUser(id, userData);
    return { status: 'success', message: 'User updated successfully' };
  },

  // Delete user
  deleteUserHandler: async (request, h) => {
    const { id } = request.params;
    await usersService.deleteUser(id);
    return { status: 'success', message: 'User deleted successfully' };
  },

  // Get user statistics
  getUserStatsHandler: async (request, h) => {
    const stats = await usersService.getUserStats();
    return { status: 'success', data: stats };
  },
};

module.exports = usersHandler;
```

#### 1.3 Simplified Service Layer

**Current Problem:** 10+ service files with overlapping functionality

**Solution:** 4 core services

```javascript
// SIMPLIFIED: src/services/UsersService.js
class UsersService {
  constructor(pool) {
    this._pool = pool;
  }

  // Unified user management for all roles
  async getUsers({ role = null, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM users';
    const params = [];

    if (role) {
      query += ' WHERE role = $1';
      params.push(role);
    }

    query +=
      ' ORDER BY created_at DESC LIMIT $' +
      (params.length + 1) +
      ' OFFSET $' +
      (params.length + 2);
    params.push(limit, offset);

    const result = await this._pool.query(query, params);
    return result.rows;
  }

  async addUser(userData) {
    const { username, password, fullName, role, email } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (id, username, password, full_name, role, email, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id
    `;

    const id = nanoid();
    const values = [
      id,
      username,
      hashedPassword,
      fullName,
      role,
      email,
      new Date(),
    ];
    const result = await this._pool.query(query, values);

    return result.rows[0].id;
  }

  async editUser(id, userData) {
    const { fullName, email, role } = userData;

    const query = `
      UPDATE users 
      SET full_name = $1, email = $2, role = $3, updated_at = $4 
      WHERE id = $5
    `;

    const values = [fullName, email, role, new Date(), id];
    await this._pool.query(query, values);
  }

  async deleteUser(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await this._pool.query(query, [id]);
  }

  async getUserStats() {
    const query = `
      SELECT 
        role,
        COUNT(*) as count
      FROM users 
      GROUP BY role
    `;

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = UsersService;
```

### Phase 2: Frontend Simplification

#### 2.1 Unified API Service

**Current Problem:** Multiple service files (api.js, dataService.js, etc.)

**Solution:** Single API service

```javascript
// NEW: src/services/apiService.js
import axios from 'axios';

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://your-production-api.com'
    : 'http://localhost:3000';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // Add auth token to all requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.refreshToken();
          return this.api.request(error.config);
        }
        throw error;
      }
    );
  }

  // Auth methods
  async login(credentials) {
    const response = await this.api.post('/api/auth/login', credentials);
    return response.data;
  }

  async register(userData) {
    const response = await this.api.post('/api/auth/register', userData);
    return response.data;
  }

  async logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await this.api.delete('/api/auth/logout', {
      data: { refreshToken },
    });
    return response.data;
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await this.api.put('/api/auth/refresh', { refreshToken });
    localStorage.setItem('accessToken', response.data.data.accessToken);
    return response.data;
  }

  // Users methods
  async getUsers(params = {}) {
    const response = await this.api.get('/api/users', { params });
    return response.data;
  }

  async createUser(userData) {
    const response = await this.api.post('/api/users', userData);
    return response.data;
  }

  async updateUser(id, userData) {
    const response = await this.api.put(`/api/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id) {
    const response = await this.api.delete(`/api/users/${id}`);
    return response.data;
  }

  // Complaints methods
  async getComplaints(params = {}) {
    const response = await this.api.get('/api/complaints', { params });
    return response.data;
  }

  async createComplaint(complaintData) {
    const response = await this.api.post('/api/complaints', complaintData);
    return response.data;
  }

  async updateComplaint(id, complaintData) {
    const response = await this.api.put(`/api/complaints/${id}`, complaintData);
    return response.data;
  }

  async deleteComplaint(id) {
    const response = await this.api.delete(`/api/complaints/${id}`);
    return response.data;
  }
}

export default new ApiService();
```

#### 2.2 Simplified Component Structure

**Current Problem:** Over-componentized structure

**Solution:** 5 core reusable components

```javascript
// NEW: src/components/index.js - Unified component exports
export { default as Layout } from './Layout';
export { default as DataTable } from './DataTable';
export { default as Modal } from './Modal';
export { default as Form } from './Form';
export { default as Card } from './Card';
```

```javascript
// NEW: src/components/DataTable.jsx - Reusable table component
import React from 'react';

const DataTable = ({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  loading = false,
  pagination = null,
}) => {
  if (loading) {
    return <div className='p-4 text-center'>Loading...</div>;
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full bg-white shadow-md rounded-lg'>
        <thead className='bg-gray-50'>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                {column.title}
              </th>
            ))}
            <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {data.map((item, index) => (
            <tr key={item.id || index}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
                >
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key]}
                </td>
              ))}
              <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className='text-indigo-600 hover:text-indigo-900 mr-3'
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item)}
                    className='text-red-600 hover:text-red-900'
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
        <div className='px-6 py-3 flex items-center justify-between border-t border-gray-200'>
          <div className='flex-1 flex justify-between sm:hidden'>
            <button
              onClick={pagination.onPrevious}
              disabled={pagination.currentPage === 1}
              className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
            >
              Previous
            </button>
            <button
              onClick={pagination.onNext}
              disabled={pagination.currentPage === pagination.totalPages}
              className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
```

### Phase 3: File Cleanup

#### 3.1 Clean Package.json Scripts

```json
{
  "name": "school-complaints-system",
  "version": "2.0.0",
  "description": "Simplified School Complaints Management System",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "migrate:up": "node-pg-migrate up",
    "migrate:down": "node-pg-migrate down",
    "test": "jest",
    "lint": "eslint src/"
  }
}
```

#### 3.2 Single Development Script

```javascript
// NEW: start.js - One script to rule them all
const { exec, spawn } = require('child_process');
const path = require('path');

const startDevelopment = () => {
  console.log('🚀 Starting School Complaints System...\n');

  // Start backend
  console.log('📡 Starting backend server...');
  const backend = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true,
  });

  // Wait 3 seconds then start frontend
  setTimeout(() => {
    console.log('🌐 Starting frontend server...');
    const frontend = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'frontend'),
      stdio: 'inherit',
      shell: true,
    });

    console.log('\n✅ Development servers started!');
    console.log('📡 Backend: http://localhost:3000');
    console.log('🌐 Frontend: http://localhost:5173');

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down servers...');
      backend.kill();
      frontend.kill();
      process.exit(0);
    });
  }, 3000);
};

// Check if user wants to run migrations first
const args = process.argv.slice(2);
if (args.includes('--with-migrate')) {
  console.log('📁 Running database migrations...');
  exec('npm run migrate:up', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Migration failed:', error);
      return;
    }
    console.log('✅ Migrations completed!');
    startDevelopment();
  });
} else {
  startDevelopment();
}
```

## 📋 IMPLEMENTATION CHECKLIST

### ✅ Phase 1: Backend (High Priority)

- [ ] Create unified auth module (`src/api/auth/`)
- [ ] Merge user management systems
- [ ] Simplify service layer (4 core services)
- [ ] Update server.js plugin registration
- [ ] Test all endpoints work correctly

### ✅ Phase 2: Frontend (Medium Priority)

- [ ] Create unified API service (`src/services/apiService.js`)
- [ ] Consolidate components (5 core components)
- [ ] Update all pages to use new API service
- [ ] Test frontend functionality
- [ ] Update routing if needed

### ✅ Phase 3: Cleanup (Low Priority)

- [ ] Delete redundant files (30+ files can be removed)
- [ ] Simplify package.json scripts
- [ ] Create single development script
- [ ] Update documentation
- [ ] Clean up root directory

## 🚀 EXPECTED RESULTS

**Before Simplification:**

- 100+ files
- 35+ dependencies
- 30-minute setup time
- Complex architecture

**After Simplification:**

- 30-40 files (70% reduction)
- 15-20 dependencies (50% reduction)
- 5-minute setup time (85% faster)
- Clear, maintainable architecture

---

**Next Step:** Start with Phase 1.1 - Merge Authentication Modules

_Implementation guide created: 2 Juli 2025_
