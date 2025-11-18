import type { Prisma } from '@prisma/client';

export type RoundWithUsers = Prisma.RoundGetPayload<{
  include: { users: true; winnerUser: true };
}>;

export type RoundWithUsersAndUserData = Prisma.RoundGetPayload<{
  include: { users: { include: { user: true } }; winnerUser: true };
}>;

