import 'package:json_annotation/json_annotation.dart';

part 'robot.g.dart';

@JsonSerializable()
class Robot {
  final String id;
  final String name;
  final String status; // 'ACTIVE', 'INACTIVE', 'ERROR'
  final String strategy;
  final List<String> symbols;
  final Map<String, dynamic> parameters;
  final double balance;
  final double equity;
  final double totalProfit;
  final int totalTrades;
  final int winTrades;
  final int lossTrades;
  final double winRate;
  final DateTime lastUpdate;
  final String? errorMessage;
  final bool autoTrading;

  const Robot({
    required this.id,
    required this.name,
    required this.status,
    required this.strategy,
    required this.symbols,
    required this.parameters,
    required this.balance,
    required this.equity,
    required this.totalProfit,
    required this.totalTrades,
    required this.winTrades,
    required this.lossTrades,
    required this.winRate,
    required this.lastUpdate,
    this.errorMessage,
    required this.autoTrading,
  });

  factory Robot.fromJson(Map<String, dynamic> json) => _$RobotFromJson(json);
  Map<String, dynamic> toJson() => _$RobotToJson(this);

  Robot copyWith({
    String? id,
    String? name,
    String? status,
    String? strategy,
    List<String>? symbols,
    Map<String, dynamic>? parameters,
    double? balance,
    double? equity,
    double? totalProfit,
    int? totalTrades,
    int? winTrades,
    int? lossTrades,
    double? winRate,
    DateTime? lastUpdate,
    String? errorMessage,
    bool? autoTrading,
  }) {
    return Robot(
      id: id ?? this.id,
      name: name ?? this.name,
      status: status ?? this.status,
      strategy: strategy ?? this.strategy,
      symbols: symbols ?? this.symbols,
      parameters: parameters ?? this.parameters,
      balance: balance ?? this.balance,
      equity: equity ?? this.equity,
      totalProfit: totalProfit ?? this.totalProfit,
      totalTrades: totalTrades ?? this.totalTrades,
      winTrades: winTrades ?? this.winTrades,
      lossTrades: lossTrades ?? this.lossTrades,
      winRate: winRate ?? this.winRate,
      lastUpdate: lastUpdate ?? this.lastUpdate,
      errorMessage: errorMessage ?? this.errorMessage,
      autoTrading: autoTrading ?? this.autoTrading,
    );
  }

  bool get isActive => status == 'ACTIVE';
  bool get isInactive => status == 'INACTIVE';
  bool get hasError => status == 'ERROR';
  bool get isProfitable => totalProfit > 0;
  
  double get profitFactor => lossTrades > 0 ? winTrades / lossTrades : 0.0;
}