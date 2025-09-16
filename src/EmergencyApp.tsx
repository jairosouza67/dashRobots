import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Importar apenas páginas essenciais
import EmergencyIndex from "./pages/EmergencyIndex";
import NotFound from "./pages/NotFound";

import { ThemeProvider } from "./context/ThemeContext";

function EmergencyApp() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <main>
              <Routes>
                <Route path="/" element={<EmergencyIndex />} />
                <Route path="/respirar" element={<EmergencyIndex />} />
                <Route path="/meditacoes" element={<EmergencyIndex />} />
                <Route path="/estatisticas" element={<EmergencyIndex />} />
                <Route path="/progresso" element={<EmergencyIndex />} />
                <Route path="/lembretes" element={<EmergencyIndex />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default EmergencyApp;