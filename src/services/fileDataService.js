// Serviço para ler dados dos robôs via arquivos
export class FileDataService {
  constructor() {
    this.dataPath = './robot_data/'; // Pasta onde os robôs salvam dados
  }

  // Lê dados dos trades dos robôs
  async readTradesData() {
    try {
      // Os robôs salvam dados em: robot_data/trades.json
      const response = await fetch('/robot_data/trades.json');
      if (!response.ok) throw new Error('Arquivo não encontrado');
      return await response.json();
    } catch (error) {
      console.log('Usando dados mock:', error.message);
      return []; // Retorna array vazio se arquivo não existir
    }
  }

  // Lê dados dos robôs
  async readRobotsData() {
    try {
      const response = await fetch('/robot_data/robots.json');
      if (!response.ok) throw new Error('Arquivo não encontrado');
      return await response.json();
    } catch (error) {
      console.log('Usando dados mock de robôs:', error.message);
      return [];
    }
  }

  // Lê dados da conta
  async readAccountData() {
    try {
      const response = await fetch('/robot_data/account.json');
      if (!response.ok) throw new Error('Arquivo não encontrado');
      return await response.json();
    } catch (error) {
      console.log('Usando dados mock da conta:', error.message);
      return {};
    }
  }

  // Monitora mudanças nos arquivos (polling)
  startPolling(callback, interval = 5000) {
    return setInterval(async () => {
      const data = {
        trades: await this.readTradesData(),
        robots: await this.readRobotsData(),
        account: await this.readAccountData()
      };
      callback(data);
    }, interval);
  }
}