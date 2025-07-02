# 📚 API Documentation - Sistem Informasi Sekolah

## 🏗️ Architecture Overview

Sistem Informasi Sekolah adalah backend API yang dibangun menggunakan **Hapi.js** dengan implementasi sesuai kriteria **OpenMusic API**. Sistem ini menggunakan **PostgreSQL** sebagai database dan **JWT** untuk autentikasi.

### Tech Stack

- **Framework**: Hapi.js v21
- **Database**: PostgreSQL
- **Authentication**: JWT (Access & Refresh Token)
- **Validation**: Joi
- **Migration**: node-pg-migrate

### Base URL

```
http://localhost:5000
```

## 🔐 Authentication

Sistem menggunakan **JWT Bearer Token** untuk autentikasi. Setiap request ke endpoint yang dilindungi harus menyertakan token di header:

```http
Authorization: Bearer <access_token>
```

### Token Management

- **Access Token**: Berlaku selama 30 menit
- **Refresh Token**: Disimpan di database, digunakan untuk memperbarui access token

---

## 📋 API Endpoints

### 🔑 Authentication Endpoints

#### 1. Register User

Mendaftarkan user baru ke sistem.

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "username": "string (required)",
  "password": "string (required)",
  "fullname": "string (required)",
  "role": "string (required)" // admin, guru, siswa, user
}
```

**Response Success (201):**

```json
{
  "status": "success",
  "message": "User berhasil didaftarkan",
  "data": {
    "userId": "user-Qbax5Oy7L8WKf74l"
  }
}
```

**Response Error (400):**

```json
{
  "status": "fail",
  "message": "Username sudah digunakan"
}
```

---

#### 2. Login User

Login user dan mendapatkan access & refresh token.

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Example Requests:**

```json
// Login sebagai Siswa
{
  "username": "siswa01",
  "password": "siswa123"
}

// Login sebagai Guru
{
  "username": "guru01",
  "password": "guru123"
}

// Login sebagai Admin
{
  "username": "admin01",
  "password": "admin123"
}
```

**Response Success (200):**

```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Error (401):**

```json
{
  "status": "fail",
  "message": "Kredensial yang Anda berikan salah"
}
```

**⚠️ Important Notes:**

- Use **exact** test credentials above
- Role in JWT token must match backend expectations
- For students, use `siswa01` (role: `siswa`) NOT `student01` (role: `student`)

---

#### 3. Get User Profile

Mendapatkan profil user yang sedang login.

**Endpoint:** `GET /auth/profile`  
**Authentication:** Required

**Response Success (200):**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user-Qbax5Oy7L8WKf74l",
      "username": "johndoe",
      "fullname": "John Doe",
      "role": "teacher"
    }
  }
}
```

---

#### 4. Logout User

Logout user (client-side token removal).

**Endpoint:** `POST /auth/logout`  
**Authentication:** Required

**Request Body:**

```json
{
  "refreshToken": "string (optional)"
}
```

**Response Success (200):**

```json
{
  "status": "success",
  "message": "Logout berhasil"
}
```

---

### 🔄 Token Management Endpoints

#### 1. Login (Get Tokens)

Mendapatkan access & refresh token.

**Endpoint:** `POST /authentications`

**Request Body:**

```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response Success (201):**

