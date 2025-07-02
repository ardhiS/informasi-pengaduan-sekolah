# Quick Reference: Troubleshooting Guide

## 🚨 CURRENT ISSUE STATUS

**MAIN PROBLEM:** User creation berhasil via API tapi tidak tersimpan di database

## ⚡ QUICK FIX COMMANDS

### 1. Start Backend (jika belum running)

```bash
cd "c:\Users\Lenovo\OneDrive\Desktop\informasi-pengaduan-sekolah-1"
npm start
```

### 2. Test User Creation

```powershell
powershell -ExecutionPolicy Bypass -File "debug-user-creation.ps1"
```

### 3. Manual API Test

```powershell
# Test backend accessibility
Invoke-RestMethod -Uri "http://localhost:3000/api/sample-data/users" -Method GET

# Create users
$payload = @{ count = @{ admin = 1; guru = 1; siswa = 1 } } | ConvertTo-Json -Depth 3
Invoke-RestMethod -Uri "http://localhost:3000/api/sample-data/users" -Method POST -Body $payload -ContentType "application/json"

# Test login
$loginData = @{ username = "admin1"; password = "password123" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/authentications" -Method POST -Body $loginData -ContentType "application/json"
```

## 🔧 FILES TO CHECK FOR DATABASE ISSUE

1. **Database Connection:**

   - `src/database.js` atau `src/db.js`
   - Connection string dan credentials

2. **User Creation Logic:**

   - `src/api/sample-data/routes.js` - line yang handle user insertion
   - `src/services/UserService.js` atau similar

3. **Database Schema:**
   - `migrations/` folder - check if tables exist
   - Table structure untuk users

## 🎯 NEXT SESSION TODO

1. **Check Database Connection:**

   ```javascript
   // Verify database connection is working
   // Check if users table exists
   // Verify insertion query is executing
   ```

2. **Debug User Creation:**

   ```javascript
   // Add console.log in sample-data routes
   // Verify SQL queries are executing
   // Check for silent failures
   ```

3. **Test Complete Flow:**
   ```
   User Creation → Database Check → Login Test → Frontend Integration
   ```

## 📱 LOGIN CREDENTIALS TO TEST

- **Admin:** admin1 / password123
- **Guru:** guru1 / password123
- **Siswa:** siswa1 / password123

## 🌐 FRONTEND ACCESS

- **URL:** http://localhost:5173
- **Login page:** Should work after backend user creation is fixed

---

_Last updated: 2 Juli 2025_
