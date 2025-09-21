# Flutter Auto-Installer for Windows
Write-Host "Flutter Auto-Installer para Windows" -ForegroundColor Cyan
Write-Host ""

# Configuracoes
$FlutterVersion = "3.24.3"
$FlutterUrl = "https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_$FlutterVersion-stable.zip"
$InstallPath = "C:\flutter"
$ZipPath = "$env:TEMP\flutter_windows.zip"

Write-Host "Verificando sistema..." -ForegroundColor Yellow

# Verificar Git
try {
    $gitVersion = git --version
    Write-Host "Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git nao encontrado!" -ForegroundColor Red
    Write-Host "Instale o Git: https://git-scm.com/download/windows" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verificar se Flutter ja existe
if (Test-Path "$InstallPath\bin\flutter.bat") {
    Write-Host "Flutter ja instalado em $InstallPath" -ForegroundColor Yellow
    $choice = Read-Host "Reinstalar? (s/N)"
    if ($choice -ne "s") {
        Write-Host "Usando instalacao existente" -ForegroundColor Green
        exit 0
    }
}

Write-Host ""
Write-Host "Baixando Flutter SDK..." -ForegroundColor Yellow

# Criar diretorio
if (!(Test-Path $InstallPath)) {
    New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
}

# Download
try {
    Invoke-WebRequest -Uri $FlutterUrl -OutFile $ZipPath -UseBasicParsing
    Write-Host "Download concluido" -ForegroundColor Green
} catch {
    Write-Host "Erro no download: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Extraindo Flutter..." -ForegroundColor Yellow

# Extrair
try {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory($ZipPath, "C:\")
    Write-Host "Extracao concluida" -ForegroundColor Green
} catch {
    Write-Host "Erro na extracao: $_" -ForegroundColor Red
    exit 1
}

# Limpar ZIP
Remove-Item $ZipPath -Force

Write-Host ""
Write-Host "Configurando PATH..." -ForegroundColor Yellow

# Adicionar ao PATH
$userPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)
$flutterBin = "$InstallPath\bin"

if ($userPath -notlike "*$flutterBin*") {
    if ($userPath) {
        $newPath = "$userPath;$flutterBin"
    } else {
        $newPath = $flutterBin
    }
    [Environment]::SetEnvironmentVariable("Path", $newPath, [EnvironmentVariableTarget]::User)
    Write-Host "PATH configurado" -ForegroundColor Green
}

# PATH para sessao atual
$env:Path += ";$flutterBin"

Write-Host ""
Write-Host "Testando Flutter..." -ForegroundColor Yellow

# Testar
try {
    & "$InstallPath\bin\flutter.bat" --version
    Write-Host "Flutter instalado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao testar Flutter" -ForegroundColor Red
}

Write-Host ""
Write-Host "Instalacao concluida!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "1. Reinicie o terminal"
Write-Host "2. Execute: flutter doctor"
Write-Host "3. Execute: npm run setup"
Write-Host ""

Read-Host "Pressione Enter"