import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle2, AlertOctagon, Code, RefreshCw, Cpu, Layers, Sparkles } from 'lucide-react';
import { executeToolCall } from '../../tools/mockToolExecution';
import { useMotionSettings } from '../../context/MotionSettingsContext';
import { ToolScoreCard } from './ToolScoreCard';
import { ToolChartCard } from './ToolChartCard';
import { ToolMetaCard } from './ToolMetaCard';
import { ConfirmationToolCard } from './ConfirmationToolCard';

/**
 * ToolLifecycleCard
 * Complete 4-State Machine Tool Part Renderer:
 * 1. input-streaming: character-by-character argument stream typing with pulsing shimmer
 * 2. input-available: validated Zod schema badge & payload preview
 * 3. output-available: crossfade/morph to target UI component
 * 4. output-error: designed failure error state with diagnostic & retry
 */
export function ToolLifecycleCard({
  toolName,
  inputArgs,
  initialState = 'input-streaming',
  onComplete,
}) {
  const { reducedMotion, simulatedLatency, forceOutcome, failureRate } = useMotionSettings();

  const [lifecycleState, setLifecycleState] = useState(initialState); // 'input-streaming' | 'input-available' | 'output-available' | 'output-error'
  const [streamedText, setStreamedText] = useState('');
  const [toolOutput, setToolOutput] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [executionCount, setExecutionCount] = useState(0);

  const fullArgsJson = JSON.stringify(inputArgs, null, 2);

  // Simulated character-by-character input streaming phase
  useEffect(() => {
    if (lifecycleState !== 'input-streaming') return;

    let index = 0;
    const interval = setInterval(() => {
      index += 3;
      if (index >= fullArgsJson.length) {
        setStreamedText(fullArgsJson);
        clearInterval(interval);
        // Move to input-available state
        setTimeout(() => setLifecycleState('input-available'), 300);
      } else {
        setStreamedText(fullArgsJson.slice(0, index));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [fullArgsJson, lifecycleState, executionCount]);

  // Execute tool call when entering input-available state
  useEffect(() => {
    if (lifecycleState !== 'input-available') return;

    let isMounted = true;

    async function runTool() {
      try {
        const forceError = forceOutcome === 'error';
        const result = await executeToolCall(toolName, inputArgs, {
          forceError,
          failureRate: forceOutcome === 'random' ? failureRate : 0,
          simulatedDelay: simulatedLatency,
        });

        if (isMounted) {
          setToolOutput(result);
          setLifecycleState('output-available');
          onComplete?.(result);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.message || 'Tool execution encountered an unexpected error.');
          setLifecycleState('output-error');
        }
      }
    }

    runTool();

    return () => {
      isMounted = false;
    };
  }, [lifecycleState, toolName, inputArgs, simulatedLatency, forceOutcome, failureRate, executionCount]);

  const handleRetry = () => {
    setStreamedText('');
    setErrorMessage('');
    setToolOutput(null);
    setExecutionCount((prev) => prev + 1);
    setLifecycleState('input-streaming');
  };

  // Render correct component output
  const renderOutputComponent = () => {
    switch (toolName) {
      case 'score_lead_analysis':
        return <ToolScoreCard data={toolOutput} />;
      case 'generate_performance_chart':
        return <ToolChartCard data={toolOutput} />;
      case 'fetch_metadata_tags':
        return <ToolMetaCard data={toolOutput} />;
      case 'confirm_action':
        return <ConfirmationToolCard data={toolOutput} />;
      default:
        return (
          <div className="p-4 bg-slate-900 rounded-xl font-mono text-xs text-slate-300">
            <pre>{JSON.stringify(toolOutput, null, 2)}</pre>
          </div>
        );
    }
  };

  const easeOutExpo = [0.16, 1, 0.3, 1];

  return (
    <div className="w-full my-4">
      {/* State Machine Status Header Bar */}
      <div className="flex items-center justify-between text-xs px-3 py-1.5 rounded-t-xl bg-slate-950/80 border border-b-0 border-slate-800 font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>TOOL: <strong className="text-indigo-300">{toolName}</strong></span>
        </div>

        {/* State Badges */}
        <div className="flex items-center gap-2">
          {lifecycleState === 'input-streaming' && (
            <span className="flex items-center gap-1.5 text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              1. input-streaming
            </span>
          )}

          {lifecycleState === 'input-available' && (
            <span className="flex items-center gap-1.5 text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
              <Code className="w-3 h-3" />
              2. input-available (executing)
            </span>
          )}

          {lifecycleState === 'output-available' && (
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              3. output-available
            </span>
          )}

          {lifecycleState === 'output-error' && (
            <span className="flex items-center gap-1.5 text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/60">
              <AlertOctagon className="w-3 h-3 text-rose-400" />
              4. output-error
            </span>
          )}
        </div>
      </div>

      {/* Main Lifecycle Content Box with Motion Morphing */}
      <AnimatePresence mode="wait">
        {/* STATE 1: INPUT STREAMING */}
        {lifecycleState === 'input-streaming' && (
          <motion.div
            key="streaming"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
            transition={{ duration: 0.25, ease: easeOutExpo }}
            className="p-4 rounded-b-xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-amber-200 shadow-xl space-y-2"
          >
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                Streaming Zod Arguments from AI Model...
              </span>
              <span className="text-[10px] text-amber-400/80 font-mono">PARSING PAYLOAD</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-amber-300/90 overflow-x-auto min-h-[60px] relative">
              <pre>{streamedText}</pre>
              <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse" />
            </div>
          </motion.div>
        )}

        {/* STATE 2: INPUT AVAILABLE */}
        {lifecycleState === 'input-available' && (
          <motion.div
            key="available"
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
            transition={{ duration: 0.25, ease: easeOutExpo }}
            className="p-4 rounded-b-xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-slate-200">Zod Schema Validated Input</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                SCHEMA: OK
              </span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {Object.entries(inputArgs).map(([key, val]) => (
                <div key={key} className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-mono">
                  <span className="text-slate-400">{key}:</span>
                  <span className="text-cyan-300 font-bold">{String(val)}</span>
                </div>
              ))}
            </div>

            {/* Spinner Progress bar during server tool execution */}
            <div className="pt-2">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-mono">
                <span className="flex items-center gap-1 text-cyan-300">
                  <Sparkles className="w-3 h-3 animate-spin text-cyan-400" />
                  Executing Tool Core Function...
                </span>
                <span>Latency: {simulatedLatency}ms</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: simulatedLatency / 1000, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* STATE 3: OUTPUT AVAILABLE */}
        {lifecycleState === 'output-available' && (
          <motion.div
            key="output"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
            className="rounded-b-xl overflow-hidden"
          >
            {renderOutputComponent()}
          </motion.div>
        )}

        {/* STATE 4: OUTPUT ERROR */}
        {lifecycleState === 'output-error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
            className="p-5 rounded-b-xl bg-gradient-to-br from-rose-950/90 via-slate-900 to-slate-900 border border-rose-500/50 space-y-4 shadow-2xl text-slate-100"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shrink-0 mt-0.5">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-rose-200 text-sm sm:text-base">Tool Execution Failed</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-900 text-rose-300 border border-rose-700">
                    ERR_TOOL_EXECUTION
                  </span>
                </div>
                <p className="text-xs text-rose-300/90 leading-relaxed font-mono">
                  {errorMessage}
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-rose-900/40 text-xs font-mono text-slate-400 space-y-1">
              <div><strong className="text-slate-300">Tool Name:</strong> {toolName}</div>
              <div><strong className="text-slate-300">Input Signature:</strong> {JSON.stringify(inputArgs)}</div>
              <div><strong className="text-slate-300">Recovery Status:</strong> Failure trapped safely, application runtime stable.</div>
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900/80 text-rose-200 border border-rose-500/60 hover:bg-rose-800 text-xs font-semibold shadow-lg shadow-rose-950/60 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Tool Execution</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
