import { Router } from 'express';
import { PaymentController } from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new PaymentController();

router.post('/process', authenticate, controller.processPayment);

export default router;
