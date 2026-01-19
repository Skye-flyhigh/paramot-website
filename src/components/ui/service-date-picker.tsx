'use client';

import { useState } from 'react';

import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  getAvailability,
  isDateSelectable,
  type DateAvailability,
} from '@/lib/workshop/availability';

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
  const [availability, setAvailability] = useState<DateAvailability | null>(null);

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
      setAvailability(null);

      return;
    }

    // Format date in local timezone (avoid UTC conversion issues)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const avail = getAvailability(dateStr);

    setSelectedDate(date);
    setAvailability(avail);

    if (onDateSelect && avail.available) {
      onDateSelect(dateStr);
    }
  };

  return (
    <div className="w-fit">
      <Label htmlFor={name}>Preferred Service Date</Label>

      <div className="mt-2 p-4 border border-sky-200 rounded-lg bg-white">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={(date) => {
            if (disabled) return true;

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            return !isDateSelectable(dateStr);
          }}
          modifiers={{
            available: (date) => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const dateStr = `${year}-${month}-${day}`;

              const avail = getAvailability(dateStr);

              return avail.status === 'available' && avail.available;
            },
            limited: (date) => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const dateStr = `${year}-${month}-${day}`;

              const avail = getAvailability(dateStr);

              return avail.status === 'limited';
            },
            full: (date) => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const dateStr = `${year}-${month}-${day}`;

              const avail = getAvailability(dateStr);

              return avail.status === 'full';
            },
            blocked: (date) => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const dateStr = `${year}-${month}-${day}`;

              const avail = getAvailability(dateStr);

              return avail.status === 'blocked';
            },
            closed: (date) => {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const dateStr = `${year}-${month}-${day}`;

              const avail = getAvailability(dateStr);

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
          value={
            selectedDate
              ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
              : ''
          }
        />
      </div>

      {/* Availability info */}
      {availability && selectedDate && (
        <div className="mt-2 text-sm">
          {availability.available ? (
            <div className="flex items-center gap-2 text-green-700">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
              <span>
                Available - {availability.remaining} of {availability.capacity} slots
                remaining
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-700">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
              <span>{availability.reason}</span>
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

      {/* Error message */}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
