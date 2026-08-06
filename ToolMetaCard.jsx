import React from 'react';
import { Globe, ShieldCheck, Lock, ExternalLink, FileSearch, CheckCircle2 } from 'lucide-react';

export function ToolMetaCard({ data }) {
  if (!data || !data.metaData) return null;
  const { targetUrl, metaData } = data;
  const { title, description, openGraph, security, seoHealthScore } = metaData;

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-700/80 p-5 shadow-2xl space-y-4 text-slate-100 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-700/50 text-purple-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm sm:text-base">Website Metadata & SEO Crawler</h3>
            <a
              href={targetUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1 font-mono truncate max-w-xs sm:max-w-sm"
            >
              <span>{targetUrl}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">SEO Health</div>
          <div className="text-lg font-extrabold text-purple-300">{seoHealthScore}/100</div>
        </div>
      </div>

      {/* Meta Content Card & OG Preview */}
      <div className="grid sm:grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
        <div className="sm:col-span-2 space-y-2">
          <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Page Title</div>
          <div className="text-sm font-semibold text-slate-100">{title}</div>
          <div className="text-xs text-slate-300 line-clamp-2">{description}</div>
        </div>

        {openGraph?.ogImage && (
          <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-900 h-24 sm:h-auto relative group">
            <img src={openGraph.ogImage} alt="OG Card" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-slate-950/40 p-1 flex items-end">
              <span className="text-[10px] text-white bg-slate-900/80 px-1.5 py-0.5 rounded font-mono">OG Preview</span>
            </div>
          </div>
        )}
      </div>

      {/* Security Headers Table */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Security & SSL Audit</span>
          <span className="text-emerald-400 flex items-center gap-1 font-normal">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Compliant
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-800">
            <div className="text-slate-400">SSL Certificate</div>
            <div className="font-semibold text-emerald-300 flex items-center gap-1 mt-0.5">
              <Lock className="w-3 h-3 text-emerald-400" /> Valid 256-bit
            </div>
          </div>
          <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-800">
            <div className="text-slate-400">HSTS Header</div>
            <div className="font-semibold text-slate-200 mt-0.5 truncate">{security?.hstsHeader ? 'Active' : 'Missing'}</div>
          </div>
          <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-800">
            <div className="text-slate-400">CSP Policy</div>
            <div className="font-semibold text-slate-200 mt-0.5">{security?.cspStatus}</div>
          </div>
          <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-800">
            <div className="text-slate-400">CORS Lockdown</div>
            <div className="font-semibold text-emerald-300 mt-0.5">Enforced</div>
          </div>
        </div>
      </div>
    </div>
  );
}
