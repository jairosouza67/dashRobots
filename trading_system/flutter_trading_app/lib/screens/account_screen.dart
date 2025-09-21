import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/providers.dart';
import '../widgets/widgets.dart';

class AccountScreen extends StatelessWidget {
  const AccountScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Account'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => context.read<AccountProvider>().refreshAccount(),
          ),
        ],
      ),
      body: Consumer<AccountProvider>(
        builder: (context, accountProvider, child) {
          if (accountProvider.isLoading && !accountProvider.hasAccount) {
            return const Center(child: CircularProgressIndicator());
          }

          final account = accountProvider.account;
          if (account == null) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.account_balance, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('No account data', style: TextStyle(fontSize: 18)),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => accountProvider.refreshAccount(),
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Account Information Card
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Account Information',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          _buildInfoRow('Account Number', account.accountNumber.toString()),
                          _buildInfoRow('Name', account.name),
                          _buildInfoRow('Server', account.server),
                          _buildInfoRow('Company', account.company),
                          _buildInfoRow('Currency', account.currency),
                          _buildInfoRow('Leverage', '1:${account.leverage}'),
                          _buildInfoRow('Status', account.status),
                        ],
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Balance Information
                  StatsGrid(
                    cards: [
                      StatsCard.balance(value: account.balance),
                      StatsCard.equity(value: account.equity),
                      StatsCard.profit(value: account.profit),
                      StatsCard(
                        title: 'Margin Level',
                        value: '${account.marginLevel.toStringAsFixed(1)}%',
                        icon: Icons.speed,
                        iconColor: account.marginLevel > 100 ? Colors.green : Colors.red,
                        valueColor: account.marginLevel > 100 ? Colors.green : Colors.red,
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Trading Permissions
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Trading Permissions',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          _buildPermissionRow('Trade Allowed', account.tradeAllowed),
                          _buildPermissionRow('Expert Advisors', account.tradeExpert),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(value),
          ),
        ],
      ),
    );
  }

  Widget _buildPermissionRow(String label, bool allowed) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          Icon(
            allowed ? Icons.check_circle : Icons.cancel,
            color: allowed ? Colors.green : Colors.red,
          ),
        ],
      ),
    );
  }
}