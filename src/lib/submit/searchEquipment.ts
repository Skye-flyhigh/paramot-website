'use server';

import { ensureTechnician } from '../security/workshop-auth';
import { findEquipmentBySerialNumber } from '../db/equipment';

interface SearchResult {
  equipment?: {
    id: string;
    serialNumber: string | null;
    type: 'GLIDER' | 'RESERVE' | 'HARNESS';
    manufacturer: string;
    model: string;
    size: string;
  };
  error?: string;
}

export async function searchEquipmentAction(serialNumber: string): Promise<SearchResult> {
  const auth = await ensureTechnician();

  if (!auth.authorized) {
    return { error: 'Not authorized' };
  }

  const equipment = await findEquipmentBySerialNumber(serialNumber);

  if (!equipment) {
    return { error: `No equipment found with serial number "${serialNumber}"` };
  }

  return {
    equipment: {
      id: equipment.id,
      serialNumber: equipment.serialNumber,
      type: equipment.type,
      manufacturer: equipment.manufacturer,
      model: equipment.model,
      size: equipment.size,
    },
  };
}
