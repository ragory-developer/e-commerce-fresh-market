import { Router } from 'express';
import { AuthController } from './controller';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema, loginWithPhoneSchema, refreshSchema, sendOtpSchema, verifyOtpSchema, completeRegistrationSchema } from './validators';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new AuthController();

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.post('/login-with-phone', validate(loginWithPhoneSchema), controller.loginWithPhone);
router.post('/refresh', validate(refreshSchema), controller.refresh);
router.post('/logout', authenticate, controller.logout);
router.post('/send-otp', validate(sendOtpSchema), controller.sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), controller.verifyOtp);
router.post('/complete-registration', validate(completeRegistrationSchema), controller.completeRegistration);

export default router;
