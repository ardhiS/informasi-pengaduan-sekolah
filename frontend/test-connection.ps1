# Frontend-Backend Connection Test Script
# PowerShell script untuk test koneksi

Write-Host "🔍 Testing Frontend-Backend Connection..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Yellow

# Test 1: Check if backend is running
Write-Host "`n1. Testing Backend Server..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend is RUNNING on http://localhost:5000" -ForegroundColor Green
    $backendStatus = $true
} catch {
    Write-Host "❌ Backend is NOT RUNNING" -ForegroundColor Red
    Write-Host "   Please start backend with: npm run start:dev" -ForegroundColor Yellow
    $backendStatus = $false
}

# Test 2: Test Authentication Endpoint
if ($backendStatus) {
    Write-Host "`n2. Testing Authentication Endpoint..." -ForegroundColor Yellow
    try {
        $authBody = @{
            username = "testuser"
            password = "wrongpassword"
        } | ConvertTo-Json

        Invoke-RestMethod -Uri "http://localhost:5000/authentications" -Method POST -Body $authBody -ContentType "application/json" -TimeoutSec 5
    } catch {
        if ($_.Exception.Response.StatusCode -eq 400 -or $_.Exception.Response.StatusCode -eq 401) {
            Write-Host "✅ Authentication endpoint is RESPONSIVE" -ForegroundColor Green
        } else {
            Write-Host "❌ Authentication endpoint error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    # Test 3: Test Protected Endpoints
    Write-Host "`n3. Testing Protected Endpoints..." -ForegroundColor Yellow
    
    $endpoints = @(
        @{name="Users"; url="http://localhost:5000/users"},
        @{name="Classes"; url="http://localhost:5000/classes"},
        @{name="Subjects"; url="http://localhost:5000/subjects"}
    )

    foreach ($endpoint in $endpoints) {
        try {
            Invoke-RestMethod -Uri $endpoint.url -Method GET -TimeoutSec 5
            Write-Host "❌ $($endpoint.name) endpoint is NOT PROTECTED" -ForegroundColor Red
        } catch {
            if ($_.Exception.Response.StatusCode -eq 401) {
                Write-Host "✅ $($endpoint.name) endpoint is PROTECTED (requires auth)" -ForegroundColor Green
            } else {
                Write-Host "⚠️  $($endpoint.name) endpoint error: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
            }
        }
    }
}

# Test 4: Check Frontend Dependencies
Write-Host "`n4. Checking Frontend Dependencies..." -ForegroundColor Yellow
if (Test-Path ".\node_modules") {
    Write-Host "✅ Frontend dependencies are INSTALLED" -ForegroundColor Green
    $depsStatus = $true
} else {
    Write-Host "❌ Frontend dependencies NOT INSTALLED" -ForegroundColor Red
    Write-Host "   Please run: npm install" -ForegroundColor Yellow
    $depsStatus = $false
}

# Test 5: Check Frontend Configuration
Write-Host "`n5. Checking Frontend Configuration..." -ForegroundColor Yellow
if (Test-Path ".\vite.config.js") {
    $viteConfig = Get-Content ".\vite.config.js" -Raw
    if ($viteConfig -match "localhost:5000") {
        Write-Host "✅ Vite proxy is CONFIGURED for backend" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Vite proxy configuration may need review" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Vite configuration NOT FOUND" -ForegroundColor Red
}

# Summary
Write-Host "`n============================================" -ForegroundColor Yellow
Write-Host "📊 CONNECTION TEST SUMMARY" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Yellow

if ($backendStatus) {
    Write-Host "✅ Backend Status: READY" -ForegroundColor Green
} else {
    Write-Host "❌ Backend Status: NOT READY" -ForegroundColor Red
}

if ($depsStatus) {
    Write-Host "✅ Frontend Dependencies: READY" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend Dependencies: NOT READY" -ForegroundColor Red
}

if ($backendStatus -and $depsStatus) {
    Write-Host "`n🚀 READY TO START!" -ForegroundColor Green
    Write-Host "Run these commands in separate terminals:" -ForegroundColor Yellow
    Write-Host "1. Backend:  cd .. && npm run start:dev" -ForegroundColor Cyan
    Write-Host "2. Frontend: npm run dev" -ForegroundColor Cyan
    Write-Host "3. Open:     http://localhost:3000" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️  SETUP REQUIRED" -ForegroundColor Yellow
    Write-Host "Please fix the issues above before starting." -ForegroundColor Yellow
}
