import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seedUsers';

const prisma = new PrismaClient();

async function main() {
  await seedUsers(prisma);

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
