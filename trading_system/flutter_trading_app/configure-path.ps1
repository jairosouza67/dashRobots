# Configure Flutter PATH permanently
$flutterPath = "$PWD\flutter\bin"
$currentUserPath = [Environment]::GetEnvironmentVariable("PATH", "User")

if ($currentUserPath -notlike "*$flutterPath*") {
    $newPath = "$currentUserPath;$flutterPath"
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
    Write-Host "Flutter added to permanent PATH: $flutterPath" -ForegroundColor Green
    Write-Host "Please restart your terminal for permanent PATH changes to take effect" -ForegroundColor Yellow
} else {
    Write-Host "Flutter is already in permanent PATH" -ForegroundColor Green
}

Write-Host "`nCurrent Flutter configuration:" -ForegroundColor Cyan
flutter --version
Write-Host "`nFlutter Doctor:" -ForegroundColor Cyan
flutter doctor