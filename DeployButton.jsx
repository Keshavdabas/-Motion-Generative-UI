import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, CheckCircle2, AlertOctagon, Loader2 } from 'lucide-react';
import { useMotionSettings } from '../../context/MotionSettingsContext';

/**
 * DeployButton Component
 * Secondary action button sharing the motion design tokens & state machine
 */
export function DeployButton({
  onDeploy,
  label = 'Deploy Cloud Agent',
  disabled = false,
}) {
  const { reducedMotion, simulatedLatency, forceOutcome, failureRate } = useMotionSettings();
  const [state, setState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  const handleDeploy = async () => {
    if (state === 'loading' || disabled) return;

    setState('loading');
    try {
      if (onDeploy) {
        await onDeploy();
      } else {
        await new Promise((resolve) => setTimeout(resolve, simulatedLatency));
        const isError = forceOutcome === 'error' || (forceOutcome === 'random' && Math.random() < failureRate);
        if (isError) throw new Error('Deployment rejected');
      }

      setState('success');
      setTimeout(() => setState('idle'), 2500);
    } catch (err) {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  };

  const easeOutExpo = [0.16, 1, 0.3, 1];
  const shakeVariant = reducedMotion
    ? {}
    : {
        x: [0, -6, 6, -4, 4, 0],
        transition: { duration: 0.35 },
      };

  return (
    <motion.button
      type="button"
      onClick={handleDeploy}
      disabled={disabled || state === 'loading'}
      animate={state === 'error' ? shakeVariant : {}}
      whileHover={disabled || reducedMotion || state !== 'idle' ? {} : { scale: 1.03 }}
      whileTap={disabled || reducedMotion || state !== 'idle' ? {} : { scale: 0.96 }}
      transition={{ duration: 0.2, ease: easeOutExpo }}
      className={`relative inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-medium text-sm border shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition-colors duration-200 cursor-pointer ${
        disabled
          ? 'bg-slate-900/40 text-slate-600 border-slate-800 cursor-not-allowed'
          : state === 'error'
          ? 'bg-rose-950/80 text-rose-300 border-rose-600/60 hover:bg-rose-900/80'
          : state === 'success'
          ? 'bg-teal-950/80 text-teal-300 border-teal-500/60 shadow-teal-950/40'
          : state === 'loading'
          ? 'bg-slate-900 text-cyan-300 border-cyan-500/40'
          : 'bg-slate-800/80 text-cyan-200 border-slate-700/80 hover:bg-slate-700/80 hover:border-cyan-500/40 hover:text-white'
      }`}
    >
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
            className="flex items-center gap-2"
          >
            <Rocket className="w-4 h-4 text-cyan-400" />
            <span>{label}</span>
          </motion.span>
        )}

        {state === 'loading' && (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-cyan-300"
          >
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Deploying Cluster...</span>
          </motion.span>
        )}

        {state === 'success' && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-teal-300"
          >
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Live on Edge v2.4</span>
          </motion.span>
        )}

        {state === 'error' && (
          <motion.span
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-rose-300"
          >
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>Deploy Failed (Retry)</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
