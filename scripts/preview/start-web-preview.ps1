param(
  [int]$Port = 3001
)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$webRoot = Join-Path $repoRoot 'apps\web'

Push-Location $webRoot
try {
  & node '..\..\node_modules\next\dist\bin\next' start --hostname 127.0.0.1 --port $Port
}
finally {
  Pop-Location
}
