param(
  [int]$Port = 3005
)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$mobileRoot = Join-Path $repoRoot 'apps\mobile'

Push-Location $mobileRoot
try {
  & npm run build
  & npx serve -s dist -l $Port
}
finally {
  Pop-Location
}
