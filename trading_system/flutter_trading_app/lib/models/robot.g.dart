// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'robot.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Robot _$RobotFromJson(Map<String, dynamic> json) => Robot(
      id: json['id'] as String,
      name: json['name'] as String,
      status: json['status'] as String,
      strategy: json['strategy'] as String,
      symbols:
          (json['symbols'] as List<dynamic>).map((e) => e as String).toList(),
      parameters: json['parameters'] as Map<String, dynamic>,
      balance: (json['balance'] as num).toDouble(),
      equity: (json['equity'] as num).toDouble(),
      totalProfit: (json['totalProfit'] as num).toDouble(),
      totalTrades: (json['totalTrades'] as num).toInt(),
      winTrades: (json['winTrades'] as num).toInt(),
      lossTrades: (json['lossTrades'] as num).toInt(),
      winRate: (json['winRate'] as num).toDouble(),
      lastUpdate: DateTime.parse(json['lastUpdate'] as String),
      errorMessage: json['errorMessage'] as String?,
      autoTrading: json['autoTrading'] as bool,
    );

Map<String, dynamic> _$RobotToJson(Robot instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'status': instance.status,
      'strategy': instance.strategy,
      'symbols': instance.symbols,
      'parameters': instance.parameters,
      'balance': instance.balance,
      'equity': instance.equity,
      'totalProfit': instance.totalProfit,
      'totalTrades': instance.totalTrades,
      'winTrades': instance.winTrades,
      'lossTrades': instance.lossTrades,
      'winRate': instance.winRate,
      'lastUpdate': instance.lastUpdate.toIso8601String(),
      'errorMessage': instance.errorMessage,
      'autoTrading': instance.autoTrading,
    };
