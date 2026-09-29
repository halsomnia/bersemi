@echo off
set /p pesan=Pesan commit: 
git add .
git commit -m "perubahan"
git push
pause