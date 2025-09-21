// import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'storage_service.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  // final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  final StorageService _storageService = StorageService();

  String? _deviceToken;
  String? get deviceToken => _deviceToken;

  Future<void> initialize() async {
    // Request permission for iOS
  // NotificationSettings settings = await _firebaseMessaging.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      debugPrint('User granted permission');
    } else if (settings.authorizationStatus == AuthorizationStatus.provisional) {
      debugPrint('User granted provisional permission');
    } else {
      debugPrint('User declined or has not accepted permission');
    }

    // Get the token
  // _deviceToken = await _firebaseMessaging.getToken();
    debugPrint('FCM Token: $_deviceToken');

    // Save token to local storage
    if (_deviceToken != null) {
      await _storageService.saveDeviceToken(_deviceToken!);
    }

    // Listen for token refresh
  // _firebaseMessaging.onTokenRefresh.listen((String token) {
      _deviceToken = token;
      _storageService.saveDeviceToken(token);
      debugPrint('FCM Token refreshed: $token');
    });

    // Handle foreground messages
  // FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

    // Handle background messages
  // FirebaseMessaging.onBackgroundMessage(_handleBackgroundMessage);

    // Handle notification taps
  // FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationTap);

    // Check if app was opened from a notification
  // RemoteMessage? initialMessage = await _firebaseMessaging.getInitialMessage();
    if (initialMessage != null) {
      _handleNotificationTap(initialMessage);
    }
  }

  void _handleForegroundMessage(RemoteMessage message) {
    debugPrint('Received foreground message: ${message.messageId}');
    debugPrint('Title: ${message.notification?.title}');
    debugPrint('Body: ${message.notification?.body}');
    debugPrint('Data: ${message.data}');

    // Show local notification or update UI
    _processNotification(message);
  }

  void _handleNotificationTap(RemoteMessage message) {
    debugPrint('Notification tapped: ${message.messageId}');
    debugPrint('Data: ${message.data}');

    // Navigate to specific screen based on notification data
    final String? type = message.data['type'];
    final String? id = message.data['id'];

    switch (type) {
      case 'trade_opened':
      case 'trade_closed':
        // Navigate to trades screen
        break;
      case 'robot_error':
      case 'robot_stopped':
        // Navigate to robots screen
        break;
      case 'account_update':
        // Navigate to account screen
        break;
      default:
        // Navigate to dashboard
        break;
    }
  }

  void _processNotification(RemoteMessage message) {
    final String? type = message.data['type'];
    
    switch (type) {
      case 'trade_opened':
        _handleTradeNotification(message, 'Trade Opened');
        break;
      case 'trade_closed':
        _handleTradeNotification(message, 'Trade Closed');
        break;
      case 'robot_error':
        _handleRobotNotification(message, 'Robot Error');
        break;
      case 'robot_stopped':
        _handleRobotNotification(message, 'Robot Stopped');
        break;
      case 'account_update':
        _handleAccountNotification(message);
        break;
      default:
        debugPrint('Unknown notification type: $type');
    }
  }

  void _handleTradeNotification(RemoteMessage message, String action) {
    final data = message.data;
    debugPrint('$action - Symbol: ${data['symbol']}, Profit: ${data['profit']}');
  }

  void _handleRobotNotification(RemoteMessage message, String action) {
    final data = message.data;
    debugPrint('$action - Robot: ${data['robot_name']}, Message: ${data['message']}');
  }

  void _handleAccountNotification(RemoteMessage message) {
    final data = message.data;
    debugPrint('Account Update - Balance: ${data['balance']}, Equity: ${data['equity']}');
  }

  // Notification settings
  Future<Map<String, bool>> getNotificationSettings() async {
    return await _storageService.getNotificationSettings();
  }

  Future<void> updateNotificationSettings(Map<String, bool> settings) async {
    await _storageService.saveNotificationSettings(settings);
  }

  Future<void> subscribeToTopic(String topic) async {
  // await _firebaseMessaging.subscribeToTopic(topic);
    debugPrint('Subscribed to topic: $topic');
  }

  Future<void> unsubscribeFromTopic(String topic) async {
  // await _firebaseMessaging.unsubscribeFromTopic(topic);
    debugPrint('Unsubscribed from topic: $topic');
  }
}

// Top-level function for background message handling
@pragma('vm:entry-point')
Future<void> _handleBackgroundMessage(RemoteMessage message) async {
  debugPrint('Received background message: ${message.messageId}');
  debugPrint('Title: ${message.notification?.title}');
  debugPrint('Body: ${message.notification?.body}');
  debugPrint('Data: ${message.data}');
}