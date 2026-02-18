/**
 * Generates a customer-facing booking reference for invoices/accounting
 * Format: SVC-001-YYMMDD-XXXX (e.g., "SVC-001-260512-3F5D")
 * 65,536 unique codes per day per service type (0000-FFFF)
 *
 * @param serviceCode The service code (e.g., "SVC-001", "PACK-001")
 */
function generateBookingReference(serviceCode: string): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  // 4-digit hex random (0000-FFFF = 65,536 possibilities)
  const random = Math.floor(Math.random() * 0x10000)
    .toString(16)
    .toUpperCase()
    .padStart(4, '0');

  return `${serviceCode}-${year}${month}${day}-${random}`;
}

/**
 * Generates a UUID for user/customer IDs
 * Globally unique, cryptographically secure
 */
function generateUserId(): string {
  return crypto.randomUUID();
}

export { generateBookingReference, generateUserId };
