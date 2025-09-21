import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class StatsCard extends StatelessWidget {
  final String title;
  final String value;
  final String? subtitle;
  final IconData icon;
  final Color? iconColor;
  final Color? valueColor;
  final Widget? trailing;
  final VoidCallback? onTap;
  final double? progress;
  final Color? progressColor;

  const StatsCard({
    super.key,
    required this.title,
    required this.value,
    this.subtitle,
    required this.icon,
    this.iconColor,
    this.valueColor,
    this.trailing,
    this.onTap,
    this.progress,
    this.progressColor,
  });

  factory StatsCard.profit({
    required double value,
    String? subtitle,
    VoidCallback? onTap,
  }) {
    final isProfit = value >= 0;
    return StatsCard(
      title: 'Total Profit',
      value: '${isProfit ? '+' : ''}\$${NumberFormat('#,##0.00').format(value)}',
      subtitle: subtitle,
      icon: Icons.monetization_on,
      iconColor: isProfit ? Colors.green : Colors.red,
      valueColor: isProfit ? Colors.green : Colors.red,
      onTap: onTap,
    );
  }

  factory StatsCard.balance({
    required double value,
    String? subtitle,
    VoidCallback? onTap,
  }) {
    return StatsCard(
      title: 'Balance',
      value: '\$${NumberFormat('#,##0.00').format(value)}',
      subtitle: subtitle,
      icon: Icons.account_balance_wallet,
      iconColor: Colors.blue,
      onTap: onTap,
    );
  }

  factory StatsCard.equity({
    required double value,
    String? subtitle,
    VoidCallback? onTap,
  }) {
    return StatsCard(
      title: 'Equity',
      value: '\$${NumberFormat('#,##0.00').format(value)}',
      subtitle: subtitle,
      icon: Icons.trending_up,
      iconColor: Colors.purple,
      onTap: onTap,
    );
  }

  factory StatsCard.winRate({
    required double value,
    String? subtitle,
    VoidCallback? onTap,
  }) {
    final color = value >= 50 ? Colors.green : Colors.red;
    return StatsCard(
      title: 'Win Rate',
      value: '${value.toStringAsFixed(1)}%',
      subtitle: subtitle,
      icon: Icons.percent,
      iconColor: color,
      valueColor: color,
      progress: value / 100,
      progressColor: color,
      onTap: onTap,
    );
  }

  factory StatsCard.profitFactor({
    required double value,
    String? subtitle,
    VoidCallback? onTap,
  }) {
    final color = value >= 1.5 ? Colors.green : value >= 1.0 ? Colors.orange : Colors.red;
    return StatsCard(
      title: 'Profit Factor',
      value: value.toStringAsFixed(2),
      subtitle: subtitle,
      icon: Icons.analytics,
      iconColor: color,
      valueColor: color,
      onTap: onTap,
    );
  }

  factory StatsCard.trades({
    required int value,
    String? subtitle,
    VoidCallback? onTap,
  }) {
    return StatsCard(
      title: 'Total Trades',
      value: NumberFormat('#,##0').format(value),
      subtitle: subtitle,
      icon: Icons.bar_chart,
      iconColor: Colors.indigo,
      onTap: onTap,
    );
  }

  factory StatsCard.drawdown({
    required double value,
    String? subtitle,
    VoidCallback? onTap,
  }) {
    final color = value < 10 ? Colors.green : value < 20 ? Colors.orange : Colors.red;
    return StatsCard(
      title: 'Max Drawdown',
      value: '${value.toStringAsFixed(1)}%',
      subtitle: subtitle,
      icon: Icons.trending_down,
      iconColor: color,
      valueColor: color,
      progress: value / 100,
      progressColor: color,
      onTap: onTap,
    );
  }

  factory StatsCard.sharpeRatio({
    required double value,
    String? subtitle,
    VoidCallback? onTap,
  }) {
    final color = value >= 1.0 ? Colors.green : value >= 0.5 ? Colors.orange : Colors.red;
    return StatsCard(
      title: 'Sharpe Ratio',
      value: value.toStringAsFixed(2),
      subtitle: subtitle,
      icon: Icons.speed,
      iconColor: color,
      valueColor: color,
      onTap: onTap,
    );
  }

  factory StatsCard.activeRobots({
    required int value,
    String? subtitle,
    VoidCallback? onTap,
  }) {
    return StatsCard(
      title: 'Active Robots',
      value: value.toString(),
      subtitle: subtitle,
      icon: Icons.smart_toy,
      iconColor: Colors.green,
      onTap: onTap,
    );
  }

  factory StatsCard.openTrades({
    required int value,
    String? subtitle,
    VoidCallback? onTap,
  }) {
    return StatsCard(
      title: 'Open Trades',
      value: value.toString(),
      subtitle: subtitle,
      icon: Icons.open_in_new,
      iconColor: Colors.blue,
      onTap: onTap,
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header Row
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: (iconColor ?? colorScheme.primary).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      icon,
                      color: iconColor ?? colorScheme.primary,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: colorScheme.onSurface.withOpacity(0.7),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          value,
                          style: theme.textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: valueColor ?? colorScheme.onSurface,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (trailing != null) trailing!,
                ],
              ),
              
              // Subtitle
              if (subtitle != null) ...[
                const SizedBox(height: 8),
                Text(
                  subtitle!,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: colorScheme.onSurface.withOpacity(0.6),
                  ),
                ),
              ],
              
              // Progress Bar
              if (progress != null) ...[
                const SizedBox(height: 12),
                LinearProgressIndicator(
                  value: progress!.clamp(0.0, 1.0),
                  backgroundColor: colorScheme.surfaceVariant,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    progressColor ?? iconColor ?? colorScheme.primary,
                  ),
                  borderRadius: BorderRadius.circular(2),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class StatsGrid extends StatelessWidget {
  final List<StatsCard> cards;
  final int crossAxisCount;
  final double mainAxisSpacing;
  final double crossAxisSpacing;

  const StatsGrid({
    super.key,
    required this.cards,
    this.crossAxisCount = 2,
    this.mainAxisSpacing = 16,
    this.crossAxisSpacing = 16,
  });

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        childAspectRatio: 1.2,
        mainAxisSpacing: mainAxisSpacing,
        crossAxisSpacing: crossAxisSpacing,
      ),
      itemCount: cards.length,
      itemBuilder: (context, index) => cards[index],
    );
  }
}

class StatsRow extends StatelessWidget {
  final List<StatsCard> cards;
  final MainAxisAlignment mainAxisAlignment;

  const StatsRow({
    super.key,
    required this.cards,
    this.mainAxisAlignment = MainAxisAlignment.spaceEvenly,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: mainAxisAlignment,
      children: cards
          .map((card) => Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: card,
                ),
              ))
          .toList(),
    );
  }
}