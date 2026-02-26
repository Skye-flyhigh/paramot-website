import { Monitor } from 'lucide-react';

export default function ComingSoon() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
          <Monitor className="h-6 w-6 text-sky-600" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-sky-900">
          Coming soon: Your equipment dashboard
        </h2>
        <p className="mx-auto max-w-lg text-sky-700 leading-relaxed">
          Track bookings, view detailed service reports, and manage your equipment online
          — all in one place.
        </p>
      </div>
    </section>
  );
}
