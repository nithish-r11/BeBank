# BeBank Windows PowerShell Setup Script for Google Antigravity
$ErrorActionPreference = "Stop"
Write-Host "=== BeBank Digital Banking Platform - PowerShell Setup ===" -ForegroundColor Cyan

$RootDir = Split-Path -Parent $PSScriptRoot
Set-Location "$RootDir\backend"

if (!(Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Green
    python -m venv venv
}

Write-Host "Installing Python dependencies..." -ForegroundColor Green
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\pip.exe install -r requirements.txt

Write-Host "Running Django migrations & seeding BeBank demo database..." -ForegroundColor Green
.\venv\Scripts\python.exe manage.py makemigrations accounts banking cards loans support admin_portal
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py seed_bebank

Set-Location "$RootDir\frontend"
Write-Host "Installing Frontend npm packages..." -ForegroundColor Green
npm install

Write-Host "=== Setup Complete! Run scripts\start_bebank.bat to launch BeBank ===" -ForegroundColor Cyan
