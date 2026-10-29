import React from 'react';
import { Sparkles, Key, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({ hasApiKey, onOpenKeyModal, currentModel, onReset, hasFile }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Gemini File QA</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">v1.0</span>
            </div>
            <p className="text-xs text-slate-400">Ask anything about your uploaded files</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasFile && (
            <button onClick={onReset} className="text-xs text-slate-400 hover:text-rose-400 px-3 py-1.5 rounded-lg border border-slate-800 transition">
              Clear File
            </button>
          )}
          <button
            onClick={onOpenKeyModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
              hasApiKey ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-teal-400" />
            <span>{hasApiKey ? currentModel : 'Set Gemini Key'}</span>
            {hasApiKey ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        </div>
      </div>
    </header>
  );
}
