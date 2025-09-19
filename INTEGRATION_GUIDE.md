# 🤖 Guia de Integração - Robôs XM com Trading Dashboard

## 📋 Resumo das Opções Implementadas

O dashboard agora suporta **4 fontes de dados diferentes**:

1. **📁 Arquivo (Recomendado para iniciantes)**
2. **🌐 API REST (Melhor para múltiplos robôs)**
3. **⚡ WebSocket (Tempo real)**
4. **🧪 Demo/Mock (Para testes)**

## 🚀 Opção 1: Integração via Arquivos (MAIS FÁCIL)

### Para seus robôs XM:

1. **Configure o caminho**: Seus robôs devem salvar arquivos JSON na pasta:
   ```
   E:\VS Code\trading_system\trading-dashboard\public\robot_data\
   ```

2. **Arquivos que os robôs devem gerar**:
   - `trades.json` - Lista de todas as operações
   - `robots.json` - Status dos robôs
   - `account.json` - Dados da conta

3. **Use o código MQL4/MQL5** em `examples/TradeReporter.mqh`

### Como implementar no seu EA:

```mql4
// No início do seu EA
#include "TradeReporter.mqh"
TradeReporter* reporter;

// No OnInit()
int OnInit() {
    // Ajuste o caminho para sua instalação
    reporter = new TradeReporter(
        "Meu_EA",  // Nome do seu robô
        "E:\\VS Code\\trading_system\\trading-dashboard\\public",  // Caminho
        12345      // Magic number
    );
    return INIT_SUCCEEDED;
}

// Quando abrir uma posição
void OnTradeOpen(int ticket) {
    reporter.ReportTradeOpen(ticket);
}

// Quando fechar uma posição  
void OnTradeClose(int ticket) {
    reporter.ReportTradeClose(ticket);
}

// No OnTick() - heartbeat a cada minuto
void OnTick() {
    static datetime last_heartbeat = 0;
    if(TimeCurrent() - last_heartbeat >= 60) {
        reporter.SendHeartbeat();
        last_heartbeat = TimeCurrent();
    }
}
```

## 🌐 Opção 2: API REST (AVANÇADO)

### 1. Crie um servidor simples:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let trades = [];
let robots = [];
let account = {};

// Endpoints para receber dados dos robôs
app.post('/api/trades', (req, res) => {
    trades.push(req.body);
    res.json({ success: true });
});

app.put('/api/robots/:id', (req, res) => {
    const index = robots.findIndex(r => r.id == req.params.id);
    if (index >= 0) {
        robots[index] = { ...robots[index], ...req.body };
    } else {
        robots.push({ id: req.params.id, ...req.body });
    }
    res.json({ success: true });
});

app.put('/api/account', (req, res) => {
    account = { ...account, ...req.body };
    res.json({ success: true });
});

// Endpoints para o dashboard buscar dados
app.get('/api/trades', (req, res) => res.json(trades));
app.get('/api/robots', (req, res) => res.json(robots));
app.get('/api/account', (req, res) => res.json(account));

app.listen(3000, () => {
    console.log('API rodando em http://localhost:3000');
});
```

### 2. No seu EA, faça requisições HTTP:

```mql4
// Função para enviar dados via HTTP POST
bool SendTradeData(string trade_json) {
    string url = "http://localhost:3000/api/trades";
    string headers = "Content-Type: application/json\r\n";
    
    char post_data[];
    char result[];
    string result_headers;
    
    StringToCharArray(trade_json, post_data, 0, StringLen(trade_json));
    
    int res = WebRequest("POST", url, headers, 5000, post_data, result, result_headers);
    
    return res == 200;
}
```

## ⚡ Opção 3: WebSocket (TEMPO REAL)

Para atualizações instantâneas, implemente um servidor WebSocket que:
- Recebe dados dos robôs
- Transmite para o dashboard em tempo real
- Permite envio de comandos para os robôs

## 🔧 Configuração no Dashboard

1. **Inicie o dashboard**:
   ```bash
   npm run preview -- --host
   ```

2. **Selecione a fonte de dados** no cabeçalho:
   - **Arquivo**: Para integração via arquivos JSON
   - **API REST**: Para servidor HTTP
   - **WebSocket**: Para tempo real
   - **Demo**: Para testar com dados fictícios

3. **Monitore a conexão**: Indicador verde/vermelho no cabeçalho

## 📊 Estrutura dos Dados

### Trade JSON:
```json
{
  "id": 1,
  "ticket": "154728394",
  "symbol": "EURUSD", 
  "direction": "BUY",
  "type": "OPEN",
  "lot": 0.1,
  "entry_price": 1.0856,
  "exit_price": null,
  "profit": 15.50,
  "robot_name": "Meu_EA",
  "open_time": "2024-01-15T14:30:00Z",
  "close_time": null,
  "is_open": true,
  "comment": "Signal confirmed"
}
```

### Robot JSON:
```json
{
  "id": 1,
  "name": "Meu_EA",
  "status": "ACTIVE",
  "current_positions": 2,
  "total_trades": 47,
  "profit_total": 1285.50,
  "last_heartbeat": "2024-01-15T14:45:00Z",
  "symbol": "EURUSD",
  "timeframe": "H1",
  "magic_number": 12345,
  "version": "2.1.0"
}
```

### Account JSON:
```json
{
  "account_number": "12345678",
  "broker": "XM Global",
  "currency": "USD",
  "balance": 10500.75,
  "equity": 10672.25,
  "margin": 425.50,
  "free_margin": 10246.75,
  "margin_level": 2509.8,
  "leverage": 500,
  "profit": 171.50,
  "last_update": "2024-01-15T14:45:30Z"
}
```

## 🎯 Próximos Passos

1. **Teste com dados demo** primeiro
2. **Implemente a integração via arquivo** (mais simples)
3. **Configure seus robôs** para gerar os JSONs
4. **Monitore no dashboard** se os dados estão chegando
5. **Evolua para API/WebSocket** se precisar de mais recursos

## 🔍 Troubleshooting

- **Dados não aparecem**: Verifique se os arquivos JSON estão na pasta correta
- **Erro de conexão**: Certifique-se que o servidor está rodando
- **Dados antigos**: Verifique se os robôs estão atualizando os arquivos
- **Performance**: Use WebSocket para muitos robôs/trades

## 📞 Suporte

Qualquer dúvida sobre a implementação, me pergunte! Posso ajudar com:
- Código MQL4/MQL5 específico
- Configuração de servidores
- Troubleshooting de conexões
- Otimizações de performance