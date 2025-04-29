@echo off
echo ========================================
echo Microservices Local Development Setup
echo ========================================
echo.

REM Check for Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed! Please install Node.js and npm first.
    exit /b 1
)

REM List available services
echo Available services:
echo 1. User Service
echo 2. Product Service
echo 3. Order Service
echo 4. Payment Service
echo 5. Frontend
echo 6. All Services
echo.

set /p service_choice="Which service would you like to set up for development? (1-6): "

echo.
echo Preparing development environment...

REM Create .env files where needed
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

REM Install dependencies based on choice
if "%service_choice%"=="1" (
    echo Setting up User Service...
    cd user-service
    call npm install
    echo.
    echo User Service setup complete!
    echo To start the service, run: cd user-service ^&^& npm run dev
    cd ..
) else if "%service_choice%"=="2" (
    echo Setting up Product Service...
    cd product-service
    call npm install
    echo.
    echo Product Service setup complete!
    echo To start the service, run: cd product-service ^&^& npm run dev
    cd ..
) else if "%service_choice%"=="3" (
    echo Setting up Order Service...
    cd order-service
    call npm install
    echo.
    echo Order Service setup complete!
    echo To start the service, run: cd order-service ^&^& npm run dev
    cd ..
) else if "%service_choice%"=="4" (
    echo Setting up Payment Service...
    cd payment-service
    call npm install
    echo.
    echo Payment Service setup complete!
    echo To start the service, run: cd payment-service ^&^& npm run dev
    cd ..
) else if "%service_choice%"=="5" (
    echo Setting up Frontend...
    cd frontend
    call npm install
    echo.
    echo Frontend setup complete!
    echo To start the frontend, run: cd frontend ^&^& npm run dev
    cd ..
) else if "%service_choice%"=="6" (
    echo Setting up all services...
    
    echo Installing User Service dependencies...
    cd user-service
    call npm install
    cd ..
    
    echo Installing Product Service dependencies...
    cd product-service
    call npm install
    cd ..
    
    echo Installing Order Service dependencies...
    cd order-service
    call npm install
    cd ..
    
    echo Installing Payment Service dependencies...
    cd payment-service
    call npm install
    cd ..
    
    echo Installing Frontend dependencies...
    cd frontend
    call npm install
    cd ..
    
    echo.
    echo All services setup complete!
) else (
    echo Invalid choice! Please run the script again with a valid option (1-6).
    exit /b 1
)

echo.
echo ========================================
echo Development environment setup complete!
echo ========================================
echo.
echo NOTE: For services to communicate properly, you'll need RabbitMQ running.
echo You can use Docker to run just RabbitMQ with:
echo docker-compose up -d rabbitmq
echo.
echo To start any service in development mode: cd [service-directory] ^&^& npm run dev
echo.
pause 