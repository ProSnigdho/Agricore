@echo off
echo Starting AgriCore Backend...
cd /d %~dp0
call .\venv\Scripts\activate
python backend/manage.py runserver
pause
