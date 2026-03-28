param(
  [switch]$SkipKill
)

$ErrorActionPreference = 'Stop'

$wslRepoRoot = '/home/god_himself_wsl/FosholHaat-CSE299'

function Invoke-WslCommand {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Command
  )

  & wsl --cd / bash -lc $Command
}

function Start-ServerProcess {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Name,
    [Parameter(Mandatory = $true)]
    [string]$WorkspaceCommand,
    [Parameter(Mandatory = $true)]
    [string]$LogPath
  )

  $command = "nohup bash -lc '$WorkspaceCommand' >$LogPath 2>&1 &"
  & wsl --cd $wslRepoRoot bash -lc $command | Out-Null
  Write-Host "  $Name log: $LogPath"
}

if (-not $SkipKill) {
  Write-Host 'Clearing ports 3000, 3001, and 8081...' -ForegroundColor Yellow

  Invoke-WslCommand 'fuser -k 3000/tcp >/dev/null 2>&1 || true'
  Invoke-WslCommand 'fuser -k 3001/tcp >/dev/null 2>&1 || true'
  Invoke-WslCommand 'fuser -k 8081/tcp >/dev/null 2>&1 || true'
}

Write-Host 'Starting API server...' -ForegroundColor Green
Start-ServerProcess -Name 'API' -WorkspaceCommand 'npm run start:dev -w apps/api' -LogPath '/tmp/fosholhaat-api.log'

Start-Sleep -Seconds 1

Write-Host 'Starting web server on port 3001...' -ForegroundColor Green
Start-ServerProcess -Name 'Web' -WorkspaceCommand 'npm run dev -w apps/web -- -p 3001' -LogPath '/tmp/fosholhaat-web.log'

Start-Sleep -Seconds 1

Write-Host 'Starting mobile server on port 8081...' -ForegroundColor Green
Start-ServerProcess -Name 'Mobile' -WorkspaceCommand 'npm run web -w apps/mobile -- --port 8081' -LogPath '/tmp/fosholhaat-mobile.log'

Write-Host ''
Write-Host 'Dev stack launch requested.' -ForegroundColor Cyan
Write-Host 'API:    http://localhost:3000'
Write-Host 'Web:    http://localhost:3001/login'
Write-Host 'Mobile: http://localhost:8081'
Write-Host ''
Write-Host 'Run this anytime from Windows PowerShell:' -ForegroundColor Cyan
Write-Host 'npm run dev:restart:windows'
