import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle, XCircle, AlertTriangle, KeyRound, Lock, Sparkles } from 'lucide-react';
import { StatefulButton } from '../motion-system/StatefulButton';

export function ConfirmationToolCard({ data, onConfirmResponse }) {
  const [decision, setDecision] = useState(null); // null | 'confirmed' | 'rejected'
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!data) return null;
  const { actionName, targetEnvironment, impactScope, requireMfa, confirmationToken } = data;

  const handleApprove = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setDecision('confirmed');
    onConfirmResponse?.({ actionName, status: 'APPROVED', token: confirmationToken });
  };

  const handleReject = () => {
    setDecision('rejected');
    onConfirmResponse?.({ actionName, status: 'REJECTED', token: confirmationToken });
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 p-5 shadow-2xl space-y-4 text-slate-100 backdrop-blur-md relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">User Approval Required</div>
            <h3 className="font-bold text-white text-base">{actionName}</h3>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700/60">
          {impactScope}
        </span>
      </div>

      {/* Details Box */}
      <div className="grid sm:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
        <div>
          <div className="text-slate-400">Target Environment</div>
          <div className="font-semibold text-amber-200 mt-0.5">{targetEnvironment}</div>
        </div>

        <div>
          <div className="text-slate-400">Security Gate</div>
          <div className="font-semibold text-indigo-300 flex items-center gap-1 mt-0.5">
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            {requireMfa ? 'MFA Token Required' : 'Standard Admin'}
          </div>
        </div>

        <div>
          <div className="text-slate-400">Token Signature</div>
          <div className="font-mono font-bold text-slate-300 mt-0.5">{confirmationToken}</div>
        </div>
      </div>

      {/* Decision State */}
      <AnimatePresence mode="wait">
        {decision === null && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap items-center justify-between gap-3 pt-2"
          >
            <div className="text-xs text-amber-300/80 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>This tool mutation cannot be automatically executed without explicit authorization.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReject}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                Reject Action
              </button>

              <StatefulButton
                onClick={handleApprove}
                label="Confirm & Authorize"
                successLabel="Authorized!"
                errorLabel="Auth Error"
                icon={Sparkles}
                className="text-xs py-2.5 px-4"
              />
            </div>
          </motion.div>
        )}

        {decision === 'confirmed' && (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-950/60 border border-emerald-500/50 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-200"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Action Authorized by User. System mutation initiated on {targetEnvironment}.</span>
            </div>
            <span className="font-mono text-[10px] bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-300">
              STATUS: EXECUTING
            </span>
          </motion.div>
        )}

        {decision === 'rejected' && (
          <motion.div
            key="rejected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-rose-950/60 border border-rose-500/50 p-3 rounded-xl flex items-center justify-between text-xs text-rose-200"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Action Cancelled by User. Tool execution aborted safely.</span>
            </div>
            <span className="font-mono text-[10px] bg-rose-900/80 px-2 py-0.5 rounded text-rose-300">
              STATUS: ABORTED
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
