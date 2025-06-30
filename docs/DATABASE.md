# Database Schema Documentation

## Website Pengaduan SMP PLUS AT-THAHIRIN

### 🗃️ Database Overview

- **Database Management System**: PostgreSQL 12+
- **Database Name**: `school_management`
- **Character Set**: UTF8
- **Collation**: `en_US.UTF-8`

---

## 📊 Tables Structure

### 1. complaints

**Purpose**: Menyimpan data pengaduan dari siswa, guru, orang tua, dan staff sekolah.

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

```sql
CREATE INDEX complaints_status_index ON complaints (status);
CREATE INDEX complaints_category_index ON complaints (category);
CREATE INDEX complaints_priority_index ON complaints (priority);
CREATE INDEX complaints_reporter_type_index ON complaints (reporter_type);
CREATE INDEX complaints_reported_at_index ON complaints (reported_at);
```

**Field Descriptions:**

| Field            | Type         | Null | Default        | Description                                     |
| ---------------- | ------------ | ---- | -------------- | ----------------------------------------------- |
| `id`             | serial       | NO   | AUTO_INCREMENT | Primary key, unique identifier                  |
| `title`          | varchar(255) | NO   | -              | Judul/ringkasan pengaduan                       |
| `description`    | text         | NO   | -              | Deskripsi detail pengaduan                      |
| `category`       | varchar(100) | NO   | -              | Kategori: akademik, fasilitas, layanan, lainnya |
| `status`         | varchar(50)  | NO   | 'pending'      | Status: pending, in_progress, resolved, closed  |
| `priority`       | varchar(20)  | NO   | 'medium'       | Prioritas: low, medium, high                    |
| `reporter_name`  | varchar(255) | NO   | -              | Nama lengkap pelapor                            |
| `reporter_email` | varchar(255) | YES  | NULL           | Email pelapor (opsional)                        |
| `reporter_phone` | varchar(20)  | YES  | NULL           | Nomor telepon pelapor (opsional)                |
| `reporter_type`  | varchar(50)  | NO   | -              | Tipe pelapor: siswa, guru, orangtua, staff      |
| `reporter_class` | varchar(100) | YES  | NULL           | Kelas pelapor (untuk siswa)                     |
| `assigned_to`    | integer      | YES  | NULL           | ID admin/guru yang menangani                    |
| `admin_notes`    | text         | YES  | NULL           | Catatan dari admin                              |
| `resolution`     | text         | YES  | NULL           | Penjelasan penyelesaian masalah                 |
| `attachments`    | json         | YES  | NULL           | File lampiran (path/URL)                        |
| `reported_at`    | timestamp    | NO   | NOW()          | Waktu pengaduan dibuat                          |
| `resolved_at`    | timestamp    | YES  | NULL           | Waktu pengaduan diselesaikan                    |
| `created_at`     | timestamp    | NO   | NOW()          | Waktu record dibuat                             |
| `updated_at`     | timestamp    | NO   | NOW()          | Waktu record terakhir diupdate                  |

### 2. users

**Purpose**: Menyimpan data pengguna sistem (admin, guru, staff).

```sql
CREATE TABLE users (
  id serial PRIMARY KEY,
  username varchar(100) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  fullname varchar(255) NOT NULL,
  email varchar(255),
  role varchar(50) NOT NULL,
  is_active boolean DEFAULT true,
  last_login timestamp,
  created_at timestamp DEFAULT current_timestamp,
  updated_at timestamp DEFAULT current_timestamp
);
```

**Field Descriptions:**

| Field        | Type         | Null | Default        | Description                    |
| ------------ | ------------ | ---- | -------------- | ------------------------------ |
| `id`         | serial       | NO   | AUTO_INCREMENT | Primary key                    |
| `username`   | varchar(100) | NO   | -              | Username unik untuk login      |
| `password`   | varchar(255) | NO   | -              | Password hash (bcrypt)         |
| `fullname`   | varchar(255) | NO   | -              | Nama lengkap pengguna          |
| `email`      | varchar(255) | YES  | NULL           | Email pengguna                 |
| `role`       | varchar(50)  | NO   | -              | Role: admin, guru, staff       |
| `is_active`  | boolean      | NO   | true           | Status aktif pengguna          |
| `last_login` | timestamp    | YES  | NULL           | Waktu login terakhir           |
| `created_at` | timestamp    | NO   | NOW()          | Waktu record dibuat            |
| `updated_at` | timestamp    | NO   | NOW()          | Waktu record terakhir diupdate |

### 3. guru

**Purpose**: Menyimpan data guru.

```sql
CREATE TABLE guru (
  id serial PRIMARY KEY,
  nama varchar(255) NOT NULL,
  nip varchar(50) UNIQUE,
  mata_pelajaran varchar(100),
  email varchar(255),
  no_telepon varchar(20),
  alamat text,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT current_timestamp,
  updated_at timestamp DEFAULT current_timestamp
);
```

### 4. siswa

**Purpose**: Menyimpan data siswa.

