import 'package:flutter/foundation.dart';
import '../models/models.dart';
import '../services/services.dart';

class AccountProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  final StorageService _storageService = StorageService();
  final WebSocketService _webSocketService = WebSocketService();

  Account? _account;
  bool _isLoading = false;
  String? _error;

  Account? get account => _account;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasAccount => _account != null;

  AccountProvider() {
    _initialize();
  }

  void _initialize() {
    // Load cached data first
    _account = _storageService.getAccountCache();
    if (_account != null) {
      notifyListeners();
    }

    // Listen to WebSocket updates
    _webSocketService.accountStream.listen(
      (account) {
        _account = account;
        _storageService.saveAccountCache(account);
        notifyListeners();
      },
      onError: (error) {
        _error = error.toString();
        notifyListeners();
      },
    );

    // Load fresh data
    loadAccount();
  }

  Future<void> loadAccount() async {
    _setLoading(true);
    _clearError();

    try {
      _account = await _apiService.getAccount();
      await _storageService.saveAccountCache(_account!);
      notifyListeners();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  Future<void> refreshAccount() async {
    await loadAccount();
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
  bool get isConnected => _account?.isConnected ?? false;
  bool get canTrade => _account?.canTrade ?? false;
  double get balance => _account?.balance ?? 0.0;
  double get equity => _account?.equity ?? 0.0;
  double get profit => _account?.profit ?? 0.0;
  double get marginLevel => _account?.marginLevel ?? 0.0;
  String get currency => _account?.currency ?? 'USD';
}