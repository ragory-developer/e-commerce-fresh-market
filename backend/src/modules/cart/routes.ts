import { Router } from 'express';
import { CartController } from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new CartController();

router.get('/', authenticate, controller.getCart);
router.post('/items', authenticate, controller.addItem);
router.put('/items/:id', authenticate, controller.updateItem);
router.delete('/items/:id', authenticate, controller.removeItem);
router.delete('/', authenticate, controller.clearCart);

export default router;
