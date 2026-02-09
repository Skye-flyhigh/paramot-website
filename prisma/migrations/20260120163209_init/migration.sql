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
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
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
    "customerId" TEXT NOT NULL,
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
    "customerId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "serviceCode" TEXT NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'PENDING',
    "preferredDate" TEXT NOT NULL,
    "deliveryMethod" "DeliveryMethod" NOT NULL,
    "contactMethod" "ContactMethod" NOT NULL,
    "specialInstructions" TEXT,
    "cost" DOUBLE PRECISION NOT NULL,
    "actualServiceDate" TIMESTAMP(3),
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
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_addressId_key" ON "Customer"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_communicationPreferencesId_key" ON "Customer"("communicationPreferencesId");

-- CreateIndex
CREATE INDEX "Customer_email_idx" ON "Customer"("email");

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
