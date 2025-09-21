// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'stats.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Stats _$StatsFromJson(Map<String, dynamic> json) => Stats(
      totalProfit: (json['totalProfit'] as num).toDouble(),
      totalLoss: (json['totalLoss'] as num).toDouble(),
      netProfit: (json['netProfit'] as num).toDouble(),
      totalTrades: (json['totalTrades'] as num).toInt(),
      winTrades: (json['winTrades'] as num).toInt(),
      lossTrades: (json['lossTrades'] as num).toInt(),
      winRate: (json['winRate'] as num).toDouble(),
      profitFactor: (json['profitFactor'] as num).toDouble(),
      averageWin: (json['averageWin'] as num).toDouble(),
      averageLoss: (json['averageLoss'] as num).toDouble(),
      maxDrawdown: (json['maxDrawdown'] as num).toDouble(),
      sharpeRatio: (json['sharpeRatio'] as num).toDouble(),
      expectancy: (json['expectancy'] as num).toDouble(),
      dailyStats: (json['dailyStats'] as List<dynamic>)
          .map((e) => DailyStats.fromJson(e as Map<String, dynamic>))
          .toList(),
      lastUpdate: DateTime.parse(json['lastUpdate'] as String),
    );

Map<String, dynamic> _$StatsToJson(Stats instance) => <String, dynamic>{
      'totalProfit': instance.totalProfit,
      'totalLoss': instance.totalLoss,
      'netProfit': instance.netProfit,
      'totalTrades': instance.totalTrades,
      'winTrades': instance.winTrades,
      'lossTrades': instance.lossTrades,
      'winRate': instance.winRate,
      'profitFactor': instance.profitFactor,
      'averageWin': instance.averageWin,
      'averageLoss': instance.averageLoss,
      'maxDrawdown': instance.maxDrawdown,
      'sharpeRatio': instance.sharpeRatio,
      'expectancy': instance.expectancy,
      'dailyStats': instance.dailyStats,
      'lastUpdate': instance.lastUpdate.toIso8601String(),
    };

DailyStats _$DailyStatsFromJson(Map<String, dynamic> json) => DailyStats(
      date: DateTime.parse(json['date'] as String),
      profit: (json['profit'] as num).toDouble(),
      loss: (json['loss'] as num).toDouble(),
      netProfit: (json['netProfit'] as num).toDouble(),
      trades: (json['trades'] as num).toInt(),
      wins: (json['wins'] as num).toInt(),
      losses: (json['losses'] as num).toInt(),
    );

Map<String, dynamic> _$DailyStatsToJson(DailyStats instance) =>
    <String, dynamic>{
      'date': instance.date.toIso8601String(),
      'profit': instance.profit,
      'loss': instance.loss,
      'netProfit': instance.netProfit,
      'trades': instance.trades,
      'wins': instance.wins,
      'losses': instance.losses,
    };
