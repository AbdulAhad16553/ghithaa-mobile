# Ghithaa - Expo + Cloudflare quick tunnel (works on any network)
# Usage: .\scripts\start-cloudflare.ps1
# Optional: .\scripts\start-cloudflare.ps1 -Port 8093

param(
  [int]$Port = 8093
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Stop-Port {
  param([int]$ListenPort)
  for ($attempt = 0; $attempt -lt 12; $attempt++) {
    $pids = @(
      Get-NetTCPConnection -LocalPort $ListenPort -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique
    )
    if (-not $pids -or $pids.Count -eq 0) { return }
    foreach ($procId in $pids) {
      Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 1
  }
  $left = Get-NetTCPConnection -LocalPort $ListenPort -ErrorAction SilentlyContinue
  if ($left) {
    Write-Host "Port $ListenPort is still in use. Close other Expo terminals and run:" -ForegroundColor Red
    Write-Host "  npm run stop:dev" -ForegroundColor Yellow
    exit 1
  }
}

function Stop-Cloudflared {
  Get-Process cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
}

if (-not (Get-Command cloudflared -ErrorAction SilentlyContinue)) {
  Write-Host ""
  Write-Host "cloudflared is not installed." -ForegroundColor Red
  Write-Host "Install: winget install Cloudflare.cloudflared" -ForegroundColor Yellow
  exit 1
}

if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
  Write-Host "npx not found. Install Node.js first." -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "=== Ghithaa - Cloudflare Tunnel ===" -ForegroundColor Cyan
Write-Host "Port: $Port"
Write-Host ""

# Clean up leftover dev servers
Stop-Cloudflared
Stop-Port -ListenPort $Port
Start-Sleep -Seconds 1

# Step 1: start Cloudflare tunnel (Metro will be started after)
Write-Host "[1/2] Starting Cloudflare tunnel to http://127.0.0.1:$Port ..." -ForegroundColor Green
$tunnelLog = Join-Path $env:TEMP "ghithaa-cloudflare-tunnel.log"
if (Test-Path $tunnelLog) { Remove-Item $tunnelLog -Force }

$tunnel = Start-Process -FilePath "cloudflared" `
  -ArgumentList @("tunnel", "--url", "http://127.0.0.1:$Port", "--logfile", $tunnelLog, "--loglevel", "info") `
  -WorkingDirectory $root `
  -PassThru `
  -WindowStyle Hidden

$tunnelUrl = $null
for ($i = 0; $i -lt 45; $i++) {
  Start-Sleep -Seconds 1
  if (Test-Path $tunnelLog) {
    $log = Get-Content $tunnelLog -Raw -ErrorAction SilentlyContinue
    if ($log -match 'https://[a-z0-9-]+\.trycloudflare\.com') {
      $tunnelUrl = $Matches[0]
      break
    }
  }
}

if (-not $tunnelUrl) {
  Write-Host "Could not read Cloudflare URL from log: $tunnelLog" -ForegroundColor Red
  Stop-Process -Id $tunnel.Id -Force -ErrorAction SilentlyContinue
  exit 1
}

Write-Host "Cloudflare URL: $tunnelUrl" -ForegroundColor Cyan

# Step 2: start Expo once with proxy URL
Write-Host "[2/2] Starting Expo with EXPO_PACKAGER_PROXY_URL ..." -ForegroundColor Green
$env:EXPO_PACKAGER_PROXY_URL = $tunnelUrl
$hostOnly = ([Uri]$tunnelUrl).Host
$loadingAndroid = "$tunnelUrl/_expo/loading?platform=android"
$loadingIos = "$tunnelUrl/_expo/loading?platform=ios"
$expUrl = "exp://${hostOnly}:443"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Expo Go - paste ONE of these:" -ForegroundColor White
Write-Host ""
Write-Host "  Android (recommended):" -ForegroundColor Green
Write-Host "  $loadingAndroid" -ForegroundColor Yellow
Write-Host ""
Write-Host "  iPhone:" -ForegroundColor Green
Write-Host "  $loadingIos" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Or try:" -ForegroundColor Gray
Write-Host "  $expUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Do NOT use exp:// without :443" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Keep this window open. Press Ctrl+C to stop." -ForegroundColor Gray
Write-Host ""

try {
  npx expo start --port $Port --lan
}
finally {
  Stop-Process -Id $tunnel.Id -Force -ErrorAction SilentlyContinue
  Stop-Cloudflared
  Stop-Port -ListenPort $Port
}
