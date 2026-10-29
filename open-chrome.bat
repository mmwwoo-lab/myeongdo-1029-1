@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0build-offline.ps1"
if errorlevel 1 (
  echo Homepage preparation failed. Check that index.html and assets folder exist.
  pause
  exit /b 1
)
set "HTML=%~dp0myeongdo-chrome-offline.html"
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%HTML%"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%HTML%"
) else (
  start "" "%HTML%"
)