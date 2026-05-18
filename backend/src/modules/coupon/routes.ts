import { Router } from 'express';
import { CouponController } from './controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const controller = new CouponController();

// Admin routes
router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.get('/:code/report', controller.getReport);

export default router;
