/**
 * Test script for RLS Prisma extensions
 * Run with: npx tsx src/scripts/test-prisma-extensions.ts
 */

import { createCustomerFromOnboarding } from '@/lib/db';
import { prisma } from '@/lib/db/client';
import { createCustomerClient } from '@/lib/db/rls';
import { generateUserId } from '@/lib/helper/id-generator';
import console from 'console';

const customers = {
  alice: {
    email: 'alice@brown.com',
    firstName: 'Alice',
    lastName: 'Brown',
    id: generateUserId(),
    privacyPolicyAcceptedAt: new Date(),
    termsAcceptedAt: new Date(),
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  john: {
    email: 'john@doe.com',
    firstName: 'john',
    lastName: 'doe',
    id: generateUserId(),
    privacyPolicyAcceptedAt: new Date(),
    termsAcceptedAt: new Date(),
    updatedAt: new Date(),
    createdAt: new Date(),
  },
};

async function testRLS() {
  if (!prisma) return console.error("❌ Prisma isn't init properly");

  console.log('🧪 Testing RLS Prisma Extensions...\n');
  const { count } = await prisma.user.deleteMany({
    where: { email: { in: [customers.alice.email, customers.john.email] } },
  });

  const customerCount = await prisma.customer.deleteMany({
    where: { firstName: { in: [customers.alice.firstName, customers.john.firstName] } },
  });

  console.log(`♻️ Cleaned up ${count} users and ${customerCount}`);

  try {
    // Step 1: Create two test customers
    console.log('1️⃣ Creating test customers...');
    const user1 = await prisma.user.create({
      data: {
        email: customers.alice.email,
      },
    });

    const customer1 = await createCustomerFromOnboarding(user1.id, {
      firstName: customers.alice.firstName,
      lastName: customers.alice.lastName,
      termsAcceptedAt: new Date(),
      privacyPolicyAcceptedAt: new Date(),
    });

    console.log(`   ✅ Created Customer 1: ${customer1.firstName} (ID: ${customer1.id})`);

    const user2 = await prisma.user.create({
      data: {
        email: customers.john.email,
      },
    });
    const customer2 = await createCustomerFromOnboarding(user2.id, customers.john);

    console.log(
      `   ✅ Created Customer 2: ${customer2.firstName} (ID: ${customer2.id})\n`,
    );

    // Step 2: Test RLS with Customer 1's scope
    console.log('2️⃣ Testing RLS with Customer 1 scope...');
    const customer1Db = createCustomerClient(customer1.id);
    const customer1Results = await customer1Db.customer.findMany({
      select: { id: true, firstName: true, lastName: true },
    });

    console.log(`   📊 Query result count: ${customer1Results.length}`);
    console.log(`   📋 Results:`, JSON.stringify(customer1Results, null, 2));

    if (customer1Results.length === 1 && customer1Results[0].id === customer1.id) {
      console.log("   ✅ RLS working! Only Customer 1's data returned.\n");
    } else {
      console.log("   ❌ RLS FAILED! Expected 1 result with Customer 1's ID.\n");
    }

    // Step 3: Test RLS with Customer 2's scope
    console.log('3️⃣ Testing RLS with Customer 2 scope...');
    const customer2Db = createCustomerClient(customer2.id);
    const customer2Results = await customer2Db.customer.findMany({
      select: { id: true, firstName: true, lastName: true },
    });

    console.log(`   📊 Query result count: ${customer2Results.length}`);
    console.log(`   📋 Results:`, JSON.stringify(customer2Results, null, 2));

    if (customer2Results.length === 1 && customer2Results[0].id === customer2.id) {
      console.log("   ✅ RLS working! Only Customer 2's data returned.\n");
    } else {
      console.log("   ❌ RLS FAILED! Expected 1 result with Customer 2's ID.\n");
    }

    // Step 4: Test without RLS (regular Prisma client)
    console.log('4️⃣ Testing without RLS (regular Prisma client)...');
    const allCustomers = await prisma.customer.findMany({
      select: { id: true, firstName: true, lastName: true },
    });

    console.log(`   📊 Query result count: ${allCustomers.length}`);
    console.log(`   📋 Results:`, JSON.stringify(allCustomers, null, 2));
    console.log('   ℹ️  Without RLS, all customers are visible.\n');

    // Cleanup
    console.log('5️⃣ Cleaning up test data...');
    await prisma.customer.deleteMany({
      where: {
        id: { in: [customer1.id, customer2.id] },
      },
    });
    console.log('   ✅ Test customers deleted.\n');

    console.log('🎉 RLS Extension Test Complete!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testRLS();
