import { Router } from 'express';
import { BuilderController } from './controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const controller = new BuilderController();

router.get('/public/:key', controller.getPublicPage);
router.get('/components', controller.getComponents);
router.get('/packs', authenticate, controller.getPacks);

router.get('/templates', controller.getTemplates);
router.get('/templates/:id', controller.getTemplateById);
router.post('/templates', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.createTemplate);
router.post('/pages/:key/apply-template', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.applyTemplate);
router.delete('/templates/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.deleteTemplate);

router.get('/pages/:key', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.getAdminPage);
router.put('/pages/:key/draft', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.saveDraft);
router.post('/pages/:key/publish', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.publish);
router.get('/pages/:key/versions', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.getVersions);

export default router;
