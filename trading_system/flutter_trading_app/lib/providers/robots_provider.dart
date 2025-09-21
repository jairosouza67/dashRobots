import 'package:flutter/foundation.dart';
import '../models/models.dart';
import '../services/services.dart';

class RobotsProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  final StorageService _storageService = StorageService();
  final WebSocketService _webSocketService = WebSocketService();

  List<Robot> _robots = [];
  bool _isLoading = false;
  String? _error;

  List<Robot> get robots => List.unmodifiable(_robots);
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasRobots => _robots.isNotEmpty;

  RobotsProvider() {
    _initialize();
  }

  void _initialize() {
    // Load cached data first
    final cachedRobots = _storageService.getRobotsCache();
    if (cachedRobots != null) {
      _robots = cachedRobots;
      notifyListeners();
    }

    // Listen to WebSocket updates
    _webSocketService.robotsStream.listen(
      (robots) {
        _robots = robots;
        _storageService.saveRobotsCache(robots);
        notifyListeners();
      },
      onError: (error) {
        _error = error.toString();
        notifyListeners();
      },
    );

    // Load fresh data
    loadRobots();
  }

  Future<void> loadRobots() async {
    _setLoading(true);
    _clearError();

    try {
      _robots = await _apiService.getRobots();
      await _storageService.saveRobotsCache(_robots);
      notifyListeners();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  Future<void> refreshRobots() async {
    await loadRobots();
  }

  Future<Robot?> getRobot(String robotId) async {
    try {
      final robot = await _apiService.getRobot(robotId);
      
      // Update the robot in the list
      final index = _robots.indexWhere((r) => r.id == robotId);
      if (index != -1) {
        _robots[index] = robot;
        await _storageService.saveRobotsCache(_robots);
        notifyListeners();
      }
      
      return robot;
    } catch (e) {
      _setError(e.toString());
      return null;
    }
  }

  Future<bool> startRobot(String robotId) async {
    try {
      _clearError();
      
      // Send WebSocket command for immediate response
      _webSocketService.startRobot(robotId);
      
      // Also update via API
      final updatedRobot = await _apiService.updateRobotStatus(robotId, true);
      
      // Update local state
      final index = _robots.indexWhere((r) => r.id == robotId);
      if (index != -1) {
        _robots[index] = updatedRobot;
        await _storageService.saveRobotsCache(_robots);
        notifyListeners();
      }
      
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  Future<bool> stopRobot(String robotId) async {
    try {
      _clearError();
      
      // Send WebSocket command for immediate response
      _webSocketService.stopRobot(robotId);
      
      // Also update via API
      final updatedRobot = await _apiService.updateRobotStatus(robotId, false);
      
      // Update local state
      final index = _robots.indexWhere((r) => r.id == robotId);
      if (index != -1) {
        _robots[index] = updatedRobot;
        await _storageService.saveRobotsCache(_robots);
        notifyListeners();
      }
      
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  Future<bool> updateRobotParameters(String robotId, Map<String, dynamic> parameters) async {
    try {
      _clearError();
      
      // Send WebSocket command for immediate response
      _webSocketService.updateRobotParameters(robotId, parameters);
      
      // Also update via API
      final updatedRobot = await _apiService.updateRobotParameters(robotId, parameters);
      
      // Update local state
      final index = _robots.indexWhere((r) => r.id == robotId);
      if (index != -1) {
        _robots[index] = updatedRobot;
        await _storageService.saveRobotsCache(_robots);
        notifyListeners();
      }
      
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  void subscribeToRobot(String robotId) {
    _webSocketService.subscribeToRobot(robotId);
  }

  void unsubscribeFromRobot(String robotId) {
    _webSocketService.unsubscribeFromRobot(robotId);
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
  List<Robot> get activeRobots => _robots.where((r) => r.isActive).toList();
  List<Robot> get inactiveRobots => _robots.where((r) => r.isInactive).toList();
  List<Robot> get errorRobots => _robots.where((r) => r.hasError).toList();
  
  int get activeCount => activeRobots.length;
  int get inactiveCount => inactiveRobots.length;
  int get errorCount => errorRobots.length;
  
  double get totalProfit => _robots.fold(0.0, (sum, robot) => sum + robot.totalProfit);
  double get totalBalance => _robots.fold(0.0, (sum, robot) => sum + robot.balance);
  double get totalEquity => _robots.fold(0.0, (sum, robot) => sum + robot.equity);
  
  Robot? findRobotById(String id) {
    try {
      return _robots.firstWhere((robot) => robot.id == id);
    } catch (e) {
      return null;
    }
  }
}