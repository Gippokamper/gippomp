# Gippokamp — lokal muhitni to'liq ishga tushirish
#
# Ishlatish:  powershell -ExecutionPolicy Bypass -File .\start-local.ps1
#
# Uchta jarayon ochiladi:
#   MariaDB   :3306
#   Laravel   :8000  (gippokamp)
#   user-app  :3000
#   admin     :3001

$ErrorActionPreference = 'Stop'

$root   = $PSScriptRoot
$php    = "C:\Users\Hp Vitus Gaming\php82\php.exe"
$mysqld = "C:\Program Files\MariaDB 12.3\bin\mysqld.exe"
$myini  = "C:\Program Files\MariaDB 12.3\data\my.ini"

function Test-Port([int]$port) {
    $null -ne (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue)
}

# --- 1. MariaDB -------------------------------------------------------------
# Windows xizmati sifatida ro'yxatdan o'tmagan, shuning uchun qo'lda ko'taramiz.
if (Test-Port 3306) {
    Write-Host "MariaDB allaqachon ishlayapti (:3306)" -ForegroundColor DarkGray
} else {
    Write-Host "MariaDB ishga tushirilmoqda..." -ForegroundColor Cyan
    Start-Process -FilePath $mysqld -ArgumentList "--defaults-file=`"$myini`"" -WindowStyle Minimized
    for ($i = 0; $i -lt 30 -and -not (Test-Port 3306); $i++) { Start-Sleep -Milliseconds 500 }
    if (-not (Test-Port 3306)) { throw "MariaDB ko'tarilmadi" }
    Write-Host "MariaDB tayyor" -ForegroundColor Green
}

# --- 2. Laravel backend -----------------------------------------------------
if (Test-Port 8000) {
    Write-Host "Backend allaqachon ishlayapti (:8000)" -ForegroundColor DarkGray
} else {
    Write-Host "Laravel backend ishga tushirilmoqda (:8000)..." -ForegroundColor Cyan
    Start-Process -FilePath $php `
        -ArgumentList 'artisan', 'serve', '--host=127.0.0.1', '--port=8000' `
        -WorkingDirectory "$root\gippokamp"
}

# --- 3. Frontendlar ---------------------------------------------------------
foreach ($app in @(
    @{ Name = 'user-app'; Port = 3000 },
    @{ Name = 'admin';    Port = 3001 }
)) {
    if (Test-Port $app.Port) {
        Write-Host "$($app.Name) allaqachon ishlayapti (:$($app.Port))" -ForegroundColor DarkGray
        continue
    }
    Write-Host "$($app.Name) ishga tushirilmoqda (:$($app.Port))..." -ForegroundColor Cyan
    Start-Process -FilePath 'cmd.exe' `
        -ArgumentList '/c', "set PORT=$($app.Port)&& set BROWSER=none&& npm start" `
        -WorkingDirectory "$root\$($app.Name)"
}

Write-Host ""
Write-Host "Frontendlar kompilyatsiyasini kutish (~1 daqiqa)..." -ForegroundColor Yellow
foreach ($port in 3000, 3001) {
    for ($i = 0; $i -lt 240 -and -not (Test-Port $port); $i++) { Start-Sleep -Seconds 1 }
}

Write-Host ""
Write-Host "  Foydalanuvchi ilovasi : http://localhost:3000" -ForegroundColor Green
Write-Host "  Admin panel           : http://localhost:3001" -ForegroundColor Green
Write-Host "  API                   : http://localhost:8000/api/v1" -ForegroundColor Green
Write-Host ""
Write-Host "  Test hisoblar (LocalSeeder):" -ForegroundColor Gray
Write-Host "    admin : 998901112233 / admin12345" -ForegroundColor Gray
Write-Host "    user  : 998902223344 / user12345"  -ForegroundColor Gray

Start-Process "http://localhost:3000"
Start-Process "http://localhost:3001"
