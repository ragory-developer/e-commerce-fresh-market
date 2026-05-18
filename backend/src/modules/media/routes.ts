import { Router } from 'express';
import multer from 'multer';
import { MediaController } from './controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const controller = new MediaController();

// Multer: store in memory for sharp processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Public routes
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// Admin routes (TODO: re-add authenticate + authorize after testing)
router.post('/upload', upload.single('image'), controller.upload);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
