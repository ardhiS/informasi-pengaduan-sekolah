# API Documentation

## Website Pengaduan SMP PLUS AT-THAHIRIN

### 📋 Base Information

- **Base URL**: `http://localhost:5000` (Development)
- **API Version**: v1
- **Content-Type**: `application/json`
- **Authentication**: JWT Bearer Token

---

## 🔐 Authentication

### Login

```http
POST /auth/login
```

**Request Body:**

```json
{
  "username": "admin",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Authentication berhasil",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    }
  }
}
```

### Register

```http
POST /auth/register
```

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "password123",
  "fullname": "John Doe",
  "role": "guru",
  "email": "john@school.com"
}
```

### Logout

```http
DELETE /auth/logout
```

**Headers:**

```
Authorization: Bearer <access_token>
```

---

## 📝 Complaints API

### 1. Get All Complaints

```http
GET /complaints
```

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `status` | string | Filter by status: `pending`, `in_progress`, `resolved`, `closed` | - |
| `category` | string | Filter by category: `akademik`, `fasilitas`, `layanan`, `lainnya` | - |
| `priority` | string | Filter by priority: `low`, `medium`, `high` | - |
| `limit` | number | Number of items per page | 50 |
| `offset` | number | Number of items to skip | 0 |

**Example Request:**

```http
GET /complaints?status=pending&category=fasilitas&limit=10&offset=0
```

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "complaints": [
      {
        "id": 1,
        "title": "AC Rusak di Kelas 7A",
        "description": "AC di kelas 7A sudah rusak sejak 3 hari yang lalu dan membuat siswa tidak nyaman belajar",
        "category": "fasilitas",
        "status": "pending",
        "priority": "medium",
        "reporter_name": "Ahmad Budi Santoso",
        "reporter_email": "ahmad.budi@email.com",
        "reporter_phone": "081234567890",
        "reporter_type": "siswa",
        "reporter_class": "7A",
        "assigned_to": null,
        "admin_notes": null,
        "resolution": null,
        "attachments": null,
        "reported_at": "2025-06-30T08:30:00.000Z",
        "resolved_at": null,
        "created_at": "2025-06-30T08:30:00.000Z",
        "updated_at": "2025-06-30T08:30:00.000Z"
      }
    ]
  }
}
```

### 2. Get Complaint Statistics

```http
GET /complaints/stats
```

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "stats": {
      "total": "25",
      "pending": "8",
      "in_progress": "12",
      "resolved": "4",
      "closed": "1",
      "high": "3",
      "medium": "15",
      "low": "7",
      "akademik": "10",
      "fasilitas": "8",
      "layanan": "4",
      "lainnya": "3",
      "from_siswa": "18",
      "from_guru": "5",
      "from_orangtua": "2"
    }
  }
}
```

### 3. Create New Complaint

```http
POST /complaints
```

**Request Body:**

```json
{
  "title": "Proyektor di Lab Komputer Tidak Berfungsi",
  "description": "Proyektor di lab komputer lantai 2 tidak dapat menampilkan gambar dengan jelas. Sudah coba restart berkali-kali tetapi masih bermasalah.",
  "category": "fasilitas",
  "priority": "high",
  "reporter_name": "Siti Nurhaliza",
  "reporter_email": "siti.nurhaliza@email.com",
  "reporter_phone": "082345678901",
  "reporter_type": "guru",
  "reporter_class": null
}
```

**Validation Rules:**

- `title`: Required, 3-200 characters
- `description`: Required, 10-2000 characters
- `category`: Required, one of: `akademik`, `fasilitas`, `layanan`, `lainnya`
- `priority`: Optional, one of: `low`, `medium`, `high` (default: `medium`)
- `reporter_name`: Required, 2-255 characters
- `reporter_email`: Optional, valid email format
- `reporter_phone`: Optional, phone number format
- `reporter_type`: Required, one of: `siswa`, `guru`, `orangtua`, `staff`
- `reporter_class`: Optional, max 100 characters

**Success Response (201):**

```json
{
  "status": "success",
  "message": "Pengaduan berhasil ditambahkan",
  "data": {
    "complaintId": 26
  }
}
```

**Error Response (400):**

```json
{
  "status": "fail",
  "message": "\"title\" is required"
}
```

### 4. Get Complaint by ID

```http
GET /complaints/{id}
```

**Path Parameters:**

- `id` (number): Complaint ID

**Example:**

```http
GET /complaints/1
```

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "complaint": {
      "id": 1,
      "title": "AC Rusak di Kelas 7A",
      "description": "AC di kelas 7A sudah rusak sejak 3 hari yang lalu...",
      "category": "fasilitas",
      "status": "pending",
      "priority": "medium",
      "reporter_name": "Ahmad Budi Santoso",
      "reporter_email": "ahmad.budi@email.com",
      "reporter_phone": "081234567890",
      "reporter_type": "siswa",
      "reporter_class": "7A",
      "assigned_to": null,
      "admin_notes": null,
      "resolution": null,
      "attachments": null,
      "reported_at": "2025-06-30T08:30:00.000Z",
      "resolved_at": null,
      "created_at": "2025-06-30T08:30:00.000Z",
      "updated_at": "2025-06-30T08:30:00.000Z"
    }
  }
}
```

