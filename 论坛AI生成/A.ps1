# 内部论坛服务器启动脚本
$Host.UI.RawUI.WindowTitle = "内部论坛服务器"

# 设置控制台编码为 UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "       内部论坛 - 启动服务器" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js 是否安装
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "[错误] 未检测到 Node.js！" -ForegroundColor Red
    Write-Host ""
    Write-Host "请先安装 Node.js："
    Write-Host "1. 访问 https://nodejs.org/"
    Write-Host "2. 下载 LTS 版本（推荐）"
    Write-Host "3. 安装时勾选所有默认选项"
    Write-Host "4. 安装完成后重新运行此脚本"
    Write-Host ""
    Read-Host "按回车键退出"
    exit 1
}

# 显示 Node.js 版本
$nodeVersion = node -v
Write-Host "[√] Node.js 版本: $nodeVersion" -ForegroundColor Green

# 检查是否已安装依赖
if (-not (Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "[*] 首次运行，正在安装依赖..." -ForegroundColor Yellow
    Write-Host ""
    
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "[错误] 依赖安装失败！" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
    
    Write-Host ""
    Write-Host "[√] 依赖安装完成！" -ForegroundColor Green
}

Write-Host ""
Write-Host "[*] 正在启动服务器..." -ForegroundColor Yellow
Write-Host ""

# 启动服务器
node Server/server.js

# 服务器退出后
Write-Host ""
Write-Host "[!] 服务器已停止" -ForegroundColor Yellow
Read-Host "按回车键退出"