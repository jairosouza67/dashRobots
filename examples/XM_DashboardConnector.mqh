//+------------------------------------------------------------------+
//| XM_DashboardConnector.mqh - Conecta robôs XM ao Trading Dashboard|
//| Especialmente configurado para conta XM: 308733384               |
//| Copyright 2024, Jairo Souza                                      |
//+------------------------------------------------------------------+

#property copyright "Copyright 2024, Jairo Souza"
#property link      "https://github.com/jairosouza67/dashRobots"
#property version   "1.00"

//+------------------------------------------------------------------+
//| Classe para conectar robôs MT5 da XM ao Dashboard               |
//+------------------------------------------------------------------+
class XM_DashboardConnector
{
private:
    string robot_name;
    string dashboard_path;
    ulong magic_number;
    string account_number;
    
public:
    // Construtor - configuração automática para XM
    XM_DashboardConnector(string name, ulong magic = 0)
    {
        robot_name = name;
        magic_number = magic;
        account_number = IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN));
        
        // Caminho automático para o dashboard (ajuste se necessário)
        dashboard_path = "E:\\VS Code\\trading_system\\trading-dashboard\\public\\robot_data";
        
        Print("=== XM Dashboard Connector Inicializado ===");
        Print("Robô: ", robot_name);
        Print("Conta XM: ", account_number);
        Print("Magic Number: ", magic_number);
        Print("Caminho: ", dashboard_path);
        Print("==========================================");
    }
    
    // Reporta nova posição aberta
    void ReportPositionOpen(ulong ticket)
    {
        if(!PositionSelectByTicket(ticket)) return;
        
        string trade_json = CreateTradeJSON(ticket, "OPEN");
        if(trade_json != "")
        {
            AppendTradeToFile(trade_json);
            Print("✅ Posição aberta reportada: #", ticket);
        }
    }
    
    // Reporta posição fechada
    void ReportPositionClose(ulong ticket, double profit)
    {
        string trade_json = CreateClosedTradeJSON(ticket, profit);
        if(trade_json != "")
        {
            AppendTradeToFile(trade_json);
            Print("✅ Posição fechada reportada: #", ticket, " | Lucro: $", profit);
        }
    }
    
    // Envia dados atualizados do robô (heartbeat)
    void SendHeartbeat()
    {
        // Atualiza arquivo de robôs
        string robots_data = CreateRobotsFileContent();
        WriteToFile(dashboard_path + "\\robots.json", robots_data);
        
        // Atualiza dados da conta
        string account_data = CreateAccountJSON();
        WriteToFile(dashboard_path + "\\account.json", account_data);
        
        // Atualiza lista completa de trades
        string trades_data = CreateAllTradesJSON();
        WriteToFile(dashboard_path + "\\trades.json", trades_data);
        
        Print("📡 Heartbeat enviado - ", TimeToString(TimeCurrent(), TIME_SECONDS));
    }
    
