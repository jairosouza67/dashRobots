// Serviço para comunicação via API REST
export class ApiDataService {
  constructor(baseUrl = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
  }

  // Busca todos os trades
  async getTrades() {
    try {
      const response = await fetch(`${this.baseUrl}/trades`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar trades:', error);
      return [];
    }
  }

  // Busca dados dos robôs
  async getRobots() {
    try {
      const response = await fetch(`${this.baseUrl}/robots`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar robôs:', error);
      return [];
    }
  }

  // Busca dados da conta
  async getAccount() {
    try {
      const response = await fetch(`${this.baseUrl}/account`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar conta:', error);
      return {};
    }
  }

  // Recebe novo trade dos robôs (os robôs fazem POST para esta URL)
  async receiveTrade(tradeData) {
    try {
      const response = await fetch(`${this.baseUrl}/trades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tradeData)
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao receber trade:', error);
      return null;
    }
  }

  // Atualiza status do robô (heartbeat)
  async updateRobotStatus(robotId, status) {
    try {
      const response = await fetch(`${this.baseUrl}/robots/${robotId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, timestamp: new Date().toISOString() })
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar status do robô:', error);
      return null;
    }
  }
}