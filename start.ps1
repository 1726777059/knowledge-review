# 知识复习系统 - 一键启动脚本
# 使用方法：右键 -> 使用 PowerShell 运行

$ErrorActionPreference = "Stop"

# 切换到脚本所在目录
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) {
    $ScriptDir = $PSScriptRoot
}
Set-Location $ScriptDir

# 检查端口 3000 是否被占用
$Port = 3000
$Process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Where-Object { $_.State -eq "Listen" }

if ($Process) {
    Write-Host "[$Port] 端口已被占用，尝试关闭占用进程..." -ForegroundColor Yellow
    $ProcessOwners = Get-Process -Id $Process.OwningProcess -ErrorAction SilentlyContinue
    if ($ProcessOwners) {
        Stop-Process -Id $ProcessOwners.Id -Force -ErrorAction SilentlyContinue
        Start-Sleep -Milliseconds 500
        Write-Host "已关闭进程" -ForegroundColor Green
    }
}

# 启动 Next.js 服务器
Write-Host "正在启动知识复习系统..." -ForegroundColor Cyan
$ServerProcess = Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow -PassThru -WorkingDirectory $ScriptDir

# 等待服务器启动
$MaxWaitSeconds = 30
$Elapsed = 0
$ServerReady = $false

Write-Host "等待服务器就绪..." -ForegroundColor Cyan

while ($Elapsed -lt $MaxWaitSeconds) {
    Start-Sleep -Milliseconds 500
    $Elapsed += 0.5
    
    try {
        $Response = Invoke-WebRequest -Uri "http://localhost:$Port" -UseBasicParsing -TimeoutSec 1 -ErrorAction SilentlyContinue
        if ($Response.StatusCode -eq 200) {
            $ServerReady = $true
            break
        }
    } catch {
        # 还没准备好，继续等待
    }
}

if ($ServerReady) {
    Write-Host ""
    Write-Host "===========================================" -ForegroundColor Green
    Write-Host "  服务器已启动！" -ForegroundColor Green
    Write-Host "  访问地址: http://localhost:$Port" -ForegroundColor Green
    Write-Host "===========================================" -ForegroundColor Green
    Write-Host ""
    
    # 打开浏览器
    Start-Process -FilePath "http://localhost:$Port"
    
    Write-Host "浏览器已打开。如需停止服务器，请关闭此窗口或按 Ctrl+C" -ForegroundColor Gray
    
    # 等待服务器进程退出
    $ServerProcess.WaitForExit()
} else {
    Write-Host ""
    Write-Host "服务器启动超时，请检查配置。" -ForegroundColor Red
    Write-Host "按任意键退出..." -ForegroundColor Yellow
    Read-Host
}
