// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trade.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Trade _$TradeFromJson(Map<String, dynamic> json) => Trade(
      id: json['id'] as String,
      symbol: json['symbol'] as String,
      type: json['type'] as String,
      volume: (json['volume'] as num).toDouble(),
      openPrice: (json['openPrice'] as num).toDouble(),
      closePrice: (json['closePrice'] as num?)?.toDouble(),
      stopLoss: (json['stopLoss'] as num?)?.toDouble(),
      takeProfit: (json['takeProfit'] as num?)?.toDouble(),
      profit: (json['profit'] as num?)?.toDouble(),
      openTime: DateTime.parse(json['openTime'] as String),
      closeTime: json['closeTime'] == null
          ? null
          : DateTime.parse(json['closeTime'] as String),
      status: json['status'] as String,
      comment: json['comment'] as String?,
      robotId: json['robotId'] as String,
    );

Map<String, dynamic> _$TradeToJson(Trade instance) => <String, dynamic>{
      'id': instance.id,
      'symbol': instance.symbol,
      'type': instance.type,
      'volume': instance.volume,
      'openPrice': instance.openPrice,
      'closePrice': instance.closePrice,
      'stopLoss': instance.stopLoss,
      'takeProfit': instance.takeProfit,
      'profit': instance.profit,
      'openTime': instance.openTime.toIso8601String(),
      'closeTime': instance.closeTime?.toIso8601String(),
      'status': instance.status,
      'comment': instance.comment,
      'robotId': instance.robotId,
    };
