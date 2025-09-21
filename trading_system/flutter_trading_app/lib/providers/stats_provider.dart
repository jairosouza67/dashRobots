import 'package:flutter/foundation.dart';
import '../models/models.dart';
import '../services/services.dart';

class StatsProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  final StorageService _storageService = StorageService();
  final WebSocketService _webSocketService = WebSocketService();

  Stats? _stats;
  bool _isLoading = false;
  String? _error;
  String? _filterRobotId;

  Stats? get stats => _stats;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasStats => _stats != null;
  String? get filterRobotId => _filterRobotId;

  StatsProvider() {
    _initialize();
  }

  void _initialize() {
    // Load cached data first
    _stats = _storageService.getStatsCache();
    if (_stats != null) {
      notifyListeners();
    }

    // Listen to WebSocket updates
    _webSocketService.statsStream.listen(
      (stats) {
        _stats = stats;
        _storageService.saveStatsCache(stats);
        notifyListeners();
      },
      onError: (error) {
        _error = error.toString();
        notifyListeners();
      },
    );

    // Load fresh data
    loadStats();
  }

  Future<void> loadStats({String? robotId}) async {
    _setLoading(true);
    _clearError();

    try {
      _stats = await _apiService.getStats(robotId: robotId);
      _filterRobotId = robotId;
      await _storageService.saveStatsCache(_stats!);
      notifyListeners();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  Future<void> refreshStats() async {
    await loadStats(robotId: _filterRobotId);
  }

  void setRobotFilter(String? robotId) {
    if (_filterRobotId != robotId) {
      _filterRobotId = robotId;
      loadStats(robotId: robotId);
    }
  }

  void clearFilter() {
    if (_filterRobotId != null) {
      _filterRobotId = null;
      loadStats();
    }
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
  double get netProfit => _stats?.netProfit ?? 0.0;
  double get totalProfit => _stats?.totalProfit ?? 0.0;
  double get totalLoss => _stats?.totalLoss ?? 0.0;
  int get totalTrades => _stats?.totalTrades ?? 0;
  int get winTrades => _stats?.winTrades ?? 0;
  int get lossTrades => _stats?.lossTrades ?? 0;
  double get winRate => _stats?.winRate ?? 0.0;
  double get profitFactor => _stats?.profitFactor ?? 0.0;
  double get averageWin => _stats?.averageWin ?? 0.0;
  double get averageLoss => _stats?.averageLoss ?? 0.0;
  double get maxDrawdown => _stats?.maxDrawdown ?? 0.0;
  double get sharpeRatio => _stats?.sharpeRatio ?? 0.0;
  double get expectancy => _stats?.expectancy ?? 0.0;
  List<DailyStats> get dailyStats => _stats?.dailyStats ?? [];

  bool get isProfitable => netProfit > 0;
  bool get hasGoodWinRate => winRate >= 50;
  bool get hasGoodProfitFactor => profitFactor >= 1.5;
  bool get hasGoodSharpeRatio => sharpeRatio >= 1.0;

  // Chart data helpers
  List<MapEntry<DateTime, double>> get profitChartData {
    return dailyStats
        .map((stat) => MapEntry(stat.date, stat.netProfit))
        .toList();
  }

  List<MapEntry<DateTime, int>> get tradesChartData {
    return dailyStats
        .map((stat) => MapEntry(stat.date, stat.trades))
        .toList();
  }

  List<MapEntry<DateTime, double>> get winRateChartData {
    return dailyStats
        .map((stat) => MapEntry(stat.date, stat.winRate))
        .toList();
  }

  // Performance metrics
  String get performanceRating {
    int score = 0;
    
    if (isProfitable) score += 2;
    if (hasGoodWinRate) score += 2;
    if (hasGoodProfitFactor) score += 2;
    if (hasGoodSharpeRatio) score += 2;
    if (maxDrawdown < 10) score += 1;
    if (totalTrades > 100) score += 1;

    switch (score) {
      case 9:
      case 10:
        return 'Excellent';
      case 7:
      case 8:
        return 'Good';
      case 5:
      case 6:
        return 'Average';
      case 3:
      case 4:
        return 'Poor';
      default:
        return 'Very Poor';
    }
  }

  String get riskRating {
    if (maxDrawdown < 5) return 'Low';
    if (maxDrawdown < 15) return 'Medium';
    if (maxDrawdown < 30) return 'High';
    return 'Very High';
  }
}