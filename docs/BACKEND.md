# Backend Documentation

## Website Pengaduan SMP PLUS AT-THAHIRIN

### 🛠️ Tech Stack

- **Framework**: Hapi.js v21
- **Database**: PostgreSQL 12+
- **Authentication**: JWT (@hapi/jwt)
- **Migration**: node-pg-migrate
- **Validation**: Joi
- **Testing**: Newman (Postman Collection)

### 🏗️ Architecture Overview

```
src/
├── api/                    # API Route Handlers
│   ├── complaints/         # Pengaduan endpoints
│   ├── guru/              # Guru management
│   ├── siswa/             # Siswa management
│   ├── auth/              # Authentication
│   └── users/             # User management
├── services/              # Business Logic Layer
│   └── postgres/          # Database Services
├── validator/             # Request Validation
├── exceptions/            # Custom Error Classes
├── utils/                 # Utility Functions
└── server.js              # Main Server Configuration
```

### 🔧 Database Configuration

#### Connection Setup

```javascript
// Database connection using Pool
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'password',
  database: process.env.PGDATABASE || 'school_management',
});
```

#### Environment Variables

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
ACCESS_TOKEN_KEY=your_access_token_secret_key
REFRESH_TOKEN_KEY=your_refresh_token_secret_key
ACCESS_TOKEN_AGE=1800
```

### 📊 Database Schema

#### Tables Overview

**1. complaints**

```sql
CREATE TABLE complaints (
  id serial PRIMARY KEY,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  category varchar(100) NOT NULL,
  status varchar(50) DEFAULT 'pending',
  priority varchar(20) DEFAULT 'medium',
  reporter_name varchar(255) NOT NULL,
  reporter_email varchar(255),
  reporter_phone varchar(20),
  reporter_type varchar(50) NOT NULL,
  reporter_class varchar(100),
  assigned_to integer,
  admin_notes text,
  resolution text,
  attachments json,
  reported_at timestamp DEFAULT current_timestamp,
  resolved_at timestamp,
  created_at timestamp DEFAULT current_timestamp,
  updated_at timestamp DEFAULT current_timestamp
);
```

**Indexes:**

- `complaints_status_index` ON status
- `complaints_category_index` ON category
- `complaints_priority_index` ON priority
- `complaints_reporter_type_index` ON reporter_type
- `complaints_reported_at_index` ON reported_at

#### Enums & Constants

```javascript
// Status values
const COMPLAINT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

// Priority values
const COMPLAINT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Category values
const COMPLAINT_CATEGORY = {
  AKADEMIK: 'akademik',
  FASILITAS: 'fasilitas',
  LAYANAN: 'layanan',
  LAINNYA: 'lainnya',
};
```

### 🔌 API Endpoints Documentation

#### Complaints API

**Base URL**: `/complaints`

##### 1. Get All Complaints

```http
GET /complaints
```

**Query Parameters:**

- `status` (string): Filter by status (pending, in_progress, resolved, closed)
- `category` (string): Filter by category (akademik, fasilitas, layanan, lainnya)
- `priority` (string): Filter by priority (low, medium, high)
- `limit` (number): Limit results (default: 50)
- `offset` (number): Offset for pagination (default: 0)

**Response:**

```json
{
  "status": "success",
  "data": {
    "complaints": [
      {
        "id": 1,
        "title": "Masalah AC di Kelas",
        "description": "AC di kelas 7A tidak berfungsi",
        "category": "fasilitas",
        "status": "pending",
        "priority": "medium",
        "reporter_name": "Ahmad Budi",
        "reporter_email": "ahmad@email.com",
        "reporter_type": "siswa",
        "reported_at": "2025-06-30T10:00:00Z"
      }
    ]
  }
}
```

##### 2. Get Complaint Statistics

```http
GET /complaints/stats
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "stats": {
      "total": "15",
      "pending": "5",
      "in_progress": "7",
      "resolved": "3",
      "closed": "0",
      "high": "2",
      "akademik": "8",
      "fasilitas": "5",
      "from_siswa": "10"
    }
  }
}
```

##### 3. Create New Complaint

```http
POST /complaints
```

**Request Body:**

```json
{
  "title": "Judul pengaduan",
  "description": "Deskripsi detail pengaduan",
  "category": "fasilitas",
  "priority": "medium",
  "reporter_name": "Nama Pelapor",
  "reporter_email": "email@example.com",
  "reporter_phone": "081234567890",
  "reporter_type": "siswa",
  "reporter_class": "7A"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Pengaduan berhasil ditambahkan",
  "data": {
    "complaintId": 123
  }
}
```

##### 4. Get Complaint by ID

```http
GET /complaints/{id}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "complaint": {
      "id": 1,
      "title": "Masalah AC"
      // ... full complaint data
    }
  }
}
```

##### 5. Update Complaint

```http
PUT /complaints/{id}
```

**Request Body:**

```json
{
  "status": "in_progress",
  "admin_notes": "Sedang dalam proses perbaikan",
  "assigned_to": 5
}
```

##### 6. Delete Complaint

```http
DELETE /complaints/{id}
```

### 🔐 Authentication & Authorization

#### JWT Strategy Configuration

```javascript
server.auth.strategy('school_jwt', 'jwt', {
  keys: process.env.ACCESS_TOKEN_KEY,
  verify: {
    aud: false,
    iss: false,
    sub: false,
    maxAgeSec: 1800, // 30 minutes
  },
  validate: async (artifacts, request, h) => {
    const { decoded } = artifacts;

    try {
      const user = await authService.getUserById(decoded.payload.userId);
      return {
        isValid: true,
        credentials: {
          userId: user.id,
          username: user.username,
          role: user.role,
        },
      };
    } catch (error) {
      return { isValid: false };
    }
  },
});
```

#### Protected Routes

```javascript
// Example: Protected route
{
  method: 'PUT',
  path: '/complaints/{id}',
  handler: handler.putComplaintHandler,
  options: {
    auth: 'school_jwt', // Requires authentication
    cors: { origin: ['*'] },
  },
}

// Example: Public route
{
  method: 'POST',
  path: '/complaints',
  handler: handler.postComplaintHandler,
  options: {
    cors: { origin: ['*'] }, // No auth required
  },
}
```

### 🔧 Services Layer

#### ComplaintsService Class

```javascript
class ComplaintsService {
  constructor() {
    this._pool = new Pool(/* db config */);
  }

  // Add new complaint
  async addComplaint(complaintData) {
    const query = {
      text: `INSERT INTO complaints (...) VALUES (...) RETURNING id`,
      values: [
        /* complaint data */
      ],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  // Get complaints with filters
  async getComplaints(filters = {}) {
    let query = `SELECT * FROM complaints WHERE 1=1`;
    const values = [];

    // Apply filters dynamically
    if (filters.status) {
      query += ` AND status = $${values.length + 1}`;
      values.push(filters.status);
    }

    const result = await this._pool.query(query, values);
    return result.rows;
  }

  // Get complaint by ID
  async getComplaintById(id) {
    const query = {
      text: 'SELECT * FROM complaints WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Pengaduan tidak ditemukan');
    }

    return result.rows[0];
  }

  // Update complaint
  async editComplaint(id, data) {
    const setClause = Object.keys(data)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const query = {
      text: `UPDATE complaints SET ${setClause}, updated_at = NOW() WHERE id = $1`,
      values: [id, ...Object.values(data)],
    };

    await this._pool.query(query);
  }

  // Delete complaint
  async deleteComplaint(id) {
    const query = {
      text: 'DELETE FROM complaints WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  // Get statistics
  async getComplaintStats() {
    const queries = [
      'SELECT COUNT(*) as total FROM complaints',
      'SELECT COUNT(*) as pending FROM complaints WHERE status = $1',
      'SELECT COUNT(*) as resolved FROM complaints WHERE status = $1',
      // ... more stat queries
    ];

    // Execute all queries in parallel
    const results = await Promise.all(
      queries.map((query) =>
        this._pool.query(query, [
          /* params */
        ])
      )
    );

    return {
      total: results[0].rows[0].total,
      pending: results[1].rows[0].pending,
      resolved: results[2].rows[0].resolved,
      // ... more stats
    };
  }
}
```

### 🔍 Validation Layer

#### Schema Definition

```javascript
// src/validator/complaints/schema.js
const Joi = require('joi');

const ComplaintPayloadSchema = Joi.object({
  title: Joi.string().required().min(3).max(200),
  description: Joi.string().required().min(10).max(2000),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  category: Joi.string()
    .valid('akademik', 'fasilitas', 'layanan', 'lainnya')
    .default('lainnya'),
  reporter_name: Joi.string().required().min(2).max(255),
  reporter_email: Joi.string().email().optional(),
  reporter_phone: Joi.string()
    .pattern(/^[0-9+\-\s]+$/)
    .optional(),
  reporter_type: Joi.string()
    .valid('siswa', 'guru', 'orangtua', 'staff')
    .required(),
  reporter_class: Joi.string().max(100).optional(),
});

const ComplaintStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'in_progress', 'resolved', 'closed')
    .required(),
  admin_notes: Joi.string().allow('').max(2000),
  assigned_to: Joi.number().integer().positive().optional(),
  resolution: Joi.string().allow('').max(2000),
});
```

#### Validator Usage

```javascript
// src/validator/complaints/index.js
const ComplaintsValidator = {
  validateComplaintPayload: (payload) => {
    const validationResult = ComplaintPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateComplaintStatus: (payload) => {
    const validationResult = ComplaintStatusSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
```

### 🚨 Error Handling

#### Custom Exception Classes

```javascript
// ClientError.js
class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

// NotFoundError.js
class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

// InvariantError.js
class InvariantError extends ClientError {
  constructor(message) {
    super(message, 400);
    this.name = 'InvariantError';
  }
}
```

#### Global Error Handler

```javascript
// In server.js
server.ext('onPreResponse', (request, h) => {
  const { response } = request;

  // Handle authentication errors
  if (response.isBoom && response.output.statusCode === 401) {
    const newResponse = h.response({
      status: 'fail',
      message: 'Token tidak valid atau sudah expired',
    });
    newResponse.code(401);
    return newResponse;
  }

  // Handle validation errors
  if (response instanceof InvariantError || (response && response.isJoi)) {
    const newResponse = h.response({
      status: 'fail',
      message: response.message || 'Data tidak valid',
    });
    newResponse.code(400);
    return newResponse;
  }

  // Handle not found errors
  if (response instanceof NotFoundError) {
    const newResponse = h.response({
      status: 'fail',
      message: response.message,
    });
    newResponse.code(404);
    return newResponse;
  }

  // Handle server errors
  if (response.isBoom && response.output.statusCode === 500) {
    console.error('Server Error:', response);
    const newResponse = h.response({
      status: 'error',
      message: 'Maaf, terjadi kegagalan pada server kami.',
    });
    newResponse.code(500);
    return newResponse;
  }

  return h.continue;
});
```

### 📝 Database Migrations

#### Migration File Structure

```javascript
// migrations/TIMESTAMP_complaints.js
const up = (pgm) => {
  // Create table
  pgm.createTable('complaints', {
    id: { type: 'serial', primaryKey: true },
    title: { type: 'varchar(255)', notNull: true },
    // ... other fields
  });

  // Create indexes
  pgm.createIndex('complaints', ['status']);
  pgm.createIndex('complaints', ['category']);
};

const down = (pgm) => {
  pgm.dropTable('complaints');
};

module.exports = { up, down };
```

#### Running Migrations

```bash
# Run all pending migrations
npm run migrate up

# Rollback last migration
npm run migrate down

# Create new migration
npx node-pg-migrate create add_new_field
```

### 🧪 Testing

#### API Testing with Newman

```bash
# Run test collection
npm run test

# Generate HTML report
npm run test:report
```

#### Unit Testing Pattern

```javascript
// Example: Service testing
const ComplaintsService = require('../src/services/postgres/complaints/ComplaintsService');

describe('ComplaintsService', () => {
  let service;

  beforeEach(() => {
    service = new ComplaintsService();
  });

  test('should create complaint successfully', async () => {
    const complaintData = {
      title: 'Test Complaint',
      description: 'Test Description',
      category: 'fasilitas',
      reporter_name: 'Test User',
      reporter_type: 'siswa',
    };

    const id = await service.addComplaint(complaintData);
    expect(id).toBeDefined();
    expect(typeof id).toBe('number');
  });

  test('should throw error for invalid data', async () => {
    const invalidData = { title: '' }; // Missing required fields

    await expect(service.addComplaint(invalidData)).rejects.toThrow(
      InvariantError
    );
  });
});
```

### 🚀 Deployment

#### Production Configuration

```javascript
// Production environment
const server = Hapi.server({
  port: process.env.PORT || 5000,
  host: process.env.HOST || '0.0.0.0',
  routes: {
    cors: {
      origin: ['https://yourfrontend.com', 'https://www.yourfrontend.com'],
    },
  },
});
```

#### Environment Setup

```bash
# Production build
NODE_ENV=production node src/server.js

# Using PM2 for process management
pm2 start src/server.js --name "school-complaints-api"
pm2 startup
pm2 save
```

### 🔧 Development Guidelines

#### Code Style

```javascript
// Use async/await instead of callbacks
const getData = async () => {
  try {
    const result = await service.fetchData();
    return result;
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};

// Proper error handling
const handleRequest = async (request, h) => {
  try {
    const { id } = request.params;
    const data = await service.getById(id);

    return {
      status: 'success',
      data: { complaint: data },
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error; // Let global handler manage it
    }
    throw new Error('Internal server error');
  }
};
```

#### Performance Tips

```javascript
// Use connection pooling
const pool = new Pool({
  max: 20, // Maximum number of clients
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Use prepared statements for repeated queries
const getComplaintQuery = {
  name: 'get-complaint',
  text: 'SELECT * FROM complaints WHERE id = $1',
};

// Use transactions for multiple related operations
const updateComplaintWithHistory = async (id, updates) => {
  const client = await this._pool.connect();

  try {
    await client.query('BEGIN');

    // Update complaint
    await client.query('UPDATE complaints SET ... WHERE id = $1', [id]);

    // Add history record
    await client.query('INSERT INTO complaint_history ...', [...]);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
```

### 📊 Monitoring & Logging

#### Structured Logging

```javascript
const logger = {
  info: (message, meta = {}) => {
    console.log(
      JSON.stringify({
        level: 'info',
        message,
        timestamp: new Date().toISOString(),
        ...meta,
      })
    );
  },

  error: (message, error, meta = {}) => {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        ...meta,
      })
    );
  },
};

// Usage in handlers
logger.info('Complaint created', {
  complaintId: id,
  userId: request.auth.credentials.userId,
});
```

### 🔒 Security Best Practices

#### Input Validation

- Always validate input using Joi schemas
- Sanitize user input to prevent SQL injection
- Use parameterized queries

#### Authentication

- Use strong JWT secrets
- Implement token expiration
- Add refresh token mechanism

#### CORS Configuration

```javascript
// Specific origins in production
routes: {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? ['https://yourdomain.com']
      : ['*'],
    credentials: true
  }
}
```
