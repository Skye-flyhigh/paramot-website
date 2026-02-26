/**
 * Workshop reference data queries.
 * Manufacturer specs from ACT parser — read-only.
 */

import { prisma } from './client';

// =============================================================================
// MANUFACTURERS
// =============================================================================

export async function findAllManufacturers() {
  return prisma.manufacturer.findMany({
    include: {
      _count: { select: { models: true } },
    },
    orderBy: { name: 'asc' },
  });
}

export async function findManufacturerById(id: string) {
  return prisma.manufacturer.findUnique({
    where: { id },
    include: {
      models: {
        include: {
          _count: { select: { sizes: true } },
        },
        orderBy: { name: 'asc' },
      },
    },
  });
}

// =============================================================================
// MODELS
// =============================================================================

export async function findModelsByManufacturer(manufacturerId: string) {
  return prisma.gliderModel.findMany({
    where: { manufacturerId },
    include: {
      manufacturer: { select: { name: true } },
      _count: { select: { sizes: true } },
    },
    orderBy: { name: 'asc' },
  });
}

export async function findModelById(modelId: string) {
  return prisma.gliderModel.findUnique({
    where: { id: modelId },
    include: {
      manufacturer: true,
      sizes: { orderBy: { minWeight: 'asc' } },
      lineMaterials: { orderBy: [{ lineRow: 'asc' }, { cascadeLevel: 'asc' }] },
    },
  });
}

// =============================================================================
// SIZES
// =============================================================================

export async function findSizesByModel(modelId: string) {
  return prisma.gliderSize.findMany({
    where: { gliderModelId: modelId },
    orderBy: { minWeight: 'asc' },
  });
}

export async function findSizeById(sizeId: string) {
  return prisma.gliderSize.findUnique({
    where: { id: sizeId },
    include: {
      gliderModel: {
        include: {
          manufacturer: true,
          lineMaterials: { orderBy: [{ lineRow: 'asc' }, { cascadeLevel: 'asc' }] },
        },
      },
    },
  });
}

/**
 * Find a glider size by manufacturer name, model name, and size label.
 * Used during session creation to auto-link reference data.
 */
export async function findGliderSizeBySpec(
  manufacturerName: string,
  modelName: string,
  sizeLabel: string,
) {
  return prisma.gliderSize.findFirst({
    where: {
      sizeLabel,
      gliderModel: {
        name: modelName,
        manufacturer: { name: manufacturerName },
      },
    },
    include: {
      gliderModel: {
        include: { manufacturer: true },
      },
    },
  });
}

// =============================================================================
// LOOP CORRECTIONS
// =============================================================================

export async function findLoopCorrections(materialType?: string) {
  return prisma.loopCorrectionTable.findMany({
    where: materialType ? { materialType } : undefined,
    orderBy: [{ materialType: 'asc' }, { loopCount: 'asc' }],
  });
}

export async function findLoopCorrectionBySpec(
  materialType: string,
  loopCount: number,
  connectionType: string,
) {
  return prisma.loopCorrectionTable.findUnique({
    where: {
      materialType_loopCount_connectionType: {
        materialType,
        loopCount,
        connectionType,
      },
    },
  });
}
