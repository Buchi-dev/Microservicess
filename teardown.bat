@echo off
setlocal enabledelayedexpansion

echo ===========================================
echo      Microservices Teardown Script         
echo ===========================================

REM Stop and remove all Docker containers
echo Stopping and removing Docker containers...
docker-compose down

REM Remove Docker volumes (optional)
set /p REMOVE_VOLUMES=Do you want to remove Docker volumes as well? (y/n): 
if /i "!REMOVE_VOLUMES!"=="y" (
    echo Removing Docker volumes...
    docker-compose down -v
    echo Docker volumes removed.
)

REM Remove Docker images (optional) 
set /p REMOVE_IMAGES=Do you want to remove Docker images as well? (y/n): 
if /i "!REMOVE_IMAGES!"=="y" (
    echo Removing Docker images...
    for /f "tokens=*" %%i in ('docker images -q microservices_* 2^>nul') do (
        docker rmi %%i 2>nul
    )
    echo Docker images removed.
)

echo ===========================================
echo            Teardown completed!             
echo =========================================== 