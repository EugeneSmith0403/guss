import type { Prisma } from '@prisma/client';

export type AuthRecordWithUser = Prisma.UserAuthGetPayload<{
  include: { user: { include: { roles: true } } };
}>;

