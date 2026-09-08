@echo off
setlocal

echo ===================================================
echo EduTrack Safe Shutdown
echo ===================================================

echo Attempting to gracefully terminate all EduTrack services started by the launcher...

:: We force terminate any command window that was given our specific titles.
:: The /T flag ensures all child processes (java, node, python) are killed cleanly.

taskkill /FI "WINDOWTITLE eq EduTrack-Eureka*" /T /F 2>nul
taskkill /FI "WINDOWTITLE eq EduTrack-UserService*" /T /F 2>nul
taskkill /FI "WINDOWTITLE eq EduTrack-ActivityService*" /T /F 2>nul
taskkill /FI "WINDOWTITLE eq EduTrack-MLService*" /T /F 2>nul
taskkill /FI "WINDOWTITLE eq EduTrack-APIGateway*" /T /F 2>nul
taskkill /FI "WINDOWTITLE eq EduTrack-Frontend*" /T /F 2>nul
:: Note: EduTrack-MongoDB is excluded to avoid killing the database

echo.
echo Shutdown complete. MongoDB and Oracle were NOT stopped.
echo ===================================================
pause
