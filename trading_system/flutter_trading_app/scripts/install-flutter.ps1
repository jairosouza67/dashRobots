# Flutter Installation Script for Windows
param(
    [string]$InstallPath = "C:\flutter"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Flutter SDK Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "WARNING: Not running as Administrator" -ForegroundColor Yellow
    Write-Host "Some operations may require elevated privileges" -ForegroundColor Yellow
}

# Create installation directory
Write-Host "`nCreating installation directory: $InstallPath" -ForegroundColor Green
if (!(Test-Path $InstallPath)) {
    New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
}

# Download Flutter SDK
$flutterUrl = "https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.24.3-stable.zip"
$zipPath = "$env:TEMP\flutter_windows.zip"

Write-Host "`nDownloading Flutter SDK..." -ForegroundColor Green
Write-Host "URL: $flutterUrl" -ForegroundColor Gray

try {
    Invoke-WebRequest -Uri $flutterUrl -OutFile $zipPath -UseBasicParsing
    Write-Host "Download completed successfully" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to download Flutter SDK" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Extract Flutter SDK
Write-Host "`nExtracting Flutter SDK to $InstallPath..." -ForegroundColor Green
try {
    Expand-Archive -Path $zipPath -DestinationPath $InstallPath -Force
    Write-Host "Extraction completed successfully" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to extract Flutter SDK" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Clean up
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

# Add to PATH
$flutterBinPath = "$InstallPath\flutter\bin"
Write-Host "`nConfiguring PATH..." -ForegroundColor Green

# Check if already in PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($currentPath -notlike "*$flutterBinPath*") {
    try {
        $newPath = "$currentPath;$flutterBinPath"
        [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
        Write-Host "Flutter added to PATH successfully" -ForegroundColor Green
        
        # Update current session PATH
        $env:PATH += ";$flutterBinPath"
        
    } catch {
        Write-Host "WARNING: Could not automatically add to PATH" -ForegroundColor Yellow
        Write-Host "Please manually add $flutterBinPath to your PATH" -ForegroundColor Yellow
    }
} else {
    Write-Host "Flutter is already in PATH" -ForegroundColor Yellow
}

# Verify installation
Write-Host "`nVerifying Flutter installation..." -ForegroundColor Green
try {
    $flutterVersion = & "$flutterBinPath\flutter.bat" --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Flutter installed successfully!" -ForegroundColor Green
        Write-Host $flutterVersion -ForegroundColor Gray
    } else {
        throw "Flutter command failed"
    }
} catch {
    Write-Host "WARNING: Flutter verification failed" -ForegroundColor Yellow
    Write-Host "You may need to restart your terminal" -ForegroundColor Yellow
}

# Run Flutter Doctor
Write-Host "`nRunning Flutter Doctor..." -ForegroundColor Green
try {
    & "$flutterBinPath\flutter.bat" doctor
} catch {
    Write-Host "Could not run flutter doctor" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Installation Summary:" -ForegroundColor Cyan
Write-Host "- Flutter SDK installed to: $InstallPath\flutter" -ForegroundColor White
Write-Host "- Flutter bin added to PATH: $flutterBinPath" -ForegroundColor White
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Restart your terminal/PowerShell" -ForegroundColor White
Write-Host "2. Run 'flutter doctor' to verify setup" -ForegroundColor White
Write-Host "3. Install Android Studio for Android development" -ForegroundColor White
Write-Host "4. Run 'flutter doctor --android-licenses' to accept licenses" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")