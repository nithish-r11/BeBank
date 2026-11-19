@echo off
title BeBank - Start Digital Banking Platform
echo ============================================================================
echo   Starting BeBank Backend (Django :8000) and Frontend (React :5173)...
echo ============================================================================

start "BeBank Django Backend (:8000)" cmd /k "cd /d "%~dp0..\backend" && call venv\Scripts\activate.bat && python manage.py runserver 127.0.0.1:8000"
timeout /t 3 /nobreak >nul
start "BeBank React Frontend (:5173)" cmd /k "cd /d "%~dp0..\frontend" && npm run dev -- --port 5173 --open"

echo Both servers have been launched in separate terminal windows!
echo - Customer & Admin Web App: http://localhost:5173
echo - Backend API Documentation: http://127.0.0.1:8000/api/docs/
