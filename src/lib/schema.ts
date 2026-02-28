// Database Schema Design for paraMOT Customer & Service Management
// This schema supports the business model: customers own gliders, book services, track history

import rawServicesData from '@/data/services.json';
import {
  ServiceChecks,
  ServiceCode,
  ServiceRecords,
  ServicesType,
} from './validation/serviceSchema';

// Re-export types for convenience
export type { ServiceChecks, ServiceCode, ServicesType };

// Workbench integration interfaces - these connect to your Electron app's Prisma data
export interface WorkbenchInspectionSession {
  id: number; // Links to workbench InspectionSession.id
  gliderModel: string; // From workbench GliderModel
  gliderSize: string; // From workbench GliderSize
  date: Date;
  technician: string;
  validationType: string; // APPI, SAFETY, CUSTOM
  status: string; // PASS, FAIL, WARNING
  groupAnalyses: GroupAnalysis[];
  lineMeasurements: LineMeasurement[];
}

export interface GroupAnalysis {
  groupLabel: string; // G1A, G2B, STA etc
  result: string; // pass/fail/notes
  correction?: string; // suggested correction
  details?: string; // JSON or text for extra info
}

export interface LineMeasurement {
  physicalLineLabel: string; // A7, B3 etc
  measuredLength: number;
  position: number; // 1-13 etc
}

// This bridges customer-facing service records with workbench technical data
export interface DetailedServiceRecord extends ServiceRecords {
  workbenchSessionId?: number; // Links to workbench InspectionSession
  inspectionData?: WorkbenchInspectionSession;
}

// Workshop availability - manual date blocks set by admin
export const BLOCK_TYPES = [
  'holiday',
  'maintenance',
  'training',
  'emergency',
  'other',
] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export interface DateBlock {
  id: string;
  startDate: string; // ISO date format YYYY-MM-DD
  endDate: string; // ISO date format YYYY-MM-DD
  reason: string;
  type: BlockType;
  createdAt: Date;
}

// Service list function helper
export function getServicesList(): ServicesType[] {
  return Object.values(rawServicesData) as ServicesType[];
}

/** Derives the price range string (e.g. "£50–£210") from available services */
export function getPriceRange(): string {
  const prices = getServicesList()
    .filter((s) => s.available && typeof s.cost === 'number')
    .map((s) => s.cost as number);

  if (prices.length === 0) return 'Contact us';

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return `£${min}–£${max}`;
}

// Get service details by code
export function getServiceByCode(serviceCode: ServiceCode): ServicesType | undefined {
  return getServicesList().find((service) => service.code === serviceCode);
}

// Grid-grouped services for comparison grid (pairs solo/tandem by gridGroup)
export interface GridServiceGroup {
  gridGroup: string;
  gridLabel: string;
  soloCost: number;
  tandemCost: number;
  checks: ServiceChecks;
}

export function getGridServiceGroups(): GridServiceGroup[] {
  const services = getServicesList();
  const grouped = new Map<string, { solo?: ServicesType; tandem?: ServicesType }>();

  for (const s of services) {
    if (!s.gridGroup || !s.variant) continue;
    const entry = grouped.get(s.gridGroup) ?? {};

    entry[s.variant] = s;
    grouped.set(s.gridGroup, entry);
  }

  // Maintain insertion order from services.json (visual-check, trim, full-service)
  const result: GridServiceGroup[] = [];
  const seen = new Set<string>();

  for (const s of services) {
    if (!s.gridGroup || seen.has(s.gridGroup)) continue;
    seen.add(s.gridGroup);
    const pair = grouped.get(s.gridGroup);

    if (!pair?.solo || !pair?.tandem) continue;
    result.push({
      gridGroup: s.gridGroup,
      gridLabel: s.gridLabel ?? s.gridGroup,
      soloCost: typeof pair.solo.cost === 'number' ? pair.solo.cost : 0,
      tandemCost: typeof pair.tandem.cost === 'number' ? pair.tandem.cost : 0,
      checks: pair.solo.checks ?? {},
    });
  }

  return result;
}
