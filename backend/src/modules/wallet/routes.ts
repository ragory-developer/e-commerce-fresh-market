import { Router } from 'express';
import { WalletController } from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new WalletController();

router.get('/balance', authenticate, controller.getBalance);
router.post('/top-up', authenticate, controller.topUp);
router.post('/ssl/success', controller.sslSuccess);
router.post('/ssl/fail', controller.sslFail);
router.post('/ssl/cancel', controller.sslCancel);
router.get('/history', authenticate, controller.getHistory);

export default router;
