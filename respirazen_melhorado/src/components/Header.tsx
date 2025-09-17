import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut } from "lucide-react";

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
};

export const Header = () => {
  const isMobile = useIsMobile();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-gradient-primary shadow-[var(--shadow-elegant)]" aria-hidden />
            <span className="text-base font-semibold">RespiraZen</span>
          </Link>
          
          {/* Hide navigation on mobile since we have bottom navigation */}
          {!isMobile && (
            <nav className="flex items-center gap-1">
              <NavLink to="/respirar">Respirar</NavLink>
              <NavLink to="/meditacoes">Meditações</NavLink>
              <NavLink to="/lembretes">Lembretes</NavLink>
              <NavLink to="/estatisticas">Estatísticas</NavLink>
            </nav>
          )}
          
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  {userProfile?.photoURL ? (
                    <img 
                      src={userProfile.photoURL} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <span className="text-gray-700 hidden sm:block font-medium">
                    {userProfile?.displayName || user.email?.split('@')[0] || 'Usuário'}
                  </span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            ) : (
              <div className="w-8 h-8" />
            )}
          </div>
        </div>
      </header>

      {/* Modal de Autenticação */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};
