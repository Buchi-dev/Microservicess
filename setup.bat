@echo off
echo ========================================
echo Microservices Application Setup
echo ========================================
echo.

REM Check if Docker is running
echo Checking if Docker is running...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running! Please start Docker Desktop and try again.
    exit /b 1
)
echo Docker is running!
echo.

REM Create .env files from examples if they don't exist
echo Setting up environment files...
if not exist "user-service\.env" (
    if exist "user-service\.env.example" (
        copy "user-service\.env.example" "user-service\.env"
        echo Created user-service/.env
    )
)

if not exist "product-service\.env" (
    if exist "product-service\.env.example" (
        copy "product-service\.env.example" "product-service\.env"
        echo Created product-service/.env
    )
)

if not exist "order-service\.env" (
    if exist "order-service\.env.example" (
        copy "order-service\.env.example" "order-service\.env"
        echo Created order-service/.env
    )
)

if not exist "payment-service\.env" (
    if exist "payment-service\.env.example" (
        copy "payment-service\.env.example" "payment-service\.env"
        echo Created payment-service/.env
    )
)

if not exist "frontend\.env" (
    if exist "frontend\.env.example" (
        copy "frontend\.env.example" "frontend\.env"
        echo Created frontend/.env
    ) else (
        echo VITE_API_USER_URL=http://localhost:3001> "frontend\.env"
        echo VITE_API_PRODUCT_URL=http://localhost:3002>> "frontend\.env"
        echo VITE_API_ORDER_URL=http://localhost:3003>> "frontend\.env"
        echo VITE_API_PAYMENT_URL=http://localhost:3004>> "frontend\.env"
        echo Created frontend/.env with default values
    )
)
echo.

REM Ask user if they want to build or pull images
echo How would you like to set up the application?
echo 1. Build Docker images locally (slower but ensures latest code)
echo 2. Pull pre-built Docker images if available (faster)
choice /c 12 /n /m "Enter your choice (1 or 2): "

if errorlevel 2 (
    echo.
    echo Pulling Docker images...
    docker-compose pull
) else (
    echo.
    echo Building Docker images...
    docker-compose build
)

echo.
echo Starting services...
docker-compose up -d

echo.
echo ========================================
echo Setup complete! Services are starting...
echo ========================================
echo.
echo The application should be accessible at: http://localhost:3000
echo RabbitMQ Management UI: http://localhost:15672 (guest/guest)
echo.
echo To stop the application, run: teardown.bat
echo To view logs, run: docker-compose logs -f
echo.
pause 