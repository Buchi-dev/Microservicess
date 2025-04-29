# Microservices Application Setup Script
Write-Host "========================================="
Write-Host "Microservices Application Setup Script"
Write-Host "========================================="

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is not installed. Please install Docker and Docker Compose first."
    exit 1
}

# Check if Docker Compose is installed
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
}

# Install dependencies for each service
Write-Host "Installing dependencies for all services..."

# User Service
Write-Host "Installing dependencies for User Service..."
Push-Location -Path .\user-service
npm install
Pop-Location

# Product Service
Write-Host "Installing dependencies for Product Service..."
Push-Location -Path .\product-service
npm install
Pop-Location

# Order Service
Write-Host "Installing dependencies for Order Service..."
Push-Location -Path .\order-service
npm install
Pop-Location

# Payment Service
Write-Host "Installing dependencies for Payment Service..."
Push-Location -Path .\payment-service
npm install
Pop-Location

# Frontend
Write-Host "Installing dependencies for Frontend..."
Push-Location -Path .\frontend
npm install
Pop-Location

# Build and start Docker containers
Write-Host "Building and starting Docker containers..."
docker-compose build
docker-compose up -d

Write-Host "========================================="
Write-Host "Setup completed!"
Write-Host "The following services are now running:"
Write-Host "- User Service: http://localhost:3001"
Write-Host "- Product Service: http://localhost:3002"
Write-Host "- Order Service: http://localhost:3003"
Write-Host "- Payment Service: http://localhost:3004"
Write-Host "- Frontend: http://localhost:3000"
Write-Host "- RabbitMQ Management UI: http://localhost:15672"
Write-Host "=========================================" 