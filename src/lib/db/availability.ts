import { prisma } from './client';

/**
 * Get all date blocks (manual unavailability set by admin)
 */
export async function findAllDateBlocks() {
  return prisma.dateBlock.findMany({
    orderBy: {
      startDate: 'asc',
    },
  });
}

/**
 * Get date blocks for a specific date
 */
export async function findDateBlocksForDate(date: string) {
  return prisma.dateBlock.findMany({
    where: {
      AND: [{ startDate: { lte: date } }, { endDate: { gte: date } }],
    },
  });
}

/**
 * Create a new date block (admin only)
 */
export async function createDateBlock(data: {
  startDate: string;
  endDate: string;
  reason: string;
  type: 'HOLIDAY' | 'MAINTENANCE' | 'TRAINING' | 'EMERGENCY' | 'OTHER';
}) {
  return prisma.dateBlock.create({
    data,
  });
}

/**
 * Delete a date block (admin only)
 */
export async function deleteDateBlock(id: string) {
  return prisma.dateBlock.delete({
    where: { id },
  });
}
