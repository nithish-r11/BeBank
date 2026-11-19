@echo off
title BeBank - Automated Windows Setup
echo ============================================================================
echo   BeBank Digital Banking Platform - Automated Windows Setup
echo   Theme: Navy Blue (#173B73) ^| Emerald Green (#079669) ^| White (#FFFFFF)
echo ============================================================================
echo.

echo [1/5] Checking Python & Node.js installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH. Please let Google Antigravity install Python 3.11+.
    exit /b 1
)
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH. Please let Google Antigravity install Node.js 18+.
    exit /b 1
)

echo [2/5] Setting up Python Virtual Environment in /backend...
cd /d "%~dp0..\backend"
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt

echo [3/5] Running Database Migrations...
python manage.py makemigrations accounts banking cards loans support admin_portal
python manage.py migrate

echo [4/5] Seeding Demo Banking Accounts, Cards, Deposits, Loans & Admin Portal...
python manage.py seed_bebank

echo [5/5] Installing React + Tailwind CSS Frontend Dependencies in /frontend...
cd /d "%~dp0..\frontend"
call npm install

echo.
echo ============================================================================
echo   BeBank Setup Completed Successfully!
echo   Run scripts\start_bebank.bat to launch both Backend and Frontend.
echo ============================================================================
