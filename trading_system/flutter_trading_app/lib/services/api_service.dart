import 'dart:convert';
import 'package:dio/dio.dart';
import '../models/models.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:8000/api';
  late final Dio _dio;

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    _dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      error: true,
    ));
  }

  // Account endpoints
  Future<Account> getAccount() async {
    try {
      final response = await _dio.get('/account');
      return Account.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Robots endpoints
  Future<List<Robot>> getRobots() async {
    try {
      final response = await _dio.get('/robots');
      final List<dynamic> data = response.data;
      return data.map((json) => Robot.fromJson(json)).toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Robot> getRobot(String robotId) async {
    try {
      final response = await _dio.get('/robots/$robotId');
      return Robot.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Robot> updateRobotStatus(String robotId, bool isActive) async {
    try {
      final response = await _dio.patch('/robots/$robotId', data: {
        'status': isActive ? 'ACTIVE' : 'INACTIVE',
      });
      return Robot.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Robot> updateRobotParameters(String robotId, Map<String, dynamic> parameters) async {
    try {
      final response = await _dio.patch('/robots/$robotId', data: {
        'parameters': parameters,
      });
      return Robot.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Trades endpoints
  Future<List<Trade>> getTrades({String? robotId, String? status}) async {
    try {
      final queryParams = <String, dynamic>{};
      if (robotId != null) queryParams['robot_id'] = robotId;
      if (status != null) queryParams['status'] = status;

      final response = await _dio.get('/trades', queryParameters: queryParams);
      final List<dynamic> data = response.data;
      return data.map((json) => Trade.fromJson(json)).toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Trade> getTrade(String tradeId) async {
    try {
      final response = await _dio.get('/trades/$tradeId');
      return Trade.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Trade> closeTrade(String tradeId) async {
    try {
      final response = await _dio.post('/trades/$tradeId/close');
      return Trade.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Trade> modifyTrade(String tradeId, {
    double? stopLoss,
    double? takeProfit,
  }) async {
    try {
      final data = <String, dynamic>{};
      if (stopLoss != null) data['stop_loss'] = stopLoss;
      if (takeProfit != null) data['take_profit'] = takeProfit;

      final response = await _dio.patch('/trades/$tradeId', data: data);
      return Trade.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Stats endpoints
  Future<Stats> getStats({String? robotId}) async {
    try {
      final queryParams = <String, dynamic>{};
      if (robotId != null) queryParams['robot_id'] = robotId;

      final response = await _dio.get('/stats', queryParameters: queryParams);
      return Stats.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // Notifications endpoints
  Future<void> registerDeviceToken(String token) async {
    try {
      await _dio.post('/notifications/register', data: {
        'device_token': token,
      });
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> updateNotificationSettings(Map<String, bool> settings) async {
    try {
      await _dio.patch('/notifications/settings', data: settings);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  // MT5 Control endpoints
  Future<Map<String, dynamic>> getMT5Status() async {
    try {
      final response = await _dio.get('/mt5/status');
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> startMT5() async {
    try {
      final response = await _dio.post('/mt5/start');
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> stopMT5() async {
    try {
      final response = await _dio.post('/mt5/stop');
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> sendRobotCommand(String robotName, String command, [Map<String, dynamic>? parameters]) async {
    try {
      final response = await _dio.post('/mt5/command/$robotName', data: {
        'command': command,
        'parameters': parameters ?? {},
      });
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> openManualTrade({
    required String symbol,
    required String direction,
    required double volume,
    double? stopLoss,
    double? takeProfit,
  }) async {
    try {
      final response = await _dio.post('/mt5/trade/open', data: {
        'symbol': symbol,
        'direction': direction,
        'volume': volume,
        'stop_loss': stopLoss,
        'take_profit': takeProfit,
      });
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> closeManualTrade(String ticket) async {
    try {
      final response = await _dio.post('/mt5/trade/close/$ticket');
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> modifyManualTrade(String ticket, {
    double? stopLoss,
    double? takeProfit,
  }) async {
    try {
      final response = await _dio.post('/mt5/trade/modify/$ticket', data: {
        'stop_loss': stopLoss,
        'take_profit': takeProfit,
      });
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> getMT5Positions() async {
    try {
      final response = await _dio.get('/mt5/positions');
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> getMT5Account() async {
    try {
      final response = await _dio.get('/mt5/account');
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  String _handleError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return 'Connection timeout. Please check your internet connection.';
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        if (statusCode == 401) {
          return 'Unauthorized access. Please check your credentials.';
        } else if (statusCode == 404) {
          return 'Resource not found.';
        } else if (statusCode == 500) {
          return 'Server error. Please try again later.';
        }
        return 'Server error: ${error.response?.statusMessage}';
      case DioExceptionType.cancel:
        return 'Request was cancelled.';
      case DioExceptionType.connectionError:
        return 'No internet connection.';
      default:
        return 'An unexpected error occurred.';
    }
  }
}