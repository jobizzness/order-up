import { PrismaClient, SubscriptionTier } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Multi-Tenant SaaS Seeder
 * 
 * Usage:
 *   npx ts-node shared/prisma/seed.ts              # Seed everything
 *   npx ts-node shared/prisma/seed.ts --tenant     # Seed only demo tenants
 *   npx ts-node shared/prisma/seed.ts --platform   # Seed only platform admin
 */

async function seedDemoTenants() {
  console.log('🌱 Seeding demo tenants...\n');

  // Demo Tenant 1: Bella Vista (Starter tier)
  const bellaVista = await prisma.tenant.upsert({
    where: { slug: 'bella-vista' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111111',
      slug: 'bella-vista',
      name: 'Bella Vista Trattoria',
      description: 'Authentic Italian dining with handmade pasta and wood-fired pizzas',
      address: '123 Main St, Downtown',
      phone: '+1-555-0123',
      email: 'hello@bellavista.example',
      cuisine: 'Italian',
      timezone: 'America/New_York',
      tier: SubscriptionTier.starter,
      maxTables: 25,
      maxStaff: 10,
      qrMenuEnabled: true,
      settings: {
        create: {
          bookingWindowDays: 30,
          defaultSlotMinutes: 90,
          minPartySize: 1,
          maxPartySize: 12,
          operatingHours: {
            monday: { open: '11:00', close: '22:00' },
            tuesday: { open: '11:00', close: '22:00' },
            wednesday: { open: '11:00', close: '22:00' },
            thursday: { open: '11:00', close: '22:00' },
            friday: { open: '11:00', close: '23:00' },
            saturday: { open: '10:00', close: '23:00' },
            sunday: { open: '10:00', close: '21:00' },
          },
          reminderHours: [24, 2],
          primaryColor: '#E63946',
        },
      },
    },
  });

  // Seed tables for Bella Vista
  const bellaTables = [
    { number: 'A1', capacity: 2, section: 'Main Dining', positionX: 100, positionY: 100 },
    { number: 'A2', capacity: 2, section: 'Main Dining', positionX: 200, positionY: 100 },
    { number: 'A3', capacity: 4, section: 'Main Dining', positionX: 300, positionY: 100 },
    { number: 'A4', capacity: 4, section: 'Main Dining', positionX: 400, positionY: 100 },
    { number: 'A5', capacity: 6, section: 'Main Dining', positionX: 500, positionY: 100 },
    { number: 'B1', capacity: 2, section: 'Window', positionX: 100, positionY: 200 },
    { number: 'B2', capacity: 2, section: 'Window', positionX: 200, positionY: 200 },
    { number: 'B3', capacity: 4, section: 'Window', positionX: 300, positionY: 200 },
    { number: 'P1', capacity: 4, section: 'Patio', positionX: 100, positionY: 300 },
    { number: 'P2', capacity: 4, section: 'Patio', positionX: 200, positionY: 300 },
    { number: 'P3', capacity: 6, section: 'Patio', positionX: 300, positionY: 300 },
    { number: 'C1', capacity: 8, section: 'Private', positionX: 100, positionY: 400 },
    { number: 'C2', capacity: 10, section: 'Private', positionX: 200, positionY: 400 },
    { number: 'Bar1', capacity: 2, section: 'Bar', positionX: 100, positionY: 500 },
    { number: 'Bar2', capacity: 2, section: 'Bar', positionX: 200, positionY: 500 },
  ];

  for (const table of bellaTables) {
    await prisma.table.upsert({
      where: { id: `${bellaVista.id}-${table.number}` },
      update: {},
      create: {
        ...table,
        tenantId: bellaVista.id,
        status: 'available',
      },
    });
  }

  // Seed menu categories
  const categories = ['Antipasti', 'Primi Piatti', 'Secondi', 'Pizza', 'Dolci', 'Bevande'];
  for (let i = 0; i < categories.length; i++) {
    await prisma.menuCategory.upsert({
      where: { id: `${bellaVista.id}-cat-${i}` },
      update: {},
      create: {
        id: `${bellaVista.id}-cat-${i}`,
        tenantId: bellaVista.id,
        name: categories[i],
        sortOrder: i,
      },
    });
  }

  console.log(`✅ Bella Vista: ${bellaTables.length} tables, ${categories.length} menu categories`);

  // Demo Tenant 2: Sakura Sushi (Free tier)
  const sakura = await prisma.tenant.upsert({
    where: { slug: 'sakura-sushi' },
    update: {},
    create: {
      id: '22222222-2222-2222-2222-222222222222',
      slug: 'sakura-sushi',
      name: 'Sakura Sushi Bar',
      description: 'Fresh sushi and sashimi daily',
      address: '456 Oak Ave, Westside',
      phone: '+1-555-0456',
      email: 'info@sakura.example',
      cuisine: 'Japanese',
      timezone: 'America/Los_Angeles',
      tier: SubscriptionTier.free,
      maxTables: 10,
      maxStaff: 3,
      qrMenuEnabled: false,
      settings: {
        create: {
          bookingWindowDays: 14,
          defaultSlotMinutes: 60,
          minPartySize: 1,
          maxPartySize: 8,
          operatingHours: {
            monday: { open: '17:00', close: '22:00' },
            tuesday: { open: '17:00', close: '22:00' },
            wednesday: { open: '17:00', close: '22:00' },
            thursday: { open: '17:00', close: '22:00' },
            friday: { open: '17:00', close: '23:00' },
            saturday: { open: '12:00', close: '23:00' },
            sunday: { open: '12:00', close: '21:00' },
          },
          reminderHours: [24],
          primaryColor: '#2A9D8F',
        },
      },
    },
  });

  // Seed 8 tables for Sakura (free tier limit)
  const sakuraTables = [
    { number: 'S1', capacity: 2, section: 'Sushi Bar', positionX: 100, positionY: 100 },
    { number: 'S2', capacity: 2, section: 'Sushi Bar', positionX: 150, positionY: 100 },
    { number: 'S3', capacity: 2, section: 'Sushi Bar', positionX: 200, positionY: 100 },
    { number: 'T1', capacity: 4, section: 'Table', positionX: 100, positionY: 200 },
    { number: 'T2', capacity: 4, section: 'Table', positionX: 200, positionY: 200 },
    { number: 'T3', capacity: 4, section: 'Table', positionX: 300, positionY: 200 },
    { number: 'P1', capacity: 2, section: 'Private', positionX: 100, positionY: 300 },
    { number: 'P2', capacity: 6, section: 'Private', positionX: 200, positionY: 300 },
  ];

  for (const table of sakuraTables) {
    await prisma.table.upsert({
      where: { id: `${sakura.id}-${table.number}` },
      update: {},
      create: {
        ...table,
        tenantId: sakura.id,
        status: 'available',
      },
    });
  }

  console.log(`✅ Sakura Sushi: ${sakuraTables.length} tables (free tier)`);

  return { bellaVista, sakura };
}

