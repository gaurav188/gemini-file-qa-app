import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, Check, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatInterface({ messages, onSendMessage, isLoading, fileInfo, onOpenKeyModal, hasApiKey }) {
  const [input, setInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const suggestions = fileInfo?.name?.endsWith('.xlsx') || fileInfo?.name?.endsWith('.csv')
    ? ['Summarize key totals and columns in this dataset', 'What are the top 5 records by value?', 'Identify anomalies or outliers']
    : ['Provide an executive summary of this document', 'Extract the key skills, qualifications, and milestones', 'Draft 3 questions based on this file'];

  return (
    <div className="flex flex-col h-[600px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Ask questions about your file</h3>
            <p className="text-xs text-slate-400 mb-4 max-w-sm">Pick a quick suggestion below or write a custom question.</p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => setInput(s)} className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-teal-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-200'}`}>
                {msg.role === 'assistant' ? (
                  <div>
                    <div className="prose prose-invert prose-sm"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-800 text-[10px] text-slate-500">
                      <span>{msg.model || 'Gemini'}</span>
                      <button onClick={() => handleCopy(msg.content, i)} className="hover:text-slate-300">
                        {copiedIndex === i ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && <div className="text-xs text-teal-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Gemini is analyzing file...</div>}
        <div ref={endRef} />
      </div>
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        {!hasApiKey && (
          <div className="mb-2 text-xs text-amber-300 flex justify-between">
            <span>Gemini Key needed</span>
            <button onClick={onOpenKeyModal} className="underline">Configure Key</button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask question about file..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
          />
          <button type="submit" disabled={!input.trim() || isLoading} className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-xl text-sm">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
