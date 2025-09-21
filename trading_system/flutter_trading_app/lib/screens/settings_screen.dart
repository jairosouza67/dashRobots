import 'package:flutter/material.dart';
import '../services/services.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final StorageService _storageService = StorageService();
  
  bool _autoRefresh = true;
  int _refreshInterval = 30;
  String _themeMode = 'system';
  Map<String, bool> _notificationSettings = {};

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    setState(() {
      _autoRefresh = _storageService.getAutoRefresh();
      _refreshInterval = _storageService.getRefreshInterval();
      _themeMode = _storageService.getThemeMode();
    });
    
    _notificationSettings = await _storageService.getNotificationSettings();
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: ListView(
        children: [
          // App Settings
          _buildSection('App Settings'),
          _buildSwitchTile(
            'Auto Refresh',
            'Automatically refresh data',
            _autoRefresh,
            (value) async {
              setState(() => _autoRefresh = value);
              await _storageService.saveAutoRefresh(value);
            },
          ),
          _buildDropdownTile(
            'Refresh Interval',
            'How often to refresh data',
            _refreshInterval.toString() + 's',
            {
              '10': '10 seconds',
              '30': '30 seconds',
              '60': '1 minute',
              '300': '5 minutes',
            },
            (value) async {
              setState(() => _refreshInterval = int.parse(value!));
              await _storageService.saveRefreshInterval(_refreshInterval);
            },
          ),
          _buildDropdownTile(
            'Theme',
            'App appearance',
            _themeMode,
            {
              'light': 'Light',
              'dark': 'Dark',
              'system': 'System',
            },
            (value) async {
              setState(() => _themeMode = value!);
              await _storageService.saveThemeMode(value!);
            },
          ),
          
          // Notification Settings
          _buildSection('Notifications'),
          ..._notificationSettings.entries.map((entry) => _buildSwitchTile(
            _formatNotificationLabel(entry.key),
            _formatNotificationDescription(entry.key),
            entry.value,
            (value) async {
              setState(() {
                _notificationSettings[entry.key] = value;
              });
              await _storageService.saveNotificationSettings(_notificationSettings);
            },
          )),
          
          // Data Management
          _buildSection('Data Management'),
          ListTile(
            leading: const Icon(Icons.delete_outline),
            title: const Text('Clear Cache'),
            subtitle: const Text('Clear all cached data'),
            onTap: () => _showClearCacheDialog(),
          ),
          ListTile(
            leading: const Icon(Icons.delete_forever),
            title: const Text('Reset App'),
            subtitle: const Text('Clear all app data'),
            onTap: () => _showResetAppDialog(),
          ),
          
          // About
          _buildSection('About'),
          const ListTile(
            leading: Icon(Icons.info_outline),
            title: Text('Version'),
            subtitle: Text('1.0.0+1'),
          ),
        ],
      ),
    );
  }

  Widget _buildSection(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 8),
      child: Text(
        title,
        style: Theme.of(context).textTheme.titleMedium?.copyWith(
          color: Theme.of(context).primaryColor,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildSwitchTile(
    String title,
    String subtitle,
    bool value,
    ValueChanged<bool> onChanged,
  ) {
    return SwitchListTile(
      title: Text(title),
      subtitle: Text(subtitle),
      value: value,
      onChanged: onChanged,
    );
  }

  Widget _buildDropdownTile<T>(
    String title,
    String subtitle,
    T value,
    Map<T, String> items,
    ValueChanged<T?> onChanged,
  ) {
    return ListTile(
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: DropdownButton<T>(
        value: value,
        items: items.entries.map((entry) => DropdownMenuItem<T>(
          value: entry.key,
          child: Text(entry.value),
        )).toList(),
        onChanged: onChanged,
      ),
    );
  }

  String _formatNotificationLabel(String key) {
    return key.split('_').map((word) => 
      word[0].toUpperCase() + word.substring(1)
    ).join(' ');
  }

  String _formatNotificationDescription(String key) {
    switch (key) {
      case 'trade_opened':
        return 'Notify when a trade is opened';
      case 'trade_closed':
        return 'Notify when a trade is closed';
      case 'robot_error':
        return 'Notify when a robot encounters an error';
      case 'robot_stopped':
        return 'Notify when a robot stops';
      case 'account_update':
        return 'Notify on account balance changes';
      case 'daily_summary':
        return 'Daily trading summary';
      default:
        return 'Notification setting';
    }
  }

  void _showClearCacheDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear Cache'),
        content: const Text('This will clear all cached data. Continue?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              await _storageService.clearCache();
              if (mounted) {
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Cache cleared')),
                );
              }
            },
            child: const Text('Clear'),
          ),
        ],
      ),
    );
  }

  void _showResetAppDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Reset App'),
        content: const Text('This will clear ALL app data including settings. This action cannot be undone. Continue?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              await _storageService.clearAllData();
              if (mounted) {
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('App data cleared')),
                );
              }
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Reset'),
          ),
        ],
      ),
    );
  }
}