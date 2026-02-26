'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';

export default function EquipmentSearchForm() {
  const router = useRouter();
  const [serial, setSerial] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = serial.trim();

    if (!trimmed) {
      setError('Please enter a serial number');

      return;
    }

    setLoading(true);
    setError(null);

    // Navigate directly — the equipment/[slug] page handles 404
    router.push(`/equipment/${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-400" />
          <input
            type="text"
            value={serial}
            onChange={(e) => {
              setSerial(e.target.value);
              setError(null);
            }}
            placeholder="Enter serial number (e.g. 1202XS1898)"
            className="w-full rounded-lg border border-sky-200 bg-white py-3 pl-10 pr-4 text-sky-900 placeholder:text-sky-300 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
