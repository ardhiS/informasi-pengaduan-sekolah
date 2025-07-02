# Script untuk membuat admin user langsung
$baseUrl = "http://localhost:3000"

Write-Host "=== Creating Admin User ===" -ForegroundColor Green

try {
    # Create admin user
    $adminData = @{
        username = "admin01"
        fullname = "Administrator 01"
        email = "admin01@atthahirin.sch.id"
        password = "admin123"
        role = "admin"
    } | ConvertTo-Json

    Write-Host "Creating admin user..." -ForegroundColor Yellow
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/users" -Method POST -Body $adminData -ContentType "application/json"
    Write-Host "Admin user created successfully!" -ForegroundColor Green
    Write-Host "Username: admin01" -ForegroundColor Cyan
    Write-Host "Password: admin123" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error creating admin: $($_.Exception.Message)" -ForegroundColor Red
    
    # If user already exists, that's fine
    if ($_.Exception.Message -like "*already exists*" -or $_.Exception.Message -like "*duplicate*") {
        Write-Host "Admin user already exists. Try logging in with:" -ForegroundColor Yellow
        Write-Host "Username: admin01" -ForegroundColor Cyan
        Write-Host "Password: admin123" -ForegroundColor Cyan
    }
}

Write-Host "`n=== Testing Login ===" -ForegroundColor Green

try {
    # Test login
    $loginData = @{
        username = "admin01"
        password = "admin123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/authentications" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "Login test successful!" -ForegroundColor Green
    Write-Host "Access token received" -ForegroundColor Cyan
    
} catch {
    Write-Host "Login test failed: $($_.Exception.Message)" -ForegroundColor Red
}
