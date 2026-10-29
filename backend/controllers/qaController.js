import { extractFileContent } from '../utils/fileExtractor.js';
import { askGeminiAboutFile } from '../services/geminiService.js';

export async function askQuestion(req, res) {
  try {
    const { question, apiKey, model, history, cachedContent } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question parameter is required.' });
    }

    const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;
    if (!effectiveApiKey) {
      return res.status(401).json({ error: 'No Gemini API key provided. Please input key in UI or server .env.' });
    }

    let extractedData = null;
    if (req.file) {
      extractedData = await extractFileContent(req.file);
    } else if (cachedContent) {
      extractedData = typeof cachedContent === 'string' ? JSON.parse(cachedContent) : cachedContent;
    } else {
      return res.status(400).json({ error: 'Please upload a file or provide document content.' });
    }

    let parsedHistory = [];
    if (history) {
      parsedHistory = typeof history === 'string' ? JSON.parse(history) : history;
    }

    const aiResponse = await askGeminiAboutFile({
      apiKey: effectiveApiKey,
      modelName: model || process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      extractedData,
      question: question.trim(),
      conversationHistory: parsedHistory
    });

    return res.status(200).json({
      success: true,
      ...aiResponse,
      extractedData: {
        name: extractedData.name,
        type: extractedData.type,
        summary: extractedData.summary,
        ...(extractedData.type === 'text' ? { content: extractedData.content } : {})
      }
    });
  } catch (error) {
    console.error('Error in askQuestion:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function parseFile(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    const extracted = await extractFileContent(req.file);
    return res.status(200).json({
      success: true,
      fileInfo: {
        name: extracted.name,
        type: extracted.type,
        mimeType: extracted.mimeType,
        summary: extracted.summary,
        previewText: extracted.content ? extracted.content.slice(0, 500) : null,
        totalLength: extracted.content ? extracted.content.length : null,
        pages: extracted.pages || null,
        sheets: extracted.sheets || null,
        totalRows: extracted.totalRows || null
      },
      extractedData: extracted
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
