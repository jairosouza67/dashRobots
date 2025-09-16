import { Link } from "react-router-dom";
import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Imagem de fundo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{
          backgroundImage: 'url(/water-background.jpg)'
        }}
      ></div>
      
      {/* Overlay gradiente para melhor legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 via-cyan-300/10 to-blue-400/20"></div>
      <SEO
        title="RespiraZen — Respiração Guiada e Meditações Curtas"
        description="Respiração guiada com animações e meditações de 1 a 5 minutos. Acalme-se em instantes com sons ambientes e lembretes."
        canonical="https://dee8e0b5-6fae-437f-832b-1a7bfb719b7b.lovableproject.com/"
      />

      {/* Efeito de ondas de água */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-4 border-white/20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-white/15 animate-ping"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/10 animate-pulse delay-1000"></div>
      </div>

  <section className="container mx-auto px-6 pt-[2px] pb-4 md:pt-[4px] md:pb-6 flex flex-col justify-center min-h-screen relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-left max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-3 mt-0">
              Respiração Guiada e<br />Meditação, em 1<br />minuto
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-xl">
              Reduza ansiedade, foque melhor e durma com mais facilidade. Sessões simples, vibração opcional e sons ambientes relaxantes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {user ? (
                // Usuário logado - mostrar botões principais
                <>
                  <Link to="/respirar">
                    <Button 
                      size="lg" 
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-base font-medium rounded-lg transition-all duration-200 min-w-[180px]"
                    >
                      Começar a Respirar
                    </Button>
                  </Link>
                  <Link to="/meditacoes">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-8 py-3 text-base font-medium rounded-lg transition-all duration-200 min-w-[180px] bg-white/80"
                    >
                      Meditações
                    </Button>
                  </Link>
                </>
              ) : (
                // Usuário não logado - mostrar botão de login e preview
                <>
                  <AuthButton onOpenAuth={() => setIsAuthModalOpen(true)} />
                  <Link to="/respirar">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 text-base font-medium rounded-lg transition-all duration-200 min-w-[180px] backdrop-blur-sm"
                    >
                      Experimentar Grátis
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6 text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium">Sessões de 1-10 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium">Lembretes inteligentes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium">Progresso personalizado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Autenticação */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </main>
  );
};

export default Index;
