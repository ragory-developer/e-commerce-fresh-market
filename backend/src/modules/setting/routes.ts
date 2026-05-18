import { Router } from 'express';
import { SettingController } from './controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const controller = new SettingController();

router.get('/home-page', controller.getHomePage);
router.put('/home-page', controller.updateHomePage);

router.get('/', controller.getAll);
// TODO: Re-add authenticate + authorize ('ADMIN') once frontend login is implemented
router.post('/', controller.update);

export default router;
