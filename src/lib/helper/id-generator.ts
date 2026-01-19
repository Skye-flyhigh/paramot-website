/**
 * Generates a human-readable service code with date + hex random
 * Format: YYMMDD-XXXX (e.g., "260119-A3F2")
 * 65,536 unique codes per day (0000-FFFF)
 */
function generateServiceCode(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  // 4-digit hex random (0000-FFFF = 65,536 possibilities)
  const random = Math.floor(Math.random() * 0x10000)
    .toString(16)
    .toUpperCase()
    .padStart(4, '0');

  return `${year}${month}${day}-${random}`;
}

/**
 * Generates a UUID for user/customer IDs
 * Globally unique, cryptographically secure
 */
function generateUserId(): string {
  return crypto.randomUUID();
}

/**
 * Generates a UUID for equipment IDs
 * Globally unique, cryptographically secure
 */
function generateEquipmentId(): string {
  return crypto.randomUUID();
}

export { generateServiceCode, generateUserId, generateEquipmentId };
