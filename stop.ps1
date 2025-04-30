# Microservices System Shutdown
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  Stopping Microservices System" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Stop all services
Write-Host "Stopping all services..." -ForegroundColor Yellow
docker-compose down

Write-Host "All services have been stopped." -ForegroundColor Green 