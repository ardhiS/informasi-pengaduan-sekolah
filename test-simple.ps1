# Simple test script untuk sample-data endpoints
$baseUrl = "http://localhost:3000"

Write-Host "=== Testing Sample Data Endpoints ===" -ForegroundColor Green

# Login untuk mendapatkan token
Write-Host "Getting authentication token..." -ForegroundColor Yellow

$loginBody = @{
    username = "testadmin"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/authentications" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.accessToken
    Write-Host "Token obtained successfully" -ForegroundColor Green
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    # Test Users Generation
    Write-Host "Testing Users Generation..." -ForegroundColor Yellow
    $usersBody = @{
        count = @{
            admin = 1
            guru = 2
            siswa = 5
        }
    } | ConvertTo-Json
    
    $usersResponse = Invoke-RestMethod -Uri "$baseUrl/api/sample-data/users" -Method POST -Body $usersBody -Headers $headers
    Write-Host "Users generated: $($usersResponse.message)" -ForegroundColor Green
    
    # Test Subjects Generation
    Write-Host "Testing Subjects Generation..." -ForegroundColor Yellow
    $subjectsBody = @{
        count = 3
    } | ConvertTo-Json
    
    $subjectsResponse = Invoke-RestMethod -Uri "$baseUrl/api/sample-data/subjects" -Method POST -Body $subjectsBody -Headers $headers
    Write-Host "Subjects generated: $($subjectsResponse.message)" -ForegroundColor Green
    
    Write-Host "All tests completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