**Error Response (404):**

```json
{
  "status": "fail",
  "message": "Pengaduan tidak ditemukan"
}
```

### 5. Update Complaint

```http
PUT /complaints/{id}
```

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "status": "in_progress",
  "admin_notes": "Pengaduan telah diterima dan sedang dalam proses penanganan oleh tim maintenance",
  "assigned_to": 5,
  "resolution": null
}
```

**Validation Rules:**

- `status`: Optional, one of: `pending`, `in_progress`, `resolved`, `closed`
- `admin_notes`: Optional, max 2000 characters
- `assigned_to`: Optional, valid user ID (integer)
- `resolution`: Optional, max 2000 characters

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Pengaduan berhasil diperbarui"
}
```

**Error Response (401):**

```json
{
  "status": "fail",
  "message": "Token tidak valid atau sudah expired"
}
```

### 6. Delete Complaint

```http
DELETE /complaints/{id}
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Pengaduan berhasil dihapus"
}
```

---

## 👥 Users Management

### Get All Users

```http
GET /users
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "username": "admin",
        "fullname": "Administrator",
        "role": "admin",
        "email": "admin@school.com",
        "created_at": "2025-06-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

## 👨‍🏫 Guru Management

### Get All Guru

```http
GET /guru
```

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "gurus": [
      {
        "id": 1,
        "nama": "Budi Santoso, S.Pd",
        "nip": "196505051990031001",
        "mata_pelajaran": "Matematika",
        "email": "budi.santoso@school.com",
        "no_telepon": "081234567890",
        "alamat": "Jl. Pendidikan No. 123",
        "created_at": "2025-06-01T00:00:00.000Z"
      }
    ]
  }
}
```

### Create New Guru

```http
POST /guru
```

**Request Body:**

```json
{
  "nama": "Siti Fatimah, S.Pd",
  "nip": "196712121992032001",
  "mata_pelajaran": "Bahasa Indonesia",
  "email": "siti.fatimah@school.com",
  "no_telepon": "082345678901",
  "alamat": "Jl. Guru No. 456"
}
```

---

## 👨‍🎓 Siswa Management

### Get All Siswa

