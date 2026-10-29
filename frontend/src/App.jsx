import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import FileViewer from './components/FileViewer';
import ChatInterface from './components/ChatInterface';
import ApiKeyModal from './components/ApiKeyModal';
import { uploadAndParseFile, askQuestionBackend, askGeminiDirect } from './utils/api';

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [model, setModel] = useState(() => localStorage.getItem('gemini_model') || 'gemini-3.8-flash');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [cachedContent, setCachedContent] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveKey = (k) => { setApiKey(k); localStorage.setItem('gemini_api_key', k); };
  const handleSaveModel = (m) => { setModel(m); localStorage.setItem('gemini_model', m); };

  const handleFileSelect = async (f) => {
    setFile(f);
    setUploadError(null);
    setMessages([]);
    try {
      const res = await uploadAndParseFile(f);
      setFileInfo(res.fileInfo);
      setCachedContent(res.extractedData);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        setFileInfo({ name: f.name, summary: `Local text: ~${text.length} chars`, previewText: text.slice(0, 300) });
        setCachedContent({ type: 'text', name: f.name, content: text });
      };
      reader.readAsText(f);
    }
  };

  const handleSendMessage = async (q) => {
    if (!apiKey) return setIsModalOpen(true);
    setMessages(prev => [...prev, { role: 'user', content: q, timestamp: new Date().toISOString() }]);
    setIsLoading(true);
    try {
      let res;
      try {
        res = await askQuestionBackend({ cachedContent, question: q, apiKey, model, history: messages });
      } catch {
        res = await askGeminiDirect({ apiKey, model, extractedData: cachedContent, question: q, history: messages });
      }
      setMessages(prev => [...prev, { role: 'assistant', content: res.answer, model: res.model, timestamp: res.timestamp }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `**Error:** ${err.message}`, model: 'Error' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => { setFile(null); setFileInfo(null); setCachedContent(null); setMessages([]); };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar hasApiKey={Boolean(apiKey)} onOpenKeyModal={() => setIsModalOpen(true)} currentModel={model} onReset={handleReset} hasFile={Boolean(file)} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col">
        {!file ? (
          <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
            <h1 className="text-4xl font-extrabold text-white mb-3 text-center">Chat with <span className="text-teal-400">any file</span> using Gemini</h1>
            <p className="text-slate-400 text-center mb-8">Upload Excel, resumes, PDFs, Word docs or images to ask questions.</p>
            <FileUpload onFileSelect={handleFileSelect} error={uploadError} />
          </div>
        ) : (
          <div className="space-y-4">
            <FileViewer file={file} fileInfo={fileInfo} onReplaceFile={handleReset} />
            <ChatInterface messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} fileInfo={fileInfo} onOpenKeyModal={() => setIsModalOpen(true)} hasApiKey={Boolean(apiKey)} />
          </div>
        )}
      </main>
      <ApiKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} apiKey={apiKey} onSaveKey={handleSaveKey} model={model} onSaveModel={handleSaveModel} />
    </div>
  );
}
