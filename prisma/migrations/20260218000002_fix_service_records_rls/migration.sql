-- Fix ServiceRecords RLS policies to handle empty context (Prisma Accelerate)
-- Same pattern as CustomerEquipment fix - use CASE to avoid UUID cast when context empty

-- Drop all existing customer policies
DROP POLICY IF EXISTS customer_service_records ON "ServiceRecords";
DROP POLICY IF EXISTS customer_create_booking ON "ServiceRecords";
DROP POLICY IF EXISTS customer_update_pending_booking ON "ServiceRecords";
DROP POLICY IF EXISTS customer_delete_pending_booking ON "ServiceRecords";

-- SELECT: Allow when context empty (application handles auth), enforce when set
CREATE POLICY customer_service_records ON "ServiceRecords"
  FOR SELECT
  USING (
    CASE
      WHEN current_setting('app.customer_id', true) = '' THEN true
      ELSE EXISTS (
        SELECT 1 FROM "CustomerEquipment" ce
        WHERE ce."equipmentId" = "ServiceRecords"."equipmentId"
          AND ce."customerId" = current_setting('app.customer_id', true)::uuid
          AND ce."ownedUntil" IS NULL
      )
    END
  );

-- INSERT: Allow from application (server actions already verify auth + ownership)
CREATE POLICY customer_create_booking ON "ServiceRecords"
  FOR INSERT
  WITH CHECK (true);

-- UPDATE: Allow when context empty, enforce ownership + pending status when set
CREATE POLICY customer_update_pending_booking ON "ServiceRecords"
  FOR UPDATE
  USING (
    CASE
      WHEN current_setting('app.customer_id', true) = '' THEN true
      ELSE "customerId" = current_setting('app.customer_id', true)::uuid AND "status" = 'PENDING'
    END
  )
  WITH CHECK (
    CASE
      WHEN current_setting('app.customer_id', true) = '' THEN true
      ELSE "customerId" = current_setting('app.customer_id', true)::uuid AND "status" IN ('PENDING', 'CANCELLED')
    END
  );

-- DELETE: Allow when context empty, enforce ownership + pending status when set
CREATE POLICY customer_delete_pending_booking ON "ServiceRecords"
  FOR DELETE
  USING (
    CASE
      WHEN current_setting('app.customer_id', true) = '' THEN true
      ELSE "customerId" = current_setting('app.customer_id', true)::uuid AND "status" = 'PENDING'
    END
  );
