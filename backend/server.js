import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import qaRoutes from './routes/qaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api', qaRoutes);

app.get('/', (req, res) => {
  res.json({ app: 'Gemini File Q&A API Server', status: 'running' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File size too large. Limit is 25MB.' });
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Gemini File Q&A Server running at http://localhost:${PORT}`);
});

export default app;
