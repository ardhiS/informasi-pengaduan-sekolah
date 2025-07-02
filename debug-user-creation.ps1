# Direct Database User Creation Script
$baseUrl = "http://localhost:3000"

Write-Host "=== DIRECT USER CREATION ===" -ForegroundColor Green

# Create a simple admin user directly via sample-data endpoint with detailed debugging
try {
    Write-Host "Attempting to create user via sample-data endpoint..." -ForegroundColor Yellow
    
    $payload = @{
        count = @{
            admin = 1
            guru = 0
            siswa = 0
        }
    } | ConvertTo-Json -Depth 3
    
    Write-Host "Payload: $payload" -ForegroundColor Cyan
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/sample-data/users" -Method POST -Body $payload -ContentType "application/json" -Verbose
    
    Write-Host "Response received:" -ForegroundColor Green
    Write-Host "$($response | ConvertTo-Json -Depth 3)" -ForegroundColor Cyan
    
    # Extract the created usernames from response
    if ($response.status -eq "success") {
        Write-Host "Users created successfully!" -ForegroundColor Green
        
        # Test with the created username pattern
        $testUsernames = @("admin1", "admin01", "Administrator 1")
        
        foreach ($testUser in $testUsernames) {
            Write-Host "Testing login with: $testUser" -ForegroundColor Yellow
            try {
                $loginData = @{
                    username = $testUser
                    password = "password123"
                } | ConvertTo-Json
                
                $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/authentications" -Method POST -Body $loginData -ContentType "application/json"
                Write-Host "✅ SUCCESS! Login works with: $testUser" -ForegroundColor Green
                Write-Host "Use this for frontend login!" -ForegroundColor Cyan
                break
            } catch {
                Write-Host "❌ Failed with: $testUser - $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
    
} catch {
    Write-Host "❌ Sample-data endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Error details: $($_.Exception.Response)" -ForegroundColor Red
}
