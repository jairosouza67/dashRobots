
'use client';

import { motion } from 'framer-motion';
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ImprovedThemeContext";
import { AuthButton } from "@/components/auth/AuthButton";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { Moon, Sun, Menu, X } from "lucide-react";

export function ImprovedHeader() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Início', path: '/' },
    { name: 'Respirar', path: '/respirar' },
    { name: 'Meditações', path: '/meditacoes' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Comunidade', path: '/comunidade' },
  ];

  return (
    <>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl">🧘‍♀️</div>
              <span className="text-xl font-bold text-primary">RespiraZen</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === item.path
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-9 h-9 p-0 hover:bg-accent/80 text-foreground hover:text-accent-foreground"
                data-tour="theme-toggle"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span className="sr-only">Alternar tema</span>
              </Button>

              {/* Auth */}
              <div className="hidden md:block">
                {user ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Olá, {user.displayName || user.email}
                    </span>
                  </div>
                ) : (
                  <AuthButton onOpenAuth={() => setIsAuthModalOpen(true)} />
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden w-9 h-9 p-0 hover:bg-accent/80 text-foreground hover:text-accent-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
                <span className="sr-only">Alternar menu</span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden border-t bg-background/95 backdrop-blur"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Auth */}
                <div className="px-3 py-2">
                  {user ? (
                    <span className="text-sm text-muted-foreground">
                      Olá, {user.displayName || user.email}
                    </span>
                  ) : (
                    <AuthButton onOpenAuth={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }} />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
