import 'package:json_annotation/json_annotation.dart';

part 'stats.g.dart';

@JsonSerializable()
class Stats {
  final double totalProfit;
  final double totalLoss;
  final double netProfit;
  final int totalTrades;
  final int winTrades;
  final int lossTrades;
  final double winRate;
  final double profitFactor;
  final double averageWin;
  final double averageLoss;
  final double maxDrawdown;
  final double sharpeRatio;
  final double expectancy;
  final List<DailyStats> dailyStats;
  final DateTime lastUpdate;

  const Stats({
    required this.totalProfit,
    required this.totalLoss,
    required this.netProfit,
    required this.totalTrades,
    required this.winTrades,
    required this.lossTrades,
    required this.winRate,
    required this.profitFactor,
    required this.averageWin,
    required this.averageLoss,
    required this.maxDrawdown,
    required this.sharpeRatio,
    required this.expectancy,
    required this.dailyStats,
    required this.lastUpdate,
  });

  factory Stats.fromJson(Map<String, dynamic> json) => _$StatsFromJson(json);
  Map<String, dynamic> toJson() => _$StatsToJson(this);

  Stats copyWith({
    double? totalProfit,
    double? totalLoss,
    double? netProfit,
    int? totalTrades,
    int? winTrades,
    int? lossTrades,
    double? winRate,
    double? profitFactor,
    double? averageWin,
    double? averageLoss,
    double? maxDrawdown,
    double? sharpeRatio,
    double? expectancy,
    List<DailyStats>? dailyStats,
    DateTime? lastUpdate,
  }) {
    return Stats(
      totalProfit: totalProfit ?? this.totalProfit,
      totalLoss: totalLoss ?? this.totalLoss,
      netProfit: netProfit ?? this.netProfit,
      totalTrades: totalTrades ?? this.totalTrades,
      winTrades: winTrades ?? this.winTrades,
      lossTrades: lossTrades ?? this.lossTrades,
      winRate: winRate ?? this.winRate,
      profitFactor: profitFactor ?? this.profitFactor,
      averageWin: averageWin ?? this.averageWin,
      averageLoss: averageLoss ?? this.averageLoss,
      maxDrawdown: maxDrawdown ?? this.maxDrawdown,
      sharpeRatio: sharpeRatio ?? this.sharpeRatio,
      expectancy: expectancy ?? this.expectancy,
      dailyStats: dailyStats ?? this.dailyStats,
      lastUpdate: lastUpdate ?? this.lastUpdate,
    );
  }

  bool get isProfitable => netProfit > 0;
  bool get hasGoodWinRate => winRate >= 50;
  bool get hasGoodProfitFactor => profitFactor >= 1.5;
}

@JsonSerializable()
class DailyStats {
  final DateTime date;
  final double profit;
  final double loss;
  final double netProfit;
  final int trades;
  final int wins;
  final int losses;

  const DailyStats({
    required this.date,
    required this.profit,
    required this.loss,
    required this.netProfit,
    required this.trades,
    required this.wins,
    required this.losses,
  });

  factory DailyStats.fromJson(Map<String, dynamic> json) => _$DailyStatsFromJson(json);
  Map<String, dynamic> toJson() => _$DailyStatsToJson(this);

  double get winRate => trades > 0 ? (wins / trades) * 100 : 0;
  bool get isProfitable => netProfit > 0;
}