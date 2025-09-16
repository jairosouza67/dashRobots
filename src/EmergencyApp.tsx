import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Importar páginas
import Breathing from "./pages/Breathing";
import Meditations from "./pages/Meditations";
import Stats from "./pages/Stats";
import Progress from "./pages/Progress";
import Reminders from "./pages/Reminders";
import NotFound from "./pages/NotFound";
import EmergencyIndex from "./pages/EmergencyIndex";

import { ThemeProvider } from "./context/ThemeContext";
import { useIsMobile } from "./hooks/use-mobile";

const queryClient = new QueryClient();

function EmergencyApp() {
  const isMobile = useIsMobile();

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <main className={`${isMobile ? 'pb-20' : 'pb-8'}`}>
                <Routes>
                  <Route path="/" element={<EmergencyIndex />} />
                  <Route path="/respirar" element={<Breathing />} />
                  <Route path="/meditacoes" element={<Meditations />} />
                  <Route path="/estatisticas" element={<Stats />} />
                  <Route path="/progresso" element={<Progress />} />
                  <Route path="/lembretes" element={<Reminders />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default EmergencyApp;