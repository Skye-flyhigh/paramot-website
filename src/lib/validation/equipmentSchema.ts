import { z } from 'zod';
import { zfd } from 'zod-form-data';

// Equipment registry (independent of ownership - like a car with a reg number)
export interface Equipment {
  id: string; // Internal ID
  serialNumber: string; // The "registration number" - unique identifier
  type: EquipmentType;
  manufacturer: string;
  model: string;
  size: string;
  manufactureDate?: Date | null;
  status: 'ACTIVE' | 'RETIRED' | 'SOLD' | 'LOST';
  createdAt: Date;
  updatedAt: Date;
  // NO customerId - ownership is tracked separately!
}

export const EQUIPMENT_TYPES = ['GLIDER', 'RESERVE', 'HARNESS'] as const;
export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];

/**
 * Types for EquipmentForm and submitEquipmentForm
 */
export interface EquipmentPickerFormState {
  formData: EquipmentPickerData;
  errors: Record<string, string>;
  success: boolean;
}

/**
 * Types for EquipmentForm and submitEquipmentForm
 */
export interface EquipmentPickerData {
  type: EquipmentType;
  manufacturer: string;
  model: string;
  size: string;
  serialNumber?: string;
}

/**
 * Zod Validation for submitEquipmentForm
 * Makes sure we have the adequate information to compare with the database
 */
export const equipmentFormSchema = zfd.formData({
  manufacturer: zfd.text(z.string().min(1, 'Manufacturer is required')),
  model: zfd.text(z.string().min(1, 'Model is required')),
  size: zfd.text(z.string().min(1, 'Size is required').max(3, 'Size too long')),
  type: zfd.text(z.string().min(1, 'Type is required')),
  serialNumber: zfd.text(z.string().optional()),

  // Examples of other zfd types you can use:
  // checkbox: zfd.checkbox(), // boolean from checkbox
  // number: zfd.numeric(z.number().positive()), // converts string to number
  // date: zfd.text(z.string().datetime()), // validate date strings
  // file: zfd.file(z.instanceof(File)), // file uploads
  // repeatable: zfd.repeatable(), // arrays from multiple inputs with same name
});
