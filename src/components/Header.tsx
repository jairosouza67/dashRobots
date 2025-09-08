import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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

  return (
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
            <NavLink to="/estatisticas">Estatísticas</NavLink>
            <NavLink to="/lembretes">Lembretes</NavLink>
          </nav>
        )}
        
        <div className="flex items-center gap-2">
          <Link to="/respirar" className={cn("hidden", !isMobile && "sm:block")}>
            <Button variant="hero" size={isMobile ? "default" : "lg"}>Começar</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
