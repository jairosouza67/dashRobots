import React from 'react';

const EmergencyIndex = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            RespiraZen
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Respiração guiada e meditação em 1 minuto. Reduza ansiedade, foque melhor e durma com facilidade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a 
              href="/respirar" 
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-medium rounded-lg min-w-[200px] inline-block transition-colors"
            >
              Começar a Respirar
            </a>
            
            <a 
              href="/meditacoes" 
              className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-medium rounded-lg min-w-[200px] inline-block transition-colors"
            >
              Meditações
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">🫁 Respiração</h3>
              <p className="text-gray-600 text-sm">Técnicas guiadas: 4-4-4-4, 4-7-8, Coerência cardíaca</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">🧘 Meditação</h3>
              <p className="text-gray-600 text-sm">Sessões de 1-10 minutos com sons ambientes</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Progresso</h3>
              <p className="text-gray-600 text-sm">Acompanhe seu desenvolvimento e estatísticas</p>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Versão simplificada - Site em manutenção temporária</p>
            <p className="mt-2">
              <a 
                href="mailto:contato@respirazen.com" 
                className="text-green-600 hover:underline"
              >
                Entre em contato para mais informações
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmergencyIndex;