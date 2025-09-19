# 🚀 Guia Completo: Conectar Conta XM 308733384 ao Dashboard

## ✅ **PASSO 1: Preparar Arquivos**

### 1.1 Copiar arquivos para o MT5
Copie estes 2 arquivos para a pasta `Include` do seu MT5:

📁 **Pasta destino**: `C:\Users\[SeuUsuário]\AppData\Roaming\MetaQuotes\Terminal\[HashDoTerminal]\MQL5\Include\`

📄 **Arquivos a copiar:**
- `XM_DashboardConnector.mqh` 
- `XM_DashboardTest.mq5` (este vai para `Experts\`)

### 1.2 Localizar pasta do MT5
Se não souber onde está, no MT5:
1. Pressione `Ctrl+Shift+D` (abre Data Folder)
2. Navegue para `MQL5\Include\`
3. Cole o arquivo `XM_DashboardConnector.mqh`
4. Navegue para `MQL5\Experts\`
5. Cole o arquivo `XM_DashboardTest.mq5`

## ✅ **PASSO 2: Configurar MT5**

### 2.1 Habilitar DLL e WebRequests
No MT5:
1. `Ferramentas` → `Opções` → `Expert Advisors`
2. ✅ Marque: `Permitir importação de DLL`
3. ✅ Marque: `Permitir WebRequest para listar URLs`
4. Em URLs permitidas, adicione: `http://localhost:4173`

### 2.2 Configurar permissões de arquivo
No MT5:
1. `Ferramentas` → `Opções` → `Expert Advisors`  
2. ✅ Marque: `Permitir modificação de arquivos`

## ✅ **PASSO 3: Iniciar Dashboard**

### 3.1 Abrir terminal no projeto
```powershell
cd "E:\VS Code\trading_system\trading-dashboard"
```

### 3.2 Iniciar servidor
```powershell
npm run preview -- --host
```

### 3.3 Verificar se está funcionando
Acesse: http://localhost:4173/
- ✅ Deve aparecer o dashboard
- ✅ Selecione "**Arquivo**" no cabeçalho
- ✅ Deve mostrar dados de exemplo

## ✅ **PASSO 4: Testar Conexão**

### 4.1 Abrir EA no MT5
1. No **Navegador** do MT5, vá em `Expert Advisors`
2. Encontre `XM_DashboardTest` 
3. Arraste para um gráfico (EURUSD recomendado)

### 4.2 Configurar parâmetros
Na janela que abrir:
- **RobotName**: `Meu_Primeiro_Robot`
- **MagicNumber**: `308733384` (seu número da conta)
- **HeartbeatInterval**: `30` (segundos)
- **EnableAutoTrading**: `false` (deixe falso para teste)

### 4.3 Verificar logs
Na aba **Journal** do MT5, deve aparecer:
```
=== Iniciando XM Dashboard Test EA ===
Conta: 308733384
Servidor: XMGlobal-MT5
✅ Conta XM 308733384 confirmada!
🚀 EA iniciado com sucesso!
📊 Dashboard: http://localhost:4173/
```

## ✅ **PASSO 5: Verificar Dashboard**

### 5.1 Atualizar dashboard
1. Acesse: http://localhost:4173/
2. Verifique se aparece "**Conectado**" (verde) no cabeçalho
3. Vá na aba "**Robôs**"
4. Deve aparecer seu robô: `Meu_Primeiro_Robot`

### 5.2 Verificar dados da conta
Na aba "**Conta**", deve mostrar:
- Número da conta: 308733384
- Saldo atual da sua conta XM
- Equity, margem, etc.

## 🔍 **TROUBLESHOOTING**

### ❌ **"Erro ao escrever arquivo"**
**Solução:**
1. Execute como administrador: 
   ```powershell
   icacls "E:\VS Code\trading_system\trading-dashboard\public\robot_data" /grant *S-1-1-0:F
   ```
2. Ou mude o caminho no arquivo `XM_DashboardConnector.mqh` linha 20

### ❌ **"Dashboard mostra Desconectado"**
**Soluções:**
1. Verifique se o EA está rodando (deve ter sorriso verde no gráfico)
2. Olhe a aba **Journal** do MT5 para erros
3. Confirme que selecionou "**Arquivo**" no dashboard
4. Recompile o EA: pressione F7 no MetaEditor

### ❌ **"Cannot open include file"**
**Solução:**
1. Verifique se copiou `XM_DashboardConnector.mqh` para pasta `Include`
2. Recompile: F7 no MetaEditor

### ❌ **"Conta diferente de 308733384"**
**É normal!** O EA funcionará mesmo assim. A mensagem é só informativa.

## 🚀 **PRÓXIMOS PASSOS**

### 1. Teste com Trading Manual
1. Abra uma posição manualmente no MT5
2. Verifique se aparece no dashboard
3. Feche a posição
4. Confirme se os dados são atualizados

### 2. Integrar seus Robôs Existentes
Para cada robô que você já tem:
1. Adicione no `OnInit()`:
   ```mql5
   #include "XM_DashboardConnector.mqh"
   XM_DashboardConnector* dashboard;
   
   dashboard = new XM_DashboardConnector("Nome_Do_Seu_Robot", SEU_MAGIC_NUMBER);
   ```

2. Adicione no `OnTick()`:
   ```mql5
   static datetime last_heartbeat = 0;
   if(TimeCurrent() - last_heartbeat >= 60) {
       dashboard.SendHeartbeat();
       last_heartbeat = TimeCurrent();
   }
   ```

### 3. Trading Automático de Teste
**⚠️ CUIDADO:** Apenas para testes!
1. Mude `EnableAutoTrading` para `true`
2. Defina `TestLotSize` para um valor baixo (0.01)
3. Monitore no dashboard

## 📞 **Precisa de Ajuda?**

Se algo não funcionar:
1. ✅ Verifique se seguiu todos os passos
2. 📋 Copie os logs do **Journal** do MT5
3. 🖼️ Tire print do dashboard
4. 💬 Me envie os detalhes do erro

**Seu sistema está quase pronto! 🎉**