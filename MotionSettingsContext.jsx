import React, { createContext, useContext, useState, useEffect } from 'react';

const MotionSettingsContext = createContext();

export function MotionSettingsProvider({ children }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [simulatedLatency, setSimulatedLatency] = useState(1500);
  const [failureRate, setFailureRate] = useState(0.2); // 20% by default
  const [forceOutcome, setForceOutcome] = useState('random'); // 'random' | 'success' | 'error'

  // Auto-detect OS reduced motion preference on load
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  const value = {
    reducedMotion,
    setReducedMotion,
    simulatedLatency,
    setSimulatedLatency,
    failureRate,
    setFailureRate,
    forceOutcome,
    setForceOutcome,
  };

  return (
    <MotionSettingsContext.Provider value={value}>
      {children}
    </MotionSettingsContext.Provider>
  );
}

export function useMotionSettings() {
  const context = useContext(MotionSettingsContext);
  if (!context) {
    throw new Error('useMotionSettings must be used within MotionSettingsProvider');
  }
  return context;
}
