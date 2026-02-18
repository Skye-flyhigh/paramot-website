-- Allow customers to create their own service bookings
-- Business rules:
-- 1. customerId must match authenticated customer
-- 2. Equipment must be currently owned by that customer
-- 3. Only PENDING status allowed (no fake COMPLETED records)

-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS customer_create_booking ON "ServiceRecords";
DROP POLICY IF EXISTS customer_update_pending_booking ON "ServiceRecords";
DROP POLICY IF EXISTS customer_delete_pending_booking ON "ServiceRecords";

-- Customer can INSERT service records (book a service)
CREATE POLICY customer_create_booking ON "ServiceRecords"
  FOR INSERT
  WITH CHECK (
    -- Customer ID matches session
    "customerId" = current_setting('app.customer_id', true)::uuid
    -- AND equipment is owned by this customer (currently, not historically)
    AND EXISTS (
      SELECT 1 FROM "CustomerEquipment" ce
      WHERE ce."equipmentId" = "ServiceRecords"."equipmentId"
        AND ce."customerId" = current_setting('app.customer_id', true)::uuid
        AND ce."ownedUntil" IS NULL
    )
    -- AND status must be PENDING (can't create completed records)
    AND "status" = 'PENDING'
  );

-- Customer can UPDATE their own PENDING bookings (reschedule, cancel)
-- Cannot update once IN_PROGRESS or COMPLETED
CREATE POLICY customer_update_pending_booking ON "ServiceRecords"
  FOR UPDATE
  USING (
    "customerId" = current_setting('app.customer_id', true)::uuid
    AND "status" = 'PENDING'
  )
  WITH CHECK (
    "customerId" = current_setting('app.customer_id', true)::uuid
    -- Can only change to PENDING or CANCELLED (not IN_PROGRESS/COMPLETED)
    AND "status" IN ('PENDING', 'CANCELLED')
  );

-- Customer can DELETE their own PENDING bookings
CREATE POLICY customer_delete_pending_booking ON "ServiceRecords"
  FOR DELETE
  USING (
    "customerId" = current_setting('app.customer_id', true)::uuid
    AND "status" = 'PENDING'
  );
