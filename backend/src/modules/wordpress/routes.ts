import { Router } from 'express';
import { WordPressController } from './controller';

const router = Router();
const ctrl = new WordPressController();

// Settings
router.get('/settings', ctrl.getSettings);
router.post('/settings', ctrl.saveSettings);

// Connection test
router.post('/test', ctrl.testConnection);

// Product preview from WC
router.get('/products', ctrl.previewProducts);

// Task operations
router.post('/tasks/generate', ctrl.generateTasks);
router.get('/tasks', ctrl.getTasks);
router.delete('/tasks', ctrl.clearTasks);

router.post('/task/:id/start', ctrl.startTask);
router.post('/task/:id/pause', ctrl.pauseTask);

// Special arbitrary ID import
router.post('/import/selected', ctrl.importSelected);

export default router;
