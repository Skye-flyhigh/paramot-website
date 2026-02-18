-- Simplify ServiceRecords SELECT policy
-- The availability calendar just needs to count bookings - no customer filtering
-- Application layer handles showing appropriate records to users

DROP POLICY IF EXISTS customer_service_records ON "ServiceRecords";

-- SELECT: Allow all reads from application
-- Service history is semi-public (like Carfax - visible when you have equipment serial)
-- Customer-specific filtering is done at application layer
CREATE POLICY service_records_select ON "ServiceRecords"
  FOR SELECT
  USING (true);
