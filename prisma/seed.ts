import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import { seedReferenceData } from './seed-reference';

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL!,
});

const SKYE_CUSTOMER_ID = 'a18ee823-d4cc-44dc-b554-6f6c7a36427b';

async function main() {
  console.log('🌱 Seeding database...');

  // Create Equipment (no RLS on public registry)
  const glider = await prisma.equipment.upsert({
    where: { serialNumber: 'ADV-SIGMA11-2023-4521' },
    update: {},
    create: {
      serialNumber: 'ADV-SIGMA11-2023-4521',
      type: 'GLIDER',
      manufacturer: 'Advance',
      model: 'Sigma 11',
      size: 'M',
      manufactureDate: new Date('2023-03-15'),
      status: 'ACTIVE',
    },
  });
  console.log('✅ Created glider:', glider.serialNumber);

  const reserve = await prisma.equipment.upsert({
    where: { serialNumber: 'SUP-ACRO-2022-8834' },
    update: {},
    create: {
      serialNumber: 'SUP-ACRO-2022-8834',
      type: 'RESERVE',
      manufacturer: 'Supair',
      model: 'Acro 3',
      size: '120',
      manufactureDate: new Date('2022-06-01'),
      status: 'ACTIVE',
    },
  });
  console.log('✅ Created reserve:', reserve.serialNumber);

  const harness = await prisma.equipment.upsert({
    where: { serialNumber: 'KOR-KOLIBRI-2023-1199' },
    update: {},
    create: {
      serialNumber: 'KOR-KOLIBRI-2023-1199',
      type: 'HARNESS',
      manufacturer: 'Kortel',
      model: 'Kolibri',
      size: 'M',
      manufactureDate: new Date('2023-01-20'),
      status: 'ACTIVE',
    },
  });
  console.log('✅ Created harness:', harness.serialNumber);

  // Customer-dependent seeding (ownership + service records)
  // Set customer context so RLS allows the SELECT on Customer table
  await prisma.$executeRaw`
    SELECT set_config('app.customer_id', ${SKYE_CUSTOMER_ID}::text, FALSE)
  `;
  const customerExists = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*) as count FROM "Customer" WHERE "id" = ${SKYE_CUSTOMER_ID}::uuid
  `;

  if (customerExists[0].count > 0n) {
    // For RLS-protected tables, use raw SQL transaction to set context
    await prisma.$executeRaw`
      SELECT set_config('app.customer_id', ${SKYE_CUSTOMER_ID}::text, FALSE)
    `;

    // Link equipment to customer
    for (const eq of [glider, reserve, harness]) {
      const ownershipCount = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM "CustomerEquipment"
        WHERE "customerId" = ${SKYE_CUSTOMER_ID}::uuid AND "equipmentId" = ${eq.id}
      `;
      if (ownershipCount[0].count === 0n) {
        await prisma.$executeRaw`
          INSERT INTO "CustomerEquipment"
            ("id", "customerId", "equipmentId", "equipmentSerialNumber", "ownedFrom", "purchaseDate", "createdAt", "updatedAt")
          VALUES
            (gen_random_uuid(), ${SKYE_CUSTOMER_ID}::uuid, ${eq.id}, ${eq.serialNumber}, NOW(), NOW(), NOW(), NOW())
        `;
      }
    }
    console.log('✅ Linked equipment to customer');
  } else {
    console.log(
      '⏭️  Customer not found — skipping ownership links (sign in first, then re-seed)',
    );
  }

  // Service Records (require customer to exist for FK)
  if (customerExists[0].count === 0n) {
    console.log('⏭️  Skipping service records (no customer)');
  }

  const serviceData = [
    {
      ref: 'SVC-001-150124-A1B2',
      equipmentId: glider.id,
      code: 'SVC-001',
      status: 'COMPLETED',
      prefDate: '2024-01-20',
      delivery: 'DROP_OFF',
      contact: 'EMAIL',
      instructions: 'Annual check before season',
      cost: 120.0,
      actualDate: '2024-01-22',
      completedBy: 'paraMOT',
      notes: 'All lines checked, no issues found',
    },
    {
      ref: 'PACK-001-100623-C3D4',
      equipmentId: reserve.id,
      code: 'PACK-001',
      status: 'COMPLETED',
      prefDate: '2023-06-15',
      delivery: 'DROP_OFF',
      contact: 'TEXT',
      instructions: null,
      cost: 45.0,
      actualDate: '2023-06-16',
      completedBy: 'paraMOT',
      notes: 'Reserve repacked, deployment system inspected',
    },
    {
      ref: 'SVC-002-050225-E5F6',
      equipmentId: glider.id,
      code: 'SVC-002',
      status: 'IN_PROGRESS',
      prefDate: '2025-02-10',
      delivery: 'POST',
      contact: 'EMAIL',
      instructions: 'Full porosity test requested',
      cost: 180.0,
      actualDate: null,
      completedBy: null,
      notes: null,
    },
    {
      ref: 'PACK-001-200225-G7H8',
      equipmentId: reserve.id,
      code: 'PACK-001',
      status: 'PENDING',
      prefDate: '2025-02-20',
      delivery: 'DROP_OFF',
      contact: 'PHONE',
      instructions: null,
      cost: 45.0,
      actualDate: null,
      completedBy: null,
      notes: 'Annual repack due',
    },
  ];

  // Use mechanic context for service records (technicians create all service states)
  if (customerExists[0].count > 0n) {
    for (const s of serviceData) {
      const existingCount = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM "ServiceRecords" WHERE "bookingReference" = ${s.ref}
      `;
      if (existingCount[0].count === 0n) {
        await prisma.$executeRaw`
          WITH set_context AS (
            SELECT set_config('app.mechanic_id', 'seed-script', TRUE)
          )
          INSERT INTO "ServiceRecords"
            ("id", "bookingReference", "customerId", "equipmentId", "serviceCode", "status",
             "preferredDate", "deliveryMethod", "contactMethod", "specialInstructions",
             "cost", "actualServiceDate", "completedBy", "notes", "createdAt", "updatedAt")
          SELECT
            gen_random_uuid(), ${s.ref}, ${SKYE_CUSTOMER_ID}::uuid, ${s.equipmentId}, ${s.code},
            ${s.status}::"ServiceStatus", ${s.prefDate}, ${s.delivery}::"DeliveryMethod", ${s.contact}::"ContactMethod",
            ${s.instructions}, ${s.cost}, ${s.actualDate}::timestamp, ${s.completedBy}, ${s.notes}, NOW(), NOW()
          FROM set_context
        `;
      }
      console.log(`✅ Created service: ${s.ref}`);
    }
  }

  // =========================================
  // Workshop Reference Data (from ACT parser)
  // =========================================
  await seedReferenceData(prisma);

  console.log('\n🎉 Seed completed!');
  console.log(`   Equipment: 3 items`);
  if (customerExists[0].count > 0n) {
    console.log(`   Ownership links: 3 records`);
    console.log(`   Service records: 4 bookings (2 completed, 1 in progress, 1 pending)`);
  } else {
    console.log(`   Ownership links: SKIPPED (no customer — sign in first)`);
    console.log(`   Service records: SKIPPED (no customer)`);
  }
  console.log(`   Reference data: see above for ACT-derived models`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
