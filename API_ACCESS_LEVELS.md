# 🔐 **LEVEL AKSES SISTEM PENGADUAN SEKOLAH**

## **📋 Overview Level Akses Baru**

Berdasarkan permintaan Anda, sistem sekarang mengimplementasikan level akses sebagai berikut:

### **✅ Yang Bisa Dilakukan Setiap Role:**

| Fitur                       | Siswa | Guru | Admin |
| --------------------------- | ----- | ---- | ----- |
| **Membuat pengaduan**       | ✅    | ✅   | ✅    |
| **Lihat semua pengaduan**   | ✅    | ✅   | ✅    |
| **Lihat pengaduan sendiri** | ✅    | ✅   | ✅    |
| **Update pengaduan**        | ❌    | ✅   | ✅    |
| **Update status pengaduan** | ❌    | ✅   | ✅    |
| **Assign pengaduan**        | ❌    | ❌   | ✅    |
| **Hapus pengaduan**         | ❌    | ❌   | ✅    |
| **Lihat statistik**         | ✅    | ✅   | ✅    |

---

## **🛠️ ENDPOINT API LENGKAP**

### **1. Authentication Required**

Semua endpoint memerlukan JWT token dengan header:

```
Authorization: Bearer <your_jwt_token>
```

### **2. Daftar Endpoint Complaints**

#### **📝 CREATE - Membuat Pengaduan (Siswa, Guru, Admin)**

```http
POST /complaints
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**

```json
{
  "title": "Judul Pengaduan",
  "description": "Deskripsi detail pengaduan",
  "category": "akademik|fasilitas|bullying|lainnya",
  "priority": "low|medium|high|urgent",
  "reporter_name": "Nama Pelapor (optional)",
  "reporter_email": "email@example.com (optional)",
  "reporter_phone": "081234567890 (optional)",
  "reporter_class": "XII-A (optional)"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Pengaduan berhasil ditambahkan",
  "data": {
    "complaintId": "complaint-123"
  }
}
```

#### **📖 READ - Lihat Semua Pengaduan (Siswa, Guru, Admin)**

```http
GET /complaints
```

**Query Parameters:**

- `status`: pending|in_progress|resolved|closed
- `category`: akademik|fasilitas|bullying|lainnya
- `priority`: low|medium|high|urgent
- `limit`: number
- `offset`: number

**Response:**

```json
{
  "status": "success",
  "data": {
    "complaints": [...],
    "user_info": {
      "role": "guru",
      "username": "guru123",
      "can_create": true,
      "can_view_all": true,
      "can_delete": false,
      "can_update": true
    }
  }
}
```

#### **📖 READ - Lihat Pengaduan Sendiri (Siswa, Guru, Admin)**

```http
GET /complaints/my
```

Menampilkan hanya pengaduan yang dibuat oleh user yang sedang login.

#### **📖 READ - Lihat Pengaduan yang Ditugaskan (Guru, Admin)**

```http
GET /complaints/assigned
```

Menampilkan pengaduan yang ditugaskan kepada user yang sedang login.

#### **📖 READ - Lihat Detail Pengaduan (Siswa, Guru, Admin)**

```http
GET /complaints/{id}
```

#### **📊 READ - Statistik Pengaduan (Siswa, Guru, Admin)**

```http
GET /complaints/stats
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "stats": {
      "total": 150,
      "pending": 25,
      "in_progress": 50,
      "resolved": 60,
      "closed": 15,
      "urgent": 10,
      "high": 30,
      "medium": 80,
      "low": 30,
      "from_siswa": 100,
      "from_guru": 40,
      "from_admin": 10,
      "user_permissions": {
        "role": "guru",
        "can_create": true,
        "can_view_all": true,
        "can_update": true,
        "can_delete": false,
        "can_assign": false
      }
    }
  }
}
```

#### **✏️ UPDATE - Update Pengaduan Lengkap (Guru, Admin)**

```http
PUT /complaints/{id}
```

**Body:**

```json
{
  "title": "Judul Baru",
  "description": "Deskripsi Baru",
  "category": "fasilitas",
  "status": "in_progress",
  "priority": "high",
  "resolution": "Solusi yang diberikan",
  "admin_notes": "Catatan admin (hanya admin)"
}
```

#### **🔄 UPDATE - Update Status Saja (Guru, Admin)**

```http
PUT /complaints/{id}/status
```

**Body:**

```json
{
  "status": "resolved",
  "resolution": "Masalah telah diselesaikan"
}
```

#### **👥 UPDATE - Assign Pengaduan (Admin Only)**

```http
PUT /complaints/{id}/assign
```

**Body:**

```json
{
  "assigned_to": "user-id-guru",
  "admin_notes": "Silakan ditangani segera"
}
```

#### **🗑️ DELETE - Hapus Pengaduan (Admin Only)**

```http
DELETE /complaints/{id}
```

---

## **🔐 IMPLEMENTASI SECURITY**

### **1. JWT Authentication**

- Semua endpoint dilindungi dengan JWT authentication
- Token berlaku selama 30 menit
- Role user disimpan dalam JWT payload

### **2. Role-Based Authorization**

- Setiap handler memeriksa role user dari JWT
- Error 403 jika user tidak memiliki akses
- Audit log untuk aksi admin

### **3. Data Isolation**

- User hanya bisa melihat data yang diizinkan sesuai role
- Admin memiliki akses penuh
- Guru bisa update tapi tidak delete
- Siswa hanya bisa create dan view

---

## **📱 CONTOH PENGGUNAAN**

### **Sebagai Siswa:**

```javascript
// Login dan dapat token
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nisn: '12345678',
    password: 'password123',
  }),
});

const { accessToken } = await loginResponse.json();

// Buat pengaduan
const createComplaint = await fetch('/complaints', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Fasilitas Rusak',
    description: 'AC di kelas tidak dingin',
    category: 'fasilitas',
    priority: 'medium',
  }),
});

// Lihat semua pengaduan (sekarang bisa!)
const allComplaints = await fetch('/complaints', {
  headers: { Authorization: `Bearer ${accessToken}` },
});
```

### **Sebagai Guru:**

```javascript
// Guru bisa buat pengaduan dan update status
const updateStatus = await fetch('/complaints/123/status', {
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    status: 'resolved',
    resolution: 'AC sudah diperbaiki',
  }),
});
```

### **Sebagai Admin:**

```javascript
// Admin bisa assign pengaduan ke guru
const assignComplaint = await fetch('/complaints/123/assign', {
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    assigned_to: 'guru-user-id',
    admin_notes: 'Mohon ditangani hari ini',
  }),
});
```

---

## **🚀 PERUBAHAN YANG DIIMPLEMENTASIKAN**

1. **✅ Guru bisa membuat pengaduan** - Implementasi complete
2. **✅ Siswa dan Guru bisa lihat semua pengaduan** - Implementasi complete
3. **✅ Authentication di semua endpoint** - JWT required
4. **✅ Role-based authorization** - Setiap handler cek role
5. **✅ Audit trail** - Track siapa yang buat/update
6. **✅ Endpoint tambahan** - /my, /assigned, /status, /assign
7. **✅ Error handling** - Proper 403 untuk unauthorized
8. **✅ Service methods** - Support untuk fitur baru

Sistem sekarang sudah sepenuhnya mengimplementasikan level akses yang Anda minta! 🎉
