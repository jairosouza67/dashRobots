import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/trades_provider.dart';
import '../services/api_service.dart';
import '../services/mt5_control_service.dart';
import '../widgets/trade_card.dart';

class ManualTradingScreen extends StatefulWidget {
  const ManualTradingScreen({super.key});

  @override
  State<ManualTradingScreen> createState() => _ManualTradingScreenState();
}

class _ManualTradingScreenState extends State<ManualTradingScreen> {
  final _formKey = GlobalKey<FormState>();
  final _symbolController = TextEditingController(text: 'EURUSD');
  final _volumeController = TextEditingController(text: '0.01');
  final _stopLossController = TextEditingController();
  final _takeProfitController = TextEditingController();

  String _selectedDirection = 'BUY';
  bool _isLoading = false;
  bool _mt5Running = false;
  bool _mt5Installed = false;
  Map<String, dynamic> _mt5Status = {};

  @override
  void initState() {
    super.initState();
    _checkMT5Status();
  }

  Future<void> _checkMT5Status() async {
    try {
      final apiService = ApiService();
      final status = await apiService.getMT5Status();
      setState(() {
        _mt5Status = status;
        _mt5Installed = status['installed'] ?? false;
        _mt5Running = status['running'] ?? false;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao verificar MT5: $e')),
      );
    }
  }

  Future<void> _toggleMT5() async {
    setState(() => _isLoading = true);
    try {
      final apiService = ApiService();
      Map<String, dynamic> result;

      if (_mt5Running) {
        result = await apiService.stopMT5();
      } else {
        result = await apiService.startMT5();
      }

      if (result['success'] == true) {
        setState(() => _mt5Running = !_mt5Running);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result['message'])),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Falha na operação')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro: $e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _openPosition() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    try {
      final apiService = ApiService();
      final result = await apiService.openManualTrade(
        symbol: _symbolController.text,
        direction: _selectedDirection,
        volume: double.parse(_volumeController.text),
        stopLoss: _stopLossController.text.isNotEmpty ? double.parse(_stopLossController.text) : null,
        takeProfit: _takeProfitController.text.isNotEmpty ? double.parse(_takeProfitController.text) : null,
      );

      if (result['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Ordem enviada com sucesso')),
        );
        _clearForm();
        // Refresh trades
        context.read<TradesProvider>().loadTrades();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro: ${result['message']}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao abrir posição: $e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _clearForm() {
    _volumeController.text = '0.01';
    _stopLossController.clear();
    _takeProfitController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Trading Manual'),
        actions: [
          IconButton(
            icon: Icon(_mt5Running ? Icons.stop : Icons.play_arrow),
            onPressed: _mt5Installed ? _toggleMT5 : null,
            tooltip: _mt5Running ? 'Parar MT5' : 'Iniciar MT5',
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _checkMT5Status,
            tooltip: 'Verificar MT5',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // MT5 Status Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          _mt5Installed ? (_mt5Running ? Icons.check_circle : Icons.warning) : Icons.error,
                          color: _mt5Installed ? (_mt5Running ? Colors.green : Colors.orange) : Colors.red,
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          'Status MT5',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text('Instalado: ${_mt5Installed ? "Sim" : "Não"}'),
                    Text('Executando: ${_mt5Running ? "Sim" : "Não"}'),
                    if (_mt5Status['path'] != null)
                      Text('Caminho: ${_mt5Status['path']}'),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Manual Trading Form
            if (_mt5Running) ...[
              const Text(
                'Abrir Nova Posição',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),

              Form(
                key: _formKey,
                child: Column(
                  children: [
                    // Symbol
                    TextFormField(
                      controller: _symbolController,
                      decoration: const InputDecoration(
                        labelText: 'Símbolo',
                        hintText: 'Ex: EURUSD, GBPUSD',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Campo obrigatório';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 16),

                    // Direction
                    DropdownButtonFormField<String>(
                      value: _selectedDirection,
                      decoration: const InputDecoration(
                        labelText: 'Direção',
                        border: OutlineInputBorder(),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'BUY', child: Text('Compra (BUY)')),
                        DropdownMenuItem(value: 'SELL', child: Text('Venda (SELL)')),
                      ],
                      onChanged: (value) {
                        setState(() => _selectedDirection = value!);
                      },
                    ),

                    const SizedBox(height: 16),

                    // Volume
                    TextFormField(
                      controller: _volumeController,
                      decoration: const InputDecoration(
                        labelText: 'Volume (Lotes)',
                        hintText: 'Ex: 0.01, 0.1, 1.0',
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Campo obrigatório';
                        }
                        final volume = double.tryParse(value);
                        if (volume == null || volume <= 0) {
                          return 'Volume deve ser maior que 0';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 16),

                    // Stop Loss and Take Profit
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: _stopLossController,
                            decoration: const InputDecoration(
                              labelText: 'Stop Loss',
                              hintText: 'Opcional',
                              border: OutlineInputBorder(),
                            ),
                            keyboardType: TextInputType.number,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: TextFormField(
                            controller: _takeProfitController,
                            decoration: const InputDecoration(
                              labelText: 'Take Profit',
                              hintText: 'Opcional',
                              border: OutlineInputBorder(),
                            ),
                            keyboardType: TextInputType.number,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Submit Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _openPosition,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          backgroundColor: _selectedDirection == 'BUY' ? Colors.green : Colors.red,
                        ),
                        child: _isLoading
                            ? const CircularProgressIndicator()
                            : Text(
                                'Abrir ${_selectedDirection == 'BUY' ? 'Compra' : 'Venda'}',
                                style: const TextStyle(fontSize: 16),
                              ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 32),

              // Current Positions
              const Text(
                'Posições Abertas',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),

              Consumer<TradesProvider>(
                builder: (context, tradesProvider, child) {
                  final openTrades = tradesProvider.trades.where((trade) => trade.isOpen).toList();

                  if (openTrades.isEmpty) {
                    return const Card(
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: Text('Nenhuma posição aberta'),
                      ),
                    );
                  }

                  return ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: openTrades.length,
                    itemBuilder: (context, index) {
                      return TradeCard(
                        trade: openTrades[index],
                        onClose: () => _closePosition(openTrades[index].ticket),
                        onModify: () => _modifyPosition(openTrades[index].ticket),
                      );
                    },
                  );
                },
              ),
            ] else ...[
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(32),
                  child: Column(
                    children: [
                      Icon(Icons.warning, size: 64, color: Colors.orange),
                      SizedBox(height: 16),
                      Text(
                        'MT5 não está executando',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Para trading manual, o MT5 deve estar rodando na mesma máquina.',
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Future<void> _closePosition(String ticket) async {
    try {
      final apiService = ApiService();
      final result = await apiService.closeManualTrade(ticket);

      if (result['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Ordem de fechamento enviada')),
        );
        context.read<TradesProvider>().loadTrades();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro: ${result['message']}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao fechar posição: $e')),
      );
    }
  }

  Future<void> _modifyPosition(String ticket) async {
    // Show dialog to modify SL/TP
    showDialog(
      context: context,
      builder: (context) => ModifyPositionDialog(ticket: ticket),
    );
  }
}

class ModifyPositionDialog extends StatefulWidget {
  final String ticket;

  const ModifyPositionDialog({super.key, required this.ticket});

  @override
  State<ModifyPositionDialog> createState() => _ModifyPositionDialogState();
}

class _ModifyPositionDialogState extends State<ModifyPositionDialog> {
  final _slController = TextEditingController();
  final _tpController = TextEditingController();
  bool _isLoading = false;

  Future<void> _modify() async {
    setState(() => _isLoading = true);
    try {
      final apiService = ApiService();
      final result = await apiService.modifyManualTrade(
        widget.ticket,
        stopLoss: _slController.text.isNotEmpty ? double.parse(_slController.text) : null,
        takeProfit: _tpController.text.isNotEmpty ? double.parse(_tpController.text) : null,
      );

      if (result['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Modificação enviada')),
        );
        Navigator.of(context).pop();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro: ${result['message']}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro: $e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Modificar Posição ${widget.ticket}'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: _slController,
            decoration: const InputDecoration(labelText: 'Stop Loss'),
            keyboardType: TextInputType.number,
          ),
          TextField(
            controller: _tpController,
            decoration: const InputDecoration(labelText: 'Take Profit'),
            keyboardType: TextInputType.number,
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancelar'),
        ),
        ElevatedButton(
          onPressed: _isLoading ? null : _modify,
          child: _isLoading
              ? const CircularProgressIndicator()
              : const Text('Modificar'),
        ),
      ],
    );
  }
}