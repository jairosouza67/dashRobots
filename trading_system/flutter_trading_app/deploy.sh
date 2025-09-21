#!/bin/bash

# Flutter Trading App - Deploy Script (Linux/macOS)

set -e

echo "========================================"
echo " Flutter Trading App - Deploy Script"
echo "========================================"
echo

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCESSO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

# Verificar se Flutter está instalado
if ! command -v flutter &> /dev/null; then
    print_error "Flutter não está instalado ou não está no PATH"
    echo
    echo "Por favor, instale o Flutter SDK seguindo as instruções em:"
    echo "https://docs.flutter.dev/get-started/install"
    echo
    exit 1
fi

print_success "Flutter encontrado"
flutter --version
echo

# Verificar se estamos no diretório correto
if [ ! -f "pubspec.yaml" ]; then
    print_error "Arquivo pubspec.yaml não encontrado"
    print_error "Certifique-se de estar no diretório raiz do projeto Flutter"
    exit 1
fi

print_success "Diretório do projeto encontrado"
echo

# Limpar cache anterior
print_info "Limpando cache anterior..."
flutter clean
echo

# Instalar dependências
print_info "Instalando dependências..."
if ! flutter pub get; then
    print_error "Falha ao instalar dependências"
    exit 1
fi
echo

# Gerar arquivos de serialização
print_info "Gerando arquivos de serialização JSON..."
flutter packages pub run build_runner build
echo

# Verificar saúde do projeto
print_info "Verificando saúde do projeto..."
flutter doctor
echo

# Análise de código
print_info "Executando análise de código..."
if ! flutter analyze; then
    print_warning "Análise de código encontrou problemas"
    print_warning "Revise os warnings antes de continuar"
    echo
fi

# Menu de opções de build
echo "========================================"
echo " Selecione o tipo de build:"
echo "========================================"
echo " 1. Debug APK (desenvolvimento)"
echo " 2. Release APK (produção)"
echo " 3. App Bundle (Google Play)"
echo " 4. Web Build"
echo " 5. iOS Build (somente macOS)"
echo " 6. macOS Build (somente macOS)"
echo " 7. Linux Build (somente Linux)"
echo " 8. Executar em dispositivo conectado"
echo " 9. Executar no emulador web"
echo "========================================"
echo

read -p "Digite sua escolha (1-9): " choice

case $choice in
    1)
        print_info "Construindo Debug APK..."
        flutter build apk --debug
        echo
        print_success "Debug APK criado em: build/app/outputs/flutter-apk/app-debug.apk"
        ;;
    2)
        print_info "Construindo Release APK..."
        flutter build apk --release
        echo
        print_success "Release APK criado em: build/app/outputs/flutter-apk/app-release.apk"
        ;;
    3)
        print_info "Construindo App Bundle..."
        flutter build appbundle --release
        echo
        print_success "App Bundle criado em: build/app/outputs/bundle/release/app-release.aab"
        ;;
    4)
        print_info "Construindo para Web..."
        flutter build web
        echo
        print_success "Build Web criado em: build/web/"
        print_info "Para testar: flutter run -d web-server --web-port 8080"
        ;;
    5)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            print_info "Construindo para iOS..."
            flutter build ios --release
            echo
            print_success "Build iOS criado"
            print_info "Abra ios/Runner.xcworkspace no Xcode para archive"
        else
            print_error "Build iOS disponível apenas no macOS"
            exit 1
        fi
        ;;
    6)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            print_info "Construindo para macOS..."
            flutter build macos --release
            echo
            print_success "Build macOS criado em: build/macos/Build/Products/Release/"
        else
            print_error "Build macOS disponível apenas no macOS"
            exit 1
        fi
        ;;
    7)
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            print_info "Construindo para Linux..."
            flutter build linux --release
            echo
            print_success "Build Linux criado em: build/linux/x64/release/bundle/"
        else
            print_error "Build Linux disponível apenas no Linux"
            exit 1
        fi
        ;;
    8)
        print_info "Listando dispositivos disponíveis..."
        flutter devices
        echo
        print_info "Executando em dispositivo conectado..."
        flutter run
        ;;
    9)
        print_info "Executando no navegador..."
        flutter run -d web-server --web-port 8080
        ;;
    *)
        print_error "Opção inválida"
        exit 1
        ;;
esac

echo
echo "========================================"
print_success " Build concluído com sucesso!"
echo "========================================"
echo

# Perguntar se quer abrir pasta dos builds
read -p "Deseja abrir a pasta dos builds? (s/n): " open
if [[ "$open" == "s" || "$open" == "S" ]]; then
    case $choice in
        1|2)
            if command -v xdg-open &> /dev/null; then
                xdg-open "build/app/outputs/flutter-apk"
            elif command -v open &> /dev/null; then
                open "build/app/outputs/flutter-apk"
            fi
            ;;
        3)
            if command -v xdg-open &> /dev/null; then
                xdg-open "build/app/outputs/bundle/release"
            elif command -v open &> /dev/null; then
                open "build/app/outputs/bundle/release"
            fi
            ;;
        4)
            if command -v xdg-open &> /dev/null; then
                xdg-open "build/web"
            elif command -v open &> /dev/null; then
                open "build/web"
            fi
            ;;
        6)
            if command -v open &> /dev/null; then
                open "build/macos/Build/Products/Release"
            fi
            ;;
        7)
            if command -v xdg-open &> /dev/null; then
                xdg-open "build/linux/x64/release/bundle"
            fi
            ;;
    esac
fi

echo "Pressione Enter para sair..."
read