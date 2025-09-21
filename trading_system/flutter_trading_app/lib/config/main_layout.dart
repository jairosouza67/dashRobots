import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class MainLayout extends StatefulWidget {
  final Widget child;
  
  const MainLayout({
    super.key,
    required this.child,
  });

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _selectedIndex = 0;

  final List<NavigationItem> _navigationItems = [
    NavigationItem(
      icon: Icons.dashboard,
      label: 'Dashboard',
      route: '/dashboard',
    ),
    NavigationItem(
      icon: FontAwesomeIcons.chartLine,
      label: 'Trades',
      route: '/trades',
    ),
    NavigationItem(
      icon: FontAwesomeIcons.robot,
      label: 'Robots',
      route: '/robots',
    ),
    NavigationItem(
      icon: Icons.account_balance,
      label: 'Account',
      route: '/account',
    ),
    NavigationItem(
      icon: FontAwesomeIcons.handPointer,
      label: 'Manual',
      route: '/manual-trading',
    ),
    NavigationItem(
      icon: Icons.settings,
      label: 'Settings',
      route: '/settings',
    ),
  ];

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _updateSelectedIndex();
  }

  void _updateSelectedIndex() {
    final location = GoRouterState.of(context).uri.path;
    final index = _navigationItems.indexWhere((item) => item.route == location);
    if (index != -1 && index != _selectedIndex) {
      setState(() => _selectedIndex = index);
    }
  }

  void _onItemTapped(int index) {
    if (index != _selectedIndex) {
      setState(() => _selectedIndex = index);
      context.go(_navigationItems[index].route);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        items: _navigationItems.map((item) {
          return BottomNavigationBarItem(
            icon: item.icon is IconData 
                ? Icon(item.icon)
                : FaIcon(item.icon as IconData),
            label: item.label,
          );
        }).toList(),
      ),
    );
  }
}

class NavigationItem {
  final dynamic icon; // Can be IconData or FaIcon
  final String label;
  final String route;

  NavigationItem({
    required this.icon,
    required this.label,
    required this.route,
  });
}