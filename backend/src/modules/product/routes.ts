import { Router } from 'express';
import { ProductController } from './controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const controller = new ProductController();

router.get('/', controller.getAll);
router.get('/check-slug', controller.checkSlug);
router.get('/slugs', controller.getSlugs);
router.get('/:slug', controller.getBySlug);
// TODO: Re-add authenticate + authorize ('ADMIN') once frontend login is implemented
router.post('/bulk-promotions', controller.applyBulkPromotion);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
