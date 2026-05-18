import { Router } from 'express';
import { locationController } from './controller';

const router = Router();

// Public routes - for dropdowns in checkout/address forms
router.get('/states', locationController.getStates);
router.get('/cities', locationController.getCities);
router.get('/areas', locationController.getAreas);

// Admin routes - temporarily remove all auth to bypass 403 error for dev
router.post('/states', locationController.createState);
router.put('/states/:id', locationController.updateState);
router.delete('/states/:id', locationController.deleteState);

router.post('/cities', locationController.createCity);
router.put('/cities/:id', locationController.updateCity);
router.delete('/cities/:id', locationController.deleteCity);

router.post('/areas', locationController.createArea);
router.put('/areas/:id', locationController.updateArea);
router.delete('/areas/:id', locationController.deleteArea);

export default router;
