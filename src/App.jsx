import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, TrendingDown, Activity, DollarSign, Bot, AlertCircle, CheckCircle, XCircle, Wifi, WifiOff } from 'lucide-react'
import { useRobotData } from './hooks/useRobotData.js'
import './App.css'

// Mock data para demonstração
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
  },
  {
    id: 2,
    ticket: "12346",
    symbol: "GBPUSD",
    direction: "SELL",
    type: "CLOSE",
    lot: 0.2,
    entry_price: 1.2650,
    exit_price: 1.2620,
    profit: 60.0,
    robot_name: "MeanReversion_EA",
    open_time: "2024-01-15T09:15:00Z",
    close_time: "2024-01-15T11:45:00Z",
    is_open: false
  },
  {
    id: 3,
    ticket: "12347",
    symbol: "USDJPY",
    direction: "BUY",
    type: "CLOSE",
    lot: 0.15,
    entry_price: 148.50,
    exit_price: 148.80,
    profit: 45.0,
    robot_name: "BreakoutAdvanced_EA",
    open_time: "2024-01-15T08:00:00Z",
    close_time: "2024-01-15T10:30:00Z",
    is_open: false
  }
]

const mockRobots = [
  {
    id: 1,
    name: "TrendFollowing_EA",
    status: "ACTIVE",
    current_positions: 2,
    total_trades: 45,
    profit_total: 1250.50,
    last_heartbeat: "2024-01-15T12:00:00Z"
  },
  {
    id: 2,
    name: "MeanReversion_EA",
    status: "ACTIVE",
    current_positions: 1,
    total_trades: 38,
    profit_total: 890.25,
    last_heartbeat: "2024-01-15T12:00:00Z"
  },
  {
    id: 3,
    name: "BreakoutAdvanced_EA",
    status: "INACTIVE",
    current_positions: 0,
    total_trades: 22,
    profit_total: -150.75,
    last_heartbeat: "2024-01-15T11:30:00Z"
  }
]

const mockAccount = {
  balance: 10000.00,
  equity: 10105.00,
  margin: 200.00,
  free_margin: 9905.00,
  margin_level: 5052.5
}

const mockProfitData = [
  { date: '01/10', profit: 100 },
  { date: '01/11', profit: 250 },
  { date: '01/12', profit: 180 },
  { date: '01/13', profit: 420 },
  { date: '01/14', profit: 380 },
  { date: '01/15', profit: 520 }
]

