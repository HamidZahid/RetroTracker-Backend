import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateToken = (userId: string): string => {
  const secret: string = env.JWT_SECRET || '';
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id: userId }, secret, {
    expiresIn: env.JWT_EXPIRE,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): { id: string } => {
  const secret: string = env.JWT_SECRET || '';
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.verify(token, secret) as { id: string };
};

