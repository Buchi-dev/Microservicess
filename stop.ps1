# Microservices System Shutdown
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  Stopping Microservices System" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Stop all services
Write-Host "Stopping all services..." -ForegroundColor Yellow
docker-compose down

# Optional: Remove volumes (uncomment if needed)
# Write-Host "Removing volumes..." -ForegroundColor Yellow
# docker-compose down -v

# Perform basic cleanup
Write-Host "Performing basic cleanup..." -ForegroundColor Yellow
docker container prune -f
docker image prune -f

Write-Host "All services have been stopped and cleaned up." -ForegroundColor Green
Write-Host "For a more thorough cleanup, run .\docker-cleanup.ps1" -ForegroundColor Yellow 