function App() {
  // Configuração do tipo de fonte de dados: 'file', 'api', 'websocket' ou 'mock'
  const [dataSource, setDataSource] = useState('file'); // Padrão: arquivo
  
  // Hook personalizado para gerenciar dados dos robôs
  const { trades, robots, account, isConnected, lastUpdate, sendRobotCommand } = useRobotData(dataSource);
  
  // Estados para estatísticas calculadas
  const [stats, setStats] = useState({
    total_trades: 0,
    open_trades: 0,
    closed_trades: 0,
    total_profit: 0,
    win_rate: 0,
    winning_trades: 0
  })

  // Recalcula estatísticas quando trades mudam
  useEffect(() => {
    const openTrades = trades.filter(t => t.is_open).length;
    const closedTrades = trades.filter(t => !t.is_open);
    const winningTrades = closedTrades.filter(t => t.profit > 0).length;
    const totalProfit = closedTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const winRate = closedTrades.length > 0 ? (winningTrades / closedTrades.length) * 100 : 0;

    setStats({
      total_trades: trades.length,
      open_trades: openTrades,
      closed_trades: closedTrades.length,
      total_profit: totalProfit,
      win_rate: winRate,
      winning_trades: winningTrades
    });
  }, [trades]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'INACTIVE':
        return <XCircle className="h-4 w-4 text-gray-500" />
      case 'ERROR':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'ACTIVE': 'default',
      'INACTIVE': 'secondary',
      'ERROR': 'destructive'
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
            <header className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bot className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Trading Dashboard</h1>
                <p className="text-muted-foreground">Sistema de Monitoramento Automatizado</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Indicador de Conexão */}
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>

              {/* Seletor de Fonte de Dados */}
              <select 
                value={dataSource} 
                onChange={(e) => setDataSource(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="file">Arquivo</option>
                <option value="api">API REST</option>
                <option value="websocket">WebSocket</option>
                <option value="mock">Demo (Mock)</option>
              </select>

              {/* Última Atualização */}
              {lastUpdate && (
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Última atualização</p>
                  <p className="text-xs">{lastUpdate.toLocaleTimeString()}</p>
                </div>
              )}

              <div className="text-right">
                <p className="text-sm text-muted-foreground">Saldo</p>
                <p className="text-lg font-semibold">{formatCurrency(account.balance)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Equity</p>
                <p className="text-lg font-semibold">{formatCurrency(account.equity)}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="trades">Operações</TabsTrigger>
            <TabsTrigger value="robots">Robôs</TabsTrigger>
            <TabsTrigger value="account">Conta</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Operações</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_trades}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.open_trades} abertas, {stats.closed_trades} fechadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.total_profit)}</div>
                  <p className="text-xs text-muted-foreground">
                    Desde o início das operações
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.win_rate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.winning_trades} operações vencedoras
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Robôs Ativos</CardTitle>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {robots.filter(r => r.status === 'ACTIVE').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    de {robots.length} robôs configurados
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução do Lucro</CardTitle>
                  <CardDescription>Últimos 6 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockProfitData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(value), 'Lucro']} />
                      <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance por Robô</CardTitle>
                  <CardDescription>Lucro total acumulado</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={robots}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(value), 'Lucro']} />
                      <Bar dataKey="profit_total" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trades Tab */}
          <TabsContent value="trades">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Operações</CardTitle>
                <CardDescription>Últimas operações realizadas pelos robôs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket</TableHead>
                      <TableHead>Símbolo</TableHead>
                      <TableHead>Direção</TableHead>
                      <TableHead>Lotes</TableHead>
                      <TableHead>Preço Entrada</TableHead>
                      <TableHead>Preço Saída</TableHead>
                      <TableHead>Lucro</TableHead>
                      <TableHead>Robô</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell className="font-medium">{trade.ticket}</TableCell>
                        <TableCell>{trade.symbol}</TableCell>
                        <TableCell>
                          <Badge variant={trade.direction === 'BUY' ? 'default' : 'secondary'}>
                            {trade.direction}
                          </Badge>
                        </TableCell>
                        <TableCell>{trade.lot}</TableCell>
                        <TableCell>{trade.entry_price}</TableCell>
                        <TableCell>{trade.exit_price || '-'}</TableCell>
                        <TableCell className={trade.profit > 0 ? 'text-green-600' : trade.profit < 0 ? 'text-red-600' : ''}>
                          {formatCurrency(trade.profit)}
                        </TableCell>
                        <TableCell>{trade.robot_name}</TableCell>
                        <TableCell>
                          <Badge variant={trade.is_open ? 'default' : 'secondary'}>
                            {trade.is_open ? 'Aberta' : 'Fechada'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Robots Tab */}
          <TabsContent value="robots">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {robots.map((robot) => (
                <Card key={robot.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{robot.name}</CardTitle>
                      {getStatusIcon(robot.status)}
                    </div>
                    <CardDescription>
                      {getStatusBadge(robot.status)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Posições Abertas</p>
                        <p className="text-2xl font-bold">{robot.current_positions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total de Trades</p>
                        <p className="text-2xl font-bold">{robot.total_trades}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lucro Total</p>
                      <p className={`text-xl font-bold ${robot.profit_total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(robot.profit_total)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Último Heartbeat</p>
                      <p className="text-sm">{formatDateTime(robot.last_heartbeat)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Conta</CardTitle>
                  <CardDescription>Dados atuais da conta de trading</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Saldo</p>
                      <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Equity</p>
                      <p className="text-2xl font-bold">{formatCurrency(account.equity)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Margem Utilizada</p>
                      <p className="text-xl font-bold">{formatCurrency(account.margin)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Margem Livre</p>
                      <p className="text-xl font-bold">{formatCurrency(account.free_margin)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nível de Margem</p>
                    <p className="text-xl font-bold">{account.margin_level?.toFixed(2)}%</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo de Performance</CardTitle>
                  <CardDescription>Estatísticas gerais de trading</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Taxa de Acerto</span>
                      <span className="font-medium">{stats.win_rate}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${stats.win_rate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Trades Vencedores</p>
                      <p className="text-lg font-bold text-green-600">{stats.winning_trades}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Trades Perdedores</p>
                      <p className="text-lg font-bold text-red-600">{stats.closed_trades - stats.winning_trades}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Lucro/Prejuízo Total</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.total_profit)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