private:
    // Cria JSON de uma posição/trade
    string CreateTradeJSON(ulong ticket, string type)
    {
        if(!PositionSelectByTicket(ticket)) return "";
        
        string symbol = PositionGetString(POSITION_SYMBOL);
        ENUM_POSITION_TYPE pos_type = (ENUM_POSITION_TYPE)PositionGetInteger(POSITION_TYPE);
        double volume = PositionGetDouble(POSITION_VOLUME);
        double price_open = PositionGetDouble(POSITION_PRICE_OPEN);
        double profit = PositionGetDouble(POSITION_PROFIT) + PositionGetDouble(POSITION_SWAP);
        datetime time_open = (datetime)PositionGetInteger(POSITION_TIME);
        string comment = PositionGetString(POSITION_COMMENT);
        
        string json = "{\n";
        json += "  \"id\": " + IntegerToString(ticket) + ",\n";
        json += "  \"ticket\": \"" + IntegerToString(ticket) + "\",\n";
        json += "  \"symbol\": \"" + symbol + "\",\n";
        json += "  \"direction\": \"" + (pos_type == POSITION_TYPE_BUY ? "BUY" : "SELL") + "\",\n";
        json += "  \"type\": \"" + type + "\",\n";
        json += "  \"lot\": " + DoubleToString(volume, 2) + ",\n";
        json += "  \"entry_price\": " + DoubleToString(price_open, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS)) + ",\n";
        json += "  \"exit_price\": null,\n";
        json += "  \"profit\": " + DoubleToString(profit, 2) + ",\n";
        json += "  \"robot_name\": \"" + robot_name + "\",\n";
        json += "  \"open_time\": \"" + TimeToString(time_open, TIME_DATE|TIME_SECONDS) + "Z\",\n";
        json += "  \"close_time\": null,\n";
        json += "  \"is_open\": true,\n";
        json += "  \"comment\": \"" + comment + "\"\n";
        json += "}";
        
        return json;
    }
    
    // Cria JSON de trade fechado
    string CreateClosedTradeJSON(ulong ticket, double final_profit)
    {
        string json = "{\n";
        json += "  \"id\": " + IntegerToString(ticket) + ",\n";
        json += "  \"ticket\": \"" + IntegerToString(ticket) + "\",\n";
        json += "  \"symbol\": \"UPDATED\",\n";
        json += "  \"direction\": \"CLOSE\",\n";
        json += "  \"type\": \"CLOSE\",\n";
        json += "  \"lot\": 0,\n";
        json += "  \"entry_price\": 0,\n";
        json += "  \"exit_price\": 0,\n";
        json += "  \"profit\": " + DoubleToString(final_profit, 2) + ",\n";
        json += "  \"robot_name\": \"" + robot_name + "\",\n";
        json += "  \"open_time\": \"" + TimeToString(TimeCurrent(), TIME_DATE|TIME_SECONDS) + "Z\",\n";
        json += "  \"close_time\": \"" + TimeToString(TimeCurrent(), TIME_DATE|TIME_SECONDS) + "Z\",\n";
        json += "  \"is_open\": false,\n";
        json += "  \"comment\": \"Position closed\"\n";
        json += "}";
        
        return json;
    }
    
    // Cria conteúdo completo do arquivo robots.json
    string CreateRobotsFileContent()
    {
        int total_positions = CountMyPositions();
        int total_deals = CountMyDeals();
        double total_profit = CalculateMyTotalProfit();
        
        string json = "[\n";
        json += "  {\n";
        json += "    \"id\": " + IntegerToString(magic_number) + ",\n";
        json += "    \"name\": \"" + robot_name + "\",\n";
        json += "    \"status\": \"ACTIVE\",\n";
        json += "    \"current_positions\": " + IntegerToString(total_positions) + ",\n";
        json += "    \"total_trades\": " + IntegerToString(total_deals) + ",\n";
        json += "    \"profit_total\": " + DoubleToString(total_profit, 2) + ",\n";
        json += "    \"last_heartbeat\": \"" + TimeToString(TimeCurrent(), TIME_DATE|TIME_SECONDS) + "Z\",\n";
        json += "    \"symbol\": \"" + Symbol() + "\",\n";
        json += "    \"timeframe\": \"" + PeriodToString() + "\",\n";
        json += "    \"magic_number\": " + IntegerToString(magic_number) + ",\n";
        json += "    \"version\": \"1.0.0\",\n";
        json += "    \"account\": \"" + account_number + "\",\n";
        json += "    \"broker\": \"XM Global\"\n";
        json += "  }\n";
        json += "]";
        
        return json;
    }
    
    // Cria JSON completo da conta XM
    string CreateAccountJSON()
    {
        string json = "{\n";
        json += "  \"account_number\": \"" + account_number + "\",\n";
        json += "  \"broker\": \"" + AccountInfoString(ACCOUNT_COMPANY) + "\",\n";
        json += "  \"currency\": \"" + AccountInfoString(ACCOUNT_CURRENCY) + "\",\n";
        json += "  \"balance\": " + DoubleToString(AccountInfoDouble(ACCOUNT_BALANCE), 2) + ",\n";
        json += "  \"equity\": " + DoubleToString(AccountInfoDouble(ACCOUNT_EQUITY), 2) + ",\n";
        json += "  \"margin\": " + DoubleToString(AccountInfoDouble(ACCOUNT_MARGIN), 2) + ",\n";
        json += "  \"free_margin\": " + DoubleToString(AccountInfoDouble(ACCOUNT_FREEMARGIN), 2) + ",\n";
        json += "  \"margin_level\": " + DoubleToString(AccountInfoDouble(ACCOUNT_MARGIN_LEVEL), 1) + ",\n";
        json += "  \"leverage\": " + IntegerToString(AccountInfoInteger(ACCOUNT_LEVERAGE)) + ",\n";
        json += "  \"profit\": " + DoubleToString(AccountInfoDouble(ACCOUNT_PROFIT), 2) + ",\n";
        json += "  \"credit\": " + DoubleToString(AccountInfoDouble(ACCOUNT_CREDIT), 2) + ",\n";
        json += "  \"last_update\": \"" + TimeToString(TimeCurrent(), TIME_DATE|TIME_SECONDS) + "Z\",\n";
        json += "  \"server\": \"" + AccountInfoString(ACCOUNT_SERVER) + "\",\n";
        json += "  \"account_type\": \"" + EnumToString((ENUM_ACCOUNT_TRADE_MODE)AccountInfoInteger(ACCOUNT_TRADE_MODE)) + "\"\n";
        json += "}";
        
        return json;
    }
    
    // Cria JSON com todas as posições ativas
    string CreateAllTradesJSON()
    {
        string json = "[\n";
        bool first = true;
        
        // Adiciona posições abertas
        for(int i = PositionsTotal() - 1; i >= 0; i--)
        {
            if(PositionGetTicket(i) > 0)
            {
                ulong ticket = PositionGetTicket(i);
                if(magic_number == 0 || PositionGetInteger(POSITION_MAGIC) == magic_number)
                {
                    if(!first) json += ",\n";
                    json += CreateTradeJSON(ticket, "OPEN");
                    first = false;
                }
            }
        }
        
        json += "\n]";
        return json;
    }
    
    // Funções auxiliares
    int CountMyPositions()
    {
        int count = 0;
        for(int i = PositionsTotal() - 1; i >= 0; i--)
        {
            if(PositionGetTicket(i) > 0)
            {
                if(magic_number == 0 || PositionGetInteger(POSITION_MAGIC) == magic_number)
                    count++;
            }
        }
        return count;
    }
    
    int CountMyDeals()
    {
        HistorySelect(0, TimeCurrent());
        int count = 0;
        for(int i = HistoryDealsTotal() - 1; i >= 0; i--)
        {
            ulong ticket = HistoryDealGetTicket(i);
            if(ticket > 0)
            {
                if(magic_number == 0 || HistoryDealGetInteger(ticket, DEAL_MAGIC) == magic_number)
                {
                    if(HistoryDealGetInteger(ticket, DEAL_ENTRY) == DEAL_ENTRY_OUT)
                        count++;
                }
            }
        }
        return count;
    }
    
    double CalculateMyTotalProfit()
    {
        HistorySelect(0, TimeCurrent());
        double profit = 0;
        for(int i = HistoryDealsTotal() - 1; i >= 0; i--)
        {
            ulong ticket = HistoryDealGetTicket(i);
            if(ticket > 0)
            {
                if(magic_number == 0 || HistoryDealGetInteger(ticket, DEAL_MAGIC) == magic_number)
                {
                    profit += HistoryDealGetDouble(ticket, DEAL_PROFIT);
                    profit += HistoryDealGetDouble(ticket, DEAL_SWAP);
                    profit += HistoryDealGetDouble(ticket, DEAL_COMMISSION);
                }
            }
        }
        return profit;
    }
    
    string PeriodToString()
    {
        switch(Period())
        {
            case PERIOD_M1: return "M1";
            case PERIOD_M2: return "M2";
            case PERIOD_M3: return "M3";
            case PERIOD_M4: return "M4";
            case PERIOD_M5: return "M5";
            case PERIOD_M6: return "M6";
            case PERIOD_M10: return "M10";
            case PERIOD_M12: return "M12";
            case PERIOD_M15: return "M15";
            case PERIOD_M20: return "M20";
            case PERIOD_M30: return "M30";
            case PERIOD_H1: return "H1";
            case PERIOD_H2: return "H2";
            case PERIOD_H3: return "H3";
            case PERIOD_H4: return "H4";
            case PERIOD_H6: return "H6";
            case PERIOD_H8: return "H8";
            case PERIOD_H12: return "H12";
            case PERIOD_D1: return "D1";
            case PERIOD_W1: return "W1";
            case PERIOD_MN1: return "MN1";
            default: return "UNKNOWN";
        }
    }
    
    // Anexa trade ao arquivo (modo append)
    void AppendTradeToFile(string trade_json)
    {
        // Por simplicidade, reescreve o arquivo completo
        // Em produção, você pode implementar append real
        SendHeartbeat();
    }
    
    // Escreve dados em arquivo
    void WriteToFile(string filename, string content)
    {
        int file_handle = FileOpen(filename, FILE_WRITE|FILE_TXT);
        if(file_handle != INVALID_HANDLE)
        {
            FileWriteString(file_handle, content);
            FileClose(file_handle);
        }
        else
        {
            Print("❌ Erro ao escrever arquivo: ", filename);
            Print("💡 Verifique se o caminho existe e o MT5 tem permissão de escrita");
        }
    }
};