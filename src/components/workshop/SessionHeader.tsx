import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import type { SessionStatus, EquipmentType } from '@/generated/prisma';

interface SessionHeaderProps {
  sessionId: string;
  equipmentType: EquipmentType;
  manufacturer: string;
  model: string;
  size: string;
  serialNumber: string | null;
  customerName: string | null;
  bookingReference: string | null;
  status: SessionStatus;
}

const statusColors: Record<SessionStatus, string> = {
  CREATED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-green-100 text-green-700',
  ARCHIVED: 'bg-zinc-100 text-zinc-500',
};

const statusLabels: Record<SessionStatus, string> = {
  CREATED: 'New',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
};

const typeLabels: Record<EquipmentType, string> = {
  GLIDER: 'Glider',
  RESERVE: 'Reserve',
  HARNESS: 'Harness',
};

export default function SessionHeader({
  equipmentType,
  manufacturer,
  model,
  size,
  serialNumber,
  customerName,
  bookingReference,
  status,
}: SessionHeaderProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-center gap-3 mb-3">
        <Link
          href="/workshop"
          className="text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          {typeLabels[equipmentType]}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[status]}`}
        >
          {statusLabels[status]}
        </span>
      </div>

      <h2 className="text-lg font-semibold text-zinc-900">
        {manufacturer} {model} {size}
      </h2>

      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
        {serialNumber && <span className="font-mono">{serialNumber}</span>}
        {customerName && <span>{customerName}</span>}
        {bookingReference && (
          <span className="font-mono text-xs">{bookingReference}</span>
        )}
      </div>
    </div>
  );
}
