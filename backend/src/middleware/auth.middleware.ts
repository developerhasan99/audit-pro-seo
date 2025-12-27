import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';
import { verifyToken } from '../utils/auth';

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
  // Check if user is authenticated via JWT
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
      return;
    } catch (error) {
      throw new AppError('Invalid or expired token', 401);
    }
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
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
    } catch (error) {
      // Ignore errors for optional auth
    }
  }
  next();
};

