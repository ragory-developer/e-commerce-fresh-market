import { Router } from 'express';
import { PageController } from './controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const controller = new PageController();

// Public routes
router.get('/', controller.getAll);
router.get('/:slug', controller.getBySlug);

// Admin routes (Authentication temporarily disabled to match products API until frontend login is finalized)
router.post('/', controller.create);
router.get('/id/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
