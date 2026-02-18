import calendarData from '@/data/workshop-calendar.json';
import { findBookingCountsForRange, findBookingsForDate } from '../db';

// Workshop configuration
export const WORKSHOP_CONFIG = {
  maxServicesPerDay: 3, // Maximum number of services per day
  workingDays: [1, 2, 3, 4, 5] as const, // Monday to Friday (0 = Sunday, 6 = Saturday)
};

// Type for blocked date entries from JSON
interface BlockedDate {
  start: string;
  end: string;
  reason: string;
}

/**
 * Check if a date falls within any blocked period (from JSON config)
 */
function getBlockedDateInfo(dateString: string): BlockedDate | null {
  const blocks = calendarData.blockedDates as BlockedDate[];

  return (
    blocks.find((block) => dateString >= block.start && dateString <= block.end) || null
  );
}

export type AvailabilityStatus = 'available' | 'limited' | 'full' | 'blocked' | 'closed';

export interface DateAvailability {
  date: string;
  available: boolean;
  status: AvailabilityStatus;
  reason: string | null;
  bookedCount: number;
  capacity: number;
  remaining: number;
}

/**
 * Check if a date is available for booking
 * Considers: manual blocks, capacity, and working days
 *
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Availability details for the date
 */
export async function getAvailability(dateString: string): Promise<DateAvailability> {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();

  // 1. Check if it's a working day
  if (!(WORKSHOP_CONFIG.workingDays as readonly number[]).includes(dayOfWeek)) {
    return {
      date: dateString,
      available: false,
      status: 'closed',
      reason: 'Workshop closed (weekend)',
      bookedCount: 0,
      capacity: WORKSHOP_CONFIG.maxServicesPerDay,
      remaining: 0,
    };
  }

  // 2. Check blocked dates (holidays, trips - from JSON config)
  const blockedDate = getBlockedDateInfo(dateString);

  if (blockedDate) {
    return {
      date: dateString,
      available: false,
      status: 'blocked',
      reason: blockedDate.reason,
      bookedCount: 0,
      capacity: WORKSHOP_CONFIG.maxServicesPerDay,
      remaining: 0,
    };
  }

  // 3. Check capacity (existing bookings)
  const bookings = await findBookingsForDate(dateString);
  const bookedCount = bookings.length;
  const capacity = WORKSHOP_CONFIG.maxServicesPerDay;
  const remaining = capacity - bookedCount;

  // Determine status based on capacity
  let status: AvailabilityStatus;
  let reason: string | null = null;

  if (remaining <= 0) {
    status = 'full';
    reason = 'Fully booked';
  } else if (remaining === 1) {
    status = 'limited';
    reason = 'Only 1 slot remaining';
  } else {
    status = 'available';
  }

  return {
    date: dateString,
    available: remaining > 0,
    status,
    reason,
    bookedCount,
    capacity,
    remaining,
  };
}

/**
 * Get availability for a range of dates (batch query - single DB call)
 *
 * @param startDate - ISO date string (YYYY-MM-DD)
 * @param endDate - ISO date string (YYYY-MM-DD)
 * @returns Map of date string -> DateAvailability
 */
export async function getAvailabilityRange(
  startDate: string,
  endDate: string,
): Promise<Map<string, DateAvailability>> {
  // Single DB query for all booking counts in range
  const bookingCounts = await findBookingCountsForRange(startDate, endDate);

  const availabilityMap = new Map<string, DateAvailability>();
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const dayOfWeek = d.getDay();

    // Past dates
    if (d < today) {
      availabilityMap.set(dateStr, {
        date: dateStr,
        available: false,
        status: 'blocked',
        reason: 'Past date',
        bookedCount: 0,
        capacity: WORKSHOP_CONFIG.maxServicesPerDay,
        remaining: 0,
      });
      continue;
    }

    // Weekend check
    if (!(WORKSHOP_CONFIG.workingDays as readonly number[]).includes(dayOfWeek)) {
      availabilityMap.set(dateStr, {
        date: dateStr,
        available: false,
        status: 'closed',
        reason: 'Workshop closed (weekend)',
        bookedCount: 0,
        capacity: WORKSHOP_CONFIG.maxServicesPerDay,
        remaining: 0,
      });
      continue;
    }

    // Blocked dates (from JSON)
    const blockedDate = getBlockedDateInfo(dateStr);

    if (blockedDate) {
      availabilityMap.set(dateStr, {
        date: dateStr,
        available: false,
        status: 'blocked',
        reason: blockedDate.reason,
        bookedCount: 0,
        capacity: WORKSHOP_CONFIG.maxServicesPerDay,
        remaining: 0,
      });
      continue;
    }

    // Check capacity from batch query
    const bookedCount = bookingCounts.get(dateStr) || 0;
    const capacity = WORKSHOP_CONFIG.maxServicesPerDay;
    const remaining = capacity - bookedCount;

    let status: AvailabilityStatus;
    let reason: string | null = null;

    if (remaining <= 0) {
      status = 'full';
      reason = 'Fully booked';
    } else if (remaining === 1) {
      status = 'limited';
      reason = 'Only 1 slot remaining';
    } else {
      status = 'available';
    }

    availabilityMap.set(dateStr, {
      date: dateStr,
      available: remaining > 0,
      status,
      reason,
      bookedCount,
      capacity,
      remaining,
    });
  }

  return availabilityMap;
}

/**
 * Check if a date is selectable (available and not in the past)
 *
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns True if the date can be selected for booking
 */
export async function isDateSelectable(dateString: string): Promise<boolean> {
  // Don't allow past dates
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  const date = new Date(dateString);

  if (date < today) {
    return false;
  }

  const availability = await getAvailability(dateString);

  return availability.available;
}

/**
 * Synchronous availability check for calendar modifiers
 * Only checks basic rules (weekends, past dates), not database capacity
 * Use getAvailability() for full check when a date is selected
 */
export function getBasicAvailability(dateString: string): DateAvailability {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  // Past dates
  if (date < today) {
    return {
      date: dateString,
      available: false,
      status: 'blocked',
      reason: 'Past date',
      bookedCount: 0,
      capacity: WORKSHOP_CONFIG.maxServicesPerDay,
      remaining: 0,
    };
  }

  // Weekend check
  if (!(WORKSHOP_CONFIG.workingDays as readonly number[]).includes(dayOfWeek)) {
    return {
      date: dateString,
      available: false,
      status: 'closed',
      reason: 'Workshop closed (weekend)',
      bookedCount: 0,
      capacity: WORKSHOP_CONFIG.maxServicesPerDay,
      remaining: 0,
    };
  }

  // Blocked dates check (holidays, trips - from JSON)
  const blockedDate = getBlockedDateInfo(dateString);

  if (blockedDate) {
    return {
      date: dateString,
      available: false,
      status: 'blocked',
      reason: blockedDate.reason,
      bookedCount: 0,
      capacity: WORKSHOP_CONFIG.maxServicesPerDay,
      remaining: 0,
    };
  }

  // Default to available (actual capacity checked async when selected)
  return {
    date: dateString,
    available: true,
    status: 'available',
    reason: null,
    bookedCount: 0,
    capacity: WORKSHOP_CONFIG.maxServicesPerDay,
    remaining: WORKSHOP_CONFIG.maxServicesPerDay,
  };
}
