import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  let admin = await prisma.user.findFirst({
    where: { name: 'admin' },
  });

  if (!admin) {
    const adminPassword = await bcrypt.hash('admin', 10);
    admin = await prisma.user.create({
      data: {
        name: 'admin',
        password: adminPassword,
        createdAt: Math.floor(Date.now() / 1000),
      },
    });
  }

  const existingAdminRole = await prisma.userRole.findFirst({
    where: { userId: admin.id, role: 'admin' },
  });

  if (!existingAdminRole) {
    await prisma.userRole.create({
      data: {
        userId: admin.id,
        role: 'admin',
      },
    });
  }

  let nikita = await prisma.user.findFirst({
    where: { name: 'nikita' },
  });

  if (!nikita) {
    const nikitaPassword = await bcrypt.hash('nikita', 10);
    nikita = await prisma.user.create({
      data: {
        name: 'nikita',
        password: nikitaPassword,
        createdAt: Math.floor(Date.now() / 1000),
      },
    });
  }

  const existingNikitaRole = await prisma.userRole.findFirst({
    where: { userId: nikita.id, role: 'nikita' },
  });

  if (!existingNikitaRole) {
    await prisma.userRole.create({
      data: {
        userId: nikita.id,
        role: 'nikita',
      },
    });
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

