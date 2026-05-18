import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

/**
 * Verifies the JWT access token from the Authorization header.
 * Attaches user info to req.user.
 */
export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Access token required'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as { userId: string; role: string };
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
};

/**
 * Optional authentication - attaches user if token is valid, but doesn't block if missing.
 */
export const optionalAuthenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // No token - proceed as guest
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as { userId: string; role: string };
    req.user = { userId: decoded.userId, role: decoded.role };
  } catch (_) {
    // Invalid token - proceed as guest rather than erroring
  }
  next();
};

/**
 * Role-based authorization middleware.
 * Must be used after `authenticate`.
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('DEBUG: Insufficient permissions (AUTH MOD)'));
    }
    next();
  };
};
