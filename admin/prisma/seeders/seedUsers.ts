import { PrismaClient } from '@prisma/client';

const DEMO_OWNER_ID = '00000000-0000-0000-0000-000000000001';
const DEMO_TENANT_ID = '00000000-0000-0000-0000-000000000010';

export async function seedUsers(prisma: PrismaClient) {
  const owner = await prisma.user.upsert({
    where: { id: DEMO_OWNER_ID },
    update: {},
    create: {
      id: DEMO_OWNER_ID,
      email: 'owner@demo.orderup.app',
      name: 'Demo Owner',
      role: 'restaurant_owner',
    },
  });

  await prisma.tenant.upsert({
    where: { id: DEMO_TENANT_ID },
    update: {},
    create: {
      id: DEMO_TENANT_ID,
      slug: 'demo-restaurant',
      name: 'Demo Restaurant',
      description: 'A demo restaurant for testing',
      ownerId: owner.id,
    },
  });

  console.log(`✅ Users seeded — owner: ${owner.email}`);
}
