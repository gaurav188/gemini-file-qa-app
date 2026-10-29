import pdfParse from 'pdf-parse';
import * as xlsx from 'xlsx';
import mammoth from 'mammoth';

export async function extractFileContent(file) {
  if (!file || !file.buffer) throw new Error('No file buffer provided.');

  const mimeType = file.mimetype || 'application/octet-stream';
  const originalName = file.originalname || 'unknown_file';
  const extension = originalName.split('.').pop().toLowerCase();

  // Images -> Multimodal Vision
  const imageExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
  if (mimeType.startsWith('image/') || imageExtensions.includes(extension)) {
    return {
      type: 'image',
      name: originalName,
      mimeType: mimeType.startsWith('image/') ? mimeType : `image/${extension === 'jpg' ? 'jpeg' : extension}`,
      data: file.buffer.toString('base64'),
      summary: `Image file: ${originalName} (${(file.size / 1024).toFixed(1)} KB)`
    };
  }

  // PDFs & Resumes
  if (mimeType === 'application/pdf' || extension === 'pdf') {
    const pdfData = await pdfParse(file.buffer);
    const cleanedText = pdfData.text.replace(/\r\n/g, '\n').trim();
    return {
      type: 'text',
      name: originalName,
      mimeType: 'application/pdf',
      pages: pdfData.numpages,
      content: cleanedText,
      summary: `PDF Document (${pdfData.numpages} pages, ~${cleanedText.length} characters)`
    };
  }

  // Excel (.xlsx, .xls) & CSV
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || ['xlsx', 'xls', 'csv'].includes(extension)) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetSummaries = [];
    let totalRows = 0;

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const rawJson = xlsx.utils.sheet_to_json(worksheet, { defval: '' });
      totalRows += rawJson.length;
      const csvData = xlsx.utils.sheet_to_csv(worksheet);
      sheetSummaries.push(`--- Sheet: ${sheetName} (${rawJson.length} rows) ---\n${csvData.slice(0, 100000)}`);
    }

    return {
      type: 'text',
      name: originalName,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      sheets: workbook.SheetNames,
      totalRows,
      content: sheetSummaries.join('\n\n'),
      summary: `Excel/CSV Workbook (${workbook.SheetNames.length} sheet(s), ${totalRows} rows)`
    };
  }

  // Word Documents (.docx)
  if (mimeType.includes('wordprocessingml') || extension === 'docx') {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    const docText = result.value.trim();
    return {
      type: 'text',
      name: originalName,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      content: docText,
      summary: `Word Document (~${docText.length} characters)`
    };
  }

  // Text / Code / JSON
  const textContent = file.buffer.toString('utf-8');
  return {
    type: 'text',
    name: originalName,
    mimeType: mimeType || 'text/plain',
    content: textContent,
    summary: `Text Document (${originalName}, ~${textContent.length} characters)`
  };
}
