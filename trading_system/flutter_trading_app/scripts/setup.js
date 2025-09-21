const inquirer = require('inquirer');
const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');

class FlutterSetupHelper {
    constructor() {
        this.spinner = ora();
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        switch (type) {
            case 'success':
                console.log(chalk.green(`[${timestamp}] ✅ ${message}`));
                break;
            case 'error':
                console.log(chalk.red(`[${timestamp}] ❌ ${message}`));
                break;
            case 'warning':
                console.log(chalk.yellow(`[${timestamp}] ⚠️  ${message}`));
                break;
            default:
                console.log(chalk.blue(`[${timestamp}] ℹ️  ${message}`));
        }
    }

    async showWelcome() {
        console.clear();
        console.log(chalk.cyan('🚀 Flutter Trading App - Setup Assistant\n'));
        console.log(chalk.white('Este assistente irá ajudá-lo a configurar o ambiente Flutter\n'));
    }

    async checkSystem() {
        this.log('Verificando sistema...', 'info');
        
        const platform = process.platform;
        this.log(`Sistema detectado: ${platform}`, 'success');

        // Verificar Git
        try {
            execSync('git --version', { stdio: 'pipe' });
            this.log('Git encontrado', 'success');
        } catch (error) {
            this.log('Git não encontrado - necessário para Flutter', 'error');
            this.showGitInstallation();
            return false;
        }

        // Verificar Node.js
        try {
            const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
            this.log(`Node.js encontrado: ${nodeVersion}`, 'success');
        } catch (error) {
            this.log('Node.js não encontrado', 'warning');
        }

        return true;
    }

    showGitInstallation() {
        console.log(chalk.red('\n📋 Instalação do Git necessária:'));
        console.log(chalk.white('1. Acesse: https://git-scm.com/download/'));
        console.log(chalk.white('2. Baixe e instale para seu sistema operacional'));
        console.log(chalk.white('3. Execute este script novamente após a instalação\n'));
    }

    showFlutterInstallation() {
        const platform = process.platform;
        
        console.log(chalk.cyan('\n📱 Instalação do Flutter SDK:'));
        
        if (platform === 'win32') {
            console.log(chalk.white('🪟 Windows:'));
            console.log(chalk.white('1. Acesse: https://docs.flutter.dev/get-started/install/windows'));
            console.log(chalk.white('2. Baixe o Flutter SDK'));
            console.log(chalk.white('3. Extraia para C:\\flutter\\'));
            console.log(chalk.white('4. Adicione C:\\flutter\\bin ao PATH'));
            console.log(chalk.white('5. Execute: flutter doctor'));
        } else if (platform === 'darwin') {
            console.log(chalk.white('🍎 macOS:'));
            console.log(chalk.white('1. Instale via Homebrew: brew install --cask flutter'));
            console.log(chalk.white('2. Ou baixe de: https://docs.flutter.dev/get-started/install/macos'));
            console.log(chalk.white('3. Execute: flutter doctor'));
        } else {
            console.log(chalk.white('🐧 Linux:'));
            console.log(chalk.white('1. Acesse: https://docs.flutter.dev/get-started/install/linux'));
            console.log(chalk.white('2. Baixe e extraia o Flutter SDK'));
            console.log(chalk.white('3. Adicione ao PATH: export PATH="$PATH:`pwd`/flutter/bin"'));
            console.log(chalk.white('4. Execute: flutter doctor'));
        }
    }

    showAndroidStudioSetup() {
        console.log(chalk.yellow('\n📱 Android Studio (necessário para desenvolvimento Android):'));
        console.log(chalk.white('1. Baixe: https://developer.android.com/studio'));
        console.log(chalk.white('2. Instale o Android Studio'));
        console.log(chalk.white('3. Configure o Android SDK'));
        console.log(chalk.white('4. Instale os plugins Flutter e Dart'));
        console.log(chalk.white('5. Execute: flutter doctor --android-licenses'));
    }

    showVSCodeSetup() {
        console.log(chalk.blue('\n💻 VS Code (recomendado):'));
        console.log(chalk.white('1. Baixe: https://code.visualstudio.com/'));
        console.log(chalk.white('2. Instale as extensões:'));
        console.log(chalk.white('   - Flutter'));
        console.log(chalk.white('   - Dart'));
        console.log(chalk.white('   - Flutter Tree'));
    }

    async checkFlutterDoctor() {
        this.spinner.start('Executando flutter doctor...');
        try {
            const doctorOutput = execSync('flutter doctor -v', { encoding: 'utf8' });
            this.spinner.succeed('Flutter doctor executado');
            console.log(doctorOutput);
            return true;
        } catch (error) {
            this.spinner.fail('Flutter não encontrado');
            return false;
        }
    }

    async createProjectStructure() {
        const { createStructure } = await inquirer.prompt([{
            type: 'confirm',
            name: 'createStructure',
            message: 'Criar estrutura adicional do projeto?',
            default: true
        }]);

        if (createStructure) {
            this.spinner.start('Criando estrutura do projeto...');
            
            try {
                // Criar diretórios adicionais
                const fs = require('fs');
                const path = require('path');
                
                const dirs = [
                    'assets/images',
                    'assets/icons',
                    'assets/fonts',
                    'test/unit',
                    'test/widget',
                    'test/integration',
                    'android/app/src/main/res/drawable',
                    'ios/Runner/Assets.xcassets'
                ];

                for (const dir of dirs) {
                    const fullPath = path.join(process.cwd(), dir);
                    if (!fs.existsSync(fullPath)) {
                        fs.mkdirSync(fullPath, { recursive: true });
                    }
                }

                this.spinner.succeed('Estrutura do projeto criada');
            } catch (error) {
                this.spinner.fail('Erro ao criar estrutura');
            }
        }
    }

    async showNextSteps() {
        console.log(chalk.green('\n🎉 Próximos passos:'));
        console.log(chalk.white('1. Verifique se flutter doctor não tem problemas'));
        console.log(chalk.white('2. Conecte um dispositivo ou configure um emulador'));
        console.log(chalk.white('3. Execute: npm run deploy'));
        console.log(chalk.white('4. Selecione o tipo de build desejado'));
        console.log(chalk.white('\n💡 Comandos úteis:'));
        console.log(chalk.gray('   flutter devices - listar dispositivos'));
        console.log(chalk.gray('   flutter emulators - listar emuladores'));
        console.log(chalk.gray('   flutter run - executar em desenvolvimento'));
        console.log(chalk.gray('   npm run deploy - ferramenta de deploy completa'));
    }

    async run() {
        await this.showWelcome();
        
        if (!(await this.checkSystem())) {
            return;
        }

        // Verificar Flutter
        if (!(await this.checkFlutterDoctor())) {
            this.showFlutterInstallation();
            this.showAndroidStudioSetup();
            this.showVSCodeSetup();
            console.log(chalk.yellow('\n⚠️  Execute este script novamente após instalar o Flutter\n'));
            return;
        }

        await this.createProjectStructure();
        await this.showNextSteps();
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    const setup = new FlutterSetupHelper();
    setup.run().catch(console.error);
}

module.exports = FlutterSetupHelper;