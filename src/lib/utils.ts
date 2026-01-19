import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { Equipment } from './schema';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Detects if equipment is a tandem glider based on size
 * Tandem gliders are typically size 38+, with exceptions for mini tandems:
 * - Niviuk Bi Roller 2 (30, 34)
 * - LittleCloud Bidule (32)
 * - Gin Fuse mini (32, 35)
 * - Level Wings Wind-Force 32 (32)
 * - Gin Osprey (34)
 */
export function isTandemGlider(equipment: Equipment): boolean {
  if (equipment.type !== 'glider') return false;

  const size = parseInt(equipment.size, 10);

  // Known mini tandem models (< 38m²)
  const smallTandems = [
    { manufacturer: 'Niviuk', model: 'Bi Roller 2', sizes: [30, 34] },
    { manufacturer: 'LittleCloud', model: 'Bidule', sizes: [32] },
    { manufacturer: 'Gin', model: 'Fuse mini', sizes: [32, 35] },
    { manufacturer: 'Level Wings', model: 'Wind-Force 32', sizes: [32] },
    { manufacturer: 'Gin', model: 'Osprey', sizes: [34] },
  ];

  const isSmallTandem = smallTandems.some(
    (t) =>
      equipment.manufacturer === t.manufacturer &&
      equipment.model === t.model &&
      t.sizes.includes(size),
  );

  return isSmallTandem || size >= 34;
}
