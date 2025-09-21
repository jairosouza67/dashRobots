import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/providers.dart';
import '../widgets/widgets.dart';

class RobotsScreen extends StatefulWidget {
  const RobotsScreen({super.key});

  @override
  State<RobotsScreen> createState() => _RobotsScreenState();
}

class _RobotsScreenState extends State<RobotsScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Robots'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => context.read<RobotsProvider>().refreshRobots(),
          ),
        ],
      ),
      body: Consumer<RobotsProvider>(
        builder: (context, robotsProvider, child) {
          if (robotsProvider.isLoading && robotsProvider.robots.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }

          if (robotsProvider.robots.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.smart_toy, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('No robots found', style: TextStyle(fontSize: 18)),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => robotsProvider.refreshRobots(),
            child: ListView.builder(
              itemCount: robotsProvider.robots.length,
              itemBuilder: (context, index) {
                final robot = robotsProvider.robots[index];
                return RobotStatusCard(
                  robot: robot,
                  onTap: () {
                    // Navigate to robot details
                  },
                  onStart: robot.isInactive ? () async {
                    await robotsProvider.startRobot(robot.id);
                  } : null,
                  onStop: robot.isActive ? () async {
                    await robotsProvider.stopRobot(robot.id);
                  } : null,
                  onSettings: () {
                    // Navigate to robot settings
                  },
                );
              },
            ),
          );
        },
      ),
    );
  }
}