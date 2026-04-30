import { EquipmentStatus, EquipmentType } from '@/generated/prisma';

export interface Equipment {
  id: string; // Internal ID
  serialNumber: string | null; // The "registration number" - unique identifier
  type: EquipmentType;
  manufacturer: string;
  model: string;
  size: string;
  manufactureDate?: Date | null;
  status: EquipmentStatus;
  createdAt: Date;
  updatedAt: Date;
  // Optional reference data FKs (linked when ACT data exists)
  manufacturerRefId?: string | null;
  gliderModelRefId?: string | null;
  gliderSizeRefId?: string | null;
  // NO customerId - ownership is tracked separately!
}

/**
 * Types for EquipmentForm and submitEquipmentForm
 */
export interface EquipmentPickerFormState {
  formData: EquipmentPickerData;
  errors: Record<string, string>;
  success: boolean;
  equipmentId?: string; // Real DB ID after successful creation
}

/**
 * Types for EquipmentForm and submitEquipmentForm
 */
export interface EquipmentPickerData {
  type: EquipmentType;
  manufacturer: string;
  model: string;
  size: string;
  serialNumber?: string | null;
}
