const API_BASE = '/api';

export async function uploadAndParseFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE}/parse-file`, { method: 'POST', body: formData });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to parse file.');
  return data;
}

export async function askQuestionBackend({ file, cachedContent, question, apiKey, model, history }) {
  const formData = new FormData();
  if (file) formData.append('file', file);
  if (cachedContent) formData.append('cachedContent', JSON.stringify(cachedContent));
  formData.append('question', question);
  if (apiKey) formData.append('apiKey', apiKey);
  if (model) formData.append('model', model);
  if (history && history.length > 0) formData.append('history', JSON.stringify(history));

  const response = await fetch(`${API_BASE}/ask`, { method: 'POST', body: formData });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to get answer.');
  return data;
}

export async function askGeminiDirect({ apiKey, model = 'gemini-1.5-flash', extractedData, question, history = [] }) {
  if (!apiKey) throw new Error('Gemini API key is required.');
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  let contents = [];
  if (history && history.length > 0) {
    history.slice(-4).forEach(msg => {
      contents.push({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content }] });
    });
  }
  const parts = [];
  if (extractedData.type === 'image') {
    parts.push({ inlineData: { mimeType: extractedData.mimeType, data: extractedData.data } });
    parts.push({ text: `Analyze this image document "${extractedData.name}" and answer: ${question}` });
  } else {
    parts.push({
      text: `Answer strictly based on document "${extractedData.name}":\n\n\`\`\`\n${extractedData.content}\n\`\`\`\n\nQuestion: ${question}`
    });
  }
  contents.push({ role: 'user', parts });
  const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents }) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Gemini API Error');
  return { answer: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response', model, timestamp: new Date().toISOString() };
}
