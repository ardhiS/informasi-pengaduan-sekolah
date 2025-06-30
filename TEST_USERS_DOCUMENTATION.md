# 📚 Test Users Documentation - School Management Dashboard

## 🎯 Overview

Dokumentasi ini berisi daftar test users yang dapat digunakan untuk demo dan testing sistem School Management Dashboard. Setiap user memiliki role yang berbeda dengan akses dan privilege yang sesuai.

## 🔐 Test User Accounts

### 1. 👑 System Administrator

```
Username: admin01
Password: admin123
Full Name: System Administrator
Role: admin
Badge Color: Red Gradient
```

**Capabilities:**

- Full system access
- User management (create, edit, delete users)
- System configuration
- View all reports and analytics
- Manage all classes and subjects
- Override all permissions

---

### 2. 👨‍🏫 Teacher

```
Username: teacher02
Password: teacher123
Full Name: Jane Smith
Role: teacher
Badge Color: Blue Gradient
```

**Capabilities:**

- Manage assigned classes
- View and edit student information
- Create and manage subjects
- Generate class reports
- View academic calendar
- Communicate with students and parents

---

### 3. 🎓 Student

```
Username: student01
Password: student123
Full Name: Alice Johnson
Role: student
Badge Color: Green Gradient
```

**Capabilities:**

- View personal academic information
- Access class schedules
- View grades and assignments
- Submit assignments
- View announcements
- Limited profile editing

---

### 4. 🏢 Staff Member

```
Username: staff01
Password: staff123
Full Name: Bob Wilson
Role: staff
Badge Color: Purple Gradient
```

**Capabilities:**

- Administrative support functions
- Data entry and maintenance
- Generate basic reports
- Student registration assistance
- Event coordination
- Limited user management

---

### 5. 🎖️ School Principal

```
Username: principal01
Password: principal123
Full Name: Dr. Sarah Davis
Role: principal
Badge Color: Yellow-Orange Gradient
```

**Capabilities:**

- High-level administrative access
- Strategic planning and oversight
- Teacher and staff management
- Budget and resource allocation
- Policy implementation
- School performance monitoring

---

### 6. 📋 Academic Coordinator (Optional)

```
Username: coordinator01
Password: coordinator123
Full Name: Michael Brown
Role: coordinator
Badge Color: Indigo Gradient
```

**Capabilities:**

- Academic program coordination
- Curriculum development
- Teacher scheduling
- Academic standards monitoring
- Cross-departmental collaboration
- Academic reporting

---

## 🎨 Visual Role Indicators

Each role has a distinct visual indicator in the header:

| Role        | Badge Color     | Avatar Color | Description            |
| ----------- | --------------- | ------------ | ---------------------- |
| Admin       | Red Gradient    | Blue-Purple  | Full system control    |
| Teacher     | Blue Gradient   | Blue-Purple  | Educational management |
| Student     | Green Gradient  | Blue-Purple  | Learning access        |
| Staff       | Purple Gradient | Blue-Purple  | Administrative support |
| Principal   | Yellow-Orange   | Blue-Purple  | Executive leadership   |
| Coordinator | Indigo Gradient | Blue-Purple  | Academic coordination  |

## 🚀 Quick Demo Guide

### Getting Started

1. Open browser to `http://localhost:3000`
2. Click "Login" or navigate to login page
3. Use any of the test accounts above
4. Observe the header changes based on role

### Demo Flow Recommendations

#### **Admin Demo Flow:**

1. Login as `admin01`
2. Navigate to Users → See all users with different roles
3. Navigate to Classes → Manage classes and subjects
4. Show user creation/editing capabilities
5. Demonstrate system-wide access

#### **Teacher Demo Flow:**

1. Login as `teacher02`
2. Navigate to Classes → Show teaching assignments
3. Navigate to Subjects → Show subject management
4. Demonstrate educational tools and features

#### **Student Demo Flow:**

1. Login as `student01`
2. Show limited navigation options
3. Navigate to Classes → Show enrolled classes
4. Demonstrate student-specific features

#### **Multi-Role Demo:**

1. Start with Admin to show full capabilities
2. Logout and login as Teacher
3. Show differences in available features
4. Logout and login as Student
5. Highlight role-based access control

## 📊 Test Data Available

### Classes Data:

- **Math Grade 10A** - Advanced mathematics for grade 10
- **Math Grade 10B** - Mathematics for grade 10 students
- **Math Grade 11A** - Advanced mathematics for grade 11

### Subjects Data:

- **Mathematics** (MATH101)
- **Science** (SCI101)
- **English** (ENG101)
- **Physics** (PHY101)
- **Chemistry** (CHEM101)

### Users Statistics:

- **Total Users:** 18+
- **Teachers:** 8
- **Students:** Variable
- **Admins:** 4+

## 🔧 Setup Commands

If you need to regenerate test data, run these commands in the backend directory:

```bash
# Add basic test users
node add-test-users.js

# Add sample classes and subjects
node add-simple-test-data.js

# Add comprehensive sample data
node create-sample-data.js
```

## 🎭 Role-Based Feature Matrix

| Feature             | Admin   | Teacher          | Student      | Staff      | Principal |
| ------------------- | ------- | ---------------- | ------------ | ---------- | --------- |
| User Management     | ✅ Full | ❌ No            | ❌ No        | ⚠️ Limited | ✅ Full   |
| Class Management    | ✅ Full | ✅ Assigned      | 👁️ View Only | ⚠️ Limited | ✅ Full   |
| Subject Management  | ✅ Full | ✅ Teaching      | 👁️ View Only | ⚠️ Limited | ✅ Full   |
| Reports & Analytics | ✅ All  | ✅ Class Reports | 👁️ Personal  | ⚠️ Basic   | ✅ All    |
| System Settings     | ✅ Full | ❌ No            | ❌ No        | ❌ No      | ✅ Full   |

## 📝 Notes for Developers

### Adding New Test Users:

```javascript
// In add-test-users.js, add new user object:
{
  username: 'newuser01',
  password: 'password123',
  fullname: 'New User Name',
  role: 'desired_role'
}
```

### Customizing Role Colors:

Update the `getRoleBadgeColor` function in `Header.jsx` to modify role badge colors.

### Security Notes:

- These are TEST ACCOUNTS ONLY
- Never use these credentials in production
- Passwords are intentionally simple for demo purposes
- In production, implement proper password policies

## 🎉 Demo Tips

1. **Start with Visual Impact:** Login as different roles to show header changes
2. **Highlight Security:** Show how features change based on role
3. **User Experience:** Demonstrate smooth transitions and responsive design
4. **Data Flow:** Show how different roles interact with the same data
5. **Real-world Scenarios:** Use realistic educational workflows

---

**Last Updated:** June 30, 2025  
**Version:** 1.0  
**Author:** School Management System Team
