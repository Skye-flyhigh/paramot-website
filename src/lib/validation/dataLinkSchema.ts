// Ownership junction table - tracks who owns what and when (like vehicle registration)
export interface CustomerEquipment {
  id: string;
  customerId: string; // Links to Customer
  equipmentId: string; // Links to Equipment
  equipmentSerialNumber: string; // Denormalized for quick lookup
  ownedFrom: Date; // When they acquired it
  ownedUntil: Date | null; // null = currently owned, date = sold/transferred
  purchaseDate?: Date; // Optional: actual purchase date (might differ from ownedFrom)
  purchasePrice?: number;
  notes?: string; // "Bought second-hand", "Gift from friend", etc.
  createdAt: Date;
  updatedAt: Date;
}
