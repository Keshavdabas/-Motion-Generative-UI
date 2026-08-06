import React from 'react';
import { Sliders, Shield, Zap, Eye, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { useMotionSettings } from '../../context/MotionSettingsContext';

export function StateControls() {
  const {
    reducedMotion,
    setReducedMotion,
    simulatedLatency,
    setSimulatedLatency,
    failureRate,
    setFailureRate,
    forceOutcome,
    setForceOutcome,
  } = useMotionSettings();

  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md space-y-4 text-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-sm text-white">Motion & Tool Simulation Controls</span>
        </div>
        <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
          LIVE INTERACTIVE SANDBOX
        </span>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        {/* Outcome Selector */}
        <div className="space-y-1.5">
          <label className="text-slate-400 font-semibold flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            Execution Outcome:
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setForceOutcome('random')}
              className={`py-1.5 px-2 rounded-lg font-medium transition-colors ${
                forceOutcome === 'random' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              20% Fail
            </button>
            <button
              type="button"
              onClick={() => setForceOutcome('success')}
              className={`py-1.5 px-2 rounded-lg font-medium transition-colors ${
                forceOutcome === 'success' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Success
            </button>
            <button
              type="button"
              onClick={() => setForceOutcome('error')}
              className={`py-1.5 px-2 rounded-lg font-medium transition-colors ${
                forceOutcome === 'error' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Error
            </button>
          </div>
        </div>

        {/* Latency Slider */}
        <div className="space-y-1.5">
          <label className="text-slate-400 font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Latency:
            </span>
            <span className="font-mono text-amber-300">{simulatedLatency}ms</span>
          </label>
          <input
            type="range"
            min="300"
            max="3500"
            step="100"
            value={simulatedLatency}
            onChange={(e) => setSimulatedLatency(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* Reduced Motion Toggle */}
        <div className="space-y-1.5">
          <label className="text-slate-400 font-semibold flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            Motion Mode:
          </label>
          <button
            type="button"
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`w-full py-2 px-3 rounded-xl border font-semibold flex items-center justify-between transition-colors cursor-pointer ${
              reducedMotion
                ? 'bg-purple-950/80 border-purple-600 text-purple-200'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span>{reducedMotion ? 'Reduced Motion (Active)' : 'Full Motion System'}</span>
            <span className={`w-2 h-2 rounded-full ${reducedMotion ? 'bg-purple-400 animate-pulse' : 'bg-emerald-400'}`} />
          </button>
        </div>

        {/* Failure Rate Adjuster */}
        <div className="space-y-1.5">
          <label className="text-slate-400 font-semibold flex items-center justify-between">
            <span>Random Error Rate:</span>
            <span className="font-mono text-rose-300">{Math.round(failureRate * 100)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={failureRate}
            disabled={forceOutcome !== 'random'}
            onChange={(e) => setFailureRate(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 disabled:opacity-40"
          />
        </div>
      </div>
    </div>
  );
}
