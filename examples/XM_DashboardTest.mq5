//+------------------------------------------------------------------+
//| XM_DashboardTest.mq5 - Expert Advisor para testar conexão      |
//| Conecta sua conta XM 308733384 ao Trading Dashboard             |
//| Copyright 2024, Jairo Souza                                      |
//+------------------------------------------------------------------+

#property copyright "Copyright 2024, Jairo Souza"
#property link      "https://github.com/jairosouza67/dashRobots"
#property version   "1.00"

#include "XM_DashboardConnector.mqh"

//--- Parâmetros de entrada
input string RobotName = "XM_TestBot";           // Nome do robô no dashboard
input ulong  MagicNumber = 308733384;            // Magic number (usando número da conta)
input int    HeartbeatInterval = 30;             // Intervalo de heartbeat em segundos
input bool   EnableAutoTrading = false;          // Habilitar trading automático (CUIDADO!)
input double TestLotSize = 0.01;                 // Tamanho do lote para testes
input int    TestSLPoints = 100;                 // Stop Loss em points
input int    TestTPPoints = 200;                 // Take Profit em points

//--- Variáveis globais
XM_DashboardConnector* dashboard;
datetime last_heartbeat;
ulong last_position_ticket = 0;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
    Print("=== Iniciando XM Dashboard Test EA ===");
    Print("Conta: ", AccountInfoInteger(ACCOUNT_LOGIN));
    Print("Servidor: ", AccountInfoString(ACCOUNT_SERVER));
    Print("Saldo: $", AccountInfoDouble(ACCOUNT_BALANCE));
    
    // Verifica se é a conta correta
    if(AccountInfoInteger(ACCOUNT_LOGIN) != 308733384)
    {
        Print("⚠️  ATENÇÃO: Esta não é a conta 308733384!");
        Print("Conta atual: ", AccountInfoInteger(ACCOUNT_LOGIN));
        Print("Continuando mesmo assim para testes...");
    }
    else
    {
        Print("✅ Conta XM 308733384 confirmada!");
    }
    
    // Inicializa connector do dashboard
    dashboard = new XM_DashboardConnector(RobotName, MagicNumber);
    
    // Enviar primeiro heartbeat
    dashboard.SendHeartbeat();
    last_heartbeat = TimeCurrent();
    
    Print("🚀 EA iniciado com sucesso!");
    Print("📊 Dashboard: http://localhost:4173/");
    Print("⏰ Heartbeat a cada ", HeartbeatInterval, " segundos");
    
    if(EnableAutoTrading)
    {
        Print("🤖 Trading automático ATIVADO");
        Print("💰 Lote de teste: ", TestLotSize);
    }
    else
    {
        Print("📊 Modo MONITORAMENTO (sem trading)");
    }
    
    return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
    Print("=== Finalizando XM Dashboard Test EA ===");
    
    // Enviar último heartbeat
    if(dashboard != NULL)
    {
        dashboard.SendHeartbeat();
        delete dashboard;
        dashboard = NULL;
    }
    
    Print("👋 EA finalizado. Razão: ", reason);
}

//+------------------------------------------------------------------+
//| Expert tick function                                              |
//+------------------------------------------------------------------+
void OnTick()
{
    // Enviar heartbeat periodicamente
    if(TimeCurrent() - last_heartbeat >= HeartbeatInterval)
    {
        if(dashboard != NULL)
        {
            dashboard.SendHeartbeat();
            last_heartbeat = TimeCurrent();
            
            // Log de atividade
            static int heartbeat_count = 0;
            heartbeat_count++;
            if(heartbeat_count % 10 == 0)  // Log a cada 10 heartbeats
            {
                Print("📡 Heartbeat #", heartbeat_count, " | Posições: ", PositionsTotal(), " | Equity: $", AccountInfoDouble(ACCOUNT_EQUITY));
            }
        }
    }
    
    // Monitorar novas posições
    MonitorPositions();
    
    // Trading automático de teste (se habilitado)
    if(EnableAutoTrading)
    {
        AutoTradingLogic();
    }
}

//+------------------------------------------------------------------+
//| Função para monitorar posições                                   |
//+------------------------------------------------------------------+
void MonitorPositions()
{
    // Verifica se há novas posições
    for(int i = PositionsTotal() - 1; i >= 0; i--)
    {
        if(PositionGetTicket(i) > 0)
        {
            ulong ticket = PositionGetTicket(i);
            
            // Se for uma posição nossa e ainda não foi reportada
            if((MagicNumber == 0 || PositionGetInteger(POSITION_MAGIC) == MagicNumber) && 
               ticket != last_position_ticket)
            {
                if(dashboard != NULL)
                {
                    dashboard.ReportPositionOpen(ticket);
                    last_position_ticket = ticket;
                }
            }
        }
    }
}

