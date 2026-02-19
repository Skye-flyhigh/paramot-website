-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('CREATED', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "gliderModelRefId" TEXT,
ADD COLUMN     "gliderSizeRefId" TEXT,
ADD COLUMN     "manufacturerRefId" TEXT,
ALTER COLUMN "serialNumber" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GliderModel" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "certificationClass" TEXT,
    "numLineRows" INTEGER NOT NULL DEFAULT 3,
    "measurementMethod" TEXT NOT NULL DEFAULT 'canopy_inner',
    "lineMapUrl" TEXT,
    "productPageUrl" TEXT,
    "techDocUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GliderModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GliderSize" (
    "id" TEXT NOT NULL,
    "gliderModelId" TEXT NOT NULL,
    "sizeLabel" TEXT NOT NULL,
    "minWeight" DOUBLE PRECISION NOT NULL,
    "maxWeight" DOUBLE PRECISION NOT NULL,
    "wingArea" DOUBLE PRECISION,
    "aspectRatio" DOUBLE PRECISION,
    "numLinesPerSide" INTEGER NOT NULL DEFAULT 15,
    "lineLengths" JSONB NOT NULL,
    "groupMappings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GliderSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineMaterial" (
    "id" TEXT NOT NULL,
    "gliderModelId" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "cascadeLevel" INTEGER NOT NULL,
    "lineRow" TEXT NOT NULL,
    "cascadeIndex" INTEGER NOT NULL,
    "brand" TEXT NOT NULL,
    "materialRef" TEXT NOT NULL,
    "strengthNew" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LineMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoopCorrectionTable" (
    "id" TEXT NOT NULL,
    "materialType" TEXT NOT NULL,
    "loopCount" INTEGER NOT NULL,
    "shorteningMm" DOUBLE PRECISION NOT NULL,
    "connectionType" TEXT NOT NULL,
    "maillonDiameter" DOUBLE PRECISION,
    "isApproximate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LoopCorrectionTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceSession" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "serviceRecordId" TEXT,
    "gliderSizeId" TEXT,
    "equipmentType" "EquipmentType" NOT NULL,
    "serialNumber" TEXT,
    "productionDate" TEXT,
    "serviceTypes" JSONB NOT NULL DEFAULT '[]',
    "measureMethod" TEXT NOT NULL DEFAULT 'differential',
    "technician" TEXT NOT NULL,
    "statedHours" DOUBLE PRECISION,
    "lastInspection" TIMESTAMP(3),
    "hoursSinceLast" DOUBLE PRECISION,
    "clientObservations" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'CREATED',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionVersion" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceChecklist" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisualDiagnosis" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "linesetCondition" TEXT,
    "risersCondition" TEXT,
    "canopyCondition" TEXT,
    "clothCondition" TEXT,
    "linesetNotes" TEXT,
    "risersNotes" TEXT,
    "canopyNotes" TEXT,
    "clothNotes" TEXT,
    "generalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisualDiagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClothTest" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "surface" TEXT NOT NULL,
    "panelZone" TEXT,
    "cellId" TEXT,
    "porosityValue" DOUBLE PRECISION,
    "porosityMethod" TEXT,
    "tearResistance" DOUBLE PRECISION,
    "tearResult" TEXT,
    "result" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClothTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrimMeasurement" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "lineRow" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "side" TEXT NOT NULL DEFAULT 'right',
    "phase" TEXT NOT NULL DEFAULT 'initial',
    "measuredLength" DOUBLE PRECISION NOT NULL,
    "manufacturerLength" DOUBLE PRECISION,
    "deviation" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrimMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorrectionLog" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "lineRow" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "side" TEXT NOT NULL DEFAULT 'both',
    "groupLabel" TEXT,
    "correctionType" TEXT NOT NULL,
    "loopsBefore" INTEGER,
    "loopsAfter" INTEGER,
    "loopType" INTEGER,
    "shorteningMm" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorrectionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionReport" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "airworthy" BOOLEAN NOT NULL,
    "nextControlHours" DOUBLE PRECISION,
    "nextControlMonths" INTEGER,
    "technicianOpinion" TEXT,
    "technicianSignature" TEXT,
    "signedAt" TIMESTAMP(3),
    "canopyRepaired" BOOLEAN NOT NULL DEFAULT false,
    "canopyRepairNotes" TEXT,
    "additionalJobs" TEXT,
    "reportVersion" INTEGER NOT NULL DEFAULT 1,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_name_key" ON "Manufacturer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GliderModel_manufacturerId_name_key" ON "GliderModel"("manufacturerId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "GliderSize_gliderModelId_sizeLabel_key" ON "GliderSize"("gliderModelId", "sizeLabel");

-- CreateIndex
CREATE UNIQUE INDEX "LineMaterial_gliderModelId_lineId_key" ON "LineMaterial"("gliderModelId", "lineId");

-- CreateIndex
CREATE UNIQUE INDEX "LoopCorrectionTable_materialType_loopCount_connectionType_key" ON "LoopCorrectionTable"("materialType", "loopCount", "connectionType");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceSession_serviceRecordId_key" ON "ServiceSession"("serviceRecordId");

-- CreateIndex
CREATE INDEX "ServiceSession_equipmentId_idx" ON "ServiceSession"("equipmentId");

-- CreateIndex
CREATE INDEX "ServiceSession_status_idx" ON "ServiceSession"("status");

-- CreateIndex
CREATE INDEX "ServiceSession_serialNumber_idx" ON "ServiceSession"("serialNumber");

-- CreateIndex
CREATE INDEX "ServiceSession_technician_status_idx" ON "ServiceSession"("technician", "status");

-- CreateIndex
CREATE INDEX "SessionVersion_sessionId_idx" ON "SessionVersion"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionVersion_sessionId_versionNumber_key" ON "SessionVersion"("sessionId", "versionNumber");

-- CreateIndex
CREATE INDEX "ServiceChecklist_sessionId_idx" ON "ServiceChecklist"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceChecklist_sessionId_serviceType_stepNumber_key" ON "ServiceChecklist"("sessionId", "serviceType", "stepNumber");

-- CreateIndex
CREATE UNIQUE INDEX "VisualDiagnosis_sessionId_key" ON "VisualDiagnosis"("sessionId");

-- CreateIndex
CREATE INDEX "ClothTest_sessionId_idx" ON "ClothTest"("sessionId");

-- CreateIndex
CREATE INDEX "TrimMeasurement_sessionId_idx" ON "TrimMeasurement"("sessionId");

-- CreateIndex
CREATE INDEX "TrimMeasurement_sessionId_phase_side_idx" ON "TrimMeasurement"("sessionId", "phase", "side");

-- CreateIndex
CREATE INDEX "CorrectionLog_sessionId_idx" ON "CorrectionLog"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionReport_sessionId_key" ON "SessionReport"("sessionId");

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_manufacturerRefId_fkey" FOREIGN KEY ("manufacturerRefId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_gliderModelRefId_fkey" FOREIGN KEY ("gliderModelRefId") REFERENCES "GliderModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_gliderSizeRefId_fkey" FOREIGN KEY ("gliderSizeRefId") REFERENCES "GliderSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GliderModel" ADD CONSTRAINT "GliderModel_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GliderSize" ADD CONSTRAINT "GliderSize_gliderModelId_fkey" FOREIGN KEY ("gliderModelId") REFERENCES "GliderModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineMaterial" ADD CONSTRAINT "LineMaterial_gliderModelId_fkey" FOREIGN KEY ("gliderModelId") REFERENCES "GliderModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceSession" ADD CONSTRAINT "ServiceSession_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceSession" ADD CONSTRAINT "ServiceSession_serviceRecordId_fkey" FOREIGN KEY ("serviceRecordId") REFERENCES "ServiceRecords"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceSession" ADD CONSTRAINT "ServiceSession_gliderSizeId_fkey" FOREIGN KEY ("gliderSizeId") REFERENCES "GliderSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionVersion" ADD CONSTRAINT "SessionVersion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ServiceSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceChecklist" ADD CONSTRAINT "ServiceChecklist_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ServiceSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisualDiagnosis" ADD CONSTRAINT "VisualDiagnosis_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ServiceSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClothTest" ADD CONSTRAINT "ClothTest_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ServiceSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrimMeasurement" ADD CONSTRAINT "TrimMeasurement_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ServiceSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorrectionLog" ADD CONSTRAINT "CorrectionLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ServiceSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionReport" ADD CONSTRAINT "SessionReport_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ServiceSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
