import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:flutter/foundation.dart';
import '../models/models.dart';

class WebSocketService {
  static final WebSocketService _instance = WebSocketService._internal();
  factory WebSocketService() => _instance;
  WebSocketService._internal();

  WebSocketChannel? _channel;
  Timer? _reconnectTimer;
  bool _isConnected = false;
  bool _shouldReconnect = true;
  int _reconnectAttempts = 0;
  static const int maxReconnectAttempts = 5;
  static const Duration reconnectInterval = Duration(seconds: 5);

  // Stream controllers for different data types
  final _accountController = StreamController<Account>.broadcast();
  final _robotsController = StreamController<List<Robot>>.broadcast();
  final _tradesController = StreamController<List<Trade>>.broadcast();
  final _statsController = StreamController<Stats>.broadcast();
  final _connectionController = StreamController<bool>.broadcast();

  // Public streams
  Stream<Account> get accountStream => _accountController.stream;
  Stream<List<Robot>> get robotsStream => _robotsController.stream;
  Stream<List<Trade>> get tradesStream => _tradesController.stream;
  Stream<Stats> get statsStream => _statsController.stream;
  Stream<bool> get connectionStream => _connectionController.stream;

  bool get isConnected => _isConnected;

  Future<void> connect() async {
    if (_isConnected) return;

    try {
      const String wsUrl = 'ws://localhost:8000/ws';
      _channel = WebSocketChannel.connect(Uri.parse(wsUrl));

      _isConnected = true;
      _reconnectAttempts = 0;
      _connectionController.add(true);

      debugPrint('WebSocket connected');

      // Listen to messages
      _channel!.stream.listen(
        _handleMessage,
        onError: _handleError,
        onDone: _handleDisconnection,
      );

      // Send initial subscription message
      _sendSubscriptionMessage();

    } catch (e) {
      debugPrint('WebSocket connection error: $e');
      _handleError(e);
    }
  }

  void _handleMessage(dynamic message) {
    try {
      final Map<String, dynamic> data = jsonDecode(message);
      final String type = data['type'] ?? '';

      switch (type) {
        case 'account_update':
          final account = Account.fromJson(data['data']);
          _accountController.add(account);
          break;

        case 'robots_update':
          final List<dynamic> robotsData = data['data'];
          final robots = robotsData.map((json) => Robot.fromJson(json)).toList();
          _robotsController.add(robots);
          break;

        case 'trades_update':
          final List<dynamic> tradesData = data['data'];
          final trades = tradesData.map((json) => Trade.fromJson(json)).toList();
          _tradesController.add(trades);
          break;

        case 'stats_update':
          final stats = Stats.fromJson(data['data']);
          _statsController.add(stats);
          break;

        case 'ping':
          _sendMessage({'type': 'pong'});
          break;

        default:
          debugPrint('Unknown message type: $type');
      }
    } catch (e) {
      debugPrint('Error parsing WebSocket message: $e');
    }
  }

  void _handleError(dynamic error) {
    debugPrint('WebSocket error: $error');
    _isConnected = false;
    _connectionController.add(false);
    
    if (_shouldReconnect) {
      _scheduleReconnect();
    }
  }

  void _handleDisconnection() {
    debugPrint('WebSocket disconnected');
    _isConnected = false;
    _connectionController.add(false);
    
    if (_shouldReconnect) {
      _scheduleReconnect();
    }
  }

  void _scheduleReconnect() {
    if (_reconnectAttempts >= maxReconnectAttempts) {
      debugPrint('Max reconnection attempts reached');
      return;
    }

    _reconnectAttempts++;
    _reconnectTimer?.cancel();
    
    final delay = Duration(
      seconds: reconnectInterval.inSeconds * _reconnectAttempts,
    );

    debugPrint('Scheduling reconnection attempt $_reconnectAttempts in ${delay.inSeconds}s');
    
    _reconnectTimer = Timer(delay, () {
      if (_shouldReconnect) {
        connect();
      }
    });
  }

  void _sendSubscriptionMessage() {
    _sendMessage({
      'type': 'subscribe',
      'channels': ['account', 'robots', 'trades', 'stats'],
    });
  }

  void _sendMessage(Map<String, dynamic> message) {
    if (_isConnected && _channel != null) {
      _channel!.sink.add(jsonEncode(message));
    }
  }

  // Subscribe to specific robot updates
  void subscribeToRobot(String robotId) {
    _sendMessage({
      'type': 'subscribe_robot',
      'robot_id': robotId,
    });
  }

  void unsubscribeFromRobot(String robotId) {
    _sendMessage({
      'type': 'unsubscribe_robot',
      'robot_id': robotId,
    });
  }

  // Send robot commands
  void startRobot(String robotId) {
    _sendMessage({
      'type': 'robot_command',
      'robot_id': robotId,
      'command': 'start',
    });
  }

  void stopRobot(String robotId) {
    _sendMessage({
      'type': 'robot_command',
      'robot_id': robotId,
      'command': 'stop',
    });
  }

  void updateRobotParameters(String robotId, Map<String, dynamic> parameters) {
    _sendMessage({
      'type': 'robot_command',
      'robot_id': robotId,
      'command': 'update_parameters',
      'parameters': parameters,
    });
  }

  // Send trade commands
  void closeTrade(String tradeId) {
    _sendMessage({
      'type': 'trade_command',
      'trade_id': tradeId,
      'command': 'close',
    });
  }

  void modifyTrade(String tradeId, {double? stopLoss, double? takeProfit}) {
    final data = <String, dynamic>{
      'type': 'trade_command',
      'trade_id': tradeId,
      'command': 'modify',
    };

    if (stopLoss != null) data['stop_loss'] = stopLoss;
    if (takeProfit != null) data['take_profit'] = takeProfit;

    _sendMessage(data);
  }

  void disconnect() {
    _shouldReconnect = false;
    _reconnectTimer?.cancel();
    _channel?.sink.close();
    _isConnected = false;
    _connectionController.add(false);
    debugPrint('WebSocket disconnected manually');
  }

  void dispose() {
    disconnect();
    _accountController.close();
    _robotsController.close();
    _tradesController.close();
    _statsController.close();
    _connectionController.close();
  }
}