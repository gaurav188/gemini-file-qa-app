import React, { useState } from 'react';
import { Key, Eye, EyeOff, ShieldCheck, ExternalLink, X } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiKey, onSaveKey, model, onSaveModel }) {
  const [tempKey, setTempKey] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState(model || 'gemini-1.5-flash');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveKey(tempKey.trim());
    onSaveModel(selectedModel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Gemini API Key</h2>
              <p className="text-xs text-slate-400">Stored safely in browser session</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Google Gemini API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-3 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white"
              />
              <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-2.5 text-slate-400">
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-teal-400 hover:underline mt-1">
              Get key from Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast & Recommended)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
              <option value="gemini-3.8-flash">Gemini 3.8 Flash</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-xl">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
