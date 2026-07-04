# Stop Expo / Metro on port 8093
$port = 8093
for ($attempt = 0; $attempt -lt 12; $attempt++) {
  $pids = @(
    Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
      Select-Object -ExpandProperty OwningProcess -Unique
  )
  if (-not $pids -or $pids.Count -eq 0) { break }
  foreach ($procId in $pids) {
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
  }
  Start-Sleep -Seconds 1
}
Get-Process cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "Port $port cleared."
