# Flutter Auto-Installer for Windows
# Este script automatiza o download e configuração básica do Flutter

Write-Host "🚀 Flutter Auto-Installer para Windows" -ForegroundColor Cyan
Write-Host ""

# Verificar se está executando como administrador
function Test-Administrator {
    $user = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($user)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Configurações
$FlutterVersion = "3.24.3"
$FlutterUrl = "https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_$FlutterVersion-stable.zip"
$InstallPath = "C:\flutter"
$ZipPath = "$env:TEMP\flutter_windows.zip"

Write-Host "📋 Verificando sistema..." -ForegroundColor Yellow

# Verificar Git
try {
    $gitVersion = git --version
    Write-Host "✅ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não encontrado!" -ForegroundColor Red
    Write-Host "📥 Instale o Git primeiro: https://git-scm.com/download/windows" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verificar se Flutter já está instalado
if (Test-Path "$InstallPath\bin\flutter.bat") {
    Write-Host "⚠️ Flutter já está instalado em $InstallPath" -ForegroundColor Yellow
    $choice = Read-Host "Deseja reinstalar? (s/N)"
    if ($choice -ne "s" -and $choice -ne "S") {
        Write-Host "✅ Usando instalação existente" -ForegroundColor Green
        & "$InstallPath\bin\flutter.bat" --version
        Read-Host "Pressione Enter para continuar"
        exit 0
    }
}

Write-Host ""
Write-Host "📥 Baixando Flutter SDK..." -ForegroundColor Yellow

# Criar diretório se não existir
if (!(Test-Path $InstallPath)) {
    New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
}

# Download do Flutter
try {
    Write-Host "Baixando de: $FlutterUrl" -ForegroundColor Gray
    Invoke-WebRequest -Uri $FlutterUrl -OutFile $ZipPath -UseBasicParsing
    Write-Host "✅ Download concluído" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro no download: $_" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "📦 Extraindo Flutter SDK..." -ForegroundColor Yellow

# Extrair ZIP
try {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory($ZipPath, "C:\")
    Write-Host "✅ Extração concluída" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro na extração: $_" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Limpar arquivo ZIP
Remove-Item $ZipPath -Force

Write-Host ""
Write-Host "🔧 Configurando PATH..." -ForegroundColor Yellow

# Adicionar ao PATH do usuário atual
$userPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)
$flutterBinPath = "$InstallPath\bin"

if ($userPath -notlike "*$flutterBinPath*") {
    $newUserPath = if ($userPath) { "$userPath;$flutterBinPath" } else { $flutterBinPath }
    [Environment]::SetEnvironmentVariable("Path", $newUserPath, [EnvironmentVariableTarget]::User)
    Write-Host "✅ PATH configurado para o usuário atual" -ForegroundColor Green
} else {
    Write-Host "✅ Flutter já está no PATH" -ForegroundColor Green
}

# Adicionar ao PATH da sessão atual
$env:Path += ";$flutterBinPath"

Write-Host ""
Write-Host "🔍 Verificando instalação..." -ForegroundColor Yellow

# Testar Flutter
try {
    $flutterVersion = & "$InstallPath\bin\flutter.bat" --version
    Write-Host "✅ Flutter instalado com sucesso!" -ForegroundColor Green
    Write-Host $flutterVersion -ForegroundColor Gray
} catch {
    Write-Host "❌ Erro ao executar Flutter: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "📱 Executando Flutter Doctor..." -ForegroundColor Yellow

# Executar flutter doctor
try {
    & "$InstallPath\bin\flutter.bat" doctor
} catch {
    Write-Host "❌ Erro ao executar flutter doctor: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Instalação do Flutter concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. 🔄 Reinicie o terminal/VS Code para carregar o PATH atualizado"
Write-Host "2. 📱 Instale Android Studio para desenvolvimento Android:"
Write-Host "   👉 https://developer.android.com/studio"
Write-Host "3. 🔧 Execute: flutter doctor --android-licenses"
Write-Host "4. ✅ Execute: npm run setup (para verificar configuração)"
Write-Host "5. 🚀 Execute: npm run deploy (para fazer build do app)"
Write-Host ""
Write-Host "💡 Comandos úteis:" -ForegroundColor Yellow
Write-Host "   flutter --version       - Verificar versão"
Write-Host "   flutter doctor -v       - Diagnóstico detalhado"
Write-Host "   flutter create test_app - Criar app de teste"
Write-Host ""

Read-Host "Pressione Enter para finalizar"