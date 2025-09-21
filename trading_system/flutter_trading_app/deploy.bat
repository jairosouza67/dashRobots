@echo off
echo ========================================
echo  Flutter Trading App - Deploy Script
echo ========================================
echo.

REM Verificar se Flutter está instalado
flutter --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Flutter não está instalado ou não está no PATH
    echo.
    echo Por favor, instale o Flutter SDK seguindo as instruções em:
    echo https://docs.flutter.dev/get-started/install/windows
    echo.
    echo Depois adicione o Flutter ao PATH do sistema.
    pause
    exit /b 1
)

echo [OK] Flutter encontrado
flutter --version
echo.

REM Verificar se estamos no diretório correto
if not exist "pubspec.yaml" (
    echo [ERRO] Arquivo pubspec.yaml não encontrado
    echo Certifique-se de estar no diretório raiz do projeto Flutter
    pause
    exit /b 1
)

echo [OK] Diretório do projeto encontrado
echo.

REM Limpar cache anterior
echo [INFO] Limpando cache anterior...
flutter clean
echo.

REM Instalar dependências
echo [INFO] Instalando dependências...
flutter pub get
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependências
    pause
    exit /b 1
)
echo.

REM Gerar arquivos de serialização
echo [INFO] Gerando arquivos de serialização JSON...
flutter packages pub run build_runner build
echo.

REM Verificar saúde do projeto
echo [INFO] Verificando saúde do projeto...
flutter doctor
echo.

REM Análise de código
echo [INFO] Executando análise de código...
flutter analyze
if %errorlevel% neq 0 (
    echo [AVISO] Análise de código encontrou problemas
    echo Revise os warnings antes de continuar
    echo.
)

REM Menu de opções de build
echo ========================================
echo  Selecione o tipo de build:
echo ========================================
echo  1. Debug APK (desenvolvimento)
echo  2. Release APK (produção)
echo  3. App Bundle (Google Play)
echo  4. Web Build
echo  5. Windows Build
echo  6. Executar em dispositivo conectado
echo  7. Executar no emulador web
echo ========================================
echo.

set /p choice="Digite sua escolha (1-7): "

if "%choice%"=="1" (
    echo [INFO] Construindo Debug APK...
    flutter build apk --debug
    echo.
    echo [SUCESSO] Debug APK criado em: build\app\outputs\flutter-apk\app-debug.apk
) else if "%choice%"=="2" (
    echo [INFO] Construindo Release APK...
    flutter build apk --release
    echo.
    echo [SUCESSO] Release APK criado em: build\app\outputs\flutter-apk\app-release.apk
) else if "%choice%"=="3" (
    echo [INFO] Construindo App Bundle...
    flutter build appbundle --release
    echo.
    echo [SUCESSO] App Bundle criado em: build\app\outputs\bundle\release\app-release.aab
) else if "%choice%"=="4" (
    echo [INFO] Construindo para Web...
    flutter build web
    echo.
    echo [SUCESSO] Build Web criado em: build\web\
    echo Para testar: flutter run -d web-server --web-port 8080
) else if "%choice%"=="5" (
    echo [INFO] Construindo para Windows...
    flutter build windows --release
    echo.
    echo [SUCESSO] Build Windows criado em: build\windows\runner\Release\
) else if "%choice%"=="6" (
    echo [INFO] Listando dispositivos disponíveis...
    flutter devices
    echo.
    echo [INFO] Executando em dispositivo conectado...
    flutter run
) else if "%choice%"=="7" (
    echo [INFO] Executando no navegador...
    flutter run -d web-server --web-port 8080
) else (
    echo [ERRO] Opção inválida
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Build concluído com sucesso!
echo ========================================
echo.

REM Perguntar se quer abrir pasta dos builds
set /p open="Deseja abrir a pasta dos builds? (s/n): "
if /i "%open%"=="s" (
    if "%choice%"=="1" (
        explorer "build\app\outputs\flutter-apk"
    ) else if "%choice%"=="2" (
        explorer "build\app\outputs\flutter-apk"
    ) else if "%choice%"=="3" (
        explorer "build\app\outputs\bundle\release"
    ) else if "%choice%"=="4" (
        explorer "build\web"
    ) else if "%choice%"=="5" (
        explorer "build\windows\runner\Release"
    )
)

echo.
echo Pressione qualquer tecla para sair...
pause >nul