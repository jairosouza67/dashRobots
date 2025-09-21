import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/providers.dart';
import '../widgets/widgets.dart';
import '../models/models.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    _refreshData();
  }

  Future<void> _refreshData() async {
    if (!mounted) return;
    
    final futures = [
      context.read<AccountProvider>().refreshAccount(),
      context.read<RobotsProvider>().refreshRobots(),
      context.read<TradesProvider>().refreshTrades(),
      context.read<StatsProvider>().refreshStats(),
    ];
    
    await Future.wait(futures);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: RefreshIndicator(
        onRefresh: _refreshData,
        child: CustomScrollView(
          slivers: [
            // App Bar
            SliverAppBar(
              expandedHeight: 120,
              floating: true,
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                title: const Text('Trading Dashboard'),
                background: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Theme.of(context).primaryColor,
                        Theme.of(context).primaryColor.withOpacity(0.8),
                      ],
                    ),
                  ),
                ),
              ),
              actions: [
                Consumer<AccountProvider>(
                  builder: (context, accountProvider, child) {
                    return IconButton(
                      icon: Icon(
                        accountProvider.isConnected
                            ? Icons.wifi
                            : Icons.wifi_off,
                        color: accountProvider.isConnected
                            ? Colors.green
                            : Colors.red,
                      ),
                      onPressed: () => _showConnectionStatus(context),
                    );
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.refresh),
                  onPressed: _refreshData,
                ),
              ],
            ),
            
            // Content
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Account Overview
                    _buildAccountOverview(),
                    
                    const SizedBox(height: 24),
                    
                    // Quick Stats Grid
                    _buildQuickStats(),
                    
                    const SizedBox(height: 24),
                    
                    // Active Robots
                    _buildActiveRobots(),
                    
                    const SizedBox(height: 24),
                    
                    // Recent Trades
                    _buildRecentTrades(),
                    
                    const SizedBox(height: 24),
                    
                    // Charts
                    _buildCharts(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAccountOverview() {
    return Consumer<AccountProvider>(
      builder: (context, accountProvider, child) {
        if (accountProvider.isLoading && !accountProvider.hasAccount) {
          return const Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Center(child: CircularProgressIndicator()),
            ),
          );
        }

        if (accountProvider.error != null) {
          return Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Icon(
                    Icons.error_outline,
                    color: Colors.red,
                    size: 48,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Error loading account',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    accountProvider.error!,
                    style: Theme.of(context).textTheme.bodySmall,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => accountProvider.loadAccount(),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
          );
        }

        final account = accountProvider.account;
        if (account == null) {
          return const SizedBox();
        }

        return Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.account_balance,
                      color: Theme.of(context).primaryColor,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Account Overview',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: account.isConnected ? Colors.green : Colors.red,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        account.status,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: _buildAccountStat(
                        'Balance',
                        '\$${account.balance.toStringAsFixed(2)}',
                        Icons.account_balance_wallet,
                      ),
                    ),
                    Expanded(
                      child: _buildAccountStat(
                        'Equity',
                        '\$${account.equity.toStringAsFixed(2)}',
                        Icons.trending_up,
                      ),
                    ),
                    Expanded(
                      child: _buildAccountStat(
                        'Profit',
                        '${account.profit >= 0 ? '+' : ''}\$${account.profit.toStringAsFixed(2)}',
                        Icons.monetization_on,
                        valueColor: account.profit >= 0 ? Colors.green : Colors.red,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _buildAccountStat(
                        'Margin Level',
                        '${account.marginLevel.toStringAsFixed(1)}%',
                        Icons.speed,
                        valueColor: account.marginLevel > 100 ? Colors.green : Colors.red,
                      ),
                    ),
                    Expanded(
                      child: _buildAccountStat(
                        'Free Margin',
                        '\$${account.freeMargin.toStringAsFixed(2)}',
                        Icons.account_balance,
                      ),
                    ),
                    Expanded(
                      child: _buildAccountStat(
                        'Leverage',
                        '1:${account.leverage}',
                        Icons.multiple_stop,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildAccountStat(
    String label,
    String value,
    IconData icon, {
    Color? valueColor,
  }) {
    return Column(
      children: [
        Icon(
          icon,
          size: 20,
          color: valueColor ?? Theme.of(context).primaryColor,
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.bold,
            color: valueColor,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildQuickStats() {
    return Consumer4<RobotsProvider, TradesProvider, StatsProvider, AccountProvider>(
      builder: (context, robotsProvider, tradesProvider, statsProvider, accountProvider, child) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Quick Stats',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            StatsGrid(
              cards: [
                StatsCard.activeRobots(
                  value: robotsProvider.activeCount,
                  subtitle: '${robotsProvider.robots.length} total',
                ),
                StatsCard.openTrades(
                  value: tradesProvider.openCount,
                  subtitle: '${tradesProvider.trades.length} total',
                ),
                StatsCard.profit(
                  value: accountProvider.profit,
                  subtitle: 'Current profit',
                ),
                StatsCard.winRate(
                  value: tradesProvider.winRate,
                  subtitle: 'Overall win rate',
                ),
              ],
            ),
          ],
        );
      },
    );
  }

  Widget _buildActiveRobots() {
    return Consumer<RobotsProvider>(
      builder: (context, robotsProvider, child) {
        final activeRobots = robotsProvider.activeRobots.take(3).toList();
        
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  'Active Robots',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                TextButton(
                  onPressed: () {
                    // Navigate to robots screen
                  },
                  child: const Text('View All'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            if (activeRobots.isEmpty)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(32),
                  child: Center(
                    child: Column(
                      children: [
                        Icon(
                          Icons.smart_toy,
                          size: 48,
                          color: Theme.of(context).primaryColor.withOpacity(0.5),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No active robots',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Start a robot to begin trading',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              )
            else
              ...activeRobots.map((robot) => RobotStatusCard(
                robot: robot,
                onTap: () {
                  // Navigate to robot details
                },
                onStop: () async {
                  await robotsProvider.stopRobot(robot.id);
                },
                onSettings: () {
                  // Navigate to robot settings
                },
              )),
          ],
        );
      },
    );
  }

  Widget _buildRecentTrades() {
    return Consumer<TradesProvider>(
      builder: (context, tradesProvider, child) {
        final recentTrades = tradesProvider.trades.take(5).toList();
        
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  'Recent Trades',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                TextButton(
                  onPressed: () {
                    // Navigate to trades screen
                  },
                  child: const Text('View All'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            if (recentTrades.isEmpty)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(32),
                  child: Center(
                    child: Column(
                      children: [
                        Icon(
                          Icons.trending_up,
                          size: 48,
                          color: Theme.of(context).primaryColor.withOpacity(0.5),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No recent trades',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Trades will appear here once robots start trading',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ),
              )
            else
              ...recentTrades.map((trade) => TradeCard(
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
              )),
          ],
        );
      },
    );
  }

  Widget _buildCharts() {
    return Consumer<StatsProvider>(
      builder: (context, statsProvider, child) {
        if (statsProvider.dailyStats.isEmpty) {
          return const SizedBox();
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Performance Charts',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            ProfitChart(data: statsProvider.dailyStats),
            const SizedBox(height: 16),
            TradesChart(data: statsProvider.dailyStats),
          ],
        );
      },
    );
  }

  void _showConnectionStatus(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Connection Status'),
        content: Consumer<AccountProvider>(
          builder: (context, accountProvider, child) {
            return Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      accountProvider.isConnected
                          ? Icons.check_circle
                          : Icons.error,
                      color: accountProvider.isConnected
                          ? Colors.green
                          : Colors.red,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      accountProvider.isConnected
                          ? 'Connected'
                          : 'Disconnected',
                      style: TextStyle(
                        color: accountProvider.isConnected
                            ? Colors.green
                            : Colors.red,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                if (accountProvider.account != null) ...[
                  const SizedBox(height: 16),
                  Text('Account: ${accountProvider.account!.accountNumber}'),
                  Text('Server: ${accountProvider.account!.server}'),
                  Text('Company: ${accountProvider.account!.company}'),
                ],
              ],
            );
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}