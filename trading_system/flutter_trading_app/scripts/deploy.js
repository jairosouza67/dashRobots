const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

class FlutterDeployTool {
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

    async checkFlutter() {
        try {
            const version = execSync('flutter --version', { encoding: 'utf8' });
            this.log('Flutter SDK encontrado', 'success');
            console.log(chalk.gray(version.split('\n')[0]));
            return true;
        } catch (error) {
            this.log('Flutter SDK não encontrado no PATH', 'error');
            console.log(chalk.red('\nPara instalar o Flutter:'));
            console.log(chalk.white('1. Acesse: https://docs.flutter.dev/get-started/install'));
            console.log(chalk.white('2. Baixe o SDK para seu sistema operacional'));
            console.log(chalk.white('3. Adicione o Flutter ao PATH do sistema'));
            return false;
        }
    }

    async checkDoctor() {
        this.spinner.start('Verificando configuração do Flutter...');
        try {
            const doctor = execSync('flutter doctor', { encoding: 'utf8' });
            this.spinner.succeed('Verificação concluída');
            console.log(doctor);
            return true;
        } catch (error) {
            this.spinner.fail('Problemas encontrados na configuração');
            return false;
        }
    }

    async installDependencies() {
        this.spinner.start('Limpando cache anterior...');
        try {
            execSync('flutter clean', { stdio: 'pipe' });
            this.spinner.succeed('Cache limpo');
        } catch (error) {
            this.spinner.warn('Falha ao limpar cache');
        }

        this.spinner.start('Instalando dependências...');
        try {
            execSync('flutter pub get', { stdio: 'pipe' });
            this.spinner.succeed('Dependências instaladas');
        } catch (error) {
            this.spinner.fail('Falha ao instalar dependências');
            throw error;
        }

        this.spinner.start('Gerando arquivos de serialização...');
        try {
            execSync('flutter packages pub run build_runner build', { stdio: 'pipe' });
            this.spinner.succeed('Arquivos gerados');
        } catch (error) {
            this.spinner.warn('Falha ao gerar arquivos (pode ser ignorado se não usar serialização)');
        }
    }

    async runAnalysis() {
        this.spinner.start('Executando análise de código...');
        try {
            execSync('flutter analyze', { stdio: 'pipe' });
            this.spinner.succeed('Código analisado sem problemas');
            return true;
        } catch (error) {
            this.spinner.warn('Análise encontrou problemas - revise antes de continuar');
            return false;
        }
    }

    async buildAndroid(type = 'debug') {
        const buildType = type === 'release' ? '--release' : '--debug';
        const command = type === 'bundle' ? 
            `flutter build appbundle --release` : 
            `flutter build apk ${buildType}`;

        this.spinner.start(`Construindo ${type} para Android...`);
        try {
            execSync(command, { stdio: 'pipe' });
            this.spinner.succeed(`Build ${type} concluído`);
            
            if (type === 'bundle') {
                this.log('App Bundle criado em: build/app/outputs/bundle/release/app-release.aab', 'success');
            } else {
                const apkPath = type === 'release' ? 
                    'build/app/outputs/flutter-apk/app-release.apk' :
                    'build/app/outputs/flutter-apk/app-debug.apk';
                this.log(`APK criado em: ${apkPath}`, 'success');
            }
            return true;
        } catch (error) {
            this.spinner.fail(`Falha no build ${type}`);
            throw error;
        }
    }

    async buildWeb() {
        this.spinner.start('Construindo para Web...');
        try {
            execSync('flutter build web', { stdio: 'pipe' });
            this.spinner.succeed('Build Web concluído');
            this.log('Arquivos criados em: build/web/', 'success');
            return true;
        } catch (error) {
            this.spinner.fail('Falha no build Web');
            throw error;
        }
    }

    async serveWeb(port = 8080) {
        this.log(`Iniciando servidor web na porta ${port}...`, 'info');
        try {
            const { spawn } = require('child_process');
            const server = spawn('flutter', ['run', '-d', 'web-server', '--web-port', port.toString()], {
                stdio: 'inherit'
            });

            this.log(`Servidor rodando em: http://localhost:${port}`, 'success');
            this.log('Pressione Ctrl+C para parar o servidor', 'info');

            server.on('close', (code) => {
                this.log('Servidor encerrado', 'info');
            });

            return server;
        } catch (error) {
            this.log('Falha ao iniciar servidor', 'error');
            throw error;
        }
    }

    async runTests() {
        this.spinner.start('Executando testes...');
        try {
            execSync('flutter test', { stdio: 'pipe' });
            this.spinner.succeed('Todos os testes passaram');
            return true;
        } catch (error) {
            this.spinner.fail('Alguns testes falharam');
            return false;
        }
    }

    async showBuildMenu() {
        const choices = [
            { name: '📱 Debug APK (desenvolvimento)', value: 'debug-apk' },
            { name: '📱 Release APK (produção)', value: 'release-apk' },
            { name: '📦 App Bundle (Google Play)', value: 'bundle' },
            { name: '🌐 Web Build', value: 'web' },
            { name: '🖥️  Windows Build', value: 'windows' },
            { name: '🏃 Executar em dispositivo', value: 'run' },
            { name: '🌐 Servir Web localmente', value: 'serve-web' },
            { name: '🧪 Executar testes', value: 'test' }
        ];

        const { buildType } = await inquirer.prompt([{
            type: 'list',
            name: 'buildType',
            message: 'Selecione o tipo de build:',
            choices
        }]);

        return buildType;
    }

    async deploy() {
        console.log(chalk.cyan('🚀 Flutter Trading App - Deploy Tool\n'));

        // Verificar Flutter
        if (!(await this.checkFlutter())) {
            process.exit(1);
        }

        // Instalar dependências
        try {
            await this.installDependencies();
        } catch (error) {
            this.log('Falha na instalação de dependências', 'error');
            process.exit(1);
        }

        // Análise de código
        await this.runAnalysis();

        // Menu de build
        const buildType = await this.showBuildMenu();

        try {
            switch (buildType) {
                case 'debug-apk':
                    await this.buildAndroid('debug');
                    break;
                case 'release-apk':
                    await this.buildAndroid('release');
                    break;
                case 'bundle':
                    await this.buildAndroid('bundle');
                    break;
                case 'web':
                    await this.buildWeb();
                    break;
                case 'windows':
                    this.spinner.start('Construindo para Windows...');
                    execSync('flutter build windows --release', { stdio: 'pipe' });
                    this.spinner.succeed('Build Windows concluído');
                    this.log('Arquivos criados em: build/windows/runner/Release/', 'success');
                    break;
                case 'run':
                    this.log('Executando em dispositivo conectado...', 'info');
                    execSync('flutter run', { stdio: 'inherit' });
                    break;
                case 'serve-web':
                    await this.serveWeb();
                    break;
                case 'test':
                    await this.runTests();
                    break;
            }

            console.log(chalk.green('\n✅ Deploy concluído com sucesso!\n'));

        } catch (error) {
            this.log('Erro durante o build', 'error');
            console.error(error.message);
            process.exit(1);
        }
    }
}

module.exports = FlutterDeployTool;

// Se executado diretamente
if (require.main === module) {
    const deployTool = new FlutterDeployTool();
    deployTool.deploy().catch(console.error);
}