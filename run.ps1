# Microservices System Launcher
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  Microservices System Launcher" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "Docker is not running. Please start Docker and try again." -ForegroundColor Yellow
    Exit 1
}

# Install dependencies for shared module
Write-Host "Installing dependencies for shared module..." -ForegroundColor Green
Push-Location -Path "shared"
npm install
Pop-Location

# Install dependencies for frontend
Write-Host "Installing dependencies for frontend..." -ForegroundColor Green
Push-Location -Path "frontend"
npm install
Pop-Location

# Install dependencies for backend services
Write-Host "Installing dependencies for backend services..." -ForegroundColor Green

# User Service
Write-Host "Installing dependencies for user-service..." -ForegroundColor Green
Push-Location -Path "server/user-service"
npm install
Pop-Location

# Product Service
Write-Host "Installing dependencies for product-service..." -ForegroundColor Green
Push-Location -Path "server/product-service"
npm install
Pop-Location

# Order Service
Write-Host "Installing dependencies for order-service..." -ForegroundColor Green
Push-Location -Path "server/order-service"
npm install
Pop-Location

# Payment Service
Write-Host "Installing dependencies for payment-service..." -ForegroundColor Green
Push-Location -Path "server/payment-service"
npm install
Pop-Location

# Stop any existing containers
Write-Host "Stopping any existing containers..." -ForegroundColor Green
docker-compose down

# Build and start all services
Write-Host "Building and starting all services..." -ForegroundColor Green
docker-compose up --build -d

# Show status
Write-Host "Services status:" -ForegroundColor Green
docker-compose ps

Write-Host "=====================================" -ForegroundColor Green
Write-Host "All services are now running!" -ForegroundColor Green
Write-Host " - Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host " - User API: http://localhost:3001" -ForegroundColor Green
Write-Host " - Product API: http://localhost:3002" -ForegroundColor Green
Write-Host " - Order API: http://localhost:3003" -ForegroundColor Green
Write-Host " - Payment API: http://localhost:3004" -ForegroundColor Green
Write-Host " - RabbitMQ Dashboard: http://localhost:15672" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "To stop all services, run: .\stop.ps1" -ForegroundColor Yellow 