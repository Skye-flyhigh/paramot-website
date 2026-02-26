'use client';

import { useActionState, useState } from 'react';
import { Search, AlertCircle, PenLine } from 'lucide-react';

import { submitSessionCreate } from '@/lib/submit/submitSession';
import {
  SERVICE_TYPES,
  SERVICE_TYPE_LABELS,
  MEASURE_METHODS,
  type SessionCreateFormState,
} from '@/lib/validation/sessionSchema';
import { searchEquipmentAction } from '@/lib/submit/searchEquipment';

interface Equipment {
  id: string;
  serialNumber: string | null;
  type: 'GLIDER' | 'RESERVE' | 'HARNESS';
  manufacturer: string;
  model: string;
  size: string;
}

interface SessionCreateFormProps {
  bookingId?: string;
  prefillEquipment?: Equipment;
}

type EntryMode = 'search' | 'manual';

const initialState: SessionCreateFormState = {
  errors: {},
  success: false,
};

export default function SessionCreateForm({
  bookingId,
  prefillEquipment,
}: SessionCreateFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitSessionCreate,
    initialState,
  );
  const [serialSearch, setSerialSearch] = useState('');
  const [equipment, setEquipment] = useState<Equipment | null>(prefillEquipment ?? null);
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);
  const [mode, setMode] = useState<EntryMode>(prefillEquipment ? 'search' : 'search');
  const [manualType, setManualType] = useState<'GLIDER' | 'RESERVE' | 'HARNESS'>(
    'GLIDER',
  );

  async function handleSearch() {
    if (!serialSearch.trim()) return;
    setSearching(true);
    setSearchError('');

    const result = await searchEquipmentAction(serialSearch.trim());

    if (result.error) {
      setSearchError(result.error);
      setEquipment(null);
    } else if (result.equipment) {
      setEquipment(result.equipment);
      setSearchError('');
    }
    setSearching(false);
  }

  function switchToManual() {
    setMode('manual');
    setEquipment(null);
    setSearchError('');
  }

  function switchToSearch() {
    setMode('search');
  }

  // Determine equipment type for conditional fields
  const effectiveType = mode === 'search' ? equipment?.type : manualType;
  const isGlider = effectiveType === 'GLIDER';
  const showForm = mode === 'manual' || equipment !== null;

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden fields */}
      {mode === 'search' && equipment && (
        <>
          <input type="hidden" name="equipmentId" value={equipment.id} />
          <input type="hidden" name="equipmentType" value={equipment.type} />
        </>
      )}
      {mode === 'manual' && (
        <input type="hidden" name="equipmentType" value={manualType} />
      )}
      {bookingId && <input type="hidden" name="serviceRecordId" value={bookingId} />}

      {/* Equipment Entry — Search or Manual */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-4">
        {/* Mode tabs */}
        <div className="flex gap-1 rounded-lg bg-zinc-100 p-1">
          <button
            type="button"
            onClick={switchToSearch}
            className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === 'search'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <Search className="h-4 w-4" />
            Find by Serial
          </button>
          <button
            type="button"
            onClick={switchToManual}
            className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === 'manual'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <PenLine className="h-4 w-4" />
            Enter Manually
          </button>
        </div>

        {/* Search mode */}
        {mode === 'search' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={serialSearch}
                onChange={(e) => setSerialSearch(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), handleSearch())
                }
                placeholder="Enter serial number..."
                className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={searching}
                className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
              >
                <Search className="h-4 w-4" />
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
            {searchError && (
              <div className="flex items-center justify-between rounded-md bg-amber-50 p-3">
                <p className="flex items-center gap-1 text-sm text-amber-700">
                  <AlertCircle className="h-3 w-3" />
                  {searchError}
                </p>
                <button
                  type="button"
                  onClick={switchToManual}
                  className="text-sm font-medium text-amber-700 underline hover:text-amber-800"
                >
                  Enter manually instead
                </button>
              </div>
            )}
            {equipment && (
              <div className="rounded-md bg-zinc-50 p-3">
                <p className="font-medium text-zinc-900">
                  {equipment.manufacturer} {equipment.model} {equipment.size}
                </p>
                <p className="text-sm text-zinc-500">
                  {equipment.type}
                  {equipment.serialNumber && ` · ${equipment.serialNumber}`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Manual mode */}
        {mode === 'manual' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Equipment Type
              </label>
              <select
                value={manualType}
                onChange={(e) =>
                  setManualType(e.target.value as 'GLIDER' | 'RESERVE' | 'HARNESS')
                }
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              >
                <option value="GLIDER">Paraglider</option>
                <option value="RESERVE">Reserve</option>
                <option value="HARNESS">Harness</option>
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Manufacturer *
                </label>
                <input
                  type="text"
                  name="manualManufacturer"
                  placeholder="e.g. Skyman"
                  required
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Model *
                </label>
                <input
                  type="text"
                  name="manualModel"
                  placeholder="e.g. Rock 2"
                  required
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Size *
                </label>
                <input
                  type="text"
                  name="manualSize"
                  placeholder="e.g. XS"
                  required
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Session details — visible once equipment is resolved */}
      {showForm && (
        <>
          {/* Equipment details */}
          <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-4">
            <h3 className="text-sm font-medium text-zinc-500">Equipment Details</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-zinc-400">
                  Serial Number
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  defaultValue={equipment?.serialNumber ?? ''}
                  placeholder="Optional"
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400">
                  Production Date
                </label>
                <input
                  type="text"
                  name="productionDate"
                  placeholder="e.g. 2023-06"
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Service history */}
          <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-4">
            <h3 className="text-sm font-medium text-zinc-500">Service History</h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400">
                  Stated Flight Hours
                </label>
                <input
                  type="number"
                  name="statedHours"
                  min="0"
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400">
                  Last Inspection Date
                </label>
                <input
                  type="date"
                  name="lastInspection"
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400">
                  Hours Since Last Check
                </label>
                <input
                  type="number"
                  name="hoursSinceLast"
                  min="0"
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Glider-specific: service types and measure method */}
          {isGlider && (
            <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-4">
              <h3 className="text-sm font-medium text-zinc-500">Service Configuration</h3>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Service Types
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SERVICE_TYPES.map((st) => (
                    <label
                      key={st}
                      className="flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name="serviceTypes"
                        value={st}
                        className="rounded border-zinc-300"
                      />
                      {SERVICE_TYPE_LABELS[st]}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Measurement Method
                </label>
                <select
                  name="measureMethod"
                  defaultValue="differential"
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                >
                  {MEASURE_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Client observations */}
          <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-2">
            <label className="block text-sm font-medium text-zinc-500">
              Client Observations
            </label>
            <textarea
              name="clientObservations"
              rows={3}
              placeholder="Any notes from the customer about issues, concerns..."
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Errors */}
          {Object.keys(state.errors).length > 0 && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {Object.entries(state.errors).map(([key, msg]) => (
                <p key={key}>{msg}</p>
              ))}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {isPending ? 'Creating Session...' : 'Create Session'}
          </button>
        </>
      )}
    </form>
  );
}
