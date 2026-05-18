import { Router } from 'express';
import { OrderController } from './controller';
import { authenticate, authorize, optionalAuthenticate } from '../../middleware/auth';

const router = Router();
const controller = new OrderController();

router.post('/calculate', optionalAuthenticate, controller.calculate);
router.post('/', authenticate, controller.create);
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.getAllOrders);
router.get('/my', authenticate, controller.getMyOrders);
router.get('/:id', authenticate, controller.getById);
router.patch('/:id/pay', authenticate, controller.pay);
router.put('/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.updateStatus);

export default router;
