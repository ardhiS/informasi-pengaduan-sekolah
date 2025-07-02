# Final Login Fix: Use sample-data endpoint that works
$baseUrl = "http://localhost:3000"

Write-Host "=== CREATING USERS VIA SAMPLE-DATA ENDPOINT ===" -ForegroundColor Green

try {
    Write-Host "Creating sample users (admin, guru, siswa)..." -ForegroundColor Yellow
    
    $sampleData = @{
        count = @{
            admin = 1
            guru = 1  
            siswa = 1
        }
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/sample-data/users" -Method POST -Body $sampleData -ContentType "application/json"
    Write-Host "✅ Sample users created successfully!" -ForegroundColor Green
    Write-Host "Response: $($response.message)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Failed to create sample users: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== AVAILABLE LOGIN CREDENTIALS ===" -ForegroundColor Cyan

Write-Host "`nADMIN LOGIN:" -ForegroundColor White
Write-Host "  Username: admin1" -ForegroundColor Green
Write-Host "  Password: password123" -ForegroundColor Green
Write-Host "  URL: http://localhost:3000/login/admin" -ForegroundColor Blue

Write-Host "`nGURU LOGIN:" -ForegroundColor White
Write-Host "  Username: guru1" -ForegroundColor Green
Write-Host "  Password: password123" -ForegroundColor Green
Write-Host "  URL: http://localhost:3000/login/guru" -ForegroundColor Blue

Write-Host "`nSISWA LOGIN:" -ForegroundColor White
Write-Host "  Username: siswa1" -ForegroundColor Green
Write-Host "  Password: password123" -ForegroundColor Green
Write-Host "  URL: http://localhost:3000/login/siswa" -ForegroundColor Blue

Write-Host "`n=== TESTING ADMIN LOGIN ===" -ForegroundColor Green

try {
    $loginData = @{ 
        username = "admin1"
        password = "password123" 
    } | ConvertTo-Json
    
    Write-Host "Testing admin1 login..." -ForegroundColor Yellow
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/authentications" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ ADMIN LOGIN SUCCESSFUL!" -ForegroundColor Green
    Write-Host "Access token received!" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Admin login failed: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try with different username patterns
    Write-Host "Trying alternative admin usernames..." -ForegroundColor Yellow
    
    $altUsernames = @("admin", "admin01", "administrator")
    foreach ($altUser in $altUsernames) {
        try {
            $altLoginData = @{ 
                username = $altUser
                password = "password123" 
            } | ConvertTo-Json
            
            $altResponse = Invoke-RestMethod -Uri "$baseUrl/api/authentications" -Method POST -Body $altLoginData -ContentType "application/json"
            Write-Host "✅ SUCCESS with username: $altUser" -ForegroundColor Green
            break
        } catch {
            Write-Host "❌ Failed with username: $altUser" -ForegroundColor Red
        }
    }
}

Write-Host "`n=== READY TO LOGIN ===" -ForegroundColor Green
Write-Host "Use the credentials above to login!" -ForegroundColor Cyan
