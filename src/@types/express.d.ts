import { User, Role } from '@prisma/client';
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        role: Role;
      };
      file?: Multer.File & {
        firebaseUrl?: string;
      };
    }
  }
}
