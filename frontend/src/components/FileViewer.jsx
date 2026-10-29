import React, { useState } from 'react';
import { FileText, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

export default function FileViewer({ file, fileInfo, onReplaceFile }) {
  const [showPreview, setShowPreview] = useState(false);
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-teal-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-white text-sm">{file?.name || fileInfo?.name}</h4>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[10px]">Loaded</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{fileInfo?.summary || 'File loaded successfully'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {fileInfo?.previewText && (
            <button onClick={() => setShowPreview(!showPreview)} className="px-3 py-1.5 text-xs bg-slate-800 rounded-lg text-slate-300 hover:text-white">
              {showPreview ? 'Hide Text' : 'View Text'}
            </button>
          )}
          <button onClick={onReplaceFile} className="px-3 py-1.5 text-xs bg-slate-800 rounded-lg text-slate-300 hover:text-white flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Replace
          </button>
        </div>
      </div>
      {showPreview && fileInfo?.previewText && (
        <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 max-h-48 overflow-y-auto whitespace-pre-wrap">
          {fileInfo.previewText}
        </div>
      )}
    </div>
  );
}
