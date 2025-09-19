// Serviço para comunicação em tempo real via WebSocket
export class WebSocketDataService {
  constructor(url = 'ws://localhost:8080') {
    this.url = url;
    this.ws = null;
    this.isConnected = false;
    this.reconnectInterval = 5000;
    this.callbacks = {
      trade: [],
      robot: [],
      account: [],
      connection: []
    };
  }

  // Conecta ao WebSocket
  connect() {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket conectado');
        this.isConnected = true;
        this.notifyCallbacks('connection', { status: 'connected' });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Erro ao parsear mensagem WebSocket:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket desconectado');
        this.isConnected = false;
        this.notifyCallbacks('connection', { status: 'disconnected' });
        // Reconectar automaticamente
        setTimeout(() => this.connect(), this.reconnectInterval);
      };

      this.ws.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
        this.notifyCallbacks('connection', { status: 'error', error });
      };

    } catch (error) {
      console.error('Erro ao conectar WebSocket:', error);
    }
  }

  // Processa mensagens recebidas
  handleMessage(data) {
    switch (data.type) {
      case 'trade':
        this.notifyCallbacks('trade', data.payload);
        break;
      case 'robot_status':
        this.notifyCallbacks('robot', data.payload);
        break;
      case 'account_update':
        this.notifyCallbacks('account', data.payload);
        break;
      default:
        console.log('Tipo de mensagem desconhecido:', data.type);
    }
  }

  // Registra callbacks para diferentes tipos de dados
  onTrade(callback) {
    this.callbacks.trade.push(callback);
  }

  onRobotUpdate(callback) {
    this.callbacks.robot.push(callback);
  }

  onAccountUpdate(callback) {
    this.callbacks.account.push(callback);
  }

  onConnection(callback) {
    this.callbacks.connection.push(callback);
  }

  // Notifica todos os callbacks registrados
  notifyCallbacks(type, data) {
    this.callbacks[type].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Erro no callback ${type}:`, error);
      }
    });
  }

  // Envia comando para os robôs
  sendCommand(robotId, command) {
    if (this.isConnected) {
      const message = {
        type: 'command',
        robotId,
        command,
        timestamp: new Date().toISOString()
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  // Desconecta
  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}