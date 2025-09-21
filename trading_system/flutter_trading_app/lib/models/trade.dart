import 'package:json_annotation/json_annotation.dart';

part 'trade.g.dart';

@JsonSerializable()
class Trade {
  final String id;
  final String symbol;
  final String type; // 'BUY' or 'SELL'
  final double volume;
  final double openPrice;
  final double? closePrice;
  final double? stopLoss;
  final double? takeProfit;
  final double? profit;
  final DateTime openTime;
  final DateTime? closeTime;
  final String status; // 'OPEN', 'CLOSED', 'PENDING'
  final String? comment;
  final String robotId;

  const Trade({
    required this.id,
    required this.symbol,
    required this.type,
    required this.volume,
    required this.openPrice,
    this.closePrice,
    this.stopLoss,
    this.takeProfit,
    this.profit,
    required this.openTime,
    this.closeTime,
    required this.status,
    this.comment,
    required this.robotId,
  });

  factory Trade.fromJson(Map<String, dynamic> json) => _$TradeFromJson(json);
  Map<String, dynamic> toJson() => _$TradeToJson(this);

  Trade copyWith({
    String? id,
    String? symbol,
    String? type,
    double? volume,
    double? openPrice,
    double? closePrice,
    double? stopLoss,
    double? takeProfit,
    double? profit,
    DateTime? openTime,
    DateTime? closeTime,
    String? status,
    String? comment,
    String? robotId,
  }) {
    return Trade(
      id: id ?? this.id,
      symbol: symbol ?? this.symbol,
      type: type ?? this.type,
      volume: volume ?? this.volume,
      openPrice: openPrice ?? this.openPrice,
      closePrice: closePrice ?? this.closePrice,
      stopLoss: stopLoss ?? this.stopLoss,
      takeProfit: takeProfit ?? this.takeProfit,
      profit: profit ?? this.profit,
      openTime: openTime ?? this.openTime,
      closeTime: closeTime ?? this.closeTime,
      status: status ?? this.status,
      comment: comment ?? this.comment,
      robotId: robotId ?? this.robotId,
    );
  }

  bool get isOpen => status == 'OPEN';
  bool get isClosed => status == 'CLOSED';
  bool get isPending => status == 'PENDING';
  bool get isBuy => type == 'BUY';
  bool get isSell => type == 'SELL';
  
  double get currentProfit => profit ?? 0.0;
}