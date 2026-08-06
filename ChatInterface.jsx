import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Sparkles, Terminal, Activity, Globe, ShieldAlert, RefreshCw, Send } from 'lucide-react';
import { StatefulButton } from '../motion-system/StatefulButton';
import { ToolLifecycleCard } from '../generative-ui/ToolLifecycleCard';
import { TOOL_CONTRACTS } from '../../tools/schemas';

export function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hello! I'm your Generative UI Agent powered by Antigravity AI SDK. I can execute server-side Zod validated tools and stream dynamic UI components directly into our chat thread. Try one of the prompts below or type your own!",
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [activeToolCall, setActiveToolCall] = useState(null);

  // Quick preset triggers
  const presetPrompts = [
    {
      label: 'Score Lead: Apex Health',
      icon: Activity,
      toolName: 'score_lead_analysis',
      args: {
        leadName: 'Sarah Jenkins',
        companyName: 'Apex Health Systems',
        industry: 'HealthTech',
        estimatedBudget: 85000,
        urgency: 'Immediate (0-30 days)',
      },
    },
    {
      label: 'Fetch SEO & Meta Tags',
      icon: Globe,
      toolName: 'fetch_metadata_tags',
      args: {
        targetUrl: 'https://antigravity.google.com/docs/sdk',
        checkSecurityHeaders: true,
        extractOpenGraph: true,
      },
    },
    {
      label: 'Generate API Latency Chart',
      icon: Sparkles,
      toolName: 'generate_performance_chart',
      args: {
        metricTitle: 'P99 Latency & API Throughput',
        timeframe: 'Past 7 Days',
        chartType: 'Area Fill',
        dataPointsCount: 7,
      },
    },
    {
      label: 'Deploy Production Cluster (Interactive Tool)',
      icon: ShieldAlert,
      toolName: 'confirm_action',
      args: {
        actionName: 'Promote Multi-Region Cluster v2.4 to Active Traffic',
        targetEnvironment: 'Production (us-east-1)',
        impactScope: 'Critical System State Change',
        requireMfa: true,
      },
    },
  ];

  const handleSendPrompt = async (customPreset = null) => {
    const selectedPreset = customPreset || presetPrompts[0];
    const userText = customPreset ? `Execute ${selectedPreset.label}` : inputPrompt || 'Execute default lead scoring tool';

    const userMsgId = Date.now().toString();
    const assistantMsgId = (Date.now() + 1).toString();

    // Append user message
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', text: userText },
    ]);

    setInputPrompt('');

    // Simulate model thinking & returning tool call request
    await new Promise((resolve) => setTimeout(resolve, 600));

    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        role: 'assistant',
        text: `Invoking server-side tool \`${selectedPreset.toolName}\` with Zod schema validation...`,
        toolCall: {
          toolName: selectedPreset.toolName,
          args: selectedPreset.args,
        },
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[780px] bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">Antigravity AI Agent & Generative UI Thread</h2>
            <p className="text-xs text-slate-400">Server-Side Tools • Zod Schemas • 4-State Lifecycle</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setMessages([
              {
                id: 'welcome',
                role: 'assistant',
                text: 'Chat thread reset. Select a tool trigger below to test the full lifecycle.',
              },
            ])
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Preset Action Tool Bar */}
      <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/60 overflow-x-auto flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Quick Tool Prompts:
        </span>
        {presetPrompts.map((preset, idx) => {
          const PresetIcon = preset.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendPrompt(preset)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/60 hover:bg-indigo-950/70 hover:border-indigo-500/50 text-xs font-medium text-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              <PresetIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-lg ${
                msg.role === 'user'
                  ? 'bg-gradient-to-tr from-cyan-600 to-blue-600'
                  : 'bg-gradient-to-tr from-indigo-600 to-purple-600'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div
              className={`flex-1 space-y-3 p-4 rounded-2xl border text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-950/60 border-cyan-800/60 text-cyan-100 rounded-tr-none'
                  : 'bg-slate-950/60 border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <p>{msg.text}</p>

              {/* Render Tool Parts Lifecycle state machine if tool present */}
              {msg.toolCall && (
                <ToolLifecycleCard
                  toolName={msg.toolCall.toolName}
                  inputArgs={msg.toolCall.args}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Input Controls utilizing StatefulButton */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendPrompt();
            }
          }}
          placeholder="Ask AI agent or trigger tool call..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />

        <StatefulButton
          onClick={() => handleSendPrompt()}
          label="Send Message"
          successLabel="Sent!"
          errorLabel="Error"
          icon={Send}
          className="py-3 px-5 text-sm"
        />
      </div>
    </div>
  );
}
