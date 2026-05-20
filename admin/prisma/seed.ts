import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create settings
  await prisma.settings.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      restaurantName: 'Order Up Restaurant',
      businessHours: {
        open: '09:00',
        close: '22:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      },
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: '00000000-0000-0000-0000-000000000101' },
      update: {},
      create: { id: '00000000-0000-0000-0000-000000000101', name: 'Appetizers', sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { id: '00000000-0000-0000-0000-000000000102' },
      update: {},
      create: { id: '00000000-0000-0000-0000-000000000102', name: 'Mains', sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { id: '00000000-0000-0000-0000-000000000103' },
      update: {},
      create: { id: '00000000-0000-0000-0000-000000000103', name: 'Desserts', sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { id: '00000000-0000-0000-0000-000000000104' },
      update: {},
      create: { id: '00000000-0000-0000-0000-000000000104', name: 'Drinks', sortOrder: 4 },
    }),
  ]);

  // Create sample menu items
  await Promise.all([
    prisma.menuItem.upsert({
      where: { id: '00000000-0000-0000-0000-000000000201' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000201',
        categoryId: categories[0].id,
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with parmesan, croutons, and Caesar dressing',
        price: 12.99,
        isAvailable: true,
      },
    }),
    prisma.menuItem.upsert({
      where: { id: '00000000-0000-0000-0000-000000000202' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000202',
        categoryId: categories[0].id,
        name: 'Garlic Bread',
        description: 'Toasted baguette with garlic butter and herbs',
        price: 6.99,
        isAvailable: true,
      },
    }),
    prisma.menuItem.upsert({
      where: { id: '00000000-0000-0000-0000-000000000203' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000203',
        categoryId: categories[1].id,
        name: 'Margherita Pizza',
        description: 'Tomato sauce, fresh mozzarella, basil',
        price: 18.99,
        isAvailable: true,
      },
    }),
    prisma.menuItem.upsert({
      where: { id: '00000000-0000-0000-0000-000000000204' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000204',
        categoryId: categories[1].id,
        name: 'Grilled Salmon',
        description: 'Atlantic salmon with lemon butter sauce and seasonal vegetables',
        price: 24.99,
        isAvailable: true,
      },
    }),
    prisma.menuItem.upsert({
      where: { id: '00000000-0000-0000-0000-000000000205' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000205',
        categoryId: categories[2].id,
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
        price: 9.99,
        isAvailable: true,
      },
    }),
    prisma.menuItem.upsert({
      where: { id: '00000000-0000-0000-0000-000000000206' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000206',
        categoryId: categories[3].id,
        name: 'Iced Tea',
        description: 'Freshly brewed black tea served over ice',
        price: 3.99,
        isAvailable: true,
      },
    }),
  ]);

  console.log('✅ Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
