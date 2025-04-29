@echo off
echo =========================================
echo Microservices Application Setup Script
echo =========================================

:: Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Docker is not installed. Please install Docker and Docker Compose first.
    exit /b 1
)

:: Check if Docker Compose is installed
where docker-compose >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

:: Install dependencies for each service
echo Installing dependencies for all services...

:: User Service
echo Installing dependencies for User Service...
cd .\user-service
call npm install
cd ..

:: Product Service
echo Installing dependencies for Product Service...
cd .\product-service
call npm install
cd ..

:: Order Service
echo Installing dependencies for Order Service...
cd .\order-service
call npm install
cd ..

:: Payment Service
echo Installing dependencies for Payment Service...
cd .\payment-service
call npm install
cd ..

:: Frontend
echo Installing dependencies for Frontend...
cd .\frontend
call npm install
cd ..

:: Build and start Docker containers
echo Building and starting Docker containers...
docker-compose build
docker-compose up -d

echo =========================================
echo Setup completed!
echo The following services are now running:
echo - User Service: http://localhost:3001
echo - Product Service: http://localhost:3002
echo - Order Service: http://localhost:3003
echo - Payment Service: http://localhost:3004
echo - Frontend: http://localhost:3000
echo - RabbitMQ Management UI: http://localhost:15672
echo ========================================= 