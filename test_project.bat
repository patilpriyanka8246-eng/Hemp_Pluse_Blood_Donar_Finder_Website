@echo off
title HemoPulse - Verification and Automated Test Suite
color 0A
echo =====================================================================
echo       RUNNING AUTOMATED TEST SUITE FOR BLOOD DONOR FINDER
echo =====================================================================
echo.
cd /d "%~dp0backend"
call cmd /c "npm test"
echo.
echo =====================================================================
pause
