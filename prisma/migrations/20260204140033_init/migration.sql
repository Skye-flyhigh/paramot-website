-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('DROP_OFF', 'POST');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('EMAIL', 'PHONE', 'TEXT');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('ACTIVE', 'RETIRED', 'SOLD', 'LOST');

-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('GLIDER', 'RESERVE', 'HARNESS');

-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('HOLIDAY', 'MAINTENANCE', 'TRAINING', 'EMERGENCY', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "customerId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "termsAcceptedAt" TIMESTAMP(3) NOT NULL,
    "privacyPolicyAcceptedAt" TIMESTAMP(3) NOT NULL,
    "addressId" TEXT,
    "communicationPreferencesId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "county" TEXT,
    "postcode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'United Kingdom',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Communication" (
    "id" TEXT NOT NULL,
    "marketing" BOOLEAN NOT NULL DEFAULT false,
    "email" BOOLEAN NOT NULL DEFAULT true,
    "phone" BOOLEAN NOT NULL DEFAULT false,
    "post" BOOLEAN NOT NULL DEFAULT false,
    "text" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Communication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "type" "EquipmentType" NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "manufactureDate" TIMESTAMP(3),
    "status" "EquipmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerEquipment" (
    "id" TEXT NOT NULL,
    "customerId" UUID NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "equipmentSerialNumber" TEXT NOT NULL,
    "ownedFrom" TIMESTAMP(3) NOT NULL,
    "ownedUntil" TIMESTAMP(3),
    "purchaseDate" TIMESTAMP(3),
    "purchasePrice" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRecords" (
    "id" TEXT NOT NULL,
    "bookingReference" TEXT NOT NULL,
    "customerId" UUID NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "serviceCode" TEXT NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'PENDING',
    "preferredDate" TEXT NOT NULL,
    "deliveryMethod" "DeliveryMethod" NOT NULL,
    "contactMethod" "ContactMethod" NOT NULL,
    "specialInstructions" TEXT,
    "cost" DOUBLE PRECISION NOT NULL,
    "actualServiceDate" TIMESTAMP(3),
    "assignedTo" TEXT,
    "completedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRecords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DateBlock" (
    "id" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "type" "BlockType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DateBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_customerId_key" ON "User"("customerId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_addressId_key" ON "Customer"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_communicationPreferencesId_key" ON "Customer"("communicationPreferencesId");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_serialNumber_key" ON "Equipment"("serialNumber");

-- CreateIndex
CREATE INDEX "Equipment_serialNumber_idx" ON "Equipment"("serialNumber");

-- CreateIndex
CREATE INDEX "Equipment_type_idx" ON "Equipment"("type");

-- CreateIndex
CREATE INDEX "CustomerEquipment_customerId_idx" ON "CustomerEquipment"("customerId");

-- CreateIndex
CREATE INDEX "CustomerEquipment_equipmentId_idx" ON "CustomerEquipment"("equipmentId");

-- CreateIndex
CREATE INDEX "CustomerEquipment_equipmentSerialNumber_idx" ON "CustomerEquipment"("equipmentSerialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerEquipment_customerId_equipmentId_ownedFrom_key" ON "CustomerEquipment"("customerId", "equipmentId", "ownedFrom");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceRecords_bookingReference_key" ON "ServiceRecords"("bookingReference");

-- CreateIndex
CREATE INDEX "ServiceRecords_customerId_idx" ON "ServiceRecords"("customerId");

-- CreateIndex
CREATE INDEX "ServiceRecords_equipmentId_idx" ON "ServiceRecords"("equipmentId");

-- CreateIndex
CREATE INDEX "ServiceRecords_status_idx" ON "ServiceRecords"("status");

-- CreateIndex
CREATE INDEX "ServiceRecords_preferredDate_idx" ON "ServiceRecords"("preferredDate");

-- CreateIndex
CREATE INDEX "DateBlock_startDate_endDate_idx" ON "DateBlock"("startDate", "endDate");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_communicationPreferencesId_fkey" FOREIGN KEY ("communicationPreferencesId") REFERENCES "Communication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerEquipment" ADD CONSTRAINT "CustomerEquipment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerEquipment" ADD CONSTRAINT "CustomerEquipment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRecords" ADD CONSTRAINT "ServiceRecords_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRecords" ADD CONSTRAINT "ServiceRecords_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable RLS on Customer and related tables
-- Using Prisma Accelerate-compatible approach with session variables
-- Ref: https://github.com/prisma/prisma-client-extensions/tree/main/row-level-security
-- Note: NextAuth tables (User, Account, Session, VerificationToken) do NOT need RLS
--       They are only accessed server-side by NextAuth, never by customer-scoped queries

-- Session variables used for RLS:
-- app.customer_id (set by website for customer-scoped queries)
-- app.mechanic_id (set by workbench for technician-scoped queries)


-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Customers can only see their own data
ALTER TABLE "Customer" ENABLE ROW LEVEL SECURITY;

CREATE POLICY customer_own_data ON "Customer"
  FOR ALL
  USING ("id" = current_setting('app.customer_id', true)::uuid);

-- Enable RLS on ServiceRecords
ALTER TABLE "ServiceRecords" ENABLE ROW LEVEL SECURITY;

-- Customers can see service records for their equipment
CREATE POLICY customer_service_records ON "ServiceRecords"
  FOR SELECT
  USING (
    current_setting('app.customer_id', true)::uuid IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM "CustomerEquipment" ce
      WHERE ce."equipmentId" = "ServiceRecords"."equipmentId"
        AND ce."customerId" = current_setting('app.customer_id', true)::uuid
        AND ce."ownedUntil" IS NULL
    )
  );

-- Equipment is public data (like VIN registry) - no RLS needed
-- Anyone can view equipment details and service history

-- Technicians can view all service records (workshop queue)
CREATE POLICY technician_view_all_services ON "ServiceRecords"
  FOR SELECT
  USING (current_setting('app.mechanic_id', true) IS NOT NULL);

-- Technicians can create new service records (equipment drop-off)
CREATE POLICY technician_create_services ON "ServiceRecords"
  FOR INSERT
  WITH CHECK (current_setting('app.mechanic_id', true) IS NOT NULL);

-- Technicians can update only their assigned service records
CREATE POLICY technician_update_assigned_services ON "ServiceRecords"
  FOR UPDATE
  USING (
    current_setting('app.mechanic_id', true) IS NOT NULL
    AND "assignedTo" = current_setting('app.mechanic_id', true)
  );

-- Technicians can view customer details for equipment they're servicing
CREATE POLICY technician_view_customers ON "Customer"
  FOR SELECT
  USING (
    current_setting('app.mechanic_id', true) IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM "ServiceRecords" sr
      WHERE sr."customerId" = "Customer"."id"
    )
  );

-- Enable RLS on CustomerEquipment (ownership is private GDPR data)
ALTER TABLE "CustomerEquipment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY customer_own_equipment ON "CustomerEquipment"
  FOR ALL
  USING ("customerId" = current_setting('app.customer_id', true)::uuid);

-- Technicians can view equipment ownership for servicing purposes
CREATE POLICY technician_view_equipment_ownership ON "CustomerEquipment"
  FOR SELECT
  USING (
    current_setting('app.mechanic_id', true) IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM "ServiceRecords" sr
      WHERE sr."equipmentId" = "CustomerEquipment"."equipmentId"
    )
  );

-- Enable RLS on Address (personal data)
ALTER TABLE "Address" ENABLE ROW LEVEL SECURITY;

CREATE POLICY customer_own_address ON "Address"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Customer" c
      WHERE c."addressId" = "Address"."id"
        AND c."id" = current_setting('app.customer_id', true)::uuid
    )
  );

-- Technicians can view addresses for customers they're servicing
CREATE POLICY technician_view_addresses ON "Address"
  FOR SELECT
  USING (
    current_setting('app.mechanic_id', true) IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM "Customer" c
      JOIN "ServiceRecords" sr ON sr."customerId" = c."id"
      WHERE c."addressId" = "Address"."id"
    )
  );

-- Enable RLS on Communication (personal preferences)
ALTER TABLE "Communication" ENABLE ROW LEVEL SECURITY;

CREATE POLICY customer_own_communication ON "Communication"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "Customer" c
      WHERE c."communicationPreferencesId" = "Communication"."id"
        AND c."id" = current_setting('app.customer_id', true)::uuid
    )
  );

-- Technicians can view communication preferences for customers they're servicing
CREATE POLICY technician_view_communication ON "Communication"
  FOR SELECT
  USING (
    current_setting('app.mechanic_id', true) IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM "Customer" c
      JOIN "ServiceRecords" sr ON sr."customerId" = c."id"
      WHERE c."communicationPreferencesId" = "Communication"."id"
    )
  );
