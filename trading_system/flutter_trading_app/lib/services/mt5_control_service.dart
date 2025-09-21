import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

class MT5ControlService {
  static const MethodChannel _platform = MethodChannel('com.trading.mt5/control');

  // MT5 installation paths for different platforms
  static const Map<String, String> _mt5Paths = {
    'windows': r'C:\Program Files\MetaTrader 5\terminal64.exe',
    'linux': '/usr/bin/metatrader5', // Adjust based on actual installation
    'macos': '/Applications/MetaTrader 5.app/Contents/MacOS/MetaTrader 5',
  };

  // Check if MT5 is installed and accessible
  static Future<bool> isMT5Installed() async {
    if (kIsWeb) return false;

    try {
      final path = _getMT5Path();
      if (path == null) return false;

      final file = File(path);
      return await file.exists();
    } catch (e) {
      debugPrint('Error checking MT5 installation: $e');
      return false;
    }
  }

  // Check if MT5 is currently running
  static Future<bool> isMT5Running() async {
    if (kIsWeb) return false;

    try {
      if (Platform.isWindows) {
        final result = await Process.run('tasklist', ['/FI', 'IMAGENAME eq terminal64.exe']);
        return result.stdout.toString().contains('terminal64.exe');
      } else if (Platform.isLinux || Platform.isMacOS) {
        final result = await Process.run('pgrep', ['-f', 'metatrader']);
        return result.exitCode == 0;
      }
      return false;
    } catch (e) {
      debugPrint('Error checking MT5 process: $e');
      return false;
    }
  }

  // Start MT5 terminal
  static Future<bool> startMT5() async {
    if (kIsWeb) return false;

    try {
      final path = _getMT5Path();
      if (path == null) return false;

      if (Platform.isWindows) {
        await Process.start(path, []);
      } else {
        await Process.start('wine', [path]); // For Linux/Mac with Wine
      }
      return true;
    } catch (e) {
      debugPrint('Error starting MT5: $e');
      return false;
    }
  }

  // Stop MT5 terminal
  static Future<bool> stopMT5() async {
    if (kIsWeb) return false;

    try {
      if (Platform.isWindows) {
        // Find and kill MT5 process
        final result = await Process.run('taskkill', ['/F', '/IM', 'terminal64.exe']);
        return result.exitCode == 0;
      } else if (Platform.isLinux || Platform.isMacOS) {
        final result = await Process.run('pkill', ['-f', 'metatrader']);
        return result.exitCode == 0;
      }
      return false;
    } catch (e) {
      debugPrint('Error stopping MT5: $e');
      return false;
    }
  }

  // Send command to MT5 via file (for Expert Advisors)
  static Future<bool> sendCommandToRobot(String robotName, String command, [Map<String, dynamic>? parameters]) async {
    try {
      final commandFile = await _getCommandFile(robotName);
      final commandData = {
        'command': command,
        'timestamp': DateTime.now().millisecondsSinceEpoch,
        'parameters': parameters ?? {},
      };

      await commandFile.writeAsString(commandData.toString());
      return true;
    } catch (e) {
      debugPrint('Error sending command to robot: $e');
      return false;
    }
  }

  // Start specific robot
  static Future<bool> startRobot(String robotName) async {
    return await sendCommandToRobot(robotName, 'START');
  }

  // Stop specific robot
  static Future<bool> stopRobot(String robotName) async {
    return await sendCommandToRobot(robotName, 'STOP');
  }

  // Update robot parameters
  static Future<bool> updateRobotParameters(String robotName, Map<String, dynamic> parameters) async {
    return await sendCommandToRobot(robotName, 'UPDATE_PARAMETERS', parameters);
  }

  // Open manual position
  static Future<bool> openPosition({
    required String symbol,
    required String direction,
    required double volume,
    double? stopLoss,
    double? takeProfit,
  }) async {
    final parameters = {
      'symbol': symbol,
      'direction': direction,
      'volume': volume,
      'stop_loss': stopLoss,
      'take_profit': takeProfit,
    };

    return await sendCommandToRobot('MANUAL_TRADER', 'OPEN_POSITION', parameters);
  }

  // Close position by ticket
  static Future<bool> closePosition(String ticket) async {
    return await sendCommandToRobot('MANUAL_TRADER', 'CLOSE_POSITION', {'ticket': ticket});
  }

  // Modify position
  static Future<bool> modifyPosition(String ticket, {double? stopLoss, double? takeProfit}) async {
    final parameters = {
      'ticket': ticket,
      'stop_loss': stopLoss,
      'take_profit': takeProfit,
    };

    return await sendCommandToRobot('MANUAL_TRADER', 'MODIFY_POSITION', parameters);
  }

  // Get MT5 terminal info
  static Future<Map<String, dynamic>?> getTerminalInfo() async {
    try {
      final infoFile = await _getTerminalInfoFile();
      if (await infoFile.exists()) {
        final content = await infoFile.readAsString();
        return Map<String, dynamic>.from(content as Map);
      }
      return null;
    } catch (e) {
      debugPrint('Error getting terminal info: $e');
      return null;
    }
  }

  // Get available symbols
  static Future<List<String>?> getAvailableSymbols() async {
    try {
      final symbolsFile = await _getSymbolsFile();
      if (await symbolsFile.exists()) {
        final content = await symbolsFile.readAsString();
        return List<String>.from(content as List);
      }
      return null;
    } catch (e) {
      debugPrint('Error getting symbols: $e');
      return null;
    }
  }

  // Private helper methods
  static String? _getMT5Path() {
    if (Platform.isWindows) {
      return _mt5Paths['windows'];
    } else if (Platform.isLinux) {
      return _mt5Paths['linux'];
    } else if (Platform.isMacOS) {
      return _mt5Paths['macos'];
    }
    return null;
  }

  static Future<File> _getCommandFile(String robotName) async {
    final directory = await _getMT5DataDirectory();
    return File('${directory.path}/commands/${robotName}_command.txt');
  }

  static Future<File> _getTerminalInfoFile() async {
    final directory = await _getMT5DataDirectory();
    return File('${directory.path}/terminal_info.json');
  }

  static Future<File> _getSymbolsFile() async {
    final directory = await _getMT5DataDirectory();
    return File('${directory.path}/symbols.json');
  }

  static Future<Directory> _getMT5DataDirectory() async {
    final appDir = await _getAppDirectory();
    final mt5Dir = Directory('${appDir.path}/mt5_data');
    if (!await mt5Dir.exists()) {
      await mt5Dir.create(recursive: true);
    }
    return mt5Dir;
  }

  static Future<Directory> _getAppDirectory() async {
    if (Platform.isWindows) {
      return Directory('${Platform.environment['APPDATA']}\\TradingSystem');
    } else if (Platform.isLinux) {
      return Directory('${Platform.environment['HOME']}/.trading_system');
    } else if (Platform.isMacOS) {
      return Directory('${Platform.environment['HOME']}/Library/Application Support/TradingSystem');
    }
    throw UnsupportedError('Unsupported platform');
  }

  // Platform-specific implementations for advanced features
  static Future<bool> _sendCommandViaPlatformChannel(String command, Map<String, dynamic> params) async {
    try {
      final result = await _platform.invokeMethod(command, params);
      return result == true;
    } on PlatformException catch (e) {
      debugPrint('Platform channel error: $e');
      return false;
    }
  }
}