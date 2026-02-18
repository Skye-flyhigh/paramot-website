// Database Schema Design for paraMOT Customer & Service Management
// This schema supports the business model: customers own gliders, book services, track history

import rawServicesData from '@/data/services.json';
import { ServiceCode, ServiceRecords, ServicesType } from './validation/serviceSchema';

// Re-export types for convenience
export type { ServiceCode, ServicesType };

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

// Get service details by code
export function getServiceByCode(serviceCode: ServiceCode): ServicesType | undefined {
  return getServicesList().find((service) => service.code === serviceCode);
}
