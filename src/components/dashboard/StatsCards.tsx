import type { ServiceRecords } from '@/lib/db';
import type { Equipment } from '@/lib/validation/equipmentSchema';

export default function StatsCards({
  upcomingServices,
  completedServices,
  equipmentList,
}: {
  upcomingServices: ServiceRecords[];
  completedServices: ServiceRecords[];
  equipmentList: Equipment[];
}) {
  return (
    <section id="stats-card">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-sky-200 p-6">
          <div className="flex items-center">
            <div className="bg-sky-100 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-sky-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-sky-900">
                {completedServices.length}
              </p>
              <p className="text-sky-600">Services Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-sky-200 p-6">
          <div className="flex items-center">
            <div className="bg-sky-100 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-sky-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-sky-900">
                {Object.keys(equipmentList).length}
              </p>
              <p className="text-sky-600">Active Equipment</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-sky-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-green-700">
                {upcomingServices.length}
              </p>
              <p className="text-sky-600">Upcoming Services</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
