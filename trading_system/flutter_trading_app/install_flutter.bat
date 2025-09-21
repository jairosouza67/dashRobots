@echo off
echo 🚀 Flutter Installation Guide for Windows
echo.
echo Este script irá guiá-lo através da instalação do Flutter SDK
echo.

echo 📋 Verificando pré-requisitos...
echo.

REM Verificar Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git não encontrado
    echo 📥 Instale o Git primeiro: https://git-scm.com/download/windows
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Git encontrado
)

REM Verificar PowerShell
powershell.exe -Command "Write-Host 'PowerShell OK'" >nul 2>&1
if errorlevel 1 (
    echo ❌ PowerShell não encontrado
    echo 📥 PowerShell é necessário para Flutter
    pause
    exit /b 1
) else (
    echo ✅ PowerShell encontrado
)

echo.
echo 📱 Instalação do Flutter SDK:
echo.
echo 1. DOWNLOAD DO FLUTTER:
echo    👉 Acesse: https://docs.flutter.dev/get-started/install/windows
echo    👉 Baixe o Flutter SDK (stable channel)
echo    👉 OU use este link direto: https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.24.3-stable.zip
echo.
echo 2. EXTRAÇÃO:
echo    👉 Extraia o arquivo ZIP
echo    👉 Mova a pasta 'flutter' para: C:\
echo    👉 Caminho final: C:\flutter
echo.
echo 3. CONFIGURAR PATH:
echo    👉 Abra 'Variáveis de Ambiente' do Windows
echo    👉 Edite a variável PATH do sistema
echo    👉 Adicione: C:\flutter\bin
echo.
echo 4. VERIFICAR INSTALAÇÃO:
echo    👉 Abra um novo PowerShell/CMD
echo    👉 Execute: flutter --version
echo    👉 Execute: flutter doctor
echo.

pause

echo.
echo 🛠️ Configuração do Android (para builds Android):
echo.
echo 1. ANDROID STUDIO:
echo    👉 Baixe: https://developer.android.com/studio
echo    👉 Instale o Android Studio
echo    👉 Instale Android SDK (API 30+)
echo.
echo 2. FLUTTER PLUGINS:
echo    👉 Abra Android Studio
echo    👉 File → Settings → Plugins
echo    👉 Instale: Flutter plugin
echo    👉 Instale: Dart plugin
echo.
echo 3. ACEITAR LICENÇAS:
echo    👉 Execute: flutter doctor --android-licenses
echo    👉 Aceite todas as licenças
echo.

pause

echo.
echo 💻 Configuração do VS Code (recomendado):
echo.
echo 1. EXTENSÕES:
echo    👉 Instale: Flutter extension
echo    👉 Instale: Dart extension
echo    👉 Instale: Flutter Tree extension
echo.
echo 2. VERIFICAR:
echo    👉 Ctrl+Shift+P → "Flutter: Doctor"
echo    👉 Deve mostrar Flutter instalado
echo.

pause

echo.
echo 🧪 TESTE RÁPIDO:
echo.
echo Após a instalação, execute estes comandos:
echo.
echo flutter --version
echo flutter doctor -v
echo flutter create test_app
echo cd test_app
echo flutter run
echo.
echo Se tudo funcionar, o Flutter está instalado corretamente!
echo.

echo.
echo 🎯 PRÓXIMOS PASSOS:
echo.
echo 1. Depois de instalar o Flutter, volte aqui
echo 2. Execute: npm run setup (para verificar)
echo 3. Execute: npm run deploy (para fazer build do app)
echo.

pause

echo.
echo 📞 SUPORTE:
echo.
echo Se encontrar problemas:
echo 👉 Documentação: https://docs.flutter.dev/get-started/install/windows
echo 👉 Flutter Doctor: flutter doctor -v
echo 👉 Comunidade: https://stackoverflow.com/questions/tagged/flutter
echo.

echo ✅ Guia de instalação concluído!
echo Execute este script novamente se precisar revisar as instruções.
echo.
pause