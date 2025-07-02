# Check Database Connection and Users
$baseUrl = "http://localhost:3000"

Write-Host "=== CHECKING DATABASE CONNECTION AND USERS ===" -ForegroundColor Green

# Function to check database connection via backend
Write-Host "`n1. Testing Database Connection..." -ForegroundColor Yellow
try {
    # Test if backend can connect to database by checking any endpoint that queries DB
    $response = Invoke-RestMethod -Uri "$baseUrl/api/users/all" -Method GET
    Write-Host "✅ Database connection working - found users in DB" -ForegroundColor Green
    Write-Host "Total users found: $($response.users.length)" -ForegroundColor Cyan
    
    # List all users
    Write-Host "`n=== EXISTING USERS IN DATABASE ===" -ForegroundColor Cyan
    foreach ($user in $response.users) {
        Write-Host "👤 Username: $($user.username) | Role: $($user.role) | Email: $($user.email)" -ForegroundColor White
    }
    
} catch {
    if ($_.Exception.Message -like "*404*") {
        Write-Host "⚠️ Users endpoint not found. Trying alternative method..." -ForegroundColor Yellow
        
        # Try sample-data status endpoint to check DB connection
        try {
            $statusResponse = Invoke-RestMethod -Uri "$baseUrl/api/sample-data/status" -Method GET
            Write-Host "✅ Database connection via sample-data endpoint working" -ForegroundColor Green
        } catch {
            Write-Host "❌ Database connection failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Database connection failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n2. Creating Test Users via Sample Data..." -ForegroundColor Yellow
try {
    # Use sample-data endpoint which we know works without auth
    $sampleData = @{
        count = @{
            admin = 1
            guru = 1  
            siswa = 1
        }
    } | ConvertTo-Json
    
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/api/sample-data/users" -Method POST -Body $sampleData -ContentType "application/json"
    Write-Host "✅ Sample users created successfully!" -ForegroundColor Green
    Write-Host "Generated: $($createResponse.data.generated) users" -ForegroundColor Cyan
    
    # Display the expected credentials
    Write-Host "`n=== LOGIN CREDENTIALS TO TRY ===" -ForegroundColor Cyan
    Write-Host "ADMIN LOGIN:" -ForegroundColor White
    Write-Host "  Username: admin1" -ForegroundColor Green
    Write-Host "  Password: password123" -ForegroundColor Green
    
    Write-Host "`nGURU LOGIN:" -ForegroundColor White  
    Write-Host "  Username: guru1" -ForegroundColor Green
    Write-Host "  Password: password123" -ForegroundColor Green
    
    Write-Host "`nSISWA LOGIN:" -ForegroundColor White
    Write-Host "  Username: siswa1" -ForegroundColor Green
    Write-Host "  Password: password123" -ForegroundColor Green
    
    # Test login with created users
    Write-Host "`n3. Testing Login with Generated Users..." -ForegroundColor Yellow
    
    # Test admin1 login
    try {
        $loginData = @{ username = "admin1"; password = "password123" } | ConvertTo-Json
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/authentications" -Method POST -Body $loginData -ContentType "application/json"
        Write-Host "✅ admin1 login: SUCCESS!" -ForegroundColor Green
    } catch {
        Write-Host "❌ admin1 login failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test guru1 login  
    try {
        $loginData = @{ username = "guru1"; password = "password123" } | ConvertTo-Json
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/authentications" -Method POST -Body $loginData -ContentType "application/json"
        Write-Host "✅ guru1 login: SUCCESS!" -ForegroundColor Green
    } catch {
        Write-Host "❌ guru1 login failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test siswa1 login
    try {
        $loginData = @{ username = "siswa1"; password = "password123" } | ConvertTo-Json
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/authentications" -Method POST -Body $loginData -ContentType "application/json"
        Write-Host "✅ siswa1 login: SUCCESS!" -ForegroundColor Green
    } catch {
        Write-Host "❌ siswa1 login failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Failed to create sample users: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== DIAGNOSIS COMPLETE ===" -ForegroundColor Green
Write-Host "If login still fails, the issue might be:" -ForegroundColor Yellow
Write-Host "1. Database connection lost" -ForegroundColor White
Write-Host "2. Users table cleared/reset" -ForegroundColor White
Write-Host "3. Backend authentication service issue" -ForegroundColor White
