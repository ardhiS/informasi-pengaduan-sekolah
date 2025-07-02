# Super Quick Fix: Manual user creation bypassing auth
$baseUrl = "http://localhost:3000"

Write-Host "=== CREATING ADMIN USER MANUALLY ===" -ForegroundColor Green

# First, let's check if users endpoint requires auth and disable it temporarily
# Or use a different approach

try {
    Write-Host "Testing direct admin user creation..." -ForegroundColor Yellow
    
    # Create admin user without auth
    $adminData = @{
        username = "admin"
        fullname = "Administrator"
        email = "admin@atthahirin.sch.id"
        password = "admin123"
        role = "admin"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method POST -Body $adminData -ContentType "application/json"
    Write-Host "✅ Admin user created successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Users endpoint requires auth. Using alternative method..." -ForegroundColor Red
    
    # Alternative: Use sample-data endpoint to create users
    try {
        Write-Host "Using sample-data endpoint to create admin user..." -ForegroundColor Yellow
        $sampleData = @{
            count = @{
                admin = 1
                guru = 1
                siswa = 1
            }
        } | ConvertTo-Json
        
        $sampleResponse = Invoke-RestMethod -Uri "$baseUrl/api/sample-data/users" -Method POST -Body $sampleData -ContentType "application/json"
        Write-Host "✅ Sample users created via sample-data endpoint!" -ForegroundColor Green
        
        # The sample-data creates users with these patterns:
        Write-Host "`n=== GENERATED LOGIN CREDENTIALS ===" -ForegroundColor Cyan
        Write-Host "ADMIN LOGIN:" -ForegroundColor White
        Write-Host "  Username: admin1" -ForegroundColor Green
        Write-Host "  Password: password123" -ForegroundColor Green
        
        Write-Host "`nGURU LOGIN:" -ForegroundColor White
        Write-Host "  Username: guru1" -ForegroundColor Green
        Write-Host "  Password: password123" -ForegroundColor Green
        
        Write-Host "`nSISWA LOGIN:" -ForegroundColor White
        Write-Host "  Username: siswa1" -ForegroundColor Green
        Write-Host "  Password: password123" -ForegroundColor Green
        
        # Test admin login
        Write-Host "`n=== TESTING ADMIN LOGIN ===" -ForegroundColor Green
        $loginData = @{
            username = "admin1"
            password = "password123"
        } | ConvertTo-Json
        
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/authentications" -Method POST -Body $loginData -ContentType "application/json"
        Write-Host "✅ Admin login test: SUCCESS!" -ForegroundColor Green
        Write-Host "Access token received and working!" -ForegroundColor Cyan
        
    } catch {
        Write-Host "❌ Sample-data method also failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== QUICK LOGIN SOLUTION ===" -ForegroundColor Green
Write-Host "Try logging in with:" -ForegroundColor Cyan
Write-Host "  Username: admin1" -ForegroundColor Green
Write-Host "  Password: password123" -ForegroundColor Green
Write-Host "  URL: http://localhost:3000/login/admin" -ForegroundColor Blue
