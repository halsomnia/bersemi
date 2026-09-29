@echo off
set /p pesan=Pesan commit: 
git add .
git commit -m "%pesan%"
git push
pause