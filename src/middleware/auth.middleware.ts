import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { User } from '../models/User.model';
import { AppError } from './error.middleware';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
  teamMembership?: any;
  retro?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.userId = String(user._id);
    req.user = user;
    next();
  } catch (error: any) {
    next(new AppError(error.message || 'Authentication failed', 401));
  }
};

