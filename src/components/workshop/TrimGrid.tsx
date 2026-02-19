'use client';

import { useState, useMemo } from 'react';
import { Save, Loader2, Check } from 'lucide-react';
import { saveTrimMeasurements } from '@/lib/submit/submitMeasurements';

interface LineLengthEntry {
  lineId: string;
  row: string;
  position: number;
  cascade: number;
  lengthMm: number;
}

interface GliderSizeData {
  id: string;
  sizeLabel: string;
  numLinesPerSide: number | null;
  lineLengths: unknown; // JSON
  groupMappings: unknown; // JSON
  aspectRatio: number | null;
  gliderModel: {
    name: string;
    numLineRows: number | null;
    manufacturer: { name: string };
  };
}

interface ExistingMeasurement {
  id: string;
  lineRow: string;
  position: number;
  side: string;
  phase: string;
  measuredLength: number | null;
  manufacturerLength: number | null;
  deviation: number | null;
}

interface TrimGridProps {
  sessionId: string;
  gliderSize: GliderSizeData;
  existingMeasurements: ExistingMeasurement[];
  measureMethod: string;
}

type Phase = 'initial' | 'corrected';
type Side = 'left' | 'right';

export default function TrimGrid({
  sessionId,
  gliderSize,
  existingMeasurements,
  measureMethod,
}: TrimGridProps) {
  const [phase, setPhase] = useState<Phase>('initial');
  const [side, setSide] = useState<Side>('left');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Parse reference data
  const lineLengths = useMemo(() => {
    const raw = gliderSize.lineLengths as LineLengthEntry[] | null;

    if (!Array.isArray(raw)) return [];

    return raw;
  }, [gliderSize.lineLengths]);

  // Extract unique rows and positions
  const { rows, positions } = useMemo(() => {
    const rowSet = new Set<string>();
    const posSet = new Set<number>();

    lineLengths.forEach((entry) => {
      rowSet.add(entry.row);
      posSet.add(entry.position);
    });

    const rowOrder = ['A', 'B', 'C', 'D', 'E', 'K'];
    const sortedRows = Array.from(rowSet).sort(
      (a, b) => rowOrder.indexOf(a) - rowOrder.indexOf(b),
    );
    const sortedPositions = Array.from(posSet).sort((a, b) => a - b);

    return { rows: sortedRows, positions: sortedPositions };
  }, [lineLengths]);

  // Build reference length lookup
  const refLookup = useMemo(() => {
    const map = new Map<string, number>();

    lineLengths.forEach((entry) => {
      // Use cascade 1 (first cascade) as primary reference
      if (entry.cascade === 1) {
        map.set(`${entry.row}-${entry.position}`, entry.lengthMm);
      }
    });

    return map;
  }, [lineLengths]);

  // Initialize grid values from existing measurements
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};

    existingMeasurements
      .filter((m) => m.phase === phase && m.side === side)
      .forEach((m) => {
        if (m.measuredLength != null) {
          init[`${m.lineRow}-${m.position}`] = String(m.measuredLength);
        }
      });

    return init;
  });

  // Rehydrate when phase/side changes
  function switchView(newPhase: Phase, newSide: Side) {
    const init: Record<string, string> = {};

    existingMeasurements
      .filter((m) => m.phase === newPhase && m.side === newSide)
      .forEach((m) => {
        if (m.measuredLength != null) {
          init[`${m.lineRow}-${m.position}`] = String(m.measuredLength);
        }
      });
    setValues(init);
    setPhase(newPhase);
    setSide(newSide);
    setSaved(false);
  }

  function updateCell(row: string, position: number, value: string) {
    setValues((prev) => ({ ...prev, [`${row}-${position}`]: value }));
    setSaved(false);
  }

  // Calculate deviation for display
  function getDeviation(row: string, position: number): number | null {
    const val = values[`${row}-${position}`];
    const ref = refLookup.get(`${row}-${position}`);

    if (!val || !ref) return null;
    const measured = parseFloat(val);

    if (isNaN(measured)) return null;

    return measured - ref;
  }

  // Deviation tolerance based on aspect ratio
  const tolerance = useMemo(() => {
    const ar = gliderSize.aspectRatio;

    if (!ar) return 20;
    if (ar <= 5) return 20;
    if (ar <= 6) return 15;
    if (ar <= 6.5) return 10;

    return 10;
  }, [gliderSize.aspectRatio]);

  function deviationColor(dev: number | null): string {
    if (dev === null) return '';
    const abs = Math.abs(dev);

    if (abs <= tolerance * 0.5) return 'text-green-600';
    if (abs <= tolerance) return 'text-amber-600';

    return 'text-red-600 font-bold';
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const measurements = rows.flatMap((row) =>
      positions
        .filter((pos) => {
          const val = values[`${row}-${pos}`];

          return val && !isNaN(parseFloat(val));
        })
        .map((pos) => ({
          lineRow: row,
          position: pos,
          measuredLength: parseFloat(values[`${row}-${pos}`]),
          manufacturerLength: refLookup.get(`${row}-${pos}`),
        })),
    );

    if (measurements.length === 0) {
      setSaving(false);

      return;
    }

    const result = await saveTrimMeasurements({
      sessionId,
      phase,
      side,
      measurements,
    });

    setSaving(false);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="flex rounded-md border border-zinc-300 text-sm">
          <button
            onClick={() => switchView('initial', side)}
            className={`px-3 py-1.5 ${phase === 'initial' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-50'}`}
          >
            Initial
          </button>
          <button
            onClick={() => switchView('corrected', side)}
            className={`px-3 py-1.5 ${phase === 'corrected' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-50'}`}
          >
            Corrected
          </button>
        </div>

        <div className="flex rounded-md border border-zinc-300 text-sm">
          <button
            onClick={() => switchView(phase, 'left')}
            className={`px-3 py-1.5 ${side === 'left' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-50'}`}
          >
            Left
          </button>
          <button
            onClick={() => switchView(phase, 'right')}
            className={`px-3 py-1.5 ${side === 'right' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-50'}`}
          >
            Right
          </button>
        </div>

        <span className="ml-auto text-xs text-zinc-400">
          Tolerance: ±{tolerance}mm (AR: {gliderSize.aspectRatio ?? '?'})
        </span>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50">
              <th className="sticky left-0 z-10 bg-zinc-50 px-3 py-2 text-left text-xs font-medium text-zinc-500">
                Row
              </th>
              {positions.map((pos) => (
                <th
                  key={pos}
                  className="px-2 py-2 text-center text-xs font-medium text-zinc-500"
                >
                  {pos}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row} className="border-t border-zinc-100">
                <td className="sticky left-0 z-10 bg-white px-3 py-1 font-mono font-bold text-zinc-700">
                  {row}
                </td>
                {positions.map((pos) => {
                  const ref = refLookup.get(`${row}-${pos}`);
                  const dev = getDeviation(row, pos);

                  // Skip cells with no reference data for this row/position
                  if (ref === undefined) {
                    return (
                      <td key={pos} className="px-1 py-1 text-center text-zinc-200">
                        —
                      </td>
                    );
                  }

                  return (
                    <td key={pos} className="px-1 py-1">
                      <div className="flex flex-col items-center gap-0.5">
                        <input
                          type="number"
                          step="1"
                          value={values[`${row}-${pos}`] ?? ''}
                          onChange={(e) => updateCell(row, pos, e.target.value)}
                          placeholder={ref != null ? String(ref) : ''}
                          className="w-16 rounded border border-zinc-200 px-1 py-0.5 text-center text-xs focus:border-zinc-500 focus:outline-none"
                        />
                        {dev !== null && (
                          <span className={`text-[10px] ${deviationColor(dev)}`}>
                            {dev > 0 ? '+' : ''}
                            {dev.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reference lengths toggle */}
      <details className="text-xs text-zinc-400">
        <summary className="cursor-pointer hover:text-zinc-600">
          Show manufacturer reference lengths
        </summary>
        <div className="mt-2 overflow-x-auto rounded border border-zinc-100 p-2">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Row</th>
                {positions.map((pos) => (
                  <th key={pos} className="px-2 py-1 text-center">
                    {pos}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row}>
                  <td className="px-2 py-1 font-mono font-bold">{row}</td>
                  {positions.map((pos) => {
                    const ref = refLookup.get(`${row}-${pos}`);

                    return (
                      <td key={pos} className="px-2 py-1 text-center font-mono">
                        {ref != null ? ref : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? 'Saving...' : 'Save Measurements'}
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <Check className="h-4 w-4" />
            Saved
          </span>
        )}
      </div>
    </div>
  );
}
