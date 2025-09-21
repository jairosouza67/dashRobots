# Flutter Trading Dashboard

Um aplicativo Flutter moderno e completo para monitoramento de robôs de trading MT5, desenvolvido especificamente para integração com o sistema de trading existente.

## 🚀 Funcionalidades Principais

### 📱 Interface Moderna
- Design Material 3 com tema claro e escuro
- Interface responsiva e intuitiva
- Navegação fluida entre telas
- Animações suaves e feedback visual

### 📊 Dashboard Completo
- Visão geral da conta de trading
- Estatísticas em tempo real
- Gráficos de performance
- Status dos robôs ativos
- Histórico de trades recentes

### 🤖 Gerenciamento de Robôs
- Visualização de todos os robôs
- Controle de start/stop remoto
- Configuração de parâmetros
- Monitoramento de status e erros
- Estatísticas individuais por robô

### 📈 Monitoramento de Trades
- Lista completa de trades
- Filtros por status e robô
- Fechamento manual de posições
- Modificação de SL/TP
- Histórico detalhado

### 👤 Informações da Conta
- Dados completos da conta MT5
- Balanço, equity e margem
- Níveis de margem e alavancagem
- Status de conexão
- Permissões de trading

### ⚙️ Configurações Avançadas
- Configuração de notificações
- Temas personalizáveis
- Intervalos de atualização
- Gerenciamento de cache
- Reset de dados

## 🛠️ Tecnologias Utilizadas

### Framework e Linguagem
- **Flutter 3.x** - Framework multiplataforma
- **Dart** - Linguagem de programação

### Gerenciamento de Estado
- **Provider** - Gerenciamento de estado reativo
- **ChangeNotifier** - Notificação de mudanças

### Comunicação
- **HTTP/Dio** - Requisições REST API
- **WebSocket** - Comunicação em tempo real
- **Firebase Messaging** - Notificações push

### Persistência
- **SharedPreferences** - Armazenamento local
- **SQLite** - Banco de dados local

### Interface
- **Material Design 3** - Sistema de design Google
- **Google Fonts** - Tipografia personalizada
- **FL Chart** - Gráficos interativos
- **Font Awesome** - Ícones adicionais

### Navegação
- **GoRouter** - Roteamento declarativo
- **Bottom Navigation** - Navegação principal

## 📱 Estrutura do Projeto

```
lib/
├── config/                 # Configurações do app
│   ├── app_router.dart     # Configuração de rotas
│   ├── app_theme.dart      # Temas e cores
│   └── main_layout.dart    # Layout principal
├── models/                 # Modelos de dados
│   ├── account.dart        # Modelo da conta
│   ├── robot.dart          # Modelo do robô
│   ├── trade.dart          # Modelo do trade
│   └── stats.dart          # Modelo de estatísticas
├── providers/              # Gerenciamento de estado
│   ├── account_provider.dart
│   ├── robots_provider.dart
│   ├── trades_provider.dart
│   └── stats_provider.dart
├── screens/                # Telas do aplicativo
│   ├── dashboard_screen.dart
│   ├── trades_screen.dart
│   ├── robots_screen.dart
│   ├── account_screen.dart
│   └── settings_screen.dart
├── services/               # Serviços e APIs
│   ├── api_service.dart    # Cliente REST API
│   ├── websocket_service.dart # Cliente WebSocket
│   ├── notification_service.dart # Notificações
│   └── storage_service.dart # Armazenamento local
├── widgets/                # Componentes reutilizáveis
│   ├── trade_card.dart     # Card de trade
│   ├── robot_status_card.dart # Card de robô
│   ├── stats_card.dart     # Card de estatística
│   └── chart_widget.dart   # Widget de gráfico
└── main.dart              # Ponto de entrada
```

## 🔧 Configuração e Instalação

### Pré-requisitos
- Flutter SDK 3.0+
- Dart SDK 3.0+
- Android Studio / VS Code
- Dispositivo Android/iOS ou emulador

### Passos de Instalação

1. **Clone o projeto** (se aplicável)
```bash
git clone <repository-url>
cd flutter_trading_app
```

2. **Instale as dependências**
```bash
flutter pub get
```

3. **Gere os arquivos necessários**
```bash
flutter packages pub run build_runner build
```

4. **Configure o Firebase** (opcional)
   - Crie um projeto no Firebase Console
   - Adicione o arquivo `google-services.json` (Android)
   - Adicione o arquivo `GoogleService-Info.plist` (iOS)

5. **Execute o aplicativo**
```bash
flutter run
```

## 🔗 Integração com Backend

O aplicativo foi projetado para integrar com o sistema de trading existente através de:

### API REST
- Endpoint base: `http://localhost:8000/api`
- Autenticação via headers
- Operações CRUD para trades, robôs e conta

### WebSocket
- Conexão: `ws://localhost:8000/ws`
- Updates em tempo real
- Comandos de controle remoto

### Firebase (Opcional)
- Notificações push
- Analytics
- Crash reporting

## 📊 Funcionalidades Principais

### Dashboard
- **Visão Geral**: Status da conta, robôs ativos, trades abertos
- **Gráficos**: Performance diária, trades por período
- **Cards Informativos**: Balanço, equity, profit, win rate

### Gerenciamento de Robôs
- **Lista Completa**: Todos os robôs configurados
- **Controles**: Start/Stop remoto via WebSocket
- **Status**: Ativo, Inativo, Erro com detalhes
- **Configurações**: Parâmetros editáveis

### Monitoramento de Trades
- **Lista Filtrada**: Por status (aberto, fechado, pendente)
- **Ações**: Fechar posição, modificar SL/TP
- **Detalhes**: Informações completas de cada trade

### Conta
- **Informações Completas**: Dados da conta MT5
- **Status de Conexão**: Indicador visual
- **Permissões**: Trading permitido, EAs habilitados

## 🎨 Customização

### Temas
- Suporte a tema claro e escuro
- Cores personalizáveis para trading
- Adaptação automática ao sistema

### Notificações
- Configuração granular
- Diferentes tipos de alertas
- Personalização por evento

## 🚀 Próximos Passos

### Funcionalidades Futuras
- [ ] Análise técnica integrada
- [ ] Alertas personalizados
- [ ] Backup na nuvem
- [ ] Multi-conta
- [ ] Relatórios PDF
- [ ] Copy trading

### Melhorias de Performance
- [ ] Cache inteligente
- [ ] Lazy loading
- [ ] Otimização de imagens
- [ ] Background sync

## 📄 Licença

Este projeto foi desenvolvido como parte do sistema de trading e está sujeito aos termos de uso estabelecidos.

## 🤝 Suporte

Para suporte técnico ou dúvidas sobre o aplicativo:
- Documentação completa na pasta do projeto
- Logs detalhados para debugging
- Configuração flexível para diferentes ambientes

---

**Desenvolvido com ❤️ usando Flutter**