# Docker Cleanup Script
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  Docker System Cleanup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Stop all running containers
Write-Host "Stopping all running containers..." -ForegroundColor Yellow
docker stop $(docker ps -q)

# Remove all stopped containers
Write-Host "Removing stopped containers..." -ForegroundColor Yellow
docker container prune -f

# Remove unused images
Write-Host "Removing unused images..." -ForegroundColor Yellow
docker image prune -f

# Remove unused volumes
Write-Host "Removing unused volumes..." -ForegroundColor Yellow
docker volume prune -f

# Remove unused networks
Write-Host "Removing unused networks..." -ForegroundColor Yellow
docker network prune -f

# Full system prune (optional, commented out by default)
# Write-Host "Performing full system prune..." -ForegroundColor Red
# docker system prune -a -f --volumes

# Show Docker disk usage
Write-Host "Current Docker disk usage:" -ForegroundColor Green
docker system df

Write-Host "=====================================" -ForegroundColor Green
Write-Host "  Docker cleanup completed!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green 