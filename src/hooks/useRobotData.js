// Hook customizado para gerenciar dados dos robôs
import { useState, useEffect } from 'react';
import { FileDataService } from '../services/fileDataService.js';
import { ApiDataService } from '../services/apiDataService.js';
import { WebSocketDataService } from '../services/webSocketDataService.js';

export const useRobotData = (dataSource = 'file') => {
  const [trades, setTrades] = useState([]);
  const [robots, setRobots] = useState([]);
  const [account, setAccount] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Mock data como fallback
  const mockTrades = [
    {
      id: 1,
      ticket: "12345",
      symbol: "EURUSD",
      direction: "BUY",
      type: "OPEN",
      lot: 0.1,
      entry_price: 1.0850,
      exit_price: null,
      profit: 0,
      robot_name: "TrendFollowing_EA",
      open_time: "2024-01-15T10:30:00Z",
      is_open: true
    }
  ];

  const mockRobots = [
    {
      id: 1,
      name: "TrendFollowing_EA",
      status: "ACTIVE",
      current_positions: 2,
      total_trades: 45,
      profit_total: 1250.50,
      last_heartbeat: "2024-01-15T12:00:00Z"
    }
  ];

  const mockAccount = {
    balance: 10000.00,
    equity: 10105.00,
    margin: 200.00,
    free_margin: 9905.00,
    margin_level: 5052.5
  };

  useEffect(() => {
    let service;
    let pollInterval;

    const loadData = async () => {
      try {
        let tradesData, robotsData, accountData;

        switch (dataSource) {
          case 'file':
            service = new FileDataService();
            tradesData = await service.readTradesData();
            robotsData = await service.readRobotsData();
            accountData = await service.readAccountData();
            setIsConnected(true);
            break;

          case 'api':
            service = new ApiDataService();
            tradesData = await service.getTrades();
            robotsData = await service.getRobots();
            accountData = await service.getAccount();
            setIsConnected(true);
            break;

          case 'websocket':
            service = new WebSocketDataService();
            
            service.onConnection((status) => {
              setIsConnected(status.status === 'connected');
            });

            service.onTrade((trade) => {
              setTrades(prev => {
                const exists = prev.find(t => t.ticket === trade.ticket);
                if (exists) {
                  return prev.map(t => t.ticket === trade.ticket ? { ...t, ...trade } : t);
                }
                return [...prev, trade];
              });
              setLastUpdate(new Date());
            });

            service.onRobotUpdate((robot) => {
              setRobots(prev => {
                const exists = prev.find(r => r.id === robot.id);
                if (exists) {
                  return prev.map(r => r.id === robot.id ? { ...r, ...robot } : r);
                }
                return [...prev, robot];
              });
              setLastUpdate(new Date());
            });

            service.onAccountUpdate((accountUpdate) => {
              setAccount(prev => ({ ...prev, ...accountUpdate }));
              setLastUpdate(new Date());
            });

            service.connect();
            return () => service.disconnect();

          default:
            tradesData = mockTrades;
            robotsData = mockRobots;
            accountData = mockAccount;
            setIsConnected(false);
        }

        // Para file e api, usa dados ou fallback para mock
        if (dataSource !== 'websocket') {
          setTrades(tradesData.length > 0 ? tradesData : mockTrades);
          setRobots(robotsData.length > 0 ? robotsData : mockRobots);
          setAccount(Object.keys(accountData).length > 0 ? accountData : mockAccount);
          setLastUpdate(new Date());

          // Para file e api, configura polling
          if (service && service.startPolling) {
            pollInterval = service.startPolling((data) => {
              if (data.trades.length > 0) setTrades(data.trades);
              if (data.robots.length > 0) setRobots(data.robots);
              if (Object.keys(data.account).length > 0) setAccount(data.account);
              setLastUpdate(new Date());
            });
          }
        }

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Fallback para dados mock em caso de erro
        setTrades(mockTrades);
        setRobots(mockRobots);
        setAccount(mockAccount);
        setIsConnected(false);
      }
    };

    loadData();

    // Cleanup
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      if (service && service.disconnect) {
        service.disconnect();
      }
    };
  }, [dataSource]);

  // Função para enviar comandos para robôs (apenas WebSocket)
  const sendRobotCommand = (robotId, command) => {
    if (dataSource === 'websocket' && service) {
      service.sendCommand(robotId, command);
    }
  };

  return {
    trades,
    robots,
    account,
    isConnected,
    lastUpdate,
    sendRobotCommand
  };
};