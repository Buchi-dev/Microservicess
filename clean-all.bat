@echo off
echo ========================================
echo Complete Microservices Codebase Cleanup
echo ========================================
echo.

echo This script will perform a complete cleanup of the codebase:
echo 1. Stop and remove Docker containers
echo 2. Clean build artifacts and node_modules
echo 3. Identify unused dependencies
echo 4. Find potentially unused files
echo.

set /p confirm="Continue with complete cleanup? (y/n): "
if /i not "%confirm%"=="y" exit /b 0

echo.
echo Step 1: Stopping and removing Docker containers...
docker-compose down
echo Docker containers stopped.
echo.

echo Step 2: Cleaning build artifacts and node_modules...
echo Removing node_modules folders...
for /d /r . %%d in (node_modules) do @if exist "%%d" echo Removing: %%d && rmdir /s /q "%%d"

echo Removing build artifacts...
for /d /r . %%d in (build dist .next out) do @if exist "%%d" echo Removing: %%d && rmdir /s /q "%%d"

echo Removing cache folders...
for /d /r . %%d in (.cache .parcel-cache) do @if exist "%%d" echo Removing: %%d && rmdir /s /q "%%d"

echo Removing log files...
del /s /q *.log
echo.

echo Step 3: Identifying unused dependencies...
echo Running dependency analysis...
call node dep-cleaner.js > unused-dependencies.txt
echo Results saved to unused-dependencies.txt
echo.

echo Step 4: Finding potentially unused files...
echo Results will be saved to unused_files.txt
echo.

type nul > unused_files.txt

REM Find all JS/TS/JSX/TSX files
dir /s /b *.js *.jsx *.ts *.tsx | findstr /v "node_modules" | findstr /v "\.git" > all_files.txt

REM Check each file to see if it's imported elsewhere
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

echo Step 5: Finding large files...
echo Finding files larger than 10MB...
echo Results will be saved to large_files.txt
echo.

dir /s /b /a-d | findstr /v "node_modules" | findstr /v "\.git" > temp_files.txt
type nul > large_files.txt

for /f "tokens=*" %%f in (temp_files.txt) do (
    for %%a in ("%%f") do (
        if %%~za GTR 10485760 (
            echo %%f [%%~za bytes] >> large_files.txt
            echo Found large file: %%f [%%~za bytes]
        )
    )
)

del temp_files.txt
echo.

echo ========================================
echo Cleanup complete!
echo ========================================
echo.
echo Please review these files for cleanup recommendations:
echo - unused-dependencies.txt: Potentially unused npm packages
echo - unused_files.txt: Files that might not be used anywhere
echo - large_files.txt: Files larger than 10MB
echo.
echo To restart the application after making changes, run:
echo   setup.bat
echo.
pause 