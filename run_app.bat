@echo off
title TMM Patente - 1-Click Fast Launch
cd /d "%~dp0"

echo ====================================================
echo         TMM Bangla Patente - 1-Click Launcher
echo ====================================================
echo.

:: 1. Check if physical device or emulator is connected
"%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" devices | findstr /v "List" | findstr /i "device" >nul
if errorlevel 1 (
    echo [1/2] No active device detected. Starting Android Emulator in fast mode...
    start "" "%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe" -avd medium_phone -gpu host -no-boot-anim
    echo Waiting for emulator to boot up...
    "%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" wait-for-device
) else (
    echo [1/2] Active Android device / emulator is connected and ready.
)

:: 2. Launch Expo with local fast Metro bundler
echo.
echo [2/2] Starting Expo Server on Android (Fast Metro)...
call npx expo start --android -c

pause
