import { Router } from 'express';
import multer from 'multer';
import { askQuestion, parseFile } from '../controllers/qaController.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_BYTES || '26214400', 10) }
});

router.post('/ask', upload.single('file'), askQuestion);
router.post('/parse-file', upload.single('file'), parseFile);
router.get('/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

export default router;
