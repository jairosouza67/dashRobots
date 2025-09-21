// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'account.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Account _$AccountFromJson(Map<String, dynamic> json) => Account(
      id: json['id'] as String,
      name: json['name'] as String,
      server: json['server'] as String,
      accountNumber: (json['accountNumber'] as num).toInt(),
      balance: (json['balance'] as num).toDouble(),
      equity: (json['equity'] as num).toDouble(),
      margin: (json['margin'] as num).toDouble(),
      freeMargin: (json['freeMargin'] as num).toDouble(),
      marginLevel: (json['marginLevel'] as num).toDouble(),
      profit: (json['profit'] as num).toDouble(),
      currency: json['currency'] as String,
      company: json['company'] as String,
      tradeAllowed: json['tradeAllowed'] as bool,
      tradeExpert: json['tradeExpert'] as bool,
      leverage: (json['leverage'] as num).toInt(),
      lastUpdate: DateTime.parse(json['lastUpdate'] as String),
      status: json['status'] as String,
    );

Map<String, dynamic> _$AccountToJson(Account instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'server': instance.server,
      'accountNumber': instance.accountNumber,
      'balance': instance.balance,
      'equity': instance.equity,
      'margin': instance.margin,
      'freeMargin': instance.freeMargin,
      'marginLevel': instance.marginLevel,
      'profit': instance.profit,
      'currency': instance.currency,
      'company': instance.company,
      'tradeAllowed': instance.tradeAllowed,
      'tradeExpert': instance.tradeExpert,
      'leverage': instance.leverage,
      'lastUpdate': instance.lastUpdate.toIso8601String(),
      'status': instance.status,
    };
