# 🧪 Manual Testing Guide - School Complaints System

## 📋 Test Users

Gunakan credentials berikut untuk testing:

- **Admin**: username: `admin01`, password: `admin123`
- **Guru**: username: `guru01`, password: `guru123`
- **Siswa**: username: `siswa01`, password: `siswa123`

## 🔄 Testing Steps

### Phase 1: Create Test Users

1. Buka http://localhost:3001
2. Klik "Register" atau buat akun baru
3. Buat 3 user dengan credentials di atas

### Phase 2: Test Image Upload (Siswa/Guru)

#### 2.1 Login as Siswa (siswa01)

1. Login dengan username: `siswa01`, password: `siswa123`
2. Navigasi ke halaman Complaints
3. Klik "Tambah Pengaduan"
4. Isi form:
   - Judul: "Test Pengaduan dengan Gambar"
   - Kategori: "Fasilitas"
   - Prioritas: "Medium"
   - Deskripsi: "Testing image upload feature"
   - Upload 2-3 gambar (jpg/png)
5. ✅ Verify: Preview gambar muncul
6. ✅ Verify: Bisa hapus gambar individual
7. Submit pengaduan
8. ✅ Verify: Pengaduan berhasil dibuat

#### 2.2 Verify Image Display

1. Kembali ke daftar pengaduan
2. ✅ Verify: Gambar muncul sebagai thumbnail di tabel
3. ✅ Verify: Reporter info menunjukkan "Informasi disembunyikan"
4. Klik "My Complaints"
5. ✅ Verify: Bisa lihat pengaduan sendiri dengan progress

### Phase 3: Test Guru Features

#### 3.1 Login as Guru (guru01)

1. Login dengan username: `guru01`, password: `guru123`
2. ✅ Verify: Dapat melihat semua pengaduan
3. ✅ Verify: Reporter info tersembunyi ("Informasi disembunyikan")
4. Buat pengaduan baru dengan gambar
5. Test "My Complaints" untuk tracking progress

#### 3.2 Test Status Update (Guru)

1. Lihat pengaduan yang sudah approved
2. Klik action button untuk update status
3. ✅ Verify: Dapat mengubah status ke "In Progress"
4. ✅ Verify: Dapat mengubah status ke "Resolved"
5. ✅ Verify: Status berubah di dashboard

### Phase 4: Test Admin Features

#### 4.1 Login as Admin (admin01)

1. Login dengan username: `admin01`, password: `admin123`
2. ✅ Verify: Dapat melihat SEMUA informasi pengaduan
3. ✅ Verify: Reporter info LENGKAP terlihat
4. ✅ Verify: Dapat melihat semua gambar

#### 4.2 Test Approval System

1. Lihat pengaduan dengan status "Pending Approval"
2. Test Approve:
   - Klik tombol "Approve"
   - ✅ Verify: Status berubah ke "In Progress"
3. Test Reject:
   - Buat pengaduan baru
   - Klik tombol "Reject"
   - Masukkan alasan penolakan
   - ✅ Verify: Status berubah ke "Rejected"

#### 4.3 Test Filtering

1. Test filter by approval status:
   - ✅ "Pending Approval"
   - ✅ "Approved"
   - ✅ "Rejected"
2. Test filter by status:
   - ✅ "In Progress"
   - ✅ "Resolved"
3. Test kombinasi filter

### Phase 5: Test View Modes

#### 5.1 Test Tab Navigation

1. Login sebagai setiap role
2. Test tabs:
   - ✅ "All Complaints" - semua pengaduan approved
   - ✅ "My Complaints" - pengaduan sendiri
   - ✅ "Assigned to Me" (guru only)

#### 5.2 Test Role-based Visibility

1. **Siswa**:
   - ✅ Tidak lihat reporter info
   - ✅ Lihat progress pengaduan sendiri
2. **Guru**:
   - ✅ Tidak lihat reporter info
   - ✅ Dapat update status pengaduan
   - ✅ Lihat assigned complaints
3. **Admin**:
   - ✅ Lihat semua info lengkap
   - ✅ Approval/rejection controls
   - ✅ Advanced filtering

## ✅ Expected Results

### Image Features:

- [x] Upload multiple images (max 5, 5MB each)
- [x] Image preview before submit
- [x] Remove individual images
- [x] Images displayed in complaints table
- [x] Images stored in database

### Role-based Access:

- [x] Admin: Full access, approval controls
- [x] Guru: Hidden reporter info, status updates
- [x] Siswa: Hidden reporter info, progress tracking

### Status Workflow:

- [x] Pending Approval → Rejected/In Progress → Resolved
- [x] Color-coded status badges
- [x] Approval/rejection with reasons

### View Modes:

- [x] All Complaints (approved only for siswa/guru)
- [x] My Complaints (personal progress)
- [x] Assigned to Me (guru only)

## 🚨 Issues to Check:

- [ ] Image file size validation
- [ ] Image type validation (jpg, png, gif)
- [ ] Error handling for failed uploads
- [ ] Mobile responsiveness
- [ ] Performance with multiple images

## 📝 Test Results Log:

```
Date: [Fill in date]
Tester: [Your name]
Browser: [Chrome/Firefox/Safari]
OS: [Windows/Mac/Linux]

Phase 1 - User Creation: ✅/❌
Phase 2 - Image Upload: ✅/❌
Phase 3 - Guru Features: ✅/❌
Phase 4 - Admin Features: ✅/❌
Phase 5 - View Modes: ✅/❌

Notes:
[Add any issues or observations]
```

---

## 🎯 Success Criteria:

✅ All 8 requirements implemented
✅ Role-based access working
✅ Image upload functional
✅ Status workflow complete
✅ No critical bugs found
