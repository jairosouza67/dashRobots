import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/models.dart';

class StorageService {
  static final StorageService _instance = StorageService._internal();
  factory StorageService() => _instance;
  StorageService._internal();

  SharedPreferences? _prefs;

  Future<void> initialize() async {
    _prefs ??= await SharedPreferences.getInstance();
  }

  SharedPreferences get prefs {
    if (_prefs == null) {
      throw Exception('StorageService not initialized. Call initialize() first.');
    }
    return _prefs!;
  }

  // Device Token
  static const String _deviceTokenKey = 'device_token';

  Future<void> saveDeviceToken(String token) async {
    await prefs.setString(_deviceTokenKey, token);
  }

  String? getDeviceToken() {
    return prefs.getString(_deviceTokenKey);
  }

  // Notification Settings
  static const String _notificationSettingsKey = 'notification_settings';

  Future<void> saveNotificationSettings(Map<String, bool> settings) async {
    final String json = jsonEncode(settings);
    await prefs.setString(_notificationSettingsKey, json);
  }

  Future<Map<String, bool>> getNotificationSettings() async {
    final String? json = prefs.getString(_notificationSettingsKey);
    if (json != null) {
      final Map<String, dynamic> decoded = jsonDecode(json);
      return decoded.map((key, value) => MapEntry(key, value as bool));
    }
    
    // Default settings
    return {
      'trade_opened': true,
      'trade_closed': true,
      'robot_error': true,
      'robot_stopped': true,
      'account_update': false,
      'daily_summary': true,
    };
  }

  // App Settings
  static const String _themeKey = 'theme_mode';
  static const String _languageKey = 'language';
  static const String _autoRefreshKey = 'auto_refresh';
  static const String _refreshIntervalKey = 'refresh_interval';

  Future<void> saveThemeMode(String themeMode) async {
    await prefs.setString(_themeKey, themeMode);
  }

  String getThemeMode() {
    return prefs.getString(_themeKey) ?? 'system';
  }

  Future<void> saveLanguage(String language) async {
    await prefs.setString(_languageKey, language);
  }

  String getLanguage() {
    return prefs.getString(_languageKey) ?? 'en';
  }

  Future<void> saveAutoRefresh(bool autoRefresh) async {
    await prefs.setBool(_autoRefreshKey, autoRefresh);
  }

  bool getAutoRefresh() {
    return prefs.getBool(_autoRefreshKey) ?? true;
  }

  Future<void> saveRefreshInterval(int seconds) async {
    await prefs.setInt(_refreshIntervalKey, seconds);
  }

  int getRefreshInterval() {
    return prefs.getInt(_refreshIntervalKey) ?? 30;
  }

  // Cache Management
  static const String _accountCacheKey = 'account_cache';
  static const String _robotsCacheKey = 'robots_cache';
  static const String _tradesCacheKey = 'trades_cache';
  static const String _statsCacheKey = 'stats_cache';

  Future<void> saveAccountCache(Account account) async {
    final String json = jsonEncode(account.toJson());
    await prefs.setString(_accountCacheKey, json);
  }

  Account? getAccountCache() {
    final String? json = prefs.getString(_accountCacheKey);
    if (json != null) {
      try {
        return Account.fromJson(jsonDecode(json));
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  Future<void> saveRobotsCache(List<Robot> robots) async {
    final List<Map<String, dynamic>> jsonList = robots.map((r) => r.toJson()).toList();
    final String json = jsonEncode(jsonList);
    await prefs.setString(_robotsCacheKey, json);
  }

  List<Robot>? getRobotsCache() {
    final String? json = prefs.getString(_robotsCacheKey);
    if (json != null) {
      try {
        final List<dynamic> jsonList = jsonDecode(json);
        return jsonList.map((json) => Robot.fromJson(json)).toList();
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  Future<void> saveTradesCache(List<Trade> trades) async {
    final List<Map<String, dynamic>> jsonList = trades.map((t) => t.toJson()).toList();
    final String json = jsonEncode(jsonList);
    await prefs.setString(_tradesCacheKey, json);
  }

  List<Trade>? getTradesCache() {
    final String? json = prefs.getString(_tradesCacheKey);
    if (json != null) {
      try {
        final List<dynamic> jsonList = jsonDecode(json);
        return jsonList.map((json) => Trade.fromJson(json)).toList();
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  Future<void> saveStatsCache(Stats stats) async {
    final String json = jsonEncode(stats.toJson());
    await prefs.setString(_statsCacheKey, json);
  }

  Stats? getStatsCache() {
    final String? json = prefs.getString(_statsCacheKey);
    if (json != null) {
      try {
        return Stats.fromJson(jsonDecode(json));
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Clear all cache
  Future<void> clearCache() async {
    await prefs.remove(_accountCacheKey);
    await prefs.remove(_robotsCacheKey);
    await prefs.remove(_tradesCacheKey);
    await prefs.remove(_statsCacheKey);
  }

  // Clear all data
  Future<void> clearAllData() async {
    await prefs.clear();
  }
}