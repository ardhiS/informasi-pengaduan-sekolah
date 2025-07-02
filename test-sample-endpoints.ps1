# Test script untuk verifikasi final sample-data endpoints
$baseUrl = "http://localhost:3000"

Write-Host "=== Testing Sample Data Endpoints ===" -ForegroundColor Green

# Test 1: Generate Users
Write-Host "`n1. Testing Generate Users..." -ForegroundColor Yellow
try {
    $usersResponse = Invoke-RestMethod -Uri "$baseUrl/api/sample-data/users" -Method POST -ContentType "application/json"
    Write-Host "✓ Users generated successfully" -ForegroundColor Green
    Write-Host "Response: $($usersResponse | ConvertTo-Json -Depth 2)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Users generation failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Generate Subjects
Write-Host "`n2. Testing Generate Subjects..." -ForegroundColor Yellow
try {
    $subjectsResponse = Invoke-RestMethod -Uri "$baseUrl/api/sample-data/subjects" -Method POST -ContentType "application/json"
    Write-Host "✓ Subjects generated successfully" -ForegroundColor Green
    Write-Host "Response: $($subjectsResponse | ConvertTo-Json -Depth 2)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Subjects generation failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Generate Classes
Write-Host "`n3. Testing Generate Classes..." -ForegroundColor Yellow
try {
    $classesResponse = Invoke-RestMethod -Uri "$baseUrl/api/sample-data/classes" -Method POST -ContentType "application/json"
    Write-Host "✓ Classes generated successfully" -ForegroundColor Green
    Write-Host "Response: $($classesResponse | ConvertTo-Json -Depth 2)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Classes generation failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Generate Complaints
Write-Host "`n4. Testing Generate Complaints..." -ForegroundColor Yellow
try {
    $complaintsResponse = Invoke-RestMethod -Uri "$baseUrl/api/sample-data/complaints" -Method POST -ContentType "application/json"
    Write-Host "✓ Complaints generated successfully" -ForegroundColor Green
    Write-Host "Response: $($complaintsResponse | ConvertTo-Json -Depth 2)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Complaints generation failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Testing Complete ===" -ForegroundColor Green
