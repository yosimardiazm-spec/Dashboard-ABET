# instalar-y-correr.ps1
# Descarga Node.js portable (sin permisos de administrador) e inicia el dashboard
# Uso: clic derecho → "Ejecutar con PowerShell"

$ErrorActionPreference = "Stop"
$nodeDir = "$env:USERPROFILE\Tools\nodejs"
$dashboardDir = $PSScriptRoot

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Dashboard ABET - Configuracion inicial" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# 1. Verificar si ya existe Node.js portable
if (Test-Path "$nodeDir\npm.cmd") {
    Write-Host "`n  Node.js ya instalado en: $nodeDir" -ForegroundColor Green
} else {
    Write-Host "`n  Descargando Node.js portable (sin necesidad de admin)..." -ForegroundColor Yellow

    # Obtener ultima version LTS
    try {
        $index = Invoke-RestMethod "https://nodejs.org/dist/index.json"
        $lts = $index | Where-Object { $_.lts -ne $false } | Select-Object -First 1
        $version = $lts.version
    } catch {
        $version = "v20.15.0"
    }

    $zipUrl  = "https://nodejs.org/dist/$version/node-$version-win-x64.zip"
    $zipPath = "$env:TEMP\nodejs-portable.zip"

    Write-Host "  Version: $version" -ForegroundColor Gray
    Write-Host "  URL: $zipUrl" -ForegroundColor Gray
    Write-Host "  Descargando... (puede tardar 1-2 minutos)" -ForegroundColor Yellow

    Invoke-WebRequest $zipUrl -OutFile $zipPath -UseBasicParsing

    Write-Host "  Extrayendo..." -ForegroundColor Yellow
    $toolsDir = "$env:USERPROFILE\Tools"
    if (-not (Test-Path $toolsDir)) { New-Item -ItemType Directory -Force $toolsDir | Out-Null }
    Expand-Archive $zipPath -DestinationPath $toolsDir -Force

    # Renombrar carpeta extraída
    $extracted = Get-ChildItem $toolsDir | Where-Object { $_.Name -like "node-*-win-x64" } | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($extracted.FullName -ne $nodeDir) {
        if (Test-Path $nodeDir) { Remove-Item $nodeDir -Recurse -Force }
        Rename-Item $extracted.FullName "nodejs" -Force
    }

    Remove-Item $zipPath -ErrorAction SilentlyContinue
    Write-Host "  Node.js instalado correctamente." -ForegroundColor Green
}

# 2. Agregar al PATH de esta sesion
$env:PATH = "$nodeDir;$env:PATH"

# 3. Verificar
$nodeVer = & "$nodeDir\node.exe" --version
$npmVer  = & "$nodeDir\npm.cmd" --version
Write-Host ""
Write-Host "  node $nodeVer    npm v$npmVer" -ForegroundColor Green

# 4. Instalar dependencias si no existen
Set-Location $dashboardDir
if (-not (Test-Path "node_modules")) {
    Write-Host "`n  Instalando dependencias npm..." -ForegroundColor Yellow
    & "$nodeDir\npm.cmd" install
    Write-Host "  Dependencias instaladas." -ForegroundColor Green
} else {
    Write-Host "`n  Dependencias ya instaladas." -ForegroundColor Green
}

# 5. Iniciar servidor de desarrollo
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Iniciando dashboard en http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Presiona Ctrl+C para detener el servidor" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

& "$nodeDir\npm.cmd" run dev
