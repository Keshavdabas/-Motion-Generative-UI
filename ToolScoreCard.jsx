import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, ShieldAlert, Award, DollarSign, CheckCircle } from 'lucide-react';

export function ToolScoreCard({ data }) {
  if (!data) return null;
  const { leadName, companyName, industry, scoreResult } = data;
  const score = scoreResult?.leadScore || 85;

  // Score color badge mapping
  const scoreColor =
    score >= 90 ? 'from-emerald-500 to-teal-400 text-emerald-400' : score >= 80 ? 'from-indigo-500 to-cyan-400 text-cyan-400' : 'from-amber-500 to-orange-400 text-amber-400';

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-700/80 p-5 shadow-2xl space-y-5 text-slate-100 overflow-hidden relative backdrop-blur-md">
      {/* Decorative gradient blur background */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-700/50">
              {industry}
            </span>
            <span className="text-xs text-slate-400">Validated CRM Payload</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">{companyName}</h3>
          <p className="text-xs text-slate-400">Contact: {leadName}</p>
        </div>

        {/* Lead Score Gauge */}
        <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
          <div className="relative flex items-center justify-center w-14 h-14">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: `${score}, 100` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="text-indigo-500"
                strokeWidth="3.5"
                strokeDasharray={`${score}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-extrabold text-white">{score}</span>
          </div>
          <div>
            <div className="text-xs text-slate-400">Lead Health Score</div>
            <div className={`text-sm font-bold bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}>
              {scoreResult?.dealTier}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Win Probability</span>
          </div>
          <div className="text-lg font-bold text-emerald-300">{scoreResult?.conversionProbability}</div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
            <span>Projected ARR</span>
          </div>
          <div className="text-lg font-bold text-cyan-300">{scoreResult?.estimatedArr}</div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Target Urgency</span>
          </div>
          <div className="text-sm font-semibold text-purple-200 truncate">{data.urgency}</div>
        </div>
      </div>

      {/* Risk Factors & Recommended Strategy */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Analysis Highlights</div>
        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-200">Risk Assessment: </span>
              <span className="text-slate-300">
                {scoreResult?.riskFactors?.join('. ') || 'Standard evaluation required.'}
              </span>
            </div>
          </div>

          <div className="bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-900/50 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-indigo-200">Recommended Action: </span>
              <span className="text-slate-300">{scoreResult?.recommendedAction}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
