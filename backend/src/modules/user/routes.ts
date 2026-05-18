import { Router } from 'express';
import { UserController } from './controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const controller = new UserController();

// Specific user actions
router.get('/profile', authenticate, controller.getProfile);
router.put('/profile', authenticate, controller.updateProfile);
router.post('/request-phone-change', authenticate, controller.requestPhoneChange);
router.post('/verify-phone-change', authenticate, controller.verifyPhoneChange);

// Address routes
router.get('/addresses', authenticate, controller.getAddresses);
router.post('/addresses', authenticate, controller.createAddress);
router.put('/addresses/:id', authenticate, controller.updateAddress);
router.delete('/addresses/:id', authenticate, controller.deleteAddress);

// Admin/ID based routes last
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.getAllUsers);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.createUser);
router.get('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.getUserById);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.updateCustomerAdmin);

export default router;
