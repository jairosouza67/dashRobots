import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { BottomNavigation } from "./components/BottomNavigation";
import { useIsMobile } from "./hooks/use-mobile";

// Importar todas as páginas
import Index from "./pages/Index";
import Breathing from "./pages/Breathing";
import Meditations from "./pages/Meditations";
import Stats from "./pages/Stats";
import Progress from "./pages/Progress";
import Reminders from "./pages/Reminders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Header />
            <main className={`${isMobile ? 'pb-20' : 'pb-8'}`}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/respirar" element={<Breathing />} />
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
  );
}

export default App;