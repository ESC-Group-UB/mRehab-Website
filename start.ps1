# PowerShell script to start both backend and frontend servers in new terminal windows

$backend = "$PSScriptRoot\server"
$frontend = "$PSScriptRoot\mrehab"

Write-Host "Starting backend server at $backend" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$backend`"; npm install; npm run dev"

Write-Host "Starting frontend server at $frontend" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$frontend`"; npm install; npm start"

Write-Host "`n Both servers launched in new PowerShell windows." -ForegroundColor Magenta
