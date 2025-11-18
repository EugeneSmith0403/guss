import type { Request } from 'express';
import type { User, UserRole } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user: User & { roles: UserRole[] };
  token: string;
}

