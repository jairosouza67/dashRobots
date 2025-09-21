import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/providers.dart';
import '../widgets/widgets.dart';

class TradesScreen extends StatefulWidget {
  const TradesScreen({super.key});

  @override
  State<TradesScreen> createState() => _TradesScreenState();
}

class _TradesScreenState extends State<TradesScreen> {
  String? _statusFilter;
  String? _robotFilter;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Trades'),
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.filter_list),
            onSelected: (value) {
              setState(() {
                _statusFilter = value == 'all' ? null : value;
              });
              context.read<TradesProvider>().setStatusFilter(_statusFilter);
            },
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'all', child: Text('All Trades')),
              const PopupMenuItem(value: 'OPEN', child: Text('Open')),
              const PopupMenuItem(value: 'CLOSED', child: Text('Closed')),
              const PopupMenuItem(value: 'PENDING', child: Text('Pending')),
            ],
          ),
        ],
      ),
      body: Consumer<TradesProvider>(
        builder: (context, tradesProvider, child) {
          if (tradesProvider.isLoading && tradesProvider.trades.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }

          if (tradesProvider.trades.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.trending_up, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('No trades found', style: TextStyle(fontSize: 18)),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => tradesProvider.refreshTrades(),
            child: ListView.builder(
              itemCount: tradesProvider.trades.length,
              itemBuilder: (context, index) {
                final trade = tradesProvider.trades[index];
                return TradeCard(
                  trade: trade,
                  onTap: () {
                    // Navigate to trade details
                  },
                  onClose: trade.isOpen ? () async {
                    await tradesProvider.closeTrade(trade.id);
                  } : null,
                  onModify: trade.isOpen ? () {
                    // Show modify dialog
                  } : null,
                );
              },
            ),
          );
        },
      ),
    );
  }
}