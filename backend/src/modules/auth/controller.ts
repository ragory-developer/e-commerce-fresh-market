import { Request, Response } from 'express';
import { AuthService } from './service';
import { asyncHandler } from '../../utils/helpers';
import { AuthRequest } from '../../middleware/auth';

const authService = new AuthService();

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result,
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  });

  loginWithPhone = asyncHandler(async (req: Request, res: Response) => {
    const { phone, password } = req.body;
    const result = await authService.loginWithPhone(phone, password);
    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refresh(refreshToken);
    res.json({
      success: true,
      message: 'Token refreshed',
      data: tokens,
    });
  });

  logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user) {
      await authService.logout(req.user.userId);
    }
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  });

  sendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { phone } = req.body;
    const result = await authService.sendOtp(phone);
    res.json({
      success: true,
      message: 'OTP sent successfully',
      data: result
    });
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { phone, code, name } = req.body;
    const result = await authService.verifyOtp(phone, code, name);
    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: result,
    });
  });

  completeRegistration = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.completeRegistration(req.body);
    res.status(200).json({
      success: true,
      message: 'Registration completed successfully',
      data: result,
    });
  });
}
