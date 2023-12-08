import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { NextFunction, Response } from 'express';
import { AuthRequest, authPayload } from '../common/types';

config();

export function generateToken(id: string, role: string): string {
  const signature = String(process.env.SIGNATURE);
  const expiration = String(process.env.EXPIRESIN);

  const payload: authPayload = { id: id, role: role };

  return jwt.sign(payload, signature, {
    expiresIn: expiration,
  });
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.method == 'OPTIONS') {
    next();
  }

  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(403).json({ message: 'Пользователь не авторизован' });
    }

    const token = auth.split(' ')[1];
    const decodedData = jwt.verify(
      token,
      String(process.env.SIGNATURE)
    ) as authPayload;
    req.credentials = decodedData;

    next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: 'Пользователь не авторизован' });
  }
}

export function roleAuth(role: string) {
  return function (req: AuthRequest, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
      next();
    }

    try {
      const auth = req.headers.authorization;
      if (!auth) {
        return res.status(403).json({ message: 'Пользователь не авторизован' });
      }

      const token = auth.split(' ')[1];
      const decodedData = jwt.verify(
        token,
        String(process.env.SIGNATURE)
      ) as authPayload;
      req.credentials = decodedData;

      if (req.credentials.role == role) {
        console.log(req.credentials);

        next();
        return;
      }

      return res.status(403).json({ message: 'У вас нет доступа' });
    } catch (e) {
      console.log(e);
      return res.status(403).json({ message: 'Пользователь не авторизован' });
    }
  };
}