```sql
CREATE TABLE siswa (
  id serial PRIMARY KEY,
  nama varchar(255) NOT NULL,
  nisn varchar(20) UNIQUE,
  kelas varchar(10),
  jenis_kelamin char(1),
  tanggal_lahir date,
  alamat text,
  nama_orangtua varchar(255),
  no_telepon_orangtua varchar(20),
  email_orangtua varchar(255),
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT current_timestamp,
  updated_at timestamp DEFAULT current_timestamp
);
```

---

## 🔗 Relationships

### Foreign Key Relationships

```sql
-- complaints.assigned_to references users.id
ALTER TABLE complaints
ADD CONSTRAINT fk_complaints_assigned_to
FOREIGN KEY (assigned_to) REFERENCES users(id);
```

### Entity Relationship Diagram

```
┌─────────────┐      ┌─────────────┐
│    users    │      │ complaints  │
├─────────────┤      ├─────────────┤
│ id (PK)     │◄────┤│ assigned_to │
│ username    │      │ id (PK)     │
│ fullname    │      │ title       │
│ role        │      │ description │
│ ...         │      │ status      │
└─────────────┘      │ ...         │
                     └─────────────┘
                            │
                            │ (reference)
                            ▼
┌─────────────┐      ┌─────────────┐
│    guru     │      │   siswa     │
├─────────────┤      ├─────────────┤
│ id (PK)     │      │ id (PK)     │
│ nama        │      │ nama        │
│ nip         │      │ nisn        │
│ ...         │      │ kelas       │
└─────────────┘      │ ...         │
                     └─────────────┘
```

---

## 📝 Enumeration Values

### Complaint Status

```sql
-- Possible values for complaints.status
'pending'     -- Pengaduan baru, belum ditangani
'in_progress' -- Sedang dalam proses penanganan
'resolved'    -- Sudah diselesaikan
'closed'      -- Ditutup (tidak dapat diselesaikan)
```

### Complaint Priority

```sql
-- Possible values for complaints.priority
'low'    -- Prioritas rendah
'medium' -- Prioritas sedang (default)
'high'   -- Prioritas tinggi
```

### Complaint Category

```sql
-- Possible values for complaints.category
'akademik'  -- Masalah pembelajaran, kurikulum, dll
'fasilitas' -- Masalah infrastruktur, peralatan, dll
'layanan'   -- Masalah pelayanan administrasi, dll
'lainnya'   -- Kategori lain yang tidak termasuk di atas
```

### Reporter Type

```sql
-- Possible values for complaints.reporter_type
'siswa'    -- Dilaporkan oleh siswa
'guru'     -- Dilaporkan oleh guru
'orangtua' -- Dilaporkan oleh orang tua siswa
'staff'    -- Dilaporkan oleh staff sekolah
```

### User Role

```sql
-- Possible values for users.role
'admin' -- Administrator sistem
'guru'  -- Guru/pengajar
'staff' -- Staff sekolah lainnya
```

---

## 🔍 Indexes and Performance

### Primary Indexes

- All tables have `serial PRIMARY KEY` on `id` field
- `users.username` has `UNIQUE` constraint with automatic index
- `guru.nip` has `UNIQUE` constraint with automatic index
- `siswa.nisn` has `UNIQUE` constraint with automatic index

### Secondary Indexes for complaints

```sql
-- For filtering by status (most common query)
CREATE INDEX complaints_status_index ON complaints (status);

-- For filtering by category
CREATE INDEX complaints_category_index ON complaints (category);

-- For filtering by priority
CREATE INDEX complaints_priority_index ON complaints (priority);

-- For filtering by reporter type
CREATE INDEX complaints_reporter_type_index ON complaints (reporter_type);

-- For sorting by report date (default sort)
CREATE INDEX complaints_reported_at_index ON complaints (reported_at DESC);

-- Composite index for common filter combinations
CREATE INDEX complaints_status_category_index ON complaints (status, category);
CREATE INDEX complaints_status_priority_index ON complaints (status, priority);
```

### Query Optimization Tips

**1. Use indexes for WHERE clauses:**

```sql
-- Good - uses complaints_status_index
SELECT * FROM complaints WHERE status = 'pending';

-- Good - uses complaints_status_category_index
SELECT * FROM complaints WHERE status = 'pending' AND category = 'fasilitas';
```

**2. Use LIMIT for pagination:**

```sql
-- Good - prevents full table scan
SELECT * FROM complaints
ORDER BY reported_at DESC
LIMIT 20 OFFSET 40;
```

**3. Avoid SELECT \* in production:**

```sql
-- Good - only select needed columns
SELECT id, title, status, reported_at
FROM complaints
WHERE status = 'pending';
```

---

## 🔄 Migration History

### Migration Files

**1. 1750506784255_guru.js**

- Creates `guru` table
- Adds basic guru information fields

**2. 1750506853992_siswa.js**

- Creates `siswa` table
- Adds basic siswa information fields

**3. 1751254014938_complaints-new.js**

