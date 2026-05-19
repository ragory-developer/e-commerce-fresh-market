import { Router } from 'express';
import { BuilderController } from './controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const controller = new BuilderController();

router.get('/public/:key', controller.getPublicPage);
router.get('/components', controller.getComponents);
router.get('/packs', authenticate, controller.getPacks);

router.get('/pages/:key', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.getAdminPage);
router.put('/pages/:key/draft', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.saveDraft);
router.post('/pages/:key/publish', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.publish);
router.get('/pages/:key/versions', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.getVersions);

export default router;
