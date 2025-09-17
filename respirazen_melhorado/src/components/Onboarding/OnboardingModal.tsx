
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, CheckCircle } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
}

export default function OnboardingModal({ isOpen, onClose, onStartTour }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Bem-vindo ao RespiraZen! 🧘‍♀️',
      description: 'Sua jornada de mindfulness e bem-estar começa aqui. Vamos transformar apenas alguns minutos do seu dia em momentos de paz e renovação.',
      image: '🌅',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Respire com Consciência 🌬️',
      description: 'Aprenda técnicas comprovadas de respiração como Box Breathing e 4-7-8. Cada sessão é guiada visualmente para máxima eficácia.',
      image: '🫁',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Acompanhe seu Progresso 📊',
      description: 'Monitore suas sessões, veja suas conquistas e mantenha sequências. Seus dados ficam seguros no seu dispositivo.',
      image: '📈',
      color: 'from-purple-500 to-violet-500'
    },
    {
      title: 'Conecte-se com a Comunidade 🤝',
      description: 'Compartilhe conquistas, encontre inspiração e apoie outros praticantes na jornada do bem-estar.',
      image: '👥',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('rz_onboarding_completed', 'true');
    onStartTour();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative">
            <div className={`h-32 bg-gradient-to-r ${steps[currentStep].color} flex items-center justify-center`}>
              <motion.div
                key={currentStep}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-6xl"
              >
                {steps[currentStep].image}
              </motion.div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {steps[currentStep].title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  {steps[currentStep].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-blue-500 scale-125'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                Anterior
              </Button>

              <div className="flex gap-2">
                {currentStep < steps.length - 1 ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={handleFinish}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Pular
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                    >
                      Próximo
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleFinish}
                    className="bg-green-500 hover:bg-green-600 text-white px-8"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Começar Jornada
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
