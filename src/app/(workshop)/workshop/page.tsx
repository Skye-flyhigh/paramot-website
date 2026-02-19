import Link from 'next/link';
import { Plus, BookOpen } from 'lucide-react';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import {
  findActiveSessionsByTechnician,
  findPendingBookingsWithoutSession,
} from '@/lib/db/sessions';
import SessionCard from '@/components/workshop/SessionCard';

export default async function WorkshopDashboard() {
  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const [sessions, pendingBookings] = await Promise.all([
    findActiveSessionsByTechnician(auth.email),
    findPendingBookingsWithoutSession(auth.email),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">Workshop Dashboard</h2>
        <Link
          href="/workshop/session/new"
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          <Plus className="h-4 w-4" />
          New Session
        </Link>
      </div>

      {/* Active Sessions */}
      <section>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500">
          Active Sessions ({sessions.length})
        </h3>
        {sessions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
            No active sessions. Create one or start from a pending booking.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => {
              const owner = session.equipment.customerEquipment[0]?.customer;
              const customerName = owner ? `${owner.firstName} ${owner.lastName}` : null;

              return (
                <SessionCard
                  key={session.id}
                  id={session.id}
                  equipmentType={session.equipmentType}
                  manufacturer={session.equipment.manufacturer}
                  model={session.equipment.model}
                  size={session.equipment.size}
                  serialNumber={session.serialNumber}
                  customerName={customerName}
                  bookingReference={session.serviceRecord?.bookingReference ?? null}
                  status={session.status}
                  startedAt={session.startedAt}
                  counts={session._count}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Pending Bookings */}
      {pendingBookings.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500">
            Pending Bookings ({pendingBookings.length})
          </h3>
          <div className="space-y-2">
            {pendingBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3"
              >
                <div className="flex items-center gap-4">
                  <BookOpen className="h-4 w-4 text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {booking.equipment.manufacturer} {booking.equipment.model}{' '}
                      {booking.equipment.size}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {booking.customer
                        ? `${booking.customer.firstName} ${booking.customer.lastName}`
                        : 'Customer'}{' '}
                      &middot;{' '}
                      <span className="font-mono">{booking.bookingReference}</span>{' '}
                      &middot; {booking.serviceCode} &middot; Preferred:{' '}
                      {booking.preferredDate}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/workshop/session/new?bookingId=${booking.id}`}
                  className="rounded-md bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200"
                >
                  Start Session
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="flex gap-3">
        <Link
          href="/workshop/reference"
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
        >
          Reference Data
        </Link>
      </section>
    </div>
  );
}
