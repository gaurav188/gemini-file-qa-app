import { GoogleGenAI } from '@google/genai';

// Fast high-throughput models (respond in 1-3 seconds)
const FAST_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'];

export async function askGeminiAboutFile({ apiKey, extractedData, question, conversationHistory = [] }) {
  if (!apiKey) throw new Error('Gemini API key is required.');
  if (!question || !question.trim()) throw new Error('Please enter a question.');

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are a fast, precise document analyst.
Answer the user's question directly using ONLY the facts and data found in the uploaded document.
Be concise, clear, and cite relevant sections or rows when applicable.`;

  // Prepare prompt payload
  const contents = [];

  // Limit conversation context to prevent payload bloat
  if (conversationHistory.length > 0) {
    const historyText = conversationHistory
      .slice(-4)
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
    contents.push({ text: `Recent Context:\n${historyText}\n---\n` });
  }

  // Handle image vs text/doc files
  if (extractedData.type === 'image') {
    contents.push({
      inlineData: {
        data: extractedData.data,
        mimeType: extractedData.mimeType
      }
    });
    contents.push({ text: `File: ${extractedData.name}\n\nQuestion: ${question}` });
  } else {
    // Truncate document text if excessively large to ensure rapid roundtrip
    const maxChars = 80000;
    const documentBody = extractedData.content.length > maxChars 
      ? extractedData.content.slice(0, maxChars) + "\n...[Document excerpted for performance]..."
      : extractedData.content;

    contents.push({
      text: `Document: "${extractedData.name}" (${extractedData.summary}):\n\`\`\`\n${documentBody}\n\`\`\`\n\nQuestion: ${question}`
    });
  }

  // Try the fastest models sequentially with an abort timeout
  let lastError = null;

  for (const model of FAST_MODELS) {
    try {
      // Abort controller ensures we never wait more than 15 seconds per model
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          temperature: 0.2,
          // Disables long deliberation pauses to return answers immediately
          thinkingConfig: {
            thinkingBudget: 0
          }
        }
      }, { signal: controller.signal });

      clearTimeout(timeoutId);

      return {
        answer: response.text,
        model,
        timestamp: new Date().toISOString(),
        fileInfo: {
          name: extractedData.name,
          type: extractedData.type,
          summary: extractedData.summary
        }
      };
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini] ${model} skipped or timed out: ${err.message}. Trying next model...`);
    }
  }

  throw lastError || new Error('All model attempts timed out. Please try asking again.');
}