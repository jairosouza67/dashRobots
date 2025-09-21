import 'package:flutter/material.dart';import 'package:flutter/material.dart';

import 'package:google_fonts/google_fonts.dart';import 'package:google_fonts/google_fonts.dart';



class AppTheme {class AppTheme {

  static const Color primaryColor = Color(0xFF1976D2);  static const Color primaryColor = Color(0xFF1976D2);

  static const Color secondaryColor = Color(0xFF03DAC6);  static const Color secondaryColor = Color(0xFF03DAC6);

  static const Color errorColor = Color(0xFFB00020);  static const Color errorColor = Color(0xFFB00020);

  static const Color successColor = Color(0xFF4CAF50);  static const Color successColor = Color(0xFF4CAF50);

  static const Color warningColor = Color(0xFFFF9800);  static const Color warningColor = Color(0xFFFF9800);

    

  static ThemeData get lightTheme {  static ThemeData get lightTheme {

    return ThemeData(    return ThemeData(

      useMaterial3: true,      useMaterial3: true,

      colorScheme: ColorScheme.fromSeed(      colorScheme: ColorScheme.fromSeed(

        seedColor: primaryColor,        seedColor: primaryColor,

        brightness: Brightness.light,        brightness: Brightness.light,

      ),      ),

      textTheme: GoogleFonts.robotoTextTheme(),      textTheme: GoogleFonts.robotoTextTheme(),

      appBarTheme: const AppBarTheme(      appBarTheme: const AppBarTheme(

        centerTitle: true,        centerTitle: true,

        elevation: 0,        elevation: 0,

        scrolledUnderElevation: 4,        scrolledUnderElevation: 4,

      ),      ),

      cardTheme: CardTheme(      cardTheme: CardTheme(

        elevation: 2,        elevation: 2,

        shape: RoundedRectangleBorder(        shape: RoundedRectangleBorder(

          borderRadius: BorderRadius.circular(12),          borderRadius: BorderRadius.circular(12),

        ),        ),

      ),      ),

      elevatedButtonTheme: ElevatedButtonThemeData(      elevatedButtonTheme: ElevatedButtonThemeData(

        style: ElevatedButton.styleFrom(        style: ElevatedButton.styleFrom(

          elevation: 2,          elevation: 2,

          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),

          shape: RoundedRectangleBorder(          shape: RoundedRectangleBorder(

            borderRadius: BorderRadius.circular(8),            borderRadius: BorderRadius.circular(8),

          ),          ),

        ),        ),

      ),      ),

      outlinedButtonTheme: OutlinedButtonThemeData(      outlinedButtonTheme: OutlinedButtonThemeData(

        style: OutlinedButton.styleFrom(        style: OutlinedButton.styleFrom(

          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),

          shape: RoundedRectangleBorder(          shape: RoundedRectangleBorder(

            borderRadius: BorderRadius.circular(8),            borderRadius: BorderRadius.circular(8),

          ),          ),

        ),        ),

      ),      ),

      inputDecorationTheme: InputDecorationTheme(      inputDecorationTheme: InputDecorationTheme(

        border: OutlineInputBorder(        border: OutlineInputBorder(\n          borderRadius: BorderRadius.circular(8),\n        ),\n        enabledBorder: OutlineInputBorder(\n          borderRadius: BorderRadius.circular(8),\n          borderSide: BorderSide(color: Colors.grey.shade300),\n        ),\n        focusedBorder: OutlineInputBorder(\n          borderRadius: BorderRadius.circular(8),\n          borderSide: const BorderSide(color: primaryColor, width: 2),\n        ),\n        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),\n      ),\n      bottomNavigationBarTheme: const BottomNavigationBarThemeData(\n        type: BottomNavigationBarType.fixed,\n        elevation: 8,\n        selectedItemColor: primaryColor,\n      ),\n    );\n  }\n\n  static ThemeData get darkTheme {\n    return ThemeData(\n      useMaterial3: true,\n      colorScheme: ColorScheme.fromSeed(\n        seedColor: primaryColor,\n        brightness: Brightness.dark,\n      ),\n      textTheme: GoogleFonts.robotoTextTheme(ThemeData.dark().textTheme),\n      appBarTheme: const AppBarTheme(\n        centerTitle: true,\n        elevation: 0,\n        scrolledUnderElevation: 4,\n      ),\n      cardTheme: CardTheme(\n        elevation: 2,\n        shape: RoundedRectangleBorder(\n          borderRadius: BorderRadius.circular(12),\n        ),\n      ),\n      elevatedButtonTheme: ElevatedButtonThemeData(\n        style: ElevatedButton.styleFrom(\n          elevation: 2,\n          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),\n          shape: RoundedRectangleBorder(\n            borderRadius: BorderRadius.circular(8),\n          ),\n        ),\n      ),\n      outlinedButtonTheme: OutlinedButtonThemeData(\n        style: OutlinedButton.styleFrom(\n          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),\n          shape: RoundedRectangleBorder(\n            borderRadius: BorderRadius.circular(8),\n          ),\n        ),\n      ),\n      inputDecorationTheme: InputDecorationTheme(\n        border: OutlineInputBorder(\n          borderRadius: BorderRadius.circular(8),\n        ),\n        enabledBorder: OutlineInputBorder(\n          borderRadius: BorderRadius.circular(8),\n          borderSide: BorderSide(color: Colors.grey.shade600),\n        ),\n        focusedBorder: OutlineInputBorder(\n          borderRadius: BorderRadius.circular(8),\n          borderSide: const BorderSide(color: primaryColor, width: 2),\n        ),\n        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),\n      ),\n      bottomNavigationBarTheme: const BottomNavigationBarThemeData(\n        type: BottomNavigationBarType.fixed,\n        elevation: 8,\n        selectedItemColor: primaryColor,\n      ),\n    );\n  }\n\n  // Custom colors for trading-specific elements\n  static const Color profitColor = Color(0xFF4CAF50);\n  static const Color lossColor = Color(0xFFE53935);\n  static const Color buyColor = Color(0xFF2196F3);\n  static const Color sellColor = Color(0xFFFF5722);\n  static const Color activeRobotColor = Color(0xFF4CAF50);\n  static const Color inactiveRobotColor = Color(0xFFFF9800);\n  static const Color errorRobotColor = Color(0xFFE53935);\n\n  // Trading status colors\n  static Color getTradeStatusColor(String status) {\n    switch (status.toUpperCase()) {\n      case 'OPEN':\n        return const Color(0xFF2196F3);\n      case 'CLOSED':\n        return const Color(0xFF4CAF50);\n      case 'PENDING':\n        return const Color(0xFFFF9800);\n      default:\n        return Colors.grey;\n    }\n  }\n\n  static Color getRobotStatusColor(String status) {\n    switch (status.toUpperCase()) {\n      case 'ACTIVE':\n        return activeRobotColor;\n      case 'INACTIVE':\n        return inactiveRobotColor;\n      case 'ERROR':\n        return errorRobotColor;\n      default:\n        return Colors.grey;\n    }\n  }\n\n  static Color getProfitLossColor(double value) {\n    return value >= 0 ? profitColor : lossColor;\n  }\n}
          borderRadius: BorderRadius.circular(8),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: primaryColor, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        type: BottomNavigationBarType.fixed,
        elevation: 8,
        selectedItemColor: primaryColor,
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryColor,
        brightness: Brightness.dark,
      ),
      textTheme: GoogleFonts.robotoTextTheme(ThemeData.dark().textTheme),
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
        scrolledUnderElevation: 4,
      ),
      cardTheme: CardTheme(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          elevation: 2,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey.shade600),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: primaryColor, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        type: BottomNavigationBarType.fixed,
        elevation: 8,
        selectedItemColor: primaryColor,
      ),
    );
  }

  // Custom colors for trading-specific elements
  static const Color profitColor = Color(0xFF4CAF50);
  static const Color lossColor = Color(0xFFE53935);
  static const Color buyColor = Color(0xFF2196F3);
  static const Color sellColor = Color(0xFFFF5722);
  static const Color activeRobotColor = Color(0xFF4CAF50);
  static const Color inactiveRobotColor = Color(0xFFFF9800);
  static const Color errorRobotColor = Color(0xFFE53935);

  // Trading status colors
  static Color getTradeStatusColor(String status) {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return const Color(0xFF2196F3);
      case 'CLOSED':
        return const Color(0xFF4CAF50);
      case 'PENDING':
        return const Color(0xFFFF9800);
      default:
        return Colors.grey;
    }
  }

  static Color getRobotStatusColor(String status) {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return activeRobotColor;
      case 'INACTIVE':
        return inactiveRobotColor;
      case 'ERROR':
        return errorRobotColor;
      default:
        return Colors.grey;
    }
  }

  static Color getProfitLossColor(double value) {
    return value >= 0 ? profitColor : lossColor;
  }
}