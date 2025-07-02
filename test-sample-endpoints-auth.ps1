# Test script dengan authentication untuk sample-data endpoints
$baseUrl = "http://localhost:3000"

Write-Host "=== Testing Sample Data Endpoints with Authentication ===" -ForegroundColor Green

# Dapatkan token terlebih dahulu
Write-Host "`n0. Getting authentication token..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = "testadmin"
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/authentications" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.accessToken
    Write-Host "✓ Token obtained successfully" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 50))..." -ForegroundColor Cyan
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
} catch {
    Write-Host "✗ Failed to get token: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Trying with existing admin user..." -ForegroundColor Yellow
    
    # Try to create admin user first
    try {
        $registerBody = @{
            username = "testadmin"
            fullname = "Test Administrator"
            email = "testadmin@school.com"
            password = "password123"
            role = "admin"
        } | ConvertTo-Json

        $registerResponse = Invoke-RestMethod -Uri "$baseUrl/users" -Method POST -Body $registerBody -ContentType "application/json"
        Write-Host "✓ Admin user created" -ForegroundColor Green
        
        # Now try login again
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/authentications" -Method POST -Body $loginBody -ContentType "application/json"
        $token = $loginResponse.data.accessToken
        Write-Host "✓ Token obtained after user creation" -ForegroundColor Green
        
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
    } catch {
        Write-Host "✗ Failed to create user and get token: $($_.Exception.Message)" -ForegroundColor Red
        return
    }
}

# Test 1: Generate Users
Write-Host "`n1. Testing Generate Users..." -ForegroundColor Yellow
try {
    $usersBody = @{
        count = @{
            admin = 2
            guru = 3
            siswa = 10
        }
    } | ConvertTo-Json

    $usersResponse = Invoke-RestMethod -Uri "$baseUrl/api/sample-data/users" -Method POST -Body $usersBody -Headers $headers
    Write-Host "✓ Users generated successfully" -ForegroundColor Green
    Write-Host "Response: $($usersResponse.message)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Users generation failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Generate Subjects
Write-Host "`n2. Testing Generate Subjects..." -ForegroundColor Yellow
try {
    $subjectsBody = @{
        count = 5
    } | ConvertTo-Json

    $subjectsResponse = Invoke-RestMethod -Uri "$baseUrl/api/sample-data/subjects" -Method POST -Body $subjectsBody -Headers $headers
    Write-Host "✓ Subjects generated successfully" -ForegroundColor Green
    Write-Host "Response: $($subjectsResponse.message)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Subjects generation failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Generate Classes
Write-Host "`n3. Testing Generate Classes..." -ForegroundColor Yellow
try {
    $classesBody = @{
        count = 3
    } | ConvertTo-Json

    $classesResponse = Invoke-RestMethod -Uri "$baseUrl/api/sample-data/classes" -Method POST -Body $classesBody -Headers $headers
    Write-Host "✓ Classes generated successfully" -ForegroundColor Green
    Write-Host "Response: $($classesResponse.message)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Classes generation failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Generate Complaints
Write-Host "`n4. Testing Generate Complaints..." -ForegroundColor Yellow
try {
    $complaintsBody = @{
        count = 5
    } | ConvertTo-Json

    $complaintsResponse = Invoke-RestMethod -Uri "$baseUrl/api/sample-data/complaints" -Method POST -Body $complaintsBody -Headers $headers
    Write-Host "✓ Complaints generated successfully" -ForegroundColor Green
    Write-Host "Response: $($complaintsResponse.message)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Complaints generation failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Testing Complete ===" -ForegroundColor Green
