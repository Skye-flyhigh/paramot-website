'use server';

import {
  getAvailability,
  getAvailabilityRange,
  type DateAvailability,
} from '../workshop/availability';

/**
 * Server action to fetch date availability
 * Called from client components when user selects a date
 */
export async function fetchDateAvailability(
  dateString: string,
): Promise<DateAvailability> {
  return await getAvailability(dateString);
}

/**
 * Server action to fetch availability for a month (batch load)
 * Called when calendar opens or month changes - single DB query
 *
 * @returns Object with date strings as keys (Map doesn't serialize over server actions)
 */
export async function fetchMonthAvailability(
  year: number,
  month: number,
): Promise<Record<string, DateAvailability>> {
  // Get first and last day of month
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const availabilityMap = await getAvailabilityRange(startDate, endDate);

  // Convert Map to plain object for serialization
  return Object.fromEntries(availabilityMap);
}
