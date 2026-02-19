/**
 * Workshop session database queries.
 * Follows existing pattern from customers.ts, equipment.ts
 */

import { prisma } from './client';
import type { SessionStatus } from '@/generated/prisma';

// =============================================================================
// READ
// =============================================================================

/**
 * Active sessions for a technician (dashboard query).
 * Includes equipment details and customer name via ownership join.
 */
export async function findActiveSessionsByTechnician(technician: string) {
  return prisma.serviceSession.findMany({
    where: {
      technician,
      status: { in: ['CREATED', 'IN_PROGRESS'] },
    },
    include: {
      equipment: {
        include: {
          customerEquipment: {
            where: { ownedUntil: null },
            include: {
              customer: {
                select: { firstName: true, lastName: true },
              },
            },
            take: 1,
          },
        },
      },
      serviceRecord: {
        select: { bookingReference: true, serviceCode: true },
      },
      gliderSize: {
        select: { sizeLabel: true },
      },
      _count: {
        select: {
          checklist: true,
          clothTests: true,
          trimMeasurements: true,
          corrections: true,
        },
      },
    },
    orderBy: { startedAt: 'desc' },
  });
}

/**
 * All sessions for the dashboard (includes completed/archived).
 */
export async function findAllSessionsByTechnician(technician: string) {
  return prisma.serviceSession.findMany({
    where: { technician },
    include: {
      equipment: {
        include: {
          customerEquipment: {
            where: { ownedUntil: null },
            include: {
              customer: {
                select: { firstName: true, lastName: true },
              },
            },
            take: 1,
          },
        },
      },
      serviceRecord: {
        select: { bookingReference: true, serviceCode: true },
      },
    },
    orderBy: { startedAt: 'desc' },
  });
}

/**
 * Session with all child data (session hub / report).
 */
export async function findSessionWithFullData(sessionId: string) {
  return prisma.serviceSession.findUnique({
    where: { id: sessionId },
    include: {
      equipment: true,
      serviceRecord: true,
      gliderSize: {
        include: {
          gliderModel: {
            include: { manufacturer: true },
          },
        },
      },
      checklist: { orderBy: { stepNumber: 'asc' } },
      diagnosis: true,
      clothTests: { orderBy: { createdAt: 'asc' } },
      trimMeasurements: {
        orderBy: [{ phase: 'asc' }, { lineRow: 'asc' }, { position: 'asc' }],
      },
      corrections: { orderBy: { createdAt: 'asc' } },
      report: true,
      versions: { orderBy: { versionNumber: 'desc' }, take: 5 },
    },
  });
}

/**
 * Lightweight session lookup (for auth checks — verify technician owns session).
 */
export async function findSessionById(sessionId: string) {
  return prisma.serviceSession.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      technician: true,
      status: true,
      equipmentType: true,
      serialNumber: true,
      equipment: {
        select: { manufacturer: true, model: true, size: true, serialNumber: true },
      },
    },
  });
}

// =============================================================================
// CREATE
// =============================================================================

interface CreateSessionInput {
  equipmentId: string;
  serviceRecordId?: string;
  gliderSizeId?: string;
  equipmentType: 'GLIDER' | 'RESERVE' | 'HARNESS';
  serialNumber?: string;
  productionDate?: string;
  serviceTypes?: string[];
  measureMethod?: string;
  technician: string;
  statedHours?: number;
  lastInspection?: Date;
  hoursSinceLast?: number;
  clientObservations?: string;
}

export async function createServiceSession(data: CreateSessionInput) {
  const session = await prisma.serviceSession.create({
    data: {
      equipmentId: data.equipmentId,
      serviceRecordId: data.serviceRecordId,
      gliderSizeId: data.gliderSizeId,
      equipmentType: data.equipmentType,
      serialNumber: data.serialNumber,
      productionDate: data.productionDate,
      serviceTypes: data.serviceTypes ?? [],
      measureMethod: data.measureMethod ?? 'differential',
      technician: data.technician,
      statedHours: data.statedHours,
      lastInspection: data.lastInspection,
      hoursSinceLast: data.hoursSinceLast,
      clientObservations: data.clientObservations,
      status: 'CREATED',
    },
  });

  // Create initial version snapshot
  await prisma.sessionVersion.create({
    data: {
      sessionId: session.id,
      versionNumber: 1,
      status: 'CREATED',
      snapshot: { event: 'session_created', timestamp: new Date().toISOString() },
    },
  });

  return session;
}

// =============================================================================
// UPDATE
// =============================================================================

/**
 * Update session status with version snapshot.
 */
export async function updateSessionStatus(sessionId: string, newStatus: SessionStatus) {
  // Get current version count
  const latestVersion = await prisma.sessionVersion.findFirst({
    where: { sessionId },
    orderBy: { versionNumber: 'desc' },
  });
  const nextVersion = (latestVersion?.versionNumber ?? 0) + 1;

  const [session] = await prisma.$transaction([
    prisma.serviceSession.update({
      where: { id: sessionId },
      data: {
        status: newStatus,
        completedAt: newStatus === 'COMPLETED' ? new Date() : undefined,
      },
    }),
    prisma.sessionVersion.create({
      data: {
        sessionId,
        versionNumber: nextVersion,
        status: newStatus,
        snapshot: {
          event: `status_changed_to_${newStatus}`,
          timestamp: new Date().toISOString(),
        },
      },
    }),
  ]);

  return session;
}

// =============================================================================
// DASHBOARD HELPERS
// =============================================================================

/**
 * Pending bookings that don't have a session yet (for "Start session" quick action).
 */
export async function findPendingBookingsWithoutSession() {
  return prisma.serviceRecords.findMany({
    where: {
      status: 'PENDING',
      serviceSession: null,
    },
    include: {
      equipment: true,
      customer: {
        select: { firstName: true, lastName: true },
      },
    },
    orderBy: { preferredDate: 'asc' },
  });
}
