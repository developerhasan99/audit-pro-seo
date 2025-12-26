import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // Check if user is authenticated via session
  if (req.session && (req.session as any).userId) {
    req.user = {
      id: (req.session as any).userId,
      email: (req.session as any).userEmail,
    };
    next();
    return;
  }

  // If not authenticated, return 401
  throw new AppError('Unauthorized - Please sign in', 401);
};

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // Set user if authenticated, but don't require it
  if (req.session && (req.session as any).userId) {
    req.user = {
      id: (req.session as any).userId,
      email: (req.session as any).userEmail,
    };
  }
  next();
};
