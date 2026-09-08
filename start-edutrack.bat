@echo off
setlocal

echo ===================================================
echo EduTrack One-Click Startup
echo ===================================================

echo [1/7] Checking MongoDB...
netstat -ano | findstr :27017 >nul
if %errorlevel% equ 0 goto mongo_running
echo MongoDB is not running. Starting MongoDB...
start "EduTrack-MongoDB" cmd /c "mongod"
ping 127.0.0.1 -n 3 >nul
:mongo_running
echo MongoDB is ready.

echo [2/7] Starting Eureka Server...
netstat -ano | findstr :8761 >nul
if %errorlevel% equ 0 goto eureka_running
start "EduTrack-Eureka" cmd /c "cd /d D:\eduTrack_structure\EduTrack\backend\eureka-server && mvnw spring-boot:run"
echo Waiting for Eureka to become available on 8761...
:wait_eureka
ping 127.0.0.1 -n 2 >nul
netstat -ano | findstr :8761 >nul
if %errorlevel% neq 0 goto wait_eureka
:eureka_running
echo Eureka is UP!

echo [3/7] Starting Microservices (User, Activity, ML)...
netstat -ano | findstr :8081 >nul
if %errorlevel% equ 0 goto user_running
start "EduTrack-UserService" cmd /c "cd /d D:\eduTrack_structure\EduTrack\backend\user-service && mvnw spring-boot:run"
:user_running

netstat -ano | findstr :8082 >nul
if %errorlevel% equ 0 goto activity_running
start "EduTrack-ActivityService" cmd /c "cd /d D:\eduTrack_structure\EduTrack\backend\activity-service && mvnw spring-boot:run"
:activity_running

netstat -ano | findstr :8000 >nul
if %errorlevel% equ 0 goto ml_running
start "EduTrack-MLService" cmd /c "cd /d D:\eduTrack_structure\EduTrack\backend\ml-service && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
:ml_running

echo Waiting for User, Activity, and ML services to be ready...
:wait_microservices
ping 127.0.0.1 -n 2 >nul
netstat -ano | findstr :8081 >nul
if %errorlevel% neq 0 goto wait_microservices
netstat -ano | findstr :8082 >nul
if %errorlevel% neq 0 goto wait_microservices
netstat -ano | findstr :8000 >nul
if %errorlevel% neq 0 goto wait_microservices
echo Microservices are UP!

echo [4/7] Starting API Gateway...
netstat -ano | findstr :8080 >nul
if %errorlevel% equ 0 goto gateway_running
start "EduTrack-APIGateway" cmd /c "cd /d D:\eduTrack_structure\EduTrack\backend\api-gateway && mvnw spring-boot:run"
echo Waiting for API Gateway to become available on 8080...
:wait_gateway
ping 127.0.0.1 -n 2 >nul
netstat -ano | findstr :8080 >nul
if %errorlevel% neq 0 goto wait_gateway
:gateway_running
echo API Gateway is UP!

echo [5/7] Starting React Frontend...
netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 goto frontend_running
start "EduTrack-Frontend" cmd /c "cd /d D:\eduTrack_structure\EduTrack\frontend\edutrack-react-app && npm run dev"
echo Waiting for React frontend on 5173...
:wait_frontend
ping 127.0.0.1 -n 2 >nul
netstat -ano | findstr :5173 >nul
if %errorlevel% neq 0 goto wait_frontend
:frontend_running
echo React Frontend is UP!

echo [6/7] Opening Browser...
start http://localhost:5173

echo ===================================================
echo EduTrack is now completely running!
echo ===================================================
pause
