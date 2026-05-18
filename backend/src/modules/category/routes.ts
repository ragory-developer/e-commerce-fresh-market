import { Router } from 'express';
import { CategoryController } from './controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const controller = new CategoryController();

router.get('/', controller.getAll);
router.get('/slugs', controller.getSlugs);
router.get('/:slug', controller.getBySlug);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
