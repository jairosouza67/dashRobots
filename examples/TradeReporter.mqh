//+------------------------------------------------------------------+
//| TradeReporter.mqh - Biblioteca para enviar dados ao Dashboard   |
//| Copyright 2024, Seu Nome                                         |
//+------------------------------------------------------------------+

#property copyright "Copyright 2024, Seu Nome"
#property link      "https://yourwebsite.com"
#property version   "1.00"

#include <json.mqh>  // Biblioteca JSON para MT4/MT5

//+------------------------------------------------------------------+
//| Classe para reportar dados ao Dashboard                          |
//+------------------------------------------------------------------+
class TradeReporter
{
private:
    string robot_name;
    string dashboard_path;
    int magic_number;
    
public:
    // Construtor
    TradeReporter(string name, string path, int magic = 0)
    {
        robot_name = name;
        dashboard_path = path;
        magic_number = magic;
    }
    
    // Reporta abertura de trade
    void ReportTradeOpen(int ticket)
    {
        if(!OrderSelect(ticket, SELECT_BY_TICKET)) return;
        
        string trade_data = CreateTradeJSON(ticket, "OPEN");
        AppendToFile(dashboard_path + "\\robot_data\\trades.json", trade_data);
        
        Print("Trade reportado: ", ticket);
    }
    
    // Reporta fechamento de trade
    void ReportTradeClose(int ticket)
    {
        if(!OrderSelect(ticket, SELECT_BY_TICKET)) return;
        
        string trade_data = CreateTradeJSON(ticket, "CLOSE");
        AppendToFile(dashboard_path + "\\robot_data\\trades.json", trade_data);
        
        Print("Fechamento reportado: ", ticket);
    }
    
    // Envia heartbeat do robô
    void SendHeartbeat()
    {
        string robot_data = CreateRobotJSON();
        UpdateRobotFile(dashboard_path + "\\robot_data\\robots.json", robot_data);
        
        // Atualiza dados da conta
        string account_data = CreateAccountJSON();
        WriteToFile(dashboard_path + "\\robot_data\\account.json", account_data);
    }
    
private:
    // Cria JSON do trade
    string CreateTradeJSON(int ticket, string type)
    {
        if(!OrderSelect(ticket, SELECT_BY_TICKET)) return "";
        
        string json = "{\n";
        json += "  \"id\": " + IntegerToString(ticket) + ",\n";
        json += "  \"ticket\": \"" + IntegerToString(ticket) + "\",\n";
        json += "  \"symbol\": \"" + OrderSymbol() + "\",\n";
        json += "  \"direction\": \"" + (OrderType() == OP_BUY ? "BUY" : "SELL") + "\",\n";
        json += "  \"type\": \"" + type + "\",\n";
        json += "  \"lot\": " + DoubleToString(OrderLots(), 2) + ",\n";
        json += "  \"entry_price\": " + DoubleToString(OrderOpenPrice(), (int)MarketInfo(OrderSymbol(), MODE_DIGITS)) + ",\n";
        
        if(type == "CLOSE")
        {
            json += "  \"exit_price\": " + DoubleToString(OrderClosePrice(), (int)MarketInfo(OrderSymbol(), MODE_DIGITS)) + ",\n";
            json += "  \"close_time\": \"" + TimeToString(OrderCloseTime(), TIME_DATE|TIME_SECONDS) + "Z\",\n";
            json += "  \"is_open\": false,\n";
        }
        else
        {
            json += "  \"exit_price\": null,\n";
            json += "  \"close_time\": null,\n";
            json += "  \"is_open\": true,\n";
        }
        
        json += "  \"profit\": " + DoubleToString(OrderProfit() + OrderSwap() + OrderCommission(), 2) + ",\n";
        json += "  \"robot_name\": \"" + robot_name + "\",\n";
        json += "  \"open_time\": \"" + TimeToString(OrderOpenTime(), TIME_DATE|TIME_SECONDS) + "Z\",\n";
        json += "  \"comment\": \"" + OrderComment() + "\"\n";
        json += "}";
        
        return json;
    }
    
    // Cria JSON do robô
    string CreateRobotJSON()
    {
        int total_trades = CountTrades();
        double total_profit = CalculateTotalProfit();
        int open_positions = CountOpenPositions();
        
        string json = "{\n";
        json += "  \"id\": " + IntegerToString(magic_number) + ",\n";
        json += "  \"name\": \"" + robot_name + "\",\n";
        json += "  \"status\": \"ACTIVE\",\n";
        json += "  \"current_positions\": " + IntegerToString(open_positions) + ",\n";
        json += "  \"total_trades\": " + IntegerToString(total_trades) + ",\n";
        json += "  \"profit_total\": " + DoubleToString(total_profit, 2) + ",\n";
        json += "  \"last_heartbeat\": \"" + TimeToString(TimeCurrent(), TIME_DATE|TIME_SECONDS) + "Z\",\n";
        json += "  \"symbol\": \"" + Symbol() + "\",\n";
        json += "  \"timeframe\": \"" + PeriodToString() + "\",\n";
        json += "  \"magic_number\": " + IntegerToString(magic_number) + ",\n";
        json += "  \"version\": \"1.0.0\"\n";
        json += "}";
        
        return json;
    }
    
