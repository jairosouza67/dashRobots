
'use client';

import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from 'framer-motion';
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { Play, Users, TrendingUp } from "lucide-react";
import BenefitsSection from "@/components/HomePage/BenefitsSection";
import HowItWorksSection from "@/components/HomePage/HowItWorksSection";
import { useOnboarding } from "@/hooks/useOnboarding";
import OnboardingModal from "@/components/Onboarding/OnboardingModal";
import OnboardingTour from "@/components/Onboarding/OnboardingTour";

const ImprovedIndex = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading } = useAuth();
  const { mounted, showModal, runTour, startTour, finishTour, closeModal } = useOnboarding();

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen relative overflow-hidden">
        {/* Hero Section */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{
            backgroundImage: 'url(/water-background.jpg)'
          }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 via-cyan-300/10 to-blue-400/20"></div>
        
        <SEO
          title="RespiraZen — Respiração Guiada e Meditações Curtas"
          description="Respiração guiada com animações e meditações de 1 a 5 minutos. Acalme-se em instantes com sons ambientes e lembretes."
          canonical="https://respirazen.app/"
        />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-4 border-white/20"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-white/15"
            animate={{
              scale: [0.9, 1.2, 0.9],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/10"
            animate={{
              scale: [1.1, 0.8, 1.1],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <section className="container mx-auto px-6 pt-[2px] pb-4 md:pt-[4px] md:pb-6 flex flex-col justify-center min-h-screen relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-left max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-3 mt-0"
              >
                Respiração Guiada e<br />Meditação, em 1<br />minuto
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-xl"
              >
                Reduza ansiedade, foque melhor e durma com mais facilidade. Sessões simples, vibração opcional e sons ambientes relaxantes.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center gap-4 mb-12"
              >
                {user ? (
                  <>
                    <Link to="/respirar" data-tour="breathing-button">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3 text-base font-medium rounded-lg transition-all duration-200 min-w-[180px] bg-white/80 dark:bg-gray-900/80"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Começar a Respirar
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/respirar">
                      <Button
                        variant="default"
                        size="lg"
                        className="px-10 py-4 text-xl font-bold transition-all duration-300 shadow-lg hover:scale-105 bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 dark:text-white rounded-2xl border-4 border-green-400/30 w-full max-w-xs mx-auto"
                      >
                        Experimentar Grátis
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="flex flex-wrap gap-6 text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium">Sessões de 1-10 minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                  <span className="text-sm font-medium">Lembretes inteligentes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></span>
                  <span className="text-sm font-medium">Progresso personalizado</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Comece Sua Jornada Hoje
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Milhares de pessoas já transformaram suas vidas com apenas 5 minutos por dia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/respirar">
                <Button
                  variant="secondary"
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-background text-primary hover:bg-accent hover:text-accent-foreground border border-primary/20"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Iniciar Exercício
                </Button>
              </Link>
              <Link to="/comunidade" data-tour="community-link">
                <Button
                  variant="secondary"
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-background text-primary hover:bg-accent hover:text-accent-foreground border border-primary/20"
                >
                  <Users className="w-6 h-6 mr-2" />
                  Ver Comunidade
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modals and Tours */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <OnboardingModal
        isOpen={showModal}
        onClose={closeModal}
        onStartTour={startTour}
      />

      <OnboardingTour
        run={runTour}
        onFinish={finishTour}
      />
    </>
  );
};

export default ImprovedIndex;
