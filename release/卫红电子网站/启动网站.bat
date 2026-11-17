@echo off
title 上海卫红电子 - 本地网站
cd /d "%~dp0"

echo.
echo   ================================================
echo     上海卫红电子网站 正在启动……
echo     浏览器将自动打开 http://127.0.0.1:4173
echo     关闭本窗口即可停止网站
echo   ================================================
echo.

start "" cmd /c "timeout /t 1 /nobreak >nul & start "" http://127.0.0.1:4173/"

"%~dp0runtime\node.exe" "%~dp0server.mjs"

echo.
echo 网站已停止。
pause