```json
{
  "status": "success",
  "message": "Authentication berhasil ditambahkan",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### 2. Refresh Access Token

Memperbarui access token menggunakan refresh token.

**Endpoint:** `PUT /authentications`

**Request Body:**

```json
{
  "refreshToken": "string (required)"
}
```

**Response Success (200):**

```json
{
  "status": "success",
  "message": "Access Token berhasil diperbarui",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Error (400):**

```json
{
  "status": "fail",
  "message": "Refresh token tidak valid"
}
```

---

#### 3. Logout (Delete Refresh Token)

Menghapus refresh token dari database.

**Endpoint:** `DELETE /authentications`

**Request Body:**

```json
{
  "refreshToken": "string (required)"
}
```

**Response Success (200):**

```json
{
  "status": "success",
  "message": "Refresh token berhasil dihapus"
}
```

---

### � Complaints (Pengaduan) Endpoints

#### 1. Get All Complaints

Mendapatkan daftar complaints berdasarkan role user.

**Endpoint:** `GET /complaints`  
**Authentication:** Required

**Query Parameters:**

```
status: string (optional) - pending, in_progress, resolved, closed
category: string (optional) - akademik, fasilitas, bullying, lainnya
priority: string (optional) - low, medium, high, urgent
limit: number (optional) - default 50
offset: number (optional) - default 0
```

**Role-based Access:**

- **Admin:** Can view all complaints
- **Guru:** Can view all complaints
- **Siswa:** Can only view own complaints

**Response Success (200):**

```json
{
  "status": "success",
  "data": {
    "complaints": [
      {
        "id": "complaint-xxxxx",
        "title": "Masalah AC Kelas",
        "description": "AC di kelas tidak berfungsi",
        "status": "pending",
        "priority": "medium",
        "category": "fasilitas",
        "reporter_id": "user-xxxxx",
        "reporter_type": "siswa",
        "created_at": "2025-07-01T10:30:00.000Z",
        "updated_at": "2025-07-01T10:30:00.000Z"
      }
    ],
    "user_info": {
      "role": "siswa",
      "can_create": true,
      "can_view_all": false,
      "can_update": false,
      "can_delete": false
    }
  }
}
```

#### 2. Get Complaint Statistics

Mendapatkan statistik complaints berdasarkan role user.

**Endpoint:** `GET /complaints/stats`  
**Authentication:** Required

**Role-based Statistics:**

- **Admin/Guru:** Get global statistics
- **Siswa:** Get statistics for own complaints only

**Response Success (200):**

```json
{
  "status": "success",
  "data": {
    "stats": {
      "total": "5",
      "pending": "2",
      "in_progress": "1",
      "resolved": "2",
      "closed": "0",
      "urgent": "0",
      "high": "1",
      "medium": "3",
      "low": "1",
      "akademik": "2",
      "fasilitas": "2",
      "bullying": "0",
      "lainnya": "1",
      "from_siswa": "3",
      "from_guru": "1",
      "from_orangtua": "1",
      "from_admin": "0",
      "user_permissions": {
        "role": "siswa",
        "can_create": true,
        "can_view_all": false,
        "can_update": false,
        "can_delete": false,
        "can_assign": false
      }
    }
  }
}
```

**⚠️ Common 403 Error:**
If you get 403 Forbidden error, check:

1. You're using correct role (`siswa`, not `student`)
2. JWT token is valid and not expired
3. You're logged in with correct test credentials

---

### �📚 Subjects (Mata Pelajaran) Endpoints

#### 1. Create Subject

Membuat mata pelajaran baru.

**Endpoint:** `POST /subjects`  
**Authentication:** Required

**Request Body:**

```json
{
  "name": "string (required)",
  "code": "string (required)", // unique
  "description": "string (optional)"
}
```

**Response Success (201):**

```json
{
  "status": "success",
  "message": "Mata pelajaran berhasil ditambahkan",
  "data": {
    "subjectId": "subject-Qbax5Oy7L8WKf74l"
  }
}
```

**Response Error (400):**

```json
{
  "status": "fail",
  "message": "Kode mata pelajaran sudah digunakan"
}
```

---

#### 2. Get All Subjects

Mendapatkan semua mata pelajaran.

**Endpoint:** `GET /subjects`  
**Authentication:** Required

**Response Success (200):**

```json
{
  "status": "success",
  "data": {
    "subjects": [
      {
        "id": "subject-Qbax5Oy7L8WKf74l",
        "name": "Matematika",
        "code": "MTK001",
        "description": "Mata pelajaran matematika dasar",
        "created_at": "2025-01-01T00:00:00.000Z",
        "updated_at": "2025-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

#### 3. Get Subject by ID

Mendapatkan detail mata pelajaran berdasarkan ID.

**Endpoint:** `GET /subjects/{id}`  
**Authentication:** Required

**Response Success (200):**

```json
{
  "status": "success",
  "data": {
    "subject": {
      "id": "subject-Qbax5Oy7L8WKf74l",
      "name": "Matematika",
      "code": "MTK001",
      "description": "Mata pelajaran matematika dasar",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

**Response Error (404):**

```json
{
  "status": "fail",
  "message": "Mata pelajaran tidak ditemukan"
}
```

---

#### 4. Update Subject

Memperbarui mata pelajaran.

**Endpoint:** `PUT /subjects/{id}`  
**Authentication:** Required

**Request Body:**

```json
{
  "name": "string (required)",
  "code": "string (required)",
  "description": "string (optional)"
}
```

**Response Success (200):**

```json
{
  "status": "success",
  "message": "Mata pelajaran berhasil diperbarui"
}
```

**Response Error (404):**

```json
{
  "status": "fail",
  "message": "Gagal memperbarui mata pelajaran. Id tidak ditemukan"
}
```

---

#### 5. Delete Subject

Menghapus mata pelajaran.

**Endpoint:** `DELETE /subjects/{id}`  
**Authentication:** Required

**Response Success (200):**

```json
{
  "status": "success",
  "message": "Mata pelajaran berhasil dihapus"
}
```

**Response Error (404):**

```json
{
  "status": "fail",
  "message": "Mata pelajaran gagal dihapus. Id tidak ditemukan"
}
```

---

### 🏫 Classes (Kelas) Endpoints

#### 1. Create Class

Membuat kelas baru.

**Endpoint:** `POST /classes`  
**Authentication:** Required

**Request Body:**

```json
{
  "name": "string (required)",
  "subjectId": "string (required)",
  "description": "string (optional)"
}
```

**Response Success (201):**

```json
{
  "status": "success",
  "message": "Kelas berhasil ditambahkan",
  "data": {
    "classId": "class-Qbax5Oy7L8WKf74l"
  }
}
```

---

#### 2. Get User Classes

Mendapatkan semua kelas yang dimiliki/diakses user.

**Endpoint:** `GET /classes`  
**Authentication:** Required

**Response Success (200):**

```json
{
  "status": "success",
  "data": {
    "classes": [
      {
        "id": "class-Qbax5Oy7L8WKf74l",
        "name": "Kelas 10 IPA 1",
        "subject_id": "subject-Qbax5Oy7L8WKf74l",
        "subject_name": "Matematika",
        "teacher_id": "user-Qbax5Oy7L8WKf74l",
        "teacher_name": "John Doe",
        "description": "Kelas matematika untuk siswa kelas 10",
        "created_at": "2025-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

#### 3. Get Class by ID

Mendapatkan detail kelas berdasarkan ID.

**Endpoint:** `GET /classes/{id}`  
**Authentication:** Required

**Response Success (200):**

```json
{
  "status": "success",
  "data": {
    "class": {
      "id": "class-Qbax5Oy7L8WKf74l",
      "name": "Kelas 10 IPA 1",
      "subject_id": "subject-Qbax5Oy7L8WKf74l",
      "subject_name": "Matematika",
      "teacher_id": "user-Qbax5Oy7L8WKf74l",
      "teacher_name": "John Doe",
      "description": "Kelas matematika untuk siswa kelas 10",
      "students": [
        {
          "id": "user-student1",
          "username": "student1",
          "fullname": "Student One"
        }
      ],
      "collaborators": [
        {
          "id": "user-teacher2",
          "username": "teacher2",
          "fullname": "Teacher Two"
        }
      ],
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

**Response Error (404):**

```json
{
  "status": "fail",
  "message": "Kelas tidak ditemukan"
}
```

**Response Error (403):**

```json
{
  "status": "fail",
  "message": "Anda tidak berhak mengakses resource ini"
}
```

---

#### 4. Update Class

Memperbarui kelas (hanya owner/collaborator).

**Endpoint:** `PUT /classes/{id}`  
**Authentication:** Required

**Request Body:**

```json
{
  "name": "string (required)",
  "description": "string (optional)"
}
```

**Response Success (200):**

```json
{
  "status": "success",
  "message": "Kelas berhasil diperbarui"
}
```

---

#### 5. Delete Class

Menghapus kelas (hanya owner).

**Endpoint:** `DELETE /classes/{id}`  
**Authentication:** Required

**Response Success (200):**

```json
{
  "status": "success",
  "message": "Kelas berhasil dihapus"
}
```

---

#### 6. Add Student to Class

Menambahkan siswa ke kelas.

**Endpoint:** `POST /classes/{id}/students`  
**Authentication:** Required

**Request Body:**

```json
{
  "studentId": "string (required)"
}
```

**Response Success (201):**

```json
{
  "status": "success",
  "message": "Siswa berhasil ditambahkan ke kelas",
  "data": {
    "message": "Student added to class successfully"
  }
}
```

---

#### 7. Remove Student from Class

Menghapus siswa dari kelas.

**Endpoint:** `DELETE /classes/{id}/students`  
**Authentication:** Required

**Request Body:**

```json
{
  "studentId": "string (required)"
}
```

**Response Success (200):**

```json
{
  "status": "success",
  "message": "Siswa berhasil dihapus dari kelas"
}
```

---

#### 8. Get Class Activities

Mendapatkan log aktivitas kelas.

**Endpoint:** `GET /classes/{id}/activities`  
**Authentication:** Required

**Response Success (200):**

```json
{
  "status": "success",
  "data": {
    "activities": [
      {
        "id": "activity-Qbax5Oy7L8WKf74l",
        "class_id": "class-Qbax5Oy7L8WKf74l",
        "user_id": "user-Qbax5Oy7L8WKf74l",
        "user_name": "John Doe",
        "action": "add",
        "target_type": "student",
        "target_name": "Student One",
        "created_at": "2025-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### 🤝 Collaborations Endpoints

#### 1. Add Collaborator

Menambahkan kolaborator ke kelas.

**Endpoint:** `POST /collaborations`  
**Authentication:** Required

**Request Body:**

```json
{
  "classId": "string (required)",
  "userId": "string (required)"
}
```

**Response Success (201):**

```json
{
  "status": "success",
  "message": "Kolaborasi berhasil ditambahkan",
  "data": {
    "collaborationId": "collaboration-Qbax5Oy7L8WKf74l"
  }
}
```

**Response Error (400):**

```json
{
  "status": "fail",
  "message": "User sudah menjadi kolaborator pada kelas ini"
}
```

---

#### 2. Remove Collaborator

Menghapus kolaborator dari kelas.

**Endpoint:** `DELETE /collaborations`  
**Authentication:** Required

**Request Body:**

```json
{
  "classId": "string (required)",
  "userId": "string (required)"
}
```

**Response Success (200):**

```json
{
  "status": "success",
  "message": "Kolaborasi berhasil dihapus"
}
```

---

### 👨‍🏫 Legacy Guru Endpoints

#### 1. Create Guru

**Endpoint:** `POST /guru`  
**Authentication:** Required

#### 2. Get All Guru

**Endpoint:** `GET /guru`  
**Authentication:** Required

#### 3. Get Guru by ID

**Endpoint:** `GET /guru/{id}`  
**Authentication:** Required

#### 4. Update Guru

**Endpoint:** `PUT /guru/{id}`  
**Authentication:** Required

#### 5. Delete Guru

**Endpoint:** `DELETE /guru/{id}`  
**Authentication:** Required

---

### 👨‍🎓 Legacy Siswa Endpoints

#### 1. Create Siswa

**Endpoint:** `POST /siswa`  
**Authentication:** Required

#### 2. Get All Siswa

**Endpoint:** `GET /siswa`  
**Authentication:** Required

#### 3. Get Siswa by ID

**Endpoint:** `GET /siswa/{id}`  
**Authentication:** Required

#### 4. Update Siswa

**Endpoint:** `PUT /siswa/{id}`  
**Authentication:** Required

#### 5. Delete Siswa

**Endpoint:** `DELETE /siswa/{id}`  
**Authentication:** Required

---

## 🛡️ Error Handling

### HTTP Status Codes

- **200 OK**: Request berhasil
- **201 Created**: Resource berhasil dibuat
- **400 Bad Request**: Request tidak valid
- **401 Unauthorized**: Authentication diperlukan
- **403 Forbidden**: Access ditolak
- **404 Not Found**: Resource tidak ditemukan
- **500 Internal Server Error**: Server error

### Error Response Format

```json
{
  "status": "error|fail",
  "message": "Error description"
}
```

### Common Error Messages

- `"Kredensial yang Anda berikan salah"` - Login failed
- `"Access token tidak valid"` - Invalid JWT token
- `"Anda tidak berhak mengakses resource ini"` - Forbidden access
- `"Resource tidak ditemukan"` - Resource not found

---

## 🔐 Authorization Rules

### Role-based Access

- **Admin**: Full access ke semua resource
- **Teacher**: Dapat membuat/manage kelas dan mata pelajaran
- **Student**: Read-only access ke kelas yang diikuti

### Resource Ownership

- **Subjects**: Dapat diakses oleh semua authenticated users
- **Classes**: Hanya owner dan collaborator yang dapat modify
- **Students in Class**: Hanya owner/collaborator kelas yang dapat add/remove
- **Collaborations**: Hanya owner kelas yang dapat add/remove collaborator

---

## 🚨 CRITICAL: User Role Authentication Issues

### ⚠️ Role Confusion Issue

**PROBLEM DISCOVERED:** Ada confusion antara role `student` dan `siswa` yang menyebabkan 403 errors.

#### Valid Roles di Backend:

- ✅ `admin` - Administrator sistem
- ✅ `guru` - Teacher/Instructor
- ✅ `siswa` - Student (Indonesian)
- ❌ `student` - **NOT SUPPORTED** (English version)

#### Test Users yang Valid:

```json
// Guru Test User
{
  "username": "guru01",
  "password": "guru123",
  "role": "guru"
}

// Siswa Test User
{
  "username": "siswa01",
  "password": "siswa123",
  "role": "siswa"  // MUST be "siswa", NOT "student"
}

// Admin Test User
{
  "username": "admin01",
  "password": "admin123",
  "role": "admin"
}
```

#### 🔧 Troubleshooting 403 Errors:

**Symptoms:**

```
Failed to load resource: the server responded with a status of 403 (Forbidden)
:5000/complaints/stats:1
:5000/complaints?limit=100:1
```

**Root Cause:**

- User logged in with wrong role (`student` instead of `siswa`)
- Backend doesn't recognize `student` role
- JWT token contains invalid role

**Solution:**

1. **Clear browser storage:**

   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Login with correct credentials:**

   - For students: `siswa01` / `siswa123` (role: `siswa`)
   - For teachers: `guru01` / `guru123` (role: `guru`)

3. **Verify JWT token:**
   ```javascript
   // In browser console:
   const token = localStorage.getItem('accessToken');
   const payload = JSON.parse(atob(token.split('.')[1]));
   console.log('Role:', payload.role); // Should be 'siswa', NOT 'student'
   ```

#### JWT Token Structure:

```json
{
  "userId": "user-xxxxx",
  "username": "siswa01",
  "fullname": "Test Siswa User",
  "role": "siswa", // CRITICAL: Must be 'siswa'
  "iat": 1751369106,
  "exp": 1751370906
}
```

---

## 🗄️ Database Schema

### Users Table

```sql
users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Refresh Tokens Table

```sql
refresh_tokens (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Subjects Table

```sql
subjects (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Classes Table

```sql
classes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject_id VARCHAR(50) REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Class Collaborators Table

```sql
class_collaborators (
  id VARCHAR(50) PRIMARY KEY,
  class_id VARCHAR(50) REFERENCES classes(id) ON DELETE CASCADE,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, user_id)
)
```

### Class Activities Table

```sql
class_activities (
  id VARCHAR(50) PRIMARY KEY,
  class_id VARCHAR(50) REFERENCES classes(id) ON DELETE CASCADE,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

---

## 📝 Example Usage

### Authentication Flow

```javascript
// 1. Register
POST /auth/register
{
  "username": "teacher1",
  "password": "password123",
  "fullname": "Teacher One",
  "role": "teacher"
}

// 2. Login
POST /authentications
{
  "username": "teacher1",
  "password": "password123"
}
// Response: { accessToken, refreshToken }

// 3. Use protected endpoint
GET /subjects
Authorization: Bearer <accessToken>

// 4. Refresh token
PUT /authentications
{
  "refreshToken": "<refreshToken>"
}
// Response: { accessToken }

// 5. Logout
DELETE /authentications
{
  "refreshToken": "<refreshToken>"
}
```

### Class Management Flow

```javascript
// 1. Create subject
POST /subjects
{
  "name": "Matematika",
  "code": "MTK001",
  "description": "Mata pelajaran matematika"
}

// 2. Create class
POST /classes
{
  "name": "Kelas 10 IPA 1",
  "subjectId": "subject-123",
  "description": "Kelas matematika untuk siswa kelas 10"
}

// 3. Add collaborator
POST /collaborations
{
  "classId": "class-123",
  "userId": "user-teacher2"
}

// 4. Add student to class
POST /classes/class-123/students
{
  "studentId": "user-student1"
}

// 5. View class activities
GET /classes/class-123/activities
```

---

## 🧪 Testing

### Postman Collection

File: `school-api-complete.postman_collection.json`

### Environment Variables

File: `school-api-test.postman_environment.json`

- `base_url`: http://localhost:5000
- `access_token`: Auto-populated
- `refresh_token`: Auto-populated

### Newman Testing

```bash
npx newman run school-api-complete.postman_collection.json -e school-api-test.postman_environment.json
```

---

## 🚀 Deployment

### Environment Variables

```env
HOST=localhost
PORT=5000
PGUSER=your_db_user
PGHOST=localhost
PGPASSWORD=your_db_password
PGDATABASE=your_db_name
PGPORT=5432
ACCESS_TOKEN_KEY=your_access_token_secret
REFRESH_TOKEN_KEY=your_refresh_token_secret
```

### Database Migration

```bash
npm run migrate up
```

### Start Server

```bash
npm start
```

---

## 📞 Support

Untuk pertanyaan dan dukungan teknis, silakan merujuk ke:

- **Repository**: `informasi-pengaduan-sekolah-1`
- **Documentation**: `README-OPENMUSIC-IMPLEMENTATION.md`
- **Test Results**: `NEWMAN-TEST-RESULTS.md`

---

**Status: ✅ Production Ready**  
**Last Updated**: December 30, 2025  
**API Version**: 1.0.0

---

## 🎯 Quick Troubleshooting Guide

### 403 Forbidden Errors

**Problem:** `Failed to load resource: the server responded with a status of 403 (Forbidden)`

**Common Causes:**

1. **Wrong Role:** Using `student` instead of `siswa`
2. **Expired Token:** JWT token has expired
3. **Invalid Credentials:** Wrong username/password combination

**Solution Steps:**

```javascript
// 1. Clear browser storage
localStorage.clear();
sessionStorage.clear();

// 2. Login with correct credentials
// For students: siswa01/siswa123
// For teachers: guru01/guru123
// For admin: admin01/admin123

// 3. Verify token
const token = localStorage.getItem('accessToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Role:', payload.role); // Must be 'siswa', 'guru', or 'admin'
```

### Test Environment

**Backend Server:** `http://localhost:5000`
**Frontend Server:** `http://localhost:3000`

**Valid Test Users:**

- `siswa01` / `siswa123` (role: siswa)
- `guru01` / `guru123` (role: guru)
- `admin01` / `admin123` (role: admin)

### Role Permissions Matrix

| Endpoint              | Admin     | Guru       | Siswa       |
| --------------------- | --------- | ---------- | ----------- |
| GET /complaints       | ✅ All    | ✅ All     | ✅ Own only |
| GET /complaints/stats | ✅ Global | ✅ Global  | ✅ Own only |
| POST /complaints      | ✅ Yes    | ✅ Yes     | ✅ Yes      |
| PUT /complaints       | ✅ Yes    | ✅ Limited | ❌ No       |
| DELETE /complaints    | ✅ Yes    | ❌ No      | ❌ No       |

---

**Last Updated:** July 1, 2025  
**Version:** 1.2.0  
**Critical Fix:** Role authentication issue resolved
