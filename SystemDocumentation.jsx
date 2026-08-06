import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code, Cpu, FileText, CheckCircle2, ShieldAlert, Activity, ArrowRight } from 'lucide-react';
import { TOOL_CONTRACTS } from '../../tools/schemas';

export function SystemDocumentation() {
  return (
    <div className="space-y-8 text-slate-200">
      {/* Motion Design System Easing Rationale */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-lg border-b border-slate-800 pb-3">
          <Sparkles className="w-5 h-5" />
          <h2>Motion Choreography & Easing Rationale</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-indigo-300 text-sm">Hover & Micro-Interactions</span>
            <div className="font-mono text-indigo-400">150ms cubic-bezier(0.4, 0, 0.2, 1)</div>
            <p className="text-slate-400 leading-relaxed">
              Provides instant feedback with rapid acceleration. Compositor properties (<code className="text-indigo-300">transform</code>, <code className="text-indigo-300">opacity</code>) prevent layout thrashing and maintain 60 FPS performance.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-cyan-300 text-sm">State Morphing (Idle → Loading)</span>
            <div className="font-mono text-cyan-400">320ms cubic-bezier(0.16, 1, 0.3, 1)</div>
            <p className="text-slate-400 leading-relaxed">
              Smooth deceleration curve allowing elements to morph gracefully into progress indicators without snap transitions or abrupt state swaps.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-300 text-sm">Success Morph & Error Shake</span>
            <div className="font-mono text-emerald-400">Spring: stiff 450, damp 25</div>
            <p className="text-slate-400 leading-relaxed">
              Physics-based spring pop for checkmark icon feedback. Error states trigger a keyframe shake (<code className="text-rose-300">x: [-8px, 8px, 0]</code>) over 450ms, automatically suppressed when <code className="text-rose-300">prefers-reduced-motion</code> is enabled.
            </p>
          </div>
        </div>
      </section>

      {/* Tool Contracts & Zod Schemas */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-lg">
            <Cpu className="w-5 h-5" />
            <h2>Server-Side Tool Contracts & Zod Schemas</h2>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            4 Defined Tools
          </span>
        </div>

        <div className="space-y-6">
          {TOOL_CONTRACTS.map((contract) => (
            <div key={contract.id} className="bg-slate-950/80 rounded-xl border border-slate-800 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-indigo-300 bg-indigo-950 px-2.5 py-1 rounded border border-indigo-800">
                    {contract.name}
                  </span>
                  <span className="text-xs text-slate-400">{contract.description}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  ZOD SCHEMA VALIDATED
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <div className="text-slate-400 mb-1 text-[11px] font-sans font-semibold">Sample Input Schema Payload</div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-cyan-300 overflow-x-auto">
                    <pre>{JSON.stringify(contract.sampleInput, null, 2)}</pre>
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 mb-1 text-[11px] font-sans font-semibold">4-State UI Rendered Output</div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300 flex items-center justify-center min-h-[100px]">
                    <div className="text-center space-y-1 font-sans">
                      <div className="text-xs text-indigo-400 font-semibold">
                        Component Output: <code className="text-white">{contract.name}</code>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Crossfades into typed visual card with custom actions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
