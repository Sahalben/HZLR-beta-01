# run_dev.ps1
# Helper script to launch the full HZLR stack simultaneously

Write-Host "============================================="
Write-Host "Starting HZLR Production Dev Servers..."
Write-Host "============================================="

# Start Backend API
Write-Host "Booting Backend API (Express on Port 4000)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\api; npm install; npx prisma db push; npx prisma generate; npx ts-node src/index.ts"

# Start Frontend Web
Write-Host "Booting Frontend Web App (Vite)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\web; npm install; npm run dev"

Write-Host "Done! The application windows should be open."
Write-Host "You can view the full stack by visiting http://localhost:8080"
