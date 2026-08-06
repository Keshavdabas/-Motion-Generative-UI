import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Zap, ArrowUpRight } from 'lucide-react';

export function ToolChartCard({ data }) {
  if (!data || !data.chartData) return null;
  const { metricTitle, timeframe, chartType, chartData } = data;
  const { labels, values, avgValue, peakValue, status } = chartData;

  const [activePoint, setActivePoint] = useState(null);

  // Calculate SVG chart coordinates
  const maxVal = Math.max(...values, 220);
  const minVal = Math.min(...values, 80);
  const height = 140;
  const width = 450;
  const padding = 20;

  const points = values.map((val, idx) => {
    const x = padding + (idx / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);
    return { x, y, val, label: labels[idx] };
  });

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-700/80 p-5 shadow-2xl space-y-4 text-slate-100 backdrop-blur-md relative overflow-hidden">
      {/* Top Title & Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-700/50 text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">{metricTitle}</h3>
            <p className="text-xs text-slate-400">
              Aggregated Telemetry ({timeframe}) • Model: {chartType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Average P99</div>
            <div className="text-sm font-bold text-cyan-300">{avgValue}</div>
          </div>
          <div className="text-right pl-3 border-l border-slate-800">
            <div className="text-xs text-slate-400">Peak Load</div>
            <div className="text-sm font-bold text-amber-300">{peakValue}</div>
          </div>
        </div>
      </div>

      {/* SVG Interactive Area Chart */}
      <div className="relative pt-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1" />

          {/* Area Fill Path */}
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            d={areaD}
            fill="url(#chartGradient)"
          />

          {/* Line Path */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            d={pathD}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Interactive Data Points */}
          {points.map((pt, i) => (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setActivePoint(pt)} onMouseLeave={() => setActivePoint(null)}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={activePoint?.label === pt.label ? 6 : 4}
                className="fill-slate-900 stroke-cyan-400 transition-all duration-200"
                strokeWidth="2.5"
              />
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Popup */}
        {activePoint && (
          <div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-slate-950 border border-cyan-500/40 px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-200 shadow-xl flex items-center gap-2 pointer-events-none"
          >
            <span>{activePoint.label}:</span>
            <span className="font-bold text-white">{activePoint.val}ms</span>
          </div>
        )}
      </div>

      {/* Footer Status Badge */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80 text-slate-400">
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <Zap className="w-3.5 h-3.5" />
          <span>{status}</span>
        </div>
        <div className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
          <span>Export Metrics</span>
          <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}