- Creates `complaints` table
- Adds all complaint-related fields
- Creates necessary indexes

### Running Migrations

```bash
# Run all pending migrations
npm run migrate up

# Rollback last migration
npm run migrate down

# Check migration status
npm run migrate list
```

### Migration Best Practices

1. **Always backup before migration:**

```bash
pg_dump school_management > backup_$(date +%Y%m%d_%H%M%S).sql
```

2. **Test migrations in development first:**

```bash
# Development environment
DATABASE_URL=postgres://user:pass@localhost:5432/school_dev npm run migrate up
```

3. **Use transactions for complex migrations:**

```javascript
exports.up = pgm => {
  pgm.db.query('BEGIN');
  try {
    // Migration operations
    pgm.createTable('new_table', {...});
    pgm.addColumn('existing_table', {...});
    pgm.db.query('COMMIT');
  } catch (error) {
    pgm.db.query('ROLLBACK');
    throw error;
  }
};
```

---

## 🛡️ Security Considerations

### Data Protection

**1. Password Hashing:**

```sql
-- Never store plain text passwords
-- Use bcrypt or similar hashing algorithm
INSERT INTO users (username, password, ...)
VALUES ('admin', '$2b$10$encrypted_hash_here', ...);
```

**2. Input Validation:**

- All input should be validated before database insertion
- Use parameterized queries to prevent SQL injection
- Validate enum values on application level

**3. Access Control:**

```sql
-- Limit database user permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON complaints TO app_user;
GRANT USAGE, SELECT ON SEQUENCE complaints_id_seq TO app_user;
```

### Audit Trail

**Consider adding audit table for complaints:**

```sql
CREATE TABLE complaints_audit (
  id serial PRIMARY KEY,
  complaint_id integer NOT NULL,
  action varchar(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_values json,
  new_values json,
  changed_by integer,
  changed_at timestamp DEFAULT current_timestamp
);
```

---

## 📊 Sample Data

### Users Sample Data

```sql
INSERT INTO users (username, password, fullname, role, email) VALUES
('admin', '$2b$10$hashed_password', 'Administrator', 'admin', 'admin@school.com'),
('guru1', '$2b$10$hashed_password', 'Budi Santoso', 'guru', 'budi@school.com'),
('staff1', '$2b$10$hashed_password', 'Siti Nurhaliza', 'staff', 'siti@school.com');
```

### Guru Sample Data

```sql
INSERT INTO guru (nama, nip, mata_pelajaran, email, no_telepon) VALUES
('Budi Santoso, S.Pd', '196505051990031001', 'Matematika', 'budi@school.com', '081234567890'),
('Siti Fatimah, S.Pd', '196712121992032001', 'Bahasa Indonesia', 'siti@school.com', '082345678901'),
('Ahmad Rahman, S.Si', '197003151995121001', 'IPA', 'ahmad@school.com', '083456789012');
```

### Siswa Sample Data

```sql
INSERT INTO siswa (nama, nisn, kelas, jenis_kelamin, nama_orangtua, no_telepon_orangtua) VALUES
('Ahmad Fauzi', '1234567890', '7A', 'L', 'Bapak Fauzi', '083456789012'),
('Sari Dewi', '1234567891', '7A', 'P', 'Ibu Dewi', '084567890123'),
('Budi Pratama', '1234567892', '7B', 'L', 'Bapak Pratama', '085678901234');
```

### Complaints Sample Data

```sql
INSERT INTO complaints (title, description, category, priority, reporter_name, reporter_type, reporter_class) VALUES
('AC Rusak di Kelas 7A', 'AC di kelas 7A sudah rusak sejak 3 hari yang lalu', 'fasilitas', 'medium', 'Ahmad Fauzi', 'siswa', '7A'),
('Proyektor Tidak Berfungsi', 'Proyektor di lab komputer tidak dapat menampilkan gambar', 'fasilitas', 'high', 'Budi Santoso', 'guru', NULL),
('Buku Pelajaran Kurang', 'Buku matematika untuk kelas 7 masih kurang 5 buah', 'akademik', 'medium', 'Siti Fatimah', 'guru', NULL);
```

---

## 🔧 Maintenance Tasks

### Regular Maintenance

**1. Vacuum and Analyze (Weekly):**

```sql
VACUUM ANALYZE complaints;
VACUUM ANALYZE users;
VACUUM ANALYZE guru;
VACUUM ANALYZE siswa;
```

**2. Update Statistics (Monthly):**

```sql
ANALYZE complaints;
```

**3. Check Index Usage:**

```sql
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### Monitoring Queries

**1. Slow Query Detection:**

```sql
-- Enable slow query logging in postgresql.conf
log_min_duration_statement = 1000  -- Log queries > 1 second
```

**2. Table Size Monitoring:**

```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**3. Active Connections:**

```sql
SELECT
  datname,
  usename,
  application_name,
  client_addr,
  state,
  query_start,
  query
FROM pg_stat_activity
WHERE datname = 'school_management';
```
