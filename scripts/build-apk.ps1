# Build Ghithaa APK for WhatsApp sharing (EAS cloud build)
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
$env:npm_config_yes = "true"

Write-Host ""
Write-Host "=== Ghithaa APK Build ===" -ForegroundColor Cyan
Write-Host ""

$whoami = & npx --yes eas-cli whoami 2>&1 | Out-String
if ($whoami -match "Not logged in") {
  Write-Host "You are not logged in to Expo yet." -ForegroundColor Yellow
  Write-Host ""
  Write-Host "Run this command FIRST in this same window:" -ForegroundColor Green
  Write-Host "  npx eas-cli login" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "Browser opens -> sign in -> then run: npm run build:apk" -ForegroundColor Gray
  exit 1
}

Write-Host "Logged in as: $($whoami.Trim())" -ForegroundColor Green
Write-Host ""
Write-Host "Starting APK build (~10-20 min)..." -ForegroundColor Green
Write-Host "If asked to create a project, answer Y." -ForegroundColor Gray
Write-Host ""

& npx --yes eas-cli build --profile preview --platform android
$code = $LASTEXITCODE

Write-Host ""
if ($code -eq 0) {
  Write-Host "Done! Copy the APK download link and send on WhatsApp." -ForegroundColor Cyan
} else {
  Write-Host "Build failed (exit $code). Paste this output in chat for help." -ForegroundColor Red
}
exit $code
