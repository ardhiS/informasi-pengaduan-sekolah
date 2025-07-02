# Quick Fix: Create default users for all roles
$baseUrl = "http://localhost:3000"

Write-Host "=== CREATING DEFAULT USERS FOR ALL ROLES ===" -ForegroundColor Green

# Function to create user
function Create-User {
    param($userData, $role)
    
    try {
        Write-Host "Creating $role user..." -ForegroundColor Yellow
        $jsonData = $userData | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method POST -Body $jsonData -ContentType "application/json"
        Write-Host "✅ $role user created: $($userData.username)" -ForegroundColor Green
        return $true
    } catch {
        if ($_.Exception.Message -like "*already exists*" -or $_.Exception.Message -like "*duplicate*") {
            Write-Host "⚠️ $role user already exists: $($userData.username)" -ForegroundColor Yellow
            return $true
        } else {
            Write-Host "❌ Failed to create $role user: $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    }
}

# Create Admin User
$adminData = @{
    username = "admin"
    fullname = "Administrator"
    email = "admin@atthahirin.sch.id"
    password = "admin123"
    role = "admin"
}
$adminCreated = Create-User $adminData "admin"

# Create Guru User
$guruData = @{
    username = "guru"
    fullname = "Guru Default"
    email = "guru@atthahirin.sch.id"
    password = "guru123"
    role = "guru"
}
$guruCreated = Create-User $guruData "guru"

# Create Siswa User
$siswaData = @{
    username = "siswa"
    fullname = "Siswa Default"
    email = "siswa@atthahirin.sch.id"
    password = "siswa123"
    role = "siswa"
}
$siswaCreated = Create-User $siswaData "siswa"

Write-Host "`n=== LOGIN CREDENTIALS ===" -ForegroundColor Cyan
Write-Host "ADMIN LOGIN:" -ForegroundColor White
Write-Host "  Username: admin" -ForegroundColor Green
Write-Host "  Password: admin123" -ForegroundColor Green
Write-Host "  URL: http://localhost:3000/login/admin" -ForegroundColor Blue

Write-Host "`nGURU LOGIN:" -ForegroundColor White
Write-Host "  Username: guru" -ForegroundColor Green
Write-Host "  Password: guru123" -ForegroundColor Green
Write-Host "  URL: http://localhost:3000/login/guru" -ForegroundColor Blue

Write-Host "`nSISWA LOGIN:" -ForegroundColor White
Write-Host "  Username: siswa" -ForegroundColor Green
Write-Host "  Password: siswa123" -ForegroundColor Green
Write-Host "  URL: http://localhost:3000/login/siswa" -ForegroundColor Blue

Write-Host "`n=== TESTING LOGINS ===" -ForegroundColor Green

# Test Admin Login
if ($adminCreated) {
    try {
        $loginData = @{ username = "admin"; password = "admin123" } | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/api/authentications" -Method POST -Body $loginData -ContentType "application/json"
        Write-Host "✅ Admin login test: SUCCESS" -ForegroundColor Green
    } catch {
        Write-Host "❌ Admin login test: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test Guru Login
if ($guruCreated) {
    try {
        $loginData = @{ username = "guru"; password = "guru123" } | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/api/authentications" -Method POST -Body $loginData -ContentType "application/json"
        Write-Host "✅ Guru login test: SUCCESS" -ForegroundColor Green
    } catch {
        Write-Host "❌ Guru login test: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test Siswa Login
if ($siswaCreated) {
    try {
        $loginData = @{ username = "siswa"; password = "siswa123" } | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/api/authentications" -Method POST -Body $loginData -ContentType "application/json"
        Write-Host "✅ Siswa login test: SUCCESS" -ForegroundColor Green
    } catch {
        Write-Host "❌ Siswa login test: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== SETUP COMPLETE ===" -ForegroundColor Green
Write-Host "Now you can login using the credentials above!" -ForegroundColor Cyan
