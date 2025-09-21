import 'package:flutter/foundation.dart';
import '../models/models.dart';
import '../services/services.dart';

class TradesProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  final StorageService _storageService = StorageService();
  final WebSocketService _webSocketService = WebSocketService();

  List<Trade> _trades = [];
  bool _isLoading = false;
  String? _error;
  String? _filterRobotId;
  String? _filterStatus;

  List<Trade> get trades => List.unmodifiable(_getFilteredTrades());
  List<Trade> get allTrades => List.unmodifiable(_trades);
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasTrades => _trades.isNotEmpty;
  String? get filterRobotId => _filterRobotId;
  String? get filterStatus => _filterStatus;

  TradesProvider() {
    _initialize();
  }

  void _initialize() {
    // Load cached data first
    final cachedTrades = _storageService.getTradesCache();
    if (cachedTrades != null) {
      _trades = cachedTrades;
      notifyListeners();
    }

    // Listen to WebSocket updates
    _webSocketService.tradesStream.listen(
      (trades) {
        _trades = trades;
        _storageService.saveTradesCache(trades);
        notifyListeners();
      },
      onError: (error) {
        _error = error.toString();
        notifyListeners();
      },
    );

    // Load fresh data
    loadTrades();
  }

  List<Trade> _getFilteredTrades() {
    List<Trade> filtered = _trades;

    if (_filterRobotId != null) {
      filtered = filtered.where((trade) => trade.robotId == _filterRobotId).toList();
    }

    if (_filterStatus != null) {
      filtered = filtered.where((trade) => trade.status == _filterStatus).toList();
    }

    // Sort by open time (newest first)
    filtered.sort((a, b) => b.openTime.compareTo(a.openTime));

    return filtered;
  }

  Future<void> loadTrades({String? robotId, String? status}) async {
    _setLoading(true);
    _clearError();

    try {
      _trades = await _apiService.getTrades(robotId: robotId, status: status);
      await _storageService.saveTradesCache(_trades);
      notifyListeners();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  Future<void> refreshTrades() async {
    await loadTrades(robotId: _filterRobotId, status: _filterStatus);
  }

  Future<Trade?> getTrade(String tradeId) async {
    try {
      final trade = await _apiService.getTrade(tradeId);
      
      // Update the trade in the list
      final index = _trades.indexWhere((t) => t.id == tradeId);
      if (index != -1) {
        _trades[index] = trade;
        await _storageService.saveTradesCache(_trades);
        notifyListeners();
      }
      
      return trade;
    } catch (e) {
      _setError(e.toString());
      return null;
    }
  }

  Future<bool> closeTrade(String tradeId) async {
    try {
      _clearError();
      
      // Send WebSocket command for immediate response
      _webSocketService.closeTrade(tradeId);
      
      // Also close via API
      final closedTrade = await _apiService.closeTrade(tradeId);
      
      // Update local state
      final index = _trades.indexWhere((t) => t.id == tradeId);
      if (index != -1) {
        _trades[index] = closedTrade;
        await _storageService.saveTradesCache(_trades);
        notifyListeners();
      }
      
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  Future<bool> modifyTrade(String tradeId, {double? stopLoss, double? takeProfit}) async {
    try {
      _clearError();
      
      // Send WebSocket command for immediate response
      _webSocketService.modifyTrade(tradeId, stopLoss: stopLoss, takeProfit: takeProfit);
      
      // Also modify via API
      final modifiedTrade = await _apiService.modifyTrade(
        tradeId,
        stopLoss: stopLoss,
        takeProfit: takeProfit,
      );
      
      // Update local state
      final index = _trades.indexWhere((t) => t.id == tradeId);
      if (index != -1) {
        _trades[index] = modifiedTrade;
        await _storageService.saveTradesCache(_trades);
        notifyListeners();
      }
      
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  void setRobotFilter(String? robotId) {
    _filterRobotId = robotId;
    notifyListeners();
  }

  void setStatusFilter(String? status) {
    _filterStatus = status;
    notifyListeners();
  }

  void clearFilters() {
    _filterRobotId = null;
    _filterStatus = null;
    notifyListeners();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
  }

  // Helper getters
  List<Trade> get openTrades => _trades.where((t) => t.isOpen).toList();
  List<Trade> get closedTrades => _trades.where((t) => t.isClosed).toList();
  List<Trade> get pendingTrades => _trades.where((t) => t.isPending).toList();
  
  List<Trade> get buyTrades => _trades.where((t) => t.isBuy).toList();
  List<Trade> get sellTrades => _trades.where((t) => t.isSell).toList();
  
  List<Trade> get profitableTrades => _trades.where((t) => t.currentProfit > 0).toList();
  List<Trade> get losingTrades => _trades.where((t) => t.currentProfit < 0).toList();
  
  int get openCount => openTrades.length;
  int get closedCount => closedTrades.length;
  int get pendingCount => pendingTrades.length;
  
  double get totalProfit => _trades.fold(0.0, (sum, trade) => sum + trade.currentProfit);
  double get openProfit => openTrades.fold(0.0, (sum, trade) => sum + trade.currentProfit);
  double get closedProfit => closedTrades.fold(0.0, (sum, trade) => sum + trade.currentProfit);
  
  double get winRate {
    final closed = closedTrades;
    if (closed.isEmpty) return 0.0;
    final wins = closed.where((t) => t.currentProfit > 0).length;
    return (wins / closed.length) * 100;
  }
  
  Trade? findTradeById(String id) {
    try {
      return _trades.firstWhere((trade) => trade.id == id);
    } catch (e) {
      return null;
    }
  }

  List<Trade> getTradesByRobot(String robotId) {
    return _trades.where((trade) => trade.robotId == robotId).toList();
  }

  List<Trade> getTradesBySymbol(String symbol) {
    return _trades.where((trade) => trade.symbol == symbol).toList();
  }
}