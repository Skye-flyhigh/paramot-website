'use client';

import { useCallback, useEffect, useState } from 'react';

import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { fetchMonthAvailability } from '@/lib/actions/availability';
import { getBasicAvailability, type DateAvailability } from '@/lib/workshop/availability';

interface ServiceDatePickerProps {
  name?: string;
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
  onDateSelect?: (date: string) => void;
}

export function ServiceDatePicker({
  name = 'preferredDate',
  defaultValue = '',
  disabled = false,
  error,
  onDateSelect,
}: ServiceDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : undefined,
  );
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());
  const [availabilityData, setAvailabilityData] = useState<
    Record<string, DateAvailability>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // Load availability for the displayed month
  const loadMonthAvailability = useCallback(async (date: Date) => {
    setIsLoading(true);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const data = await fetchMonthAvailability(year, month);

    setAvailabilityData((prev) => ({ ...prev, ...data }));
    setIsLoading(false);
  }, []);

  // Load initial month on mount
  useEffect(() => {
    loadMonthAvailability(displayMonth);
  }, [displayMonth, loadMonthAvailability]);

  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);

      return;
    }

    const dateStr = formatDate(date);
    const avail = availabilityData[dateStr];

    setSelectedDate(date);

    if (onDateSelect && avail?.available) {
      onDateSelect(dateStr);
    }
  };

  // Handle month navigation
  const handleMonthChange = (date: Date) => {
    setDisplayMonth(date);
  };

  // Get availability for a date (from loaded data, fallback to basic check)
  const getDateAvailability = (date: Date): DateAvailability => {
    const dateStr = formatDate(date);

    return availabilityData[dateStr] || getBasicAvailability(dateStr);
  };

  // Selected date availability (for display)
  const selectedAvailability = selectedDate ? getDateAvailability(selectedDate) : null;

  return (
    <div className="w-full" id="Service-date-picker">
      <Label htmlFor={name}>Preferred Service Date</Label>
      <div className="flex justify-around gap-2">
        <div className="mt-2 p-4 border border-sky-200 rounded-lg bg-white">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            month={displayMonth}
            onMonthChange={handleMonthChange}
            disabled={(date) => {
              if (disabled) return true;

              const avail = getDateAvailability(date);

              return !avail.available;
            }}
            modifiers={{
              available: (date) => {
                const avail = getDateAvailability(date);

                return avail.status === 'available' && avail.available;
              },
              limited: (date) => {
                const avail = getDateAvailability(date);

                return avail.status === 'limited';
              },
              full: (date) => {
                const avail = getDateAvailability(date);

                return avail.status === 'full';
              },
              blocked: (date) => {
                const avail = getDateAvailability(date);

                return avail.status === 'blocked';
              },
              closed: (date) => {
                const avail = getDateAvailability(date);

                return avail.status === 'closed';
              },
            }}
            modifiersClassNames={{
              available: 'bg-green-50 hover:bg-green-100',
              limited: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-900',
              full: 'bg-red-50 text-red-400 line-through',
              blocked: 'bg-gray-100 text-gray-400 line-through',
              closed: 'bg-gray-50 text-gray-300',
            }}
            className="rounded-md"
          />

          {/* Hidden input for FormData submission */}
          <input
            type="hidden"
            name={name}
            value={selectedDate ? formatDate(selectedDate) : ''}
          />
        </div>

        <div>
          {/* Loading indicator */}
          {isLoading && (
            <div className="mt-2 text-sm text-gray-500">Loading availability...</div>
          )}

          {/* Availability info */}
          {!isLoading && selectedAvailability && selectedDate && (
            <div className="mt-2 text-sm">
              {selectedAvailability.available ? (
                <div className="flex items-center gap-2 text-green-700">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                  <span>
                    Available - {selectedAvailability.remaining} of{' '}
                    {selectedAvailability.capacity} slots remaining
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-700">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
                  <span>{selectedAvailability.reason}</span>
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="mt-3 p-3 bg-sky-50 rounded-md text-xs space-y-1">
            <p className="font-semibold text-sky-900 mb-2">Legend:</p>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-green-50 border border-green-200 rounded" />
              <span className="text-sky-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-yellow-50 border border-yellow-200 rounded" />
              <span className="text-sky-700">Limited availability</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-red-50 border border-red-200 rounded line-through" />
              <span className="text-sky-700">Fully booked</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-gray-50 border border-gray-200 rounded" />
              <span className="text-sky-700">Closed (weekend/holiday)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