    // Cria JSON da conta
    string CreateAccountJSON()
    {
        string json = "{\n";
        json += "  \"account_number\": \"" + IntegerToString(AccountNumber()) + "\",\n";
        json += "  \"broker\": \"" + AccountCompany() + "\",\n";
        json += "  \"currency\": \"" + AccountCurrency() + "\",\n";
        json += "  \"balance\": " + DoubleToString(AccountBalance(), 2) + ",\n";
        json += "  \"equity\": " + DoubleToString(AccountEquity(), 2) + ",\n";
        json += "  \"margin\": " + DoubleToString(AccountMargin(), 2) + ",\n";
        json += "  \"free_margin\": " + DoubleToString(AccountFreeMargin(), 2) + ",\n";
        json += "  \"margin_level\": " + DoubleToString(AccountMargin() > 0 ? AccountEquity() / AccountMargin() * 100 : 0, 1) + ",\n";
        json += "  \"leverage\": " + IntegerToString(AccountLeverage()) + ",\n";
        json += "  \"profit\": " + DoubleToString(AccountProfit(), 2) + ",\n";
        json += "  \"credit\": " + DoubleToString(AccountCredit(), 2) + ",\n";
        json += "  \"last_update\": \"" + TimeToString(TimeCurrent(), TIME_DATE|TIME_SECONDS) + "Z\",\n";
        json += "  \"server\": \"" + AccountServer() + "\",\n";
        json += "  \"account_type\": \"Standard\"\n";
        json += "}";
        
        return json;
    }
    
    // Funções auxiliares
    int CountTrades()
    {
        int count = 0;
        for(int i = OrdersHistoryTotal() - 1; i >= 0; i--)
        {
            if(OrderSelect(i, SELECT_BY_POS, MODE_HISTORY))
            {
                if(magic_number == 0 || OrderMagicNumber() == magic_number)
                    count++;
            }
        }
        return count;
    }
    
    double CalculateTotalProfit()
    {
        double profit = 0;
        for(int i = OrdersHistoryTotal() - 1; i >= 0; i--)
        {
            if(OrderSelect(i, SELECT_BY_POS, MODE_HISTORY))
            {
                if(magic_number == 0 || OrderMagicNumber() == magic_number)
                    profit += OrderProfit() + OrderSwap() + OrderCommission();
            }
        }
        return profit;
    }
    
    int CountOpenPositions()
    {
        int count = 0;
        for(int i = OrdersTotal() - 1; i >= 0; i--)
        {
            if(OrderSelect(i, SELECT_BY_POS))
            {
                if(magic_number == 0 || OrderMagicNumber() == magic_number)
                    count++;
            }
        }
        return count;
    }
    
    string PeriodToString()
    {
        switch(Period())
        {
            case PERIOD_M1: return "M1";
            case PERIOD_M5: return "M5";
            case PERIOD_M15: return "M15";
            case PERIOD_M30: return "M30";
            case PERIOD_H1: return "H1";
            case PERIOD_H4: return "H4";
            case PERIOD_D1: return "D1";
            case PERIOD_W1: return "W1";
            case PERIOD_MN1: return "MN1";
            default: return "UNKNOWN";
        }
    }
};

//+------------------------------------------------------------------+
//| Exemplo de uso no seu EA                                         |
//+------------------------------------------------------------------+

// Declara o reporter globalmente no seu EA
TradeReporter* reporter;

// No OnInit() do seu EA:
int OnInit()
{
    // Inicializa o reporter
    // Ajuste o caminho para onde está seu dashboard
    reporter = new TradeReporter("Meu_EA", "C:\\Users\\SeuUsuario\\Documents\\trading-dashboard", 12345);
    
    return INIT_SUCCEEDED;
}

// No OnDeinit():
void OnDeinit(const int reason)
{
    delete reporter;
}

// Quando abrir um trade:
void OnTradeOpen(int ticket)
{
    if(reporter != NULL)
        reporter.ReportTradeOpen(ticket);
}

// Quando fechar um trade:
void OnTradeClose(int ticket)
{
    if(reporter != NULL)
        reporter.ReportTradeClose(ticket);
}

// No OnTick() ou em um timer:
void OnTick()
{
    // Seus códigos do EA...
    
    // Enviar heartbeat a cada minuto
    static datetime last_heartbeat = 0;
    if(TimeCurrent() - last_heartbeat >= 60)
    {
        if(reporter != NULL)
            reporter.SendHeartbeat();
        last_heartbeat = TimeCurrent();
    }
}