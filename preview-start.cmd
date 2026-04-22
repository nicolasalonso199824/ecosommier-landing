@echo off
setlocal

set "PORT=3002"
set "ROOT=%~dp0"
set "TITLE=Ecosommier Preview"

echo Stopping old preview on port %PORT%...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :%PORT% ^| findstr LISTENING') do (
  taskkill /PID %%p /F >nul 2>nul
)

cd /d "%ROOT%"

echo Building project...
call npm.cmd run build > preview-build.log 2>&1
if errorlevel 1 (
  echo.
  echo Build failed. Check preview-build.log
  exit /b 1
)

netsh advfirewall firewall add rule name="Ecosommier Preview 3002" dir=in action=allow protocol=TCP localport=%PORT% >nul 2>nul

for /f %%i in ('powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -ne '127.0.0.1' -and $_.IPAddress -notlike '169.254*' } | Sort-Object InterfaceMetric | Select-Object -First 1 -ExpandProperty IPAddress)"') do set "LAN_IP=%%i"

echo Starting stable preview on port %PORT%...
start "%TITLE%" /min cmd /k "cd /d ""%ROOT%"" && node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port %PORT% > preview-runtime.log 2>&1"

for /L %%i in (1,1,20) do (
  >nul 2>nul netstat -ano ^| findstr :%PORT% ^| findstr LISTENING && goto preview_ready
  timeout /t 1 >nul
)

echo.
echo Preview failed to start. Check preview-runtime.log
exit /b 1

:preview_ready

echo.
echo Local:   http://127.0.0.1:%PORT%
if defined LAN_IP echo Mobile:  http://%LAN_IP%:%PORT%
echo.
echo Keep the "%TITLE%" window open while using the preview.
exit /b 0
