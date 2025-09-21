import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import '../models/models.dart';

class ChartWidget extends StatelessWidget {
  final List<DailyStats> data;
  final ChartType type;
  final String title;
  final Color? primaryColor;
  final Duration animationDuration;

  const ChartWidget({
    super.key,
    required this.data,
    required this.type,
    required this.title,
    this.primaryColor,
    this.animationDuration = const Duration(milliseconds: 800),
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final color = primaryColor ?? colorScheme.primary;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Icon(
                  _getChartIcon(type),
                  color: color,
                  size: 20,
                ),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                _buildPeriodSelector(context),
              ],
            ),
            const SizedBox(height: 16),
            
            // Chart
            SizedBox(
              height: 200,
              child: _buildChart(context, color),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChart(BuildContext context, Color color) {
    if (data.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.bar_chart,
              size: 48,
              color: color.withOpacity(0.3),
            ),
            const SizedBox(height: 8),
            Text(
              'No data available',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: color.withOpacity(0.6),
              ),
            ),
          ],
        ),
      );
    }

    switch (type) {
      case ChartType.line:
        return _buildLineChart(context, color);
      case ChartType.bar:
        return _buildBarChart(context, color);
      case ChartType.area:
        return _buildAreaChart(context, color);
    }
  }

  Widget _buildLineChart(BuildContext context, Color color) {
    final spots = data.asMap().entries.map((entry) {
      final index = entry.key.toDouble();
      final value = _getChartValue(entry.value);
      return FlSpot(index, value);
    }).toList();

    return LineChart(
      LineChartData(
        lineBarsData: [
          LineChartBarData(
            spots: spots,
            isCurved: true,
            color: color,
            barWidth: 2,
            dotData: const FlDotData(show: false),
            belowBarData: BarAreaData(
              show: true,
              color: color.withOpacity(0.1),
            ),
          ),
        ],
        titlesData: FlTitlesData(
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 40,
              getTitlesWidget: (value, meta) => _buildLeftTitle(context, value),
            ),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 30,
              getTitlesWidget: (value, meta) => _buildBottomTitle(context, value),
            ),
          ),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          horizontalInterval: _getHorizontalInterval(),
          getDrawingHorizontalLine: (value) => FlLine(
            color: color.withOpacity(0.1),
            strokeWidth: 1,
          ),
        ),
        borderData: FlBorderData(show: false),
        lineTouchData: LineTouchData(
          touchTooltipData: LineTouchTooltipData(
            tooltipBgColor: color.withOpacity(0.8),
            getTooltipItems: (touchedSpots) {
              return touchedSpots.map((spot) {
                final date = data[spot.x.toInt()].date;
                final value = _getChartValue(data[spot.x.toInt()]);
                return LineTooltipItem(
                  '${DateFormat('MMM dd').format(date)}\n${_formatTooltipValue(value)}',
                  const TextStyle(color: Colors.white, fontSize: 12),
                );
              }).toList();
            },
          ),
        ),
      ),
      duration: animationDuration,
    );
  }

  Widget _buildBarChart(BuildContext context, Color color) {
    final barGroups = data.asMap().entries.map((entry) {
      final index = entry.key;
      final value = _getChartValue(entry.value);
      return BarChartGroupData(
        x: index,
        barRods: [
          BarChartRodData(
            toY: value,
            color: value >= 0 ? Colors.green : Colors.red,
            width: 12,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(2)),
          ),
        ],
      );
    }).toList();

    return BarChart(
      BarChartData(
        barGroups: barGroups,
        titlesData: FlTitlesData(
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 40,
              getTitlesWidget: (value, meta) => _buildLeftTitle(context, value),
            ),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 30,
              getTitlesWidget: (value, meta) => _buildBottomTitle(context, value),
            ),
          ),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          horizontalInterval: _getHorizontalInterval(),
          getDrawingHorizontalLine: (value) => FlLine(
            color: color.withOpacity(0.1),
            strokeWidth: 1,
          ),
        ),
        borderData: FlBorderData(show: false),
        barTouchData: BarTouchData(
          touchTooltipData: BarTouchTooltipData(
            tooltipBgColor: color.withOpacity(0.8),
            getTooltipItem: (group, groupIndex, rod, rodIndex) {
              final date = data[group.x].date;
              final value = rod.toY;
              return BarTooltipItem(
                '${DateFormat('MMM dd').format(date)}\n${_formatTooltipValue(value)}',
                const TextStyle(color: Colors.white, fontSize: 12),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildAreaChart(BuildContext context, Color color) {
    return _buildLineChart(context, color); // Area chart is similar to line chart with fill
  }

  Widget _buildLeftTitle(BuildContext context, double value) {
    final theme = Theme.of(context);
    return Text(
      _formatAxisValue(value),
      style: theme.textTheme.bodySmall?.copyWith(
        color: theme.colorScheme.onSurface.withOpacity(0.6),
      ),
    );
  }

  Widget _buildBottomTitle(BuildContext context, double value) {
    final theme = Theme.of(context);
    if (value.toInt() >= data.length || value < 0) return const SizedBox();
    
    final date = data[value.toInt()].date;
    return Text(
      DateFormat('dd').format(date),
      style: theme.textTheme.bodySmall?.copyWith(
        color: theme.colorScheme.onSurface.withOpacity(0.6),
      ),
    );
  }

  Widget _buildPeriodSelector(BuildContext context) {
    return PopupMenuButton<String>(
      icon: const Icon(Icons.more_vert, size: 16),
      itemBuilder: (context) => [
        const PopupMenuItem(value: '7d', child: Text('7 Days')),
        const PopupMenuItem(value: '30d', child: Text('30 Days')),
        const PopupMenuItem(value: '90d', child: Text('90 Days')),
        const PopupMenuItem(value: '1y', child: Text('1 Year')),
      ],
      onSelected: (value) {
        // Handle period selection
      },
    );
  }

  double _getChartValue(DailyStats stat) {
    switch (title.toLowerCase()) {
      case 'profit':
      case 'daily profit':
        return stat.netProfit;
      case 'trades':
      case 'daily trades':
        return stat.trades.toDouble();
      case 'win rate':
        return stat.winRate;
      default:
        return stat.netProfit;
    }
  }

  double _getHorizontalInterval() {
    if (data.isEmpty) return 1;
    
    final values = data.map(_getChartValue).toList();
    final max = values.reduce((a, b) => a > b ? a : b);
    final min = values.reduce((a, b) => a < b ? a : b);
    final range = max - min;
    
    if (range == 0) return 1;
    return range / 5;
  }

  String _formatAxisValue(double value) {
    if (title.toLowerCase().contains('profit')) {
      return '\$${value.toStringAsFixed(0)}';
    } else if (title.toLowerCase().contains('rate')) {
      return '${value.toStringAsFixed(0)}%';
    } else {
      return value.toStringAsFixed(0);
    }
  }

  String _formatTooltipValue(double value) {
    if (title.toLowerCase().contains('profit')) {
      return '\$${value.toStringAsFixed(2)}';
    } else if (title.toLowerCase().contains('rate')) {
      return '${value.toStringAsFixed(1)}%';
    } else {
      return value.toStringAsFixed(0);
    }
  }

  IconData _getChartIcon(ChartType type) {
    switch (type) {
      case ChartType.line:
        return Icons.show_chart;
      case ChartType.bar:
        return Icons.bar_chart;
      case ChartType.area:
        return Icons.area_chart;
    }
  }
}

enum ChartType {
  line,
  bar,
  area,
}

// Predefined chart widgets for common use cases
class ProfitChart extends StatelessWidget {
  final List<DailyStats> data;
  final String title;

  const ProfitChart({
    super.key,
    required this.data,
    this.title = 'Daily Profit',
  });

  @override
  Widget build(BuildContext context) {
    return ChartWidget(
      data: data,
      type: ChartType.area,
      title: title,
      primaryColor: Colors.green,
    );
  }
}

class TradesChart extends StatelessWidget {
  final List<DailyStats> data;
  final String title;

  const TradesChart({
    super.key,
    required this.data,
    this.title = 'Daily Trades',
  });

  @override
  Widget build(BuildContext context) {
    return ChartWidget(
      data: data,
      type: ChartType.bar,
      title: title,
      primaryColor: Colors.blue,
    );
  }
}

class WinRateChart extends StatelessWidget {
  final List<DailyStats> data;
  final String title;

  const WinRateChart({
    super.key,
    required this.data,
    this.title = 'Win Rate',
  });

  @override
  Widget build(BuildContext context) {
    return ChartWidget(
      data: data,
      type: ChartType.line,
      title: title,
      primaryColor: Colors.purple,
    );
  }
}