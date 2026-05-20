import { loadEnvFile } from 'process';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { seedUsers } from './seedUsers';

try { loadEnvFile('.env.local'); } catch { /* optional */ }
try { loadEnvFile('.env'); } catch { /* optional */ }

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

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
