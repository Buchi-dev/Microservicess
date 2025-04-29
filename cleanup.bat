@echo off
echo ========================================
echo Microservices Codebase Cleanup Utility
echo ========================================
echo.

echo This utility will help you clean the codebase by:
echo  - Removing node_modules folders
echo  - Clearing build artifacts and cache
echo  - Finding and optionally removing unused files
echo.

:MENU
echo Select an operation:
echo 1. Basic cleanup (node_modules, build files, logs)
echo 2. Find large files
echo 3. Find potentially unused files
echo 4. Remove Docker containers, volumes, and images
echo 5. Full cleanup (all of the above)
echo 6. Exit
echo.

set /p choice="Enter your choice (1-6): "
echo.

if "%choice%"=="1" goto BASIC_CLEANUP
if "%choice%"=="2" goto FIND_LARGE_FILES
if "%choice%"=="3" goto FIND_UNUSED_FILES
if "%choice%"=="4" goto DOCKER_CLEANUP
if "%choice%"=="5" goto FULL_CLEANUP
if "%choice%"=="6" goto EXIT
echo Invalid choice. Please try again.
goto MENU

:BASIC_CLEANUP
echo Running basic cleanup...

echo Removing node_modules folders...
for /d /r . %%d in (node_modules) do @if exist "%%d" echo Removing: %%d && rmdir /s /q "%%d"

echo Removing build artifacts...
for /d /r . %%d in (build dist .next out) do @if exist "%%d" echo Removing: %%d && rmdir /s /q "%%d"

echo Removing cache folders...
for /d /r . %%d in (.cache .parcel-cache) do @if exist "%%d" echo Removing: %%d && rmdir /s /q "%%d"

echo Removing log files...
del /s /q *.log

echo Basic cleanup complete!
echo.
goto MENU

:FIND_LARGE_FILES
echo Finding large files (greater than 10MB)...
echo Results will be saved to large_files.txt
echo.

dir /s /b /a-d | findstr /v "node_modules" | findstr /v "\.git" > temp_files.txt
type nul > large_files.txt

for /f "tokens=*" %%f in (temp_files.txt) do (
    for %%a in ("%%f") do (
        if %%~za GTR 10485760 (
            echo %%f [%%~za bytes] >> large_files.txt
            echo Found: %%f [%%~za bytes]
        )
    )
)

del temp_files.txt
echo.
echo Large files have been listed in large_files.txt
echo.
goto MENU

:FIND_UNUSED_FILES
echo This will attempt to find potentially unused files by checking:
echo  - JavaScript files not imported anywhere
echo  - Components that might not be used
echo.
echo NOTE: This is a heuristic approach and might have false positives.
echo       Manual review is recommended before deletion.
echo.

set /p confirm="Continue? (y/n): "
if /i not "%confirm%"=="y" goto MENU

echo Searching for potentially unused files...
echo Results will be saved to unused_files.txt
echo.

type nul > unused_files.txt

REM Find all JS/TS/JSX/TSX files
dir /s /b *.js *.jsx *.ts *.tsx | findstr /v "node_modules" | findstr /v "\.git" > all_files.txt

REM Check each file to see if it's imported elsewhere
for /f "tokens=*" %%f in (all_files.txt) do (
    set "file_name=%%~nf"
    set "found=0"
    
    REM Extract filename without extension
    for %%a in ("%%f") do set "file_name=%%~na"
    
    findstr /s /m /c:"import.*%%~nf" *.js *.jsx *.ts *.tsx | findstr /v "%%f" > nul
    if errorlevel 1 (
        findstr /s /m /c:"require.*%%~nf" *.js *.jsx *.ts *.tsx | findstr /v "%%f" > nul
        if errorlevel 1 (
            echo %%f >> unused_files.txt
            echo Potentially unused: %%f
            set "found=1"
        )
    )
)

del all_files.txt
echo.
echo Potentially unused files have been listed in unused_files.txt
echo Please review this file carefully before deleting anything!
echo.
goto MENU

:DOCKER_CLEANUP
echo This will remove Docker containers, volumes, and images related to the project.
echo.
set /p confirm="Continue? (y/n): "
if /i not "%confirm%"=="y" goto MENU

echo Stopping and removing containers...
docker-compose down

set /p removeVolumes="Remove volumes? (y/n): "
if /i "%removeVolumes%"=="y" (
    echo Removing volumes...
    docker-compose down -v
)

set /p removeImages="Remove project images? (y/n): "
if /i "%removeImages%"=="y" (
    echo Removing project images...
    for /f "tokens=*" %%i in ('docker images "microservices_*" -q') do (
        docker rmi %%i
    )
)

echo Docker cleanup complete!
echo.
goto MENU

:FULL_CLEANUP
echo Running full cleanup process...
echo.

REM Basic cleanup
echo Step 1: Basic cleanup...
call :BASIC_CLEANUP_HELPER

REM Large files
echo Step 2: Finding large files...
echo Finding large files (greater than 10MB)...
echo Results will be saved to large_files.txt
echo.

dir /s /b /a-d | findstr /v "node_modules" | findstr /v "\.git" > temp_files.txt
type nul > large_files.txt

for /f "tokens=*" %%f in (temp_files.txt) do (
    for %%a in ("%%f") do (
        if %%~za GTR 10485760 (
            echo %%f [%%~za bytes] >> large_files.txt
            echo Found: %%f [%%~za bytes]
        )
    )
)

del temp_files.txt
echo.

REM Find unused files
echo Step 3: Finding potentially unused files...
echo Results will be saved to unused_files.txt
echo.

type nul > unused_files.txt

dir /s /b *.js *.jsx *.ts *.tsx | findstr /v "node_modules" | findstr /v "\.git" > all_files.txt

for /f "tokens=*" %%f in (all_files.txt) do (
    set "file_name=%%~nf"
    set "found=0"
    
    findstr /s /m /c:"import.*%%~nf" *.js *.jsx *.ts *.tsx | findstr /v "%%f" > nul
    if errorlevel 1 (
        findstr /s /m /c:"require.*%%~nf" *.js *.jsx *.ts *.tsx | findstr /v "%%f" > nul
        if errorlevel 1 (
            echo %%f >> unused_files.txt
            echo Potentially unused: %%f
        )
    )
)

del all_files.txt
echo.

REM Docker cleanup
echo Step 4: Docker cleanup...
echo Stopping and removing containers...
docker-compose down

echo Full cleanup complete!
echo Please review large_files.txt and unused_files.txt before deleting any files.
echo.
goto MENU

:BASIC_CLEANUP_HELPER
echo Removing node_modules folders...
for /d /r . %%d in (node_modules) do @if exist "%%d" echo Removing: %%d && rmdir /s /q "%%d"

echo Removing build artifacts...
for /d /r . %%d in (build dist .next out) do @if exist "%%d" echo Removing: %%d && rmdir /s /q "%%d"

echo Removing cache folders...
for /d /r . %%d in (.cache .parcel-cache) do @if exist "%%d" echo Removing: %%d && rmdir /s /q "%%d"

echo Removing log files...
del /s /q *.log
exit /b

:EXIT
echo Exiting cleanup utility...
exit /b 0 