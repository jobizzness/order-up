import { PrismaClient } from '@prisma/client';

const SUPER_ADMIN_ID = 'c22771ed-468a-4400-82c0-7e2bbd67543a';
const DEMO_OWNER_ID = 'af4db38f-387d-4640-bdf7-0492bee5e5b9';
const DEMO_TENANT_ID = '00000000-0000-0000-0000-000000000010';

export async function seedUsers(prisma: PrismaClient) {
  const admin = await prisma.user.upsert({
    where: { id: SUPER_ADMIN_ID },
    update: {},
    create: {
      id: SUPER_ADMIN_ID,
      email: 'jobizzness@matarrhq.com',
      name: 'Super Admin',
      role: 'platform_admin',
    },
  });

  const owner = await prisma.user.upsert({
    where: { id: DEMO_OWNER_ID },
    update: {},
    create: {
      id: DEMO_OWNER_ID,
      email: 'restaurant@matarrhq.com',
      name: 'Demo Restaurant Owner',
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
      isApproved: true,
      approvedAt: new Date(),
    },
  });

  console.log(`✅ Users seeded — admin: ${admin.email}, owner: ${owner.email}`);
}
