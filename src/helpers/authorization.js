import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export function generateToken(id, role) {
  const signature = process.env.SIGNATURE;
  const expiration = process.env.EXPIRESIN;

  return jwt.sign({ id: id, role: role }, signature, {
    expiresIn: expiration,
  });
}

export function auth(req, res, next) {
  if (req.method == 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'Пользователь не авторизован' });
    }
    const decodedData = jwt.verify(token, process.env.SIGNATURE);
    req.user = decodedData;
    next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: 'Пользователь не авторизован' });
  }
}

export function roleAuth(role) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }

    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(403).json({ message: 'Пользователь не авторизован' });
      }
      const decodedData = jwt.verify(token, process.env.SIGNATURE);

      req.user = decodedData;
      if (req.user.role == role) {
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
