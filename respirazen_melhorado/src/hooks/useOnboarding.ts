
import { useState, useEffect } from 'react';

export function useOnboarding() {
  const [showModal, setShowModal] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user has completed onboarding
    const hasCompleted = localStorage.getItem('rz_onboarding_completed');
    
    if (!hasCompleted) {
      // Delay to ensure components are mounted
      setTimeout(() => {
        setShowModal(true);
      }, 1000);
    }
  }, []);

  const startTour = () => {
    setRunTour(true);
  };

  const finishTour = () => {
    setRunTour(false);
    localStorage.setItem('rz_tour_completed', 'true');
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return {
    mounted,
    showModal,
    runTour,
    startTour,
    finishTour,
    closeModal
  };
}
