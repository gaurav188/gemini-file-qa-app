# Gemini File Q&A Full-Stack Application

A production-grade, single-page application built with **React** (frontend) and **Node.js Express** (backend) that enables users to upload any file format (Resumes, Excel spreadsheets, CSVs, PDFs, Word docs, Images, Code) and ask questions powered by the **Google Gemini API**.

---

## 🌟 Highlights
- **Universal Multi-Format Ingestion**:
  - Resumes & PDFs (`.pdf`) via `pdf-parse`
  - Excel & Spreadsheets (`.xlsx`, `.xls`, `.csv`) via `xlsx` (SheetJS)
  - Word Documents (`.docx`) via `mammoth`
  - Images (`.png`, `.jpg`, `.jpeg`, `.webp`) via Gemini Multimodal Vision
  - Text, Code, JSON & Markdown via UTF-8 streaming buffers
- **Strict Grounding & Zero Hallucination**:
  - System prompts constrain answers strictly to the file's verified content with citations.
- **In-Memory Buffer Processing**:
  - Zero disk clutter using `multer.memoryStorage()`.
- **Session Caching**:
  - Subsequent questions on the same file don't re-upload large files.

---

## 🚀 Setup & Execution

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm start
```
Runs at `http://localhost:5000`.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:3000`.
