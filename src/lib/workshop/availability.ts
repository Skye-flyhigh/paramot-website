import { getBookingsForDate, getDateBlocks } from '../mockData';

// Workshop configuration
export const WORKSHOP_CONFIG = {
  maxServicesPerDay: 3, // Maximum number of services per day
  workingDays: [1, 2, 3, 4, 5] as const, // Monday to Friday (0 = Sunday, 6 = Saturday)
};

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
export function getAvailability(dateString: string): DateAvailability {
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

  // 2. Check manual date blocks (holidays, maintenance, etc.)
  const dateBlocks = getDateBlocks();
  const isBlocked = dateBlocks.some(
    (block) => dateString >= block.startDate && dateString <= block.endDate,
  );

  if (isBlocked) {
    const block = dateBlocks.find(
      (b) => dateString >= b.startDate && dateString <= b.endDate,
    );

    return {
      date: dateString,
      available: false,
      status: 'blocked',
      reason: block?.reason || 'Unavailable',
      bookedCount: 0,
      capacity: WORKSHOP_CONFIG.maxServicesPerDay,
      remaining: 0,
    };
  }

  // 3. Check capacity (existing bookings)
  const bookings = getBookingsForDate(dateString);
  const bookedCount = bookings.length;
  const capacity = WORKSHOP_CONFIG.maxServicesPerDay;
  const remaining = capacity - bookedCount;

  // Determine status based on capacity
  let status: AvailabilityStatus;
  let reason: string | null = null;

  if (bookedCount >= capacity) {
    status = 'full';
    reason = 'Fully booked';
  } else if (bookedCount >= capacity * 0.7) {
    // 70% full = limited availability
    status = 'limited';
    reason = `Only ${remaining} slot${remaining > 1 ? 's' : ''} remaining`;
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
 * Get availability for a range of dates
 *
 * @param startDate - ISO date string (YYYY-MM-DD)
 * @param endDate - ISO date string (YYYY-MM-DD)
 * @returns Array of availability details for each date in range
 */
export function getAvailabilityRange(
  startDate: string,
  endDate: string,
): DateAvailability[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const availabilities: DateAvailability[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];

    availabilities.push(getAvailability(dateStr));
  }

  return availabilities;
}

/**
 * Check if a date is selectable (available and not in the past)
 *
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns True if the date can be selected for booking
 */
export function isDateSelectable(dateString: string): boolean {
  // Don't allow past dates
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  const date = new Date(dateString);

  if (date < today) {
    return false;
  }

  const availability = getAvailability(dateString);

  return availability.available;
}
