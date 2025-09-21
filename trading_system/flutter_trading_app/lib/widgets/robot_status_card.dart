import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/models.dart';

class RobotStatusCard extends StatelessWidget {
  final Robot robot;
  final VoidCallback? onTap;
  final VoidCallback? onStart;
  final VoidCallback? onStop;
  final VoidCallback? onSettings;

  const RobotStatusCard({
    super.key,
    required this.robot,
    this.onTap,
    this.onStart,
    this.onStop,
    this.onSettings,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    final isProfit = robot.totalProfit >= 0;
    final profitColor = isProfit ? Colors.green : Colors.red;
    
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Row
              Row(
                children: [
                  // Robot Icon and Name
                  Expanded(
                    child: Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: _getStatusColor(robot.status).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(
                            Icons.smart_toy,
                            color: _getStatusColor(robot.status),
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                robot.name,
                                style: theme.textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                              Text(
                                robot.strategy,
                                style: theme.textTheme.bodySmall?.copyWith(
                                  color: colorScheme.onSurface.withOpacity(0.6),
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Status Badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: _getStatusColor(robot.status).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: _getStatusColor(robot.status),
                        width: 1,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          _getStatusIcon(robot.status),
                          size: 12,
                          color: _getStatusColor(robot.status),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          robot.status,
                          style: TextStyle(
                            color: _getStatusColor(robot.status),
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 16),
              
              // Stats Row
              Row(
                children: [
                  Expanded(
                    child: _buildStatItem(
                      context,
                      'Balance',
                      '\$${NumberFormat('#,##0.00').format(robot.balance)}',
                      Icons.account_balance_wallet,
                    ),
                  ),
                  Expanded(
                    child: _buildStatItem(
                      context,
                      'Equity',
                      '\$${NumberFormat('#,##0.00').format(robot.equity)}',
                      Icons.trending_up,
                    ),
                  ),
                  Expanded(
                    child: _buildStatItem(
                      context,
                      'Profit',
                      '${isProfit ? '+' : ''}\$${NumberFormat('#,##0.00').format(robot.totalProfit)}',
                      Icons.monetization_on,
                      valueColor: profitColor,
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 16),
              
              // Performance Row
              Row(
                children: [
                  Expanded(
                    child: _buildStatItem(
                      context,
                      'Trades',
                      robot.totalTrades.toString(),
                      Icons.bar_chart,
                    ),
                  ),
                  Expanded(
                    child: _buildStatItem(
                      context,
                      'Win Rate',
                      '${robot.winRate.toStringAsFixed(1)}%',
                      Icons.percent,
                      valueColor: robot.winRate >= 50 ? Colors.green : Colors.red,
                    ),
                  ),
                  Expanded(
                    child: _buildStatItem(
                      context,
                      'Auto Trading',
                      robot.autoTrading ? 'ON' : 'OFF',
                      robot.autoTrading ? Icons.play_arrow : Icons.pause,
                      valueColor: robot.autoTrading ? Colors.green : Colors.orange,
                    ),
                  ),
                ],
              ),
              
              // Symbols
              if (robot.symbols.isNotEmpty) ...[
                const SizedBox(height: 12),
                Text(
                  'Symbols',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: colorScheme.onSurface.withOpacity(0.6),
                  ),
                ),
                const SizedBox(height: 4),
                Wrap(
                  spacing: 4,
                  runSpacing: 4,
                  children: robot.symbols.take(5).map((symbol) {
                    return Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: colorScheme.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        symbol,
                        style: TextStyle(
                          fontSize: 10,
                          color: colorScheme.primary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    );
                  }).toList()
                    ..addAll(robot.symbols.length > 5 ? [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: colorScheme.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '+${robot.symbols.length - 5}',
                          style: TextStyle(
                            fontSize: 10,
                            color: colorScheme.primary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ] : []),
                ),
              ],
              
              // Error Message
              if (robot.hasError && robot.errorMessage != null) ...[
                const SizedBox(height: 12),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.red.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.red.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.error_outline,
                        size: 16,
                        color: Colors.red,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          robot.errorMessage!,
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: Colors.red,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
              
              // Last Update
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(
                    Icons.access_time,
                    size: 12,
                    color: colorScheme.onSurface.withOpacity(0.5),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'Updated ${DateFormat('MMM dd, HH:mm').format(robot.lastUpdate)}',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: colorScheme.onSurface.withOpacity(0.5),
                    ),
                  ),
                ],
              ),
              
              // Action Buttons
              if (onStart != null || onStop != null || onSettings != null) ...[
                const SizedBox(height: 16),
                Row(
                  children: [
                    if (onSettings != null)
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: onSettings,
                          icon: const Icon(Icons.settings, size: 16),
                          label: const Text('Settings'),
                        ),
                      ),
                    if (onSettings != null && (onStart != null || onStop != null))
                      const SizedBox(width: 8),
                    if (robot.isActive && onStop != null)
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: onStop,
                          icon: const Icon(Icons.stop, size: 16),
                          label: const Text('Stop'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                            foregroundColor: Colors.white,
                          ),
                        ),
                      )
                    else if (!robot.isActive && onStart != null)
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: onStart,
                          icon: const Icon(Icons.play_arrow, size: 16),
                          label: const Text('Start'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            foregroundColor: Colors.white,
                          ),
                        ),
                      ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatItem(
    BuildContext context,
    String label,
    String value,
    IconData icon, {
    Color? valueColor,
  }) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Column(
      children: [
        Icon(
          icon,
          size: 20,
          color: valueColor ?? colorScheme.primary,
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: theme.textTheme.bodySmall?.copyWith(
            color: colorScheme.onSurface.withOpacity(0.6),
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: theme.textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.bold,
            color: valueColor,
          ),
          textAlign: TextAlign.center,
          overflow: TextOverflow.ellipsis,
        ),
      ],
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return Colors.green;
      case 'INACTIVE':
        return Colors.orange;
      case 'ERROR':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  IconData _getStatusIcon(String status) {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return Icons.check_circle;
      case 'INACTIVE':
        return Icons.pause_circle;
      case 'ERROR':
        return Icons.error;
      default:
        return Icons.help;
    }
  }
}