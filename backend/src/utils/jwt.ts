import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload extends JwtPayload {
  sub: string;
  role: string;
}

export const generateToken = (payload: TokenPayload, expiresIn: SignOptions['expiresIn'] = '7d'): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, env.jwtSecret, options);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
};


