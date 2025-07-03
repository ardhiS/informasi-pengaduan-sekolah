# 🧪 Testing Guide - School Complaints System

## Features Implemented ✅

### 1. Image Upload in "Tambah Pengaduan"

- Navigate to complaints page
- Click "Tambah Pengaduan"
- Upload images (max 5, 5MB each)
- Preview images before submitting
- Remove individual images

### 2. Image Display in Complaints List

- Images shown as thumbnails in table
- Multiple images displayed with count indicator
- "Tidak ada" shown when no images

### 3. Role-based Visibility

#### Admin View:

- See ALL complaint details including reporter info
- Can approve/reject complaints
- Filter by approval status
- Access to all view modes

#### Siswa/Guru View:

- See all complaints but reporter info shows "Informasi disembunyikan"
- Can create complaints
- Can view own complaints progress
- Guru can update complaint status

### 4. Complaint Status Workflow

1. **Pending Approval** (default for new complaints)
2. **Rejected** (admin can reject with reason)
3. **In Progress** (approved complaints that guru is working on)
4. **Resolved** (completed complaints)

### 5. View Modes

- **All Complaints**: See all approved complaints
- **My Complaints**: User's own complaints with progress
- **Assigned to Me**: For guru - complaints assigned to them

## Testing Steps

### Test as Admin:

1. Login as admin user
2. View all complaints with full reporter details
3. Test approval/rejection workflow
4. Filter by approval status
5. Upload complaint with images

### Test as Guru:

1. Login as guru user
2. Verify reporter info is hidden
3. Create complaint with images
4. View "My Complaints" progress
5. Update status of assigned complaints

### Test as Siswa:

1. Login as siswa user
2. Verify reporter info is hidden
3. Create complaint with multiple images
4. Track progress in "My Complaints"

## Backend Endpoints

- `POST /api/complaints` - Create with image upload
- `GET /api/complaints` - Role-based filtering
- `GET /api/complaints/my` - User's own complaints
- `GET /api/complaints/assigned` - Guru's assigned complaints
- `PUT /api/complaints/{id}/approve` - Admin approval
- `PUT /api/complaints/{id}/reject` - Admin rejection
- `PUT /api/complaints/{id}/progress` - Status update

## Database Tables

- `complaints` - Enhanced with approval columns
- `complaint_images` - Image metadata storage
- `users` - Existing user roles (admin, guru, siswa)

## File Structure

```
backend/
├── uploads/                    # Image storage
├── migrations/
│   └── 1751400000000_*        # Image and approval tables
├── src/
│   ├── api/complaints/
│   │   ├── handler.js         # Enhanced with image/approval
│   │   └── routes.js          # New approval endpoints
│   └── services/
│       └── ComplaintsService.js # Role-based filtering

frontend/
├── src/
│   ├── pages/
│   │   └── Complaints.jsx     # Enhanced UI with images/tabs
│   └── services/
│       └── complaintsService.js # Image upload support
```

## Status Colors

- 🟡 Pending Approval (Yellow)
- 🔴 Rejected (Red)
- 🔵 In Progress (Blue)
- 🟢 Resolved (Green)

---

🎉 **All requirements have been successfully implemented!**
