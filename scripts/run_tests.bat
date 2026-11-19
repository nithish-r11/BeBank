@echo off
title BeBank - Automated Test Suite
echo Running BeBank Django Backend Automated Tests...
cd /d "%~dp0..\backend"
call venv\Scripts\activate.bat
python manage.py test --verbosity=2
echo.
echo Building React Frontend to verify zero compile/bundle errors...
cd /d "%~dp0..\frontend"
call npm run build
