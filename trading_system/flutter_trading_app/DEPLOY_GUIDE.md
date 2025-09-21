# 🚀 Guia de Deploy - Flutter Trading App

Este guia fornece instruções completas para fazer o deploy do aplicativo Flutter Trading App.

## 📋 Pré-requisitos

### 1. Instalar Flutter SDK

#### Windows:
1. **Baixar Flutter SDK:**
   - Acesse: https://docs.flutter.dev/get-started/install/windows
   - Baixe o Flutter SDK (versão estável mais recente)
   - Extraia para `C:\flutter` (ou local de sua preferência)

2. **Configurar PATH:**
   ```powershell
   # Adicionar ao PATH do sistema
   $env:PATH += ";C:\flutter\bin"
   
   # Para tornar permanente, adicione ao PATH do sistema nas variáveis de ambiente
   ```

3. **Verificar instalação:**
   ```powershell
   flutter --version
   flutter doctor
   ```

#### macOS:
```bash
# Usando Homebrew
brew install --cask flutter

# Ou baixar manualmente e configurar PATH
export PATH="$PATH:`pwd`/flutter/bin"
```

#### Linux:
```bash
# Baixar e extrair
sudo tar xf flutter_linux_*.tar.xz -C /opt/
export PATH="$PATH:/opt/flutter/bin"
```

### 2. Configurar Desenvolvimento Android

#### Android Studio:
1. Baixe e instale o Android Studio
2. Instale Android SDK e ferramentas
3. Configure dispositivo virtual (AVD) ou conecte dispositivo físico

#### SDK Command Line Tools:
```powershell
# Verificar se SDK está configurado
flutter doctor --android-licenses
```

### 3. Configurar Desenvolvimento iOS (macOS apenas)

```bash
# Instalar Xcode
sudo xcode-select --install

# Instalar CocoaPods
sudo gem install cocoapods
```

## 🔧 Configuração do Projeto

### 1. Instalar Dependências

```powershell
# Navegar para o projeto
cd "d:\VS Code\trading_system\flutter_trading_app"

# Instalar dependências
flutter pub get

# Gerar arquivos (para serialização JSON)
flutter packages pub run build_runner build
```

### 2. Verificar Configuração

```powershell
# Verificar se tudo está configurado
flutter doctor

# Listar dispositivos disponíveis
flutter devices

# Verificar se projeto está válido
flutter analyze
```

## 📱 Deploy para Android

### 1. Debug Build (Desenvolvimento)

```powershell
# Build para debug
flutter build apk --debug

# Ou instalar diretamente em dispositivo conectado
flutter run
```

### 2. Release Build (Produção)

```powershell
# Build APK para produção
flutter build apk --release

# Build App Bundle (recomendado para Google Play)
flutter build appbundle --release
```

### 3. Localização dos Arquivos

- **APK Debug:** `build/app/outputs/flutter-apk/app-debug.apk`
- **APK Release:** `build/app/outputs/flutter-apk/app-release.apk`
- **App Bundle:** `build/app/outputs/bundle/release/app-release.aab`

### 4. Assinatura Digital (Produção)

1. **Gerar keystore:**
```powershell
keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

2. **Configurar gradle:**
Criar `android/key.properties`:
```properties
storePassword=<password>
keyPassword=<password>
keyAlias=upload
storeFile=../upload-keystore.jks
```

3. **Atualizar `android/app/build.gradle`:**
```gradle
android {
    ...
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

## 🍎 Deploy para iOS (macOS apenas)

### 1. Configurar Xcode

```bash
# Abrir projeto iOS
open ios/Runner.xcworkspace

# Ou via Flutter
flutter run -d ios
```

### 2. Build para iOS

```bash
# Build para simulador
flutter build ios --simulator

# Build para dispositivo
flutter build ios --release
```

### 3. Deploy via Xcode

1. Abra `ios/Runner.xcworkspace` no Xcode
2. Configure Team e Bundle Identifier
3. Selecione dispositivo alvo
4. Archive → Distribute App

## 🌐 Deploy Web

### 1. Build Web

```powershell
# Build para web
flutter build web

# Servir localmente para teste
flutter run -d web-server --web-port 8080
```

### 2. Deploy em Servidor

Os arquivos gerados estarão em `build/web/`. Faça upload para seu servidor web.

### 3. Deploy no Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar projeto
firebase init hosting

# Deploy
firebase deploy
```

## 🖥️ Deploy Desktop

### Windows:

```powershell
# Build para Windows
flutter build windows --release
```

### macOS:

```bash
# Build para macOS
flutter build macos --release
```

### Linux:

```bash
# Build para Linux
flutter build linux --release
```

## 🔧 Scripts Automatizados

Vou criar scripts para automatizar o processo de deploy.

## 🧪 Testes

### Executar Testes

```powershell
# Testes unitários
flutter test

# Testes de integração
flutter drive --target=test_driver/app.dart
```

### Análise de Código

```powershell
# Análise estática
flutter analyze

# Verificar formatação
flutter format --set-exit-if-changed .
```

## 🚀 CI/CD

Para automatizar deploys, configure GitHub Actions ou similar:

```yaml
# .github/workflows/deploy.yml
name: Flutter CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    - uses: subosito/flutter-action@v2
      with:
        flutter-version: '3.x'
    
    - run: flutter pub get
    - run: flutter test
    - run: flutter build apk --release
    - run: flutter build web
```

## 📋 Checklist de Deploy

### Antes do Deploy:
- [ ] Todas as dependências instaladas
- [ ] `flutter doctor` sem erros críticos
- [ ] Testes passando
- [ ] Código analisado (`flutter analyze`)
- [ ] Configurações de produção ajustadas

### Android:
- [ ] Keystore configurado (produção)
- [ ] Permissões no AndroidManifest.xml
- [ ] Ícones e splash screen configurados
- [ ] Build APK/AAB gerado com sucesso

### iOS:
- [ ] Certificados configurados
- [ ] Bundle ID único
- [ ] Info.plist configurado
- [ ] Build para App Store Connect

### Web:
- [ ] Arquivos estáticos otimizados
- [ ] CORS configurado (se necessário)
- [ ] SSL configurado

## 🔍 Troubleshooting

### Problemas Comuns:

1. **Flutter não encontrado:**
   - Verificar PATH
   - Reinstalar Flutter SDK

2. **Dependências não resolvidas:**
   ```powershell
   flutter clean
   flutter pub cache repair
   flutter pub get
   ```

3. **Erro de build Android:**
   - Verificar versões do Gradle
   - Limpar cache: `flutter clean`

4. **Erro de build iOS:**
   - Verificar certificados
   - Limpar DerivedData do Xcode

## 📞 Suporte

Para problemas específicos:
- Documentação oficial: https://docs.flutter.dev/
- Stack Overflow: Tag `flutter`
- GitHub Issues do projeto

---

**Sucesso no seu deploy! 🚀**