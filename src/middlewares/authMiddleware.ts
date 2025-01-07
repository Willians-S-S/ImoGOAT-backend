import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { UserRepository } from '../repositories/UserRepository';

const jwt_pass = process.env.JWT_PASS as string;
const userRepository = new UserRepository();

type JwtPayload = {
  id: number;
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const token = authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, jwt_pass) as JwtPayload;

    const user = await userRepository.findById(decodedToken.id);

    if (!user) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const { password: _, ...loggedUser } = user;

    req.user = loggedUser;
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    return res.status(401).json({ message: 'Não autorizado' });
  }
};
