# Microservices Teardown Script
Write-Host "==========================================="
Write-Host "     Microservices Teardown Script         "
Write-Host "==========================================="

# Stop and remove all Docker containers
Write-Host "Stopping and removing Docker containers..."
docker-compose down

# Remove Docker volumes (optional)
$removeVolumes = Read-Host "Do you want to remove Docker volumes as well? (y/n)"
if ($removeVolumes -eq 'y') {
    Write-Host "Removing Docker volumes..."
    docker-compose down -v
    Write-Host "Docker volumes removed."
}

# Remove Docker images (optional)
$removeImages = Read-Host "Do you want to remove Docker images as well? (y/n)"
if ($removeImages -eq 'y') {
    Write-Host "Removing Docker images..."
    $images = docker images --format "{{.Repository}}" | Where-Object { $_ -like "microservices_*" }
    foreach ($image in $images) {
        docker rmi $image
    }
    Write-Host "Docker images removed."
}

Write-Host "==========================================="
Write-Host "           Teardown completed!             "
Write-Host "===========================================" 