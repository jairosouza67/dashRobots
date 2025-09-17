
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ImprovedHeader } from "./components/Layout/ImprovedHeader";
import { BottomNavigation } from "./components/BottomNavigation";
import { useIsMobile } from "./hooks/use-mobile";

// Import all pages
import ImprovedIndex from "./pages/ImprovedIndex";
import ImprovedBreathing from "./pages/ImprovedBreathing";
import DashboardPage from "./pages/DashboardPage";
import CommunityPage from "./pages/CommunityPage";
import Meditations from "./pages/Meditations";
import Stats from "./pages/Stats";
import Progress from "./pages/Progress";
import Reminders from "./pages/Reminders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import { ThemeProvider } from "./context/ImprovedThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeSelector } from "./components/Settings/ThemeSelector";

function App() {
  const isMobile = useIsMobile();

  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <ImprovedHeader />
                <main className={`${isMobile ? 'pb-20' : 'pb-8'}`}>
                  <Routes>
                    <Route path="/" element={<ImprovedIndex />} />
                    <Route path="/respirar" element={<ImprovedBreathing />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/comunidade" element={<CommunityPage />} />
                    <Route path="/meditacoes" element={<Meditations />} />
                    <Route path="/estatisticas" element={<Stats />} />
                    <Route path="/progresso" element={<Progress />} />
                    <Route path="/lembretes" element={<Reminders />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                {isMobile && <BottomNavigation />}
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