//+------------------------------------------------------------------+
//| Lógica de trading automático para teste                          |
//+------------------------------------------------------------------+
void AutoTradingLogic()
{
    // CUIDADO: Esta é uma lógica MUITO simples para testes!
    // NÃO use em conta real sem estudar primeiro!
    
    static datetime last_trade_time = 0;
    
    // Só faz um trade a cada 5 minutos para evitar spam
    if(TimeCurrent() - last_trade_time < 300) return;
    
    // Se já tem posição, não abre nova
    if(CountMyPositions() > 0) return;
    
    // Lógica super simples: compra se preço subiu nas últimas 3 barras
    double close1 = iClose(Symbol(), PERIOD_CURRENT, 1);
    double close2 = iClose(Symbol(), PERIOD_CURRENT, 2);
    double close3 = iClose(Symbol(), PERIOD_CURRENT, 3);
    
    if(close1 > close2 && close2 > close3)
    {
        OpenTestPosition(ORDER_TYPE_BUY);
        last_trade_time = TimeCurrent();
    }
    else if(close1 < close2 && close2 < close3)
    {
        OpenTestPosition(ORDER_TYPE_SELL);
        last_trade_time = TimeCurrent();
    }
}

//+------------------------------------------------------------------+
//| Abre posição de teste                                            |
//+------------------------------------------------------------------+
void OpenTestPosition(ENUM_ORDER_TYPE type)
{
    MqlTradeRequest request = {};
    MqlTradeResult result = {};
    
    double price = (type == ORDER_TYPE_BUY) ? SymbolInfoDouble(Symbol(), SYMBOL_ASK) : SymbolInfoDouble(Symbol(), SYMBOL_BID);
    double point = SymbolInfoDouble(Symbol(), SYMBOL_POINT);
    int digits = (int)SymbolInfoInteger(Symbol(), SYMBOL_DIGITS);
    
    request.action = TRADE_ACTION_DEAL;
    request.symbol = Symbol();
    request.volume = TestLotSize;
    request.type = type;
    request.price = price;
    request.magic = MagicNumber;
    request.comment = "XM Dashboard Test";
    
    // Stop Loss e Take Profit
    if(type == ORDER_TYPE_BUY)
    {
        request.sl = NormalizeDouble(price - TestSLPoints * point, digits);
        request.tp = NormalizeDouble(price + TestTPPoints * point, digits);
    }
    else
    {
        request.sl = NormalizeDouble(price + TestSLPoints * point, digits);
        request.tp = NormalizeDouble(price - TestTPPoints * point, digits);
    }
    
    if(OrderSend(request, result))
    {
        Print("✅ Posição teste aberta: #", result.order, " | Tipo: ", EnumToString(type), " | Lote: ", TestLotSize);
        
        if(dashboard != NULL && result.order > 0)
        {
            dashboard.ReportPositionOpen(result.order);
        }
    }
    else
    {
        Print("❌ Erro ao abrir posição: ", result.retcode, " - ", result.comment);
    }
}

//+------------------------------------------------------------------+
//| Conta posições do EA                                             |
//+------------------------------------------------------------------+
int CountMyPositions()
{
    int count = 0;
    for(int i = PositionsTotal() - 1; i >= 0; i--)
    {
        if(PositionGetTicket(i) > 0)
        {
            if(MagicNumber == 0 || PositionGetInteger(POSITION_MAGIC) == MagicNumber)
                count++;
        }
    }
    return count;
}

//+------------------------------------------------------------------+
//| Event handler para quando posição é fechada                      |
//+------------------------------------------------------------------+
void OnTradeTransaction(const MqlTradeTransaction& trans,
                       const MqlTradeRequest& request,
                       const MqlTradeResult& result)
{
    // Detecta quando uma posição é fechada
    if(trans.type == TRADE_TRANSACTION_DEAL_ADD)
    {
        if(HistoryDealSelect(trans.deal))
        {
            ulong deal_magic = HistoryDealGetInteger(trans.deal, DEAL_MAGIC);
            if(deal_magic == MagicNumber || MagicNumber == 0)
            {
                if(HistoryDealGetInteger(trans.deal, DEAL_ENTRY) == DEAL_ENTRY_OUT)
                {
                    double profit = HistoryDealGetDouble(trans.deal, DEAL_PROFIT);
                    profit += HistoryDealGetDouble(trans.deal, DEAL_SWAP);
                    profit += HistoryDealGetDouble(trans.deal, DEAL_COMMISSION);
                    
                    Print("💰 Posição fechada: Deal #", trans.deal, " | Lucro: $", profit);
                    
                    if(dashboard != NULL)
                    {
                        dashboard.ReportPositionClose(trans.deal, profit);
                    }
                }
            }
        }
    }
}