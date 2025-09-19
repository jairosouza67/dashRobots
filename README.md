# 🤖 Trading Dashboard - Integração com Robôs XM

Um dashboard moderno e responsivo para monitoramento de robôs de trading automatizados da XM. Built with React, Vite, e TailwindCSS.

![Trading Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.3.6-yellow)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.7-blue)

## 🌟 Features

- **📊 Dashboard Completo**: Visualização em tempo real de trades, lucros e performance
- **🤖 Monitor de Robôs**: Status, heartbeat e controle de Expert Advisors
- **📈 Gráficos Interativos**: Charts de performance e análise de dados
- **🔄 Múltiplas Fontes**: Suporte para arquivos, API REST, WebSocket e dados demo
- **📱 Responsivo**: Interface adaptável para desktop, tablet e mobile
- **⚡ Tempo Real**: Atualizações automáticas dos dados
- **🎨 UI Moderna**: Interface limpa e profissional

## 🚀 Demo Online

Acesse o dashboard funcionando: [Dashboard Demo](https://dashrobots.vercel.app)

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm

### Setup Rápido
```bash
# Clone o repositório
git clone https://github.com/jairosouza67/dashRobots.git
cd dashRobots

# Instale dependências
npm install --legacy-peer-deps

# Inicie em modo desenvolvimento
npm run dev

# Ou faça build e rode em produção
npm run build
npm run preview
```

## 🌐 Acesso Local

Após inicializar, acesse:
- **Local**: http://localhost:4173/
- **Rede**: http://[seu-ip]:4173/

## 🤖 Integração com Robôs XM

### Método 1: Arquivos JSON (Recomendado)

1. **Configure o caminho** nos seus EAs para salvar em:
   ```
   /public/robot_data/
   ```

2. **Use a biblioteca MQL4/MQL5** em `examples/TradeReporter.mqh`:
   ```mql4
   #include "TradeReporter.mqh"
   TradeReporter* reporter;
   
   int OnInit() {
       reporter = new TradeReporter("Meu_EA", "caminho/para/dashboard/public", 12345);
       return INIT_SUCCEEDED;
   }
   
   void OnTick() {
       // Enviar heartbeat a cada minuto
       static datetime last_heartbeat = 0;
       if(TimeCurrent() - last_heartbeat >= 60) {
           reporter.SendHeartbeat();
           last_heartbeat = TimeCurrent();
       }
   }
   ```

### Método 2: API REST

1. **Configure um servidor** (exemplo em `INTEGRATION_GUIDE.md`)
2. **Selecione "API REST"** no dashboard
3. **Configure seus robôs** para enviar HTTP requests

### Método 3: WebSocket (Tempo Real)

1. **Implemente servidor WebSocket**
2. **Selecione "WebSocket"** no dashboard  
3. **Receba atualizações instantâneas**

## 📋 Estrutura de Dados

### Trade JSON
```json
{
  "id": 1,
  "ticket": "154728394",
  "symbol": "EURUSD",
  "direction": "BUY", 
  "lot": 0.1,
  "entry_price": 1.0856,
  "profit": 15.50,
  "robot_name": "TrendFollowing_EA",
  "is_open": true
}
```

### Robot JSON
```json
{
  "id": 1,
  "name": "TrendFollowing_EA",
  "status": "ACTIVE",
  "current_positions": 2,
  "total_trades": 47,
  "profit_total": 1285.50,
  "last_heartbeat": "2024-01-15T14:45:00Z"
}
```

## 🛠️ Tecnologias

- **Frontend**: React 19.1, Vite 6.3
- **Styling**: TailwindCSS 4.1, Radix UI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build**: Vite com plugins otimizados

## 📊 Scripts Disponíveis

```bash
npm run dev        # Desenvolvimento
npm run build      # Build produção  
npm run preview    # Preview build local
npm run lint       # ESLint check
```

## 🔧 Configuração

### Fonte de Dados
Selecione no header do dashboard:
- **Arquivo**: Lê JSONs locais
- **API REST**: Conecta a servidor HTTP
- **WebSocket**: Conexão tempo real
- **Demo**: Dados fictícios para teste

### Customização
- Modifique `src/App.jsx` para layout
- Adicione novos serviços em `src/services/`
- Customize estilos em `src/App.css`

## 📖 Documentação Completa

Veja o guia detalhado: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙋‍♂️ Suporte

- **GitHub Issues**: [Reportar problemas](https://github.com/jairosouza67/dashRobots/issues)
- **Documentação**: Consulte `INTEGRATION_GUIDE.md`
- **Email**: Para dúvidas específicas

## 🎯 Roadmap

- [ ] Alertas por email/SMS
- [ ] Histórico de performance avançado
- [ ] Dashboard multi-conta
- [ ] App mobile nativo
- [ ] Integração com mais brokers

---

**⭐ Se este projeto te ajudou, deixe uma estrela no GitHub!**

Made with ❤️ for the trading community