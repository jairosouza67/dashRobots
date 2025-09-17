
'use client';

import Joyride, { STATUS, CallBackProps, Step } from 'react-joyride';
import { useState, useEffect } from 'react';

interface OnboardingTourProps {
  run: boolean;
  onFinish: () => void;
}

export default function OnboardingTour({ run, onFinish }: OnboardingTourProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps: Step[] = [
    {
      target: 'body',
      content: 'Bem-vindo ao RespiraZen! Vou te mostrar os principais recursos do aplicativo.',
      placement: 'center'
    },
    {
      target: '[data-tour="breathing-button"]',
      content: 'Aqui você inicia suas sessões de respiração guiada. Clique para começar a respirar com consciência!',
      placement: 'bottom'
    },
    {
      target: '[data-tour="dashboard-link"]',
      content: 'No Dashboard você acompanha seu progresso, vê estatísticas e conquistas.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="community-link"]',
      content: 'Na Comunidade você se conecta com outros praticantes e compartilha experiências.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="theme-toggle"]',
      content: 'Altere entre os temas claro e escuro conforme sua preferência.',
      placement: 'bottom-start'
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setStepIndex(0);
      onFinish();
    } else if (type === 'step:after') {
      setStepIndex(index + 1);
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      stepIndex={stepIndex}
      steps={steps}
      styles={{
        options: {
          arrowColor: '#ffffff',
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.7)',
          primaryColor: '#3B82F6',
          textColor: '#374151',
          width: 320,
          zIndex: 1000,
        },
        tooltip: {
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
        tooltipContainer: {
          textAlign: 'left' as const,
        },
        tooltipTitle: {
          color: '#1F2937',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
        },
        tooltipContent: {
          fontSize: '1rem',
          lineHeight: '1.5',
          color: '#4B5563',
        },
        buttonNext: {
          backgroundColor: '#3B82F6',
          borderRadius: 8,
          fontSize: '0.875rem',
          fontWeight: '600',
          padding: '8px 16px',
        },
        buttonBack: {
          color: '#6B7280',
          fontSize: '0.875rem',
          fontWeight: '600',
        },
        buttonSkip: {
          color: '#6B7280',
          fontSize: '0.875rem',
          fontWeight: '600',
        },
      }}
      locale={{
        back: 'Anterior',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Próximo',
        skip: 'Pular',
      }}
    />
  );
}
