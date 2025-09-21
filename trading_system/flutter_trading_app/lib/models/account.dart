import 'package:json_annotation/json_annotation.dart';

part 'account.g.dart';

@JsonSerializable()
class Account {
  final String id;
  final String name;
  final String server;
  final int accountNumber;
  final double balance;
  final double equity;
  final double margin;
  final double freeMargin;
  final double marginLevel;
  final double profit;
  final String currency;
  final String company;
  final bool tradeAllowed;
  final bool tradeExpert;
  final int leverage;
  final DateTime lastUpdate;
  final String status; // 'CONNECTED', 'DISCONNECTED', 'ERROR'

  const Account({
    required this.id,
    required this.name,
    required this.server,
    required this.accountNumber,
    required this.balance,
    required this.equity,
    required this.margin,
    required this.freeMargin,
    required this.marginLevel,
    required this.profit,
    required this.currency,
    required this.company,
    required this.tradeAllowed,
    required this.tradeExpert,
    required this.leverage,
    required this.lastUpdate,
    required this.status,
  });

  factory Account.fromJson(Map<String, dynamic> json) => _$AccountFromJson(json);
  Map<String, dynamic> toJson() => _$AccountToJson(this);

  Account copyWith({
    String? id,
    String? name,
    String? server,
    int? accountNumber,
    double? balance,
    double? equity,
    double? margin,
    double? freeMargin,
    double? marginLevel,
    double? profit,
    String? currency,
    String? company,
    bool? tradeAllowed,
    bool? tradeExpert,
    int? leverage,
    DateTime? lastUpdate,
    String? status,
  }) {
    return Account(
      id: id ?? this.id,
      name: name ?? this.name,
      server: server ?? this.server,
      accountNumber: accountNumber ?? this.accountNumber,
      balance: balance ?? this.balance,
      equity: equity ?? this.equity,
      margin: margin ?? this.margin,
      freeMargin: freeMargin ?? this.freeMargin,
      marginLevel: marginLevel ?? this.marginLevel,
      profit: profit ?? this.profit,
      currency: currency ?? this.currency,
      company: company ?? this.company,
      tradeAllowed: tradeAllowed ?? this.tradeAllowed,
      tradeExpert: tradeExpert ?? this.tradeExpert,
      leverage: leverage ?? this.leverage,
      lastUpdate: lastUpdate ?? this.lastUpdate,
      status: status ?? this.status,
    );
  }

  bool get isConnected => status == 'CONNECTED';
  bool get isDisconnected => status == 'DISCONNECTED';
  bool get hasError => status == 'ERROR';
  bool get isProfitable => profit > 0;
  bool get canTrade => tradeAllowed && tradeExpert;
  
  double get marginUsagePercent => balance > 0 ? (margin / balance) * 100 : 0;
}