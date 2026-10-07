# Menunggu server R-LAB siap, lalu membuka dashboard di browser.
# Dipanggil oleh MULAI-RLAB.bat
$url = 'http://localhost:8080/'
for ($i = 0; $i -lt 60; $i++) {
  try {
    Invoke-WebRequest -Uri ($url + 'api/health') -UseBasicParsing -TimeoutSec 2 | Out-Null
    Start-Process $url
    exit 0
  } catch { }
  Start-Sleep -Milliseconds 500
}
Write-Host '  [PERINGATAN] Server belum merespons dalam 30 detik.'
Write-Host '  Buka manual: http://localhost:8080/'
