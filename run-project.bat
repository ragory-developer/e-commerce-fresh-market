@echo off
title FreshCart Full-Stack Runner
echo ===================================================
echo 🚀 Launching FreshCart Full-Stack E-Commerce Platform
echo ===================================================
echo.
echo Starting Backend API Server (Port 5000)...
start "FreshCart Backend API" cmd /k "cd backend && npm run dev"
echo.
echo Starting Frontend Client (Port 3000)...
start "FreshCart Frontend Client" cmd /k "cd frontend && npm run dev"
echo.
echo ===================================================
echo 🎉 Both servers launched in separate terminal windows!
echo backend: http://localhost:5000
echo frontend: http://localhost:3000
echo ===================================================
pause
