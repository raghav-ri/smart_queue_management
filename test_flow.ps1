# Test Script for Smart Queue Management System APIs

Write-Host "--- 1. Registering Admin ---"
$registerAdminBody = @{
    name = "System Admin"
    email = "admin@qflow.com"
    password = "adminpassword"
    phone = "1234567890"
    role = "ROLE_ADMIN"
} | ConvertTo-Json

try {
    $regAdminRes = Invoke-RestMethod -Uri "http://localhost:8080/auth/register" -Method Post -ContentType "application/json" -Body $registerAdminBody
    Write-Host "Admin registration response:"
    $regAdminRes | ConvertTo-Json
} catch {
    Write-Host "Admin registration failed or already exists: $_"
}

Write-Host "`n--- 2. Logging in as Admin ---"
$loginAdminBody = @{
    email = "admin@qflow.com"
    password = "adminpassword"
} | ConvertTo-Json

$loginAdminRes = Invoke-RestMethod -Uri "http://localhost:8080/auth/login" -Method Post -ContentType "application/json" -Body $loginAdminBody
Write-Host "Admin login successful. Token received: $($loginAdminRes.token.Substring(0, 15))..."

$adminHeaders = @{
    Authorization = "Bearer $($loginAdminRes.token)"
}

Write-Host "`n--- 3. Creating Service Counter ---"
$counterBody = @{
    name = "General Enquiry Counter 1"
    department = "Support Desk"
} | ConvertTo-Json

$counterRes = Invoke-RestMethod -Uri "http://localhost:8080/admin/counter" -Method Post -ContentType "application/json" -Headers $adminHeaders -Body $counterBody
Write-Host "Counter created successfully:"
$counterRes | ConvertTo-Json

Write-Host "`n--- 4. Activating/Opening Service Counter ---"
$statusRes = Invoke-RestMethod -Uri "http://localhost:8080/admin/counter/$($counterRes.id)/status?status=ACTIVE" -Method Put -Headers $adminHeaders
Write-Host "Counter activated status: $($statusRes.status)"

Write-Host "`n--- 5. Registering Customer ---"
$registerCustBody = @{
    name = "Alice Smith"
    email = "alice@gmail.com"
    password = "alicepassword"
    phone = "9876543210"
    role = "ROLE_USER"
} | ConvertTo-Json

try {
    $regCustRes = Invoke-RestMethod -Uri "http://localhost:8080/auth/register" -Method Post -ContentType "application/json" -Body $registerCustBody
    Write-Host "Customer registration response:"
    $regCustRes | ConvertTo-Json
} catch {
    Write-Host "Customer registration failed or already exists: $_"
}

Write-Host "`n--- 6. Logging in as Customer ---"
$loginCustBody = @{
    email = "alice@gmail.com"
    password = "alicepassword"
} | ConvertTo-Json

$loginCustRes = Invoke-RestMethod -Uri "http://localhost:8080/auth/login" -Method Post -ContentType "application/json" -Body $loginCustBody
Write-Host "Customer login successful. Token received: $($loginCustRes.token.Substring(0, 15))..."

$custHeaders = @{
    Authorization = "Bearer $($loginCustRes.token)"
}

Write-Host "`n--- 7. Joining Counter Queue ---"
$joinBody = @{
    counterId = $counterRes.id
} | ConvertTo-Json

try {
    $joinRes = Invoke-RestMethod -Uri "http://localhost:8080/queue/join" -Method Post -ContentType "application/json" -Headers $custHeaders -Body $joinBody
    Write-Host "Joined queue ticket details:"
    $joinRes | ConvertTo-Json
} catch {
    Write-Host "Failed to join queue (perhaps active ticket already exists): $_"
    try {
        Write-Host "Fetching existing active ticket..."
        $myRes = Invoke-RestMethod -Uri "http://localhost:8080/queue/my" -Method Get -Headers $custHeaders
        $myRes | ConvertTo-Json
    } catch {
        Write-Host "No active ticket found either."
    }
}
