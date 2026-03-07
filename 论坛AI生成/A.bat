@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0A.ps1" 2>&1

REM 检查上一个命令的退出代码
if errorlevel 1 (
    echo.
    echo 错误: PowerShell 脚本执行失败！
    echo 退出代码: %errorlevel%
    pause
    exit /b %errorlevel%
) else (
    echo.
    echo PowerShell 脚本执行成功！
)

pause
