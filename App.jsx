import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bot, Layers, BookOpen, Rocket, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { MotionSettingsProvider } from './context/MotionSettingsContext';
import { StateControls } from './components/motion-system/StateControls';
import { StatefulButton } from './components/motion-system/StatefulButton';
import { DeployButton } from './components/motion-system/DeployButton';
import { ChatInterface } from './components/chat/ChatInterface';
import { SystemDocumentation } from './components/chat/SystemDocumentation';
import { ToolLifecycleCard } from './components/generative-ui/ToolLifecycleCard';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'buttons' | 'docs'

  return (
    <MotionSettingsProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white antialiased relative overflow-x-hidden">
        {/* Ambient background glows */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Navbar */}
        <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                M
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
                  <span>Motion & Generative UI</span>
                  <span className="text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-2 py-0.5 rounded-full">
                    FE-CAPSTONE
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Stateful Motion Buttons • Zod Tools • 4-State Machine</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>AI Chat Thread</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('buttons')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'buttons'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Stateful Buttons</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('docs')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'docs'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Specs & Easing</span>
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Interactive Simulation Controls Bar */}
          <StateControls />

          {/* TAB 1: AI Chat Thread with Generative UI Tools */}
          {activeTab === 'chat' && <ChatInterface />}

          {/* TAB 2: Stateful Motion Buttons Dedicated Sandbox */}
          {activeTab === 'buttons' && (
            <div className="space-y-8">
              {/* Primary Stateful Button Section */}
              <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      Stateful Button System (5+ States)
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Choreographed state machine (<code className="text-indigo-300">idle</code> → <code className="text-indigo-300">hover/focus</code> → <code className="text-indigo-300">loading</code> → <code className="text-indigo-300">success/error</code> → <code className="text-indigo-300">disabled</code>). Safe against spam-clicking.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                      COMPOSITOR-FRIENDLY (NO LAYOUT THRASH)
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-6 text-center">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Interactive Live Component
                    </div>

                    <StatefulButton className="text-base py-4 px-8" />

                    <p className="text-xs text-slate-400 max-w-xs">
                      Click to initiate simulated call. Use the top control bar to force success or error conditions.
                    </p>
                  </div>

                  {/* Motion State Matrix */}
                  <div className="space-y-3 text-xs">
                    <h3 className="font-bold text-slate-200 text-sm">Choreographed Motion Matrix</h3>
                    
                    <div className="space-y-2 font-mono">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                        <span className="text-indigo-300 font-bold">1. Idle State</span>
                        <span className="text-slate-400">Scale 1.0 • Indigo Gradient Fill</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                        <span className="text-cyan-300 font-bold">2. Hover / Focus</span>
                        <span className="text-slate-400">150ms easeOut (Scale 1.02, Aura glow expansion)</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                        <span className="text-purple-300 font-bold">3. Loading State</span>
                        <span className="text-slate-400">300ms easeOutExpo (Scale 0.98, Spinner Morph)</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                        <span className="text-emerald-300 font-bold">4. Success State</span>
                        <span className="text-slate-400">400ms Spring (Stiffness 450, Checkmark Pop)</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                        <span className="text-rose-300 font-bold">5. Error State</span>
                        <span className="text-slate-400">450ms Keyframe Shake [-8px, 8px] + Retry Action</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Secondary Button Motion System Flex */}
              <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-cyan-400" />
                      Motion System Flex: Deploy Button
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Demonstrates that the exact same motion language and timing tokens scale across secondary component contexts.
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                    SHARED MOTION TOKENS
                  </span>
                </div>

                <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-4 text-center">
                  <DeployButton />
                  <p className="text-xs text-slate-400 max-w-sm">
                    Shares the same spring physics, error keyframes, and reduced-motion fallback strategy.
                  </p>
                </div>
              </section>

              {/* Standalone Tool Part Renderer Preview */}
              <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-400" />
                    Standalone Tool Parts 4-State Renderer
                  </h2>
                  <span className="text-xs text-slate-400">Direct Tool Execution Sandbox</span>
                </div>

                <ToolLifecycleCard
                  toolName="generate_performance_chart"
                  inputArgs={{
                    metricTitle: 'System API P99 Latency & Peak Load',
                    timeframe: 'Past 7 Days',
                    chartType: 'Area Fill',
                    dataPointsCount: 7,
                  }}
                />
              </section>
            </div>
          )}

          {/* TAB 3: System Specifications & Documentation */}
          {activeTab === 'docs' && <SystemDocumentation />}
        </main>
      </div>
    </MotionSettingsProvider>
  );
}