```http
GET /siswa
```

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "siswas": [
      {
        "id": 1,
        "nama": "Ahmad Fauzi",
        "nisn": "1234567890",
        "kelas": "7A",
        "jenis_kelamin": "L",
        "tanggal_lahir": "2010-05-15",
        "alamat": "Jl. Siswa No. 789",
        "nama_orangtua": "Bapak Fauzi",
        "no_telepon_orangtua": "083456789012",
        "created_at": "2025-06-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

## 🚨 Error Responses

### Common Error Codes

| Status Code | Description                             |
| ----------- | --------------------------------------- |
| 400         | Bad Request - Invalid input data        |
| 401         | Unauthorized - Invalid or missing token |
| 403         | Forbidden - Insufficient permissions    |
| 404         | Not Found - Resource not found          |
| 500         | Internal Server Error                   |

### Error Response Format

**Validation Error (400):**

```json
{
  "status": "fail",
  "message": "\"title\" is required"
}
```

**Authentication Error (401):**

```json
{
  "status": "fail",
  "message": "Token tidak valid atau sudah expired"
}
```

**Not Found Error (404):**

```json
{
  "status": "fail",
  "message": "Pengaduan tidak ditemukan"
}
```

**Server Error (500):**

```json
{
  "status": "error",
  "message": "Maaf, terjadi kegagalan pada server kami."
}
```

---

## 🔧 Rate Limiting

Currently no rate limiting is implemented. For production deployment, consider implementing rate limiting to prevent abuse.

**Recommended limits:**

- General API: 100 requests per minute per IP
- Authentication: 5 requests per minute per IP
- Create complaints: 10 requests per hour per IP

---

## 📝 Request/Response Examples

### Using cURL

**Create a complaint:**

```bash
curl -X POST http://localhost:5000/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Toilet Rusak",
    "description": "Toilet di lantai 2 tidak bisa di-flush",
    "category": "fasilitas",
    "priority": "high",
    "reporter_name": "Maria Sari",
    "reporter_type": "siswa",
    "reporter_class": "8B"
  }'
```

**Get complaints with filters:**

```bash
curl "http://localhost:5000/complaints?status=pending&category=fasilitas&limit=5"
```

**Update complaint (requires auth):**

```bash
curl -X PUT http://localhost:5000/complaints/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved",
    "resolution": "Toilet sudah diperbaiki oleh tim maintenance"
  }'
```

### Using JavaScript (Fetch API)

**Create complaint:**

```javascript
const createComplaint = async (complaintData) => {
  try {
    const response = await fetch('http://localhost:5000/complaints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complaintData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Complaint created:', result.data.complaintId);
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

**Get complaints:**

```javascript
const getComplaints = async (filters = {}) => {
  const params = new URLSearchParams(filters);

  try {
    const response = await fetch(`http://localhost:5000/complaints?${params}`);
    const result = await response.json();

    if (response.ok) {
      return result.data.complaints;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to fetch complaints:', error);
    throw error;
  }
};
```

---

## 🧪 Testing

### Postman Collection

Import the Postman collection from `/testing/postman-collection-fixed.json` to test all endpoints.

**Running tests:**

```bash
# Run all tests
npm run test

# Generate HTML report
npm run test:report
```

### Test Environment

Environment variables for testing are in `/testing/test-environment-simple.json`:

```json
{
  "id": "test-environment",
  "name": "Test Environment",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000",
      "enabled": true
    },
    {
      "key": "accessToken",
      "value": "",
      "enabled": true
    }
  ]
}
```

---

## 📊 Database Schema Quick Reference

### Complaints Table Structure

```sql
complaints (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  reporter_name VARCHAR(255) NOT NULL,
  reporter_email VARCHAR(255),
  reporter_phone VARCHAR(20),
  reporter_type VARCHAR(50) NOT NULL,
  reporter_class VARCHAR(100),
  assigned_to INTEGER,
  admin_notes TEXT,
  resolution TEXT,
  attachments JSON,
  reported_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

### Enum Values

- **Status**: `pending`, `in_progress`, `resolved`, `closed`
- **Priority**: `low`, `medium`, `high`
- **Category**: `akademik`, `fasilitas`, `layanan`, `lainnya`
- **Reporter Type**: `siswa`, `guru`, `orangtua`, `staff`
