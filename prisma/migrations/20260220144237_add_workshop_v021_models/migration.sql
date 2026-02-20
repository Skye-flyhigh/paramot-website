-- AlterTable
ALTER TABLE "ServiceSession" ADD COLUMN     "brakeOffset" DOUBLE PRECISION,
ADD COLUMN     "gliderOffset" DOUBLE PRECISION,
ADD COLUMN     "initialLoopsLeft" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "initialLoopsRight" JSONB NOT NULL DEFAULT '{}';

-- CreateTable
CREATE TABLE "StrengthTest" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "lineRow" TEXT NOT NULL,
    "cascadeLevel" INTEGER NOT NULL,
    "side" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "loadApplied" DOUBLE PRECISION NOT NULL,
    "result" TEXT NOT NULL,
    "measuredStrength" DOUBLE PRECISION,
    "percentRemaining" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StrengthTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DamagedLine" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "lineCode" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DamagedLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanopyDamage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "surface" TEXT NOT NULL,
    "cellNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CanopyDamage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StrengthTest_sessionId_idx" ON "StrengthTest"("sessionId");

-- CreateIndex
CREATE INDEX "StrengthTest_sessionId_lineId_idx" ON "StrengthTest"("sessionId", "lineId");

-- CreateIndex
CREATE INDEX "DamagedLine_sessionId_idx" ON "DamagedLine"("sessionId");

-- CreateIndex
CREATE INDEX "CanopyDamage_sessionId_idx" ON "CanopyDamage"("sessionId");

-- AddForeignKey
ALTER TABLE "StrengthTest" ADD CONSTRAINT "StrengthTest_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ServiceSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DamagedLine" ADD CONSTRAINT "DamagedLine_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ServiceSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanopyDamage" ADD CONSTRAINT "CanopyDamage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ServiceSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
