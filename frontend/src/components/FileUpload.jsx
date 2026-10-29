import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, FileText, Image as ImageIcon, FileCode, AlertCircle } from 'lucide-react';

export default function FileUpload({ onFileSelect, isProcessing, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) onFileSelect(e.dataTransfer.files[0]);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition ${
          isDragging ? 'border-teal-400 bg-teal-500/10' : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
        }`}
      >
        <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => e.target.files?.length && onFileSelect(e.target.files[0])} />
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">Upload any document or data file</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">Drag and drop Excel spreadsheets, resumes, PDFs, Word docs, images or code.</p>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
          <span className="px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-300">Excel / CSV</span>
          <span className="px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-300">PDF / Resumes</span>
          <span className="px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-300">Word (.docx)</span>
          <span className="px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-300">Images (PNG/JPG)</span>
        </div>
      </div>
      {error && <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">{error}</div>}
    </div>
  );
}
