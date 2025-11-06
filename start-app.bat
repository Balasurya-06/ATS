@echo off
echo Starting ATS Application...
echo.

:: Start the backend server
echo Starting Backend Server...
start cmd /k "cd backend && npm install && npm start"

:: Wait for a moment to let backend initialize
timeout /t 5 /nobreak

:: Start the frontend application
echo Starting Frontend...
start cmd /k "npm install && npm start"

echo.
echo Application startup initiated! 
echo.
echo Press any key to exit this window...
pause > nul