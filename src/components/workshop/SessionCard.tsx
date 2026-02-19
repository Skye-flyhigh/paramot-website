import Link from 'next/link';
import { Clock, Wrench } from 'lucide-react';

import type { SessionStatus, EquipmentType } from '@/generated/prisma';

interface SessionCardProps {
  id: string;
  equipmentType: EquipmentType;
  manufacturer: string;
  model: string;
  size: string;
  serialNumber: string | null;
  customerName: string | null;
  bookingReference: string | null;
  status: SessionStatus;
  startedAt: Date;
  counts: {
    checklist: number;
    clothTests: number;
    trimMeasurements: number;
    corrections: number;
  };
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

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;

  return 'just now';
}

export default function SessionCard({
  id,
  equipmentType,
  manufacturer,
  model,
  size,
  serialNumber,
  customerName,
  bookingReference,
  status,
  startedAt,
  counts,
}: SessionCardProps) {
  return (
    <Link
      href={`/workshop/session/${id}`}
      className="block rounded-lg border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-zinc-900">
            {manufacturer} {model} {size}
          </p>
          {serialNumber && (
            <p className="text-sm text-zinc-500 font-mono">{serialNumber}</p>
          )}
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[status]}`}
        >
          {statusLabels[status]}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
        {customerName && <span>{customerName}</span>}
        {bookingReference && <span className="font-mono">{bookingReference}</span>}
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {timeAgo(startedAt)}
        </span>
      </div>

      {equipmentType === 'GLIDER' && (
        <div className="mt-2 flex gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <Wrench className="h-3 w-3" />
            {counts.clothTests > 0 ? `${counts.clothTests} cloth` : 'No cloth'}
          </span>
          <span>
            {counts.trimMeasurements > 0 ? `${counts.trimMeasurements} trim` : 'No trim'}
          </span>
          <span>{counts.corrections > 0 ? `${counts.corrections} corrections` : ''}</span>
        </div>
      )}
    </Link>
  );
}
