@echo off
cd /d "%~dp0"
git pull
set /p pesan=Pesan commit: 
git add .
git commit -m "%pesan%"
git push
pause