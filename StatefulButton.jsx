import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, AlertCircle, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { useMotionSettings } from '../../context/MotionSettingsContext';

/**
 * StatefulButton Component
 * Core 5-state button (Idle, Hover/Focus, Loading, Success, Error + Disabled)
 * 
 * Motion Design Tokens & Easing Strategy:
 * - Idle -> Hover: 150ms cubic-bezier(0.4, 0, 0.2, 1) micro-lift & aura glow expand
 * - Idle -> Loading: 300ms cubic-bezier(0.16, 1, 0.3, 1) scale-down & spinner crossfade
 * - Loading -> Success: 400ms spring (stiffness: 450, damping: 25) checkmark scale pop
 * - Loading -> Error: 350ms horizontal keyframe shake [-5px, 5px, -3px, 3px, 0px] + error color fill
 * - Error -> Idle: 250ms smooth reset
 */
export function StatefulButton({
  onClick,
  disabled = false,
  label = 'Generate AI Solution',
  successLabel = 'Solution Ready!',
  errorLabel = 'Execution Failed (Retry)',
  className = '',
  icon: Icon = Sparkles,
}) {
  const { reducedMotion, simulatedLatency, forceOutcome, failureRate } = useMotionSettings();
  const [buttonState, setButtonState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const isExecutingRef = useRef(false);

  const handleClick = async (e) => {
    e?.preventDefault();
    // Interruptibility check: Prevent re-triggering while loading
    if (buttonState === 'loading' || disabled || isExecutingRef.current) return;

    isExecutingRef.current = true;
    setButtonState('loading');

    try {
      if (onClick) {
        await onClick();
      } else {
        // Default simulated async call
        await new Promise((resolve) => setTimeout(resolve, simulatedLatency));
        const isError = forceOutcome === 'error' || (forceOutcome === 'random' && Math.random() < failureRate);
        if (isError) throw new Error('Simulated Async Failure');
      }

      setButtonState('success');
      
      // Auto return to idle after success banner
      setTimeout(() => {
        setButtonState('idle');
        isExecutingRef.current = false;
      }, 2500);
    } catch (err) {
      setButtonState('error');
      // Hold error state until manual click retry or 3 seconds
      setTimeout(() => {
        isExecutingRef.current = false;
      }, 500);
    }
  };

  // Easing presets
  const easeOutExpo = [0.16, 1, 0.3, 1];
  const springSnappy = reducedMotion
    ? { duration: 0.2 }
    : { type: 'spring', stiffness: 450, damping: 25 };

  // Shake variant for error state (skipped under reduced motion)
  const shakeAnimation = reducedMotion
    ? {}
    : {
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.45, ease: 'easeInOut' },
      };

  return (
    <div className="relative inline-flex items-center group">
      {/* Outer Glow effect on hover/active (compositor opacity/transform) */}
      <motion.div
        className={`absolute -inset-0.5 rounded-xl blur-md opacity-0 transition-opacity duration-300 pointer-events-none ${
          buttonState === 'error'
            ? 'bg-gradient-to-r from-red-600 to-rose-500 opacity-60'
            : buttonState === 'success'
            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 opacity-60'
            : buttonState === 'loading'
            ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50 animate-pulse'
            : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 group-hover:opacity-75 group-focus-within:opacity-100'
        }`}
      />

      <motion.button
        type="button"
        onClick={handleClick}
        disabled={disabled || buttonState === 'loading'}
        aria-label={
          buttonState === 'loading'
            ? 'Processing AI call'
            : buttonState === 'success'
            ? successLabel
            : buttonState === 'error'
            ? errorLabel
            : label
        }
        aria-live="polite"
        animate={buttonState === 'error' ? shakeAnimation : { scale: buttonState === 'loading' ? 0.98 : 1 }}
        whileHover={
          disabled || reducedMotion || buttonState !== 'idle'
            ? {}
            : { scale: 1.02, y: -1 }
        }
        whileTap={
          disabled || reducedMotion || buttonState !== 'idle'
            ? {}
            : { scale: 0.97, y: 0 }
        }
        transition={{ duration: 0.2, ease: easeOutExpo }}
        className={`relative z-10 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition-colors duration-200 ${
          disabled
            ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/50 shadow-none'
            : buttonState === 'error'
            ? 'bg-red-950/90 text-red-200 border border-red-500/50 hover:bg-red-900/90 shadow-lg shadow-red-950/50'
            : buttonState === 'success'
            ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-500/50 shadow-lg shadow-emerald-950/50'
            : buttonState === 'loading'
            ? 'bg-slate-900/90 text-indigo-200 border border-indigo-500/40 shadow-inner'
            : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30 hover:shadow-indigo-500/40'
        } ${className}`}
      >
        <AnimatePresence mode="wait">
          {buttonState === 'idle' && (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
              transition={{ duration: 0.18, ease: easeOutExpo }}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform duration-300" />
              <span>{label}</span>
            </motion.span>
          )}

          {buttonState === 'loading' && (
            <motion.span
              key="loading"
              initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.8 }}
              transition={{ duration: 0.2, ease: easeOutExpo }}
              className="flex items-center gap-2.5 text-indigo-300 font-medium"
            >
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Processing Tool Call...</span>
            </motion.span>
          )}

          {buttonState === 'success' && (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.8 }}
              transition={springSnappy}
              className="flex items-center gap-2 text-emerald-300 font-semibold"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, ...springSnappy }}
              >
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              </motion.div>
              <span>{successLabel}</span>
            </motion.span>
          )}

          {buttonState === 'error' && (
            <motion.span
              key="error"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-red-300 font-semibold"
            >
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{errorLabel}</span>
              <RefreshCw className="w-3.5 h-3.5 ml-1 text-red-300 opacity-70 group-hover:rotate-180 transition-transform duration-500" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