async function seedSampleReservations() {
  console.log('\n📅 Creating sample reservations...');

  const bellaVistaId = '11111111-1111-1111-1111-111111111111';
  const today = new Date();

  // Sample customers
  const customers = [
    { name: 'John Smith', phone: '+1-555-1111', email: 'john@example.com' },
    { name: 'Sarah Johnson', phone: '+1-555-2222', email: 'sarah@example.com' },
    { name: 'Mike Chen', phone: '+1-555-3333', email: 'mike@example.com' },
  ];

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { id: `${bellaVistaId}-${customer.phone}` },
      update: {},
      create: {
        id: `${bellaVistaId}-${customer.phone}`,
        tenantId: bellaVistaId,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        points: Math.floor(Math.random() * 500),
        visits: Math.floor(Math.random() * 10) + 1,
      },
    });
  }

  // Sample reservations for today
  const reservations = [
    { guestName: 'John Smith', phone: '+1-555-1111', partySize: 4, time: '18:00', status: 'confirmed' },
    { guestName: 'Sarah Johnson', phone: '+1-555-2222', partySize: 2, time: '19:30', status: 'pending' },
    { guestName: 'Corporate Dinner', phone: '+1-555-4444', partySize: 8, time: '20:00', status: 'confirmed' },
  ];

  for (const res of reservations) {
    await prisma.reservation.create({
      data: {
        tenantId: bellaVistaId,
        guestName: res.guestName,
        guestPhone: res.phone,
        partySize: res.partySize,
        date: today,
        time: res.time,
        status: res.status as any,
        source: 'web',
      },
    });
  }

  console.log(`✅ Created ${reservations.length} sample reservations`);
}

async function main() {
  const args = process.argv.slice(2);
  const seedTenant = args.includes('--tenant') || args.length === 0;
  const seedPlatform = args.includes('--platform') || args.length === 0;
  const seedReservations = args.includes('--with-data') || args.length === 0;

  try {
    if (seedTenant) {
      await seedDemoTenants();
    }

    if (seedReservations) {
      await seedSampleReservations();
    }

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\nDemo tenants:');
    console.log('  - Bella Vista (Starter tier): 15 tables, QR menu enabled');
    console.log('  - Sakura Sushi (Free tier): 8 tables, QR menu disabled');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
