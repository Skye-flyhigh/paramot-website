-- Fix CustomerEquipment RLS to allow INSERTs from authenticated server actions
-- The issue: FOR ALL policy with USING tries to cast empty string to UUID for inserts

-- Drop the problematic policy
DROP POLICY IF EXISTS customer_own_equipment ON "CustomerEquipment";

-- SELECT: Customers can only see their own equipment ownership records
CREATE POLICY customer_equipment_select ON "CustomerEquipment"
  FOR SELECT
  USING (
    "customerId" = current_setting('app.customer_id', true)::uuid
  );

-- INSERT: Allow from application (server actions already verify authentication)
-- The application passes valid customerId from authenticated session
CREATE POLICY customer_equipment_insert ON "CustomerEquipment"
  FOR INSERT
  WITH CHECK (true);

-- UPDATE/DELETE: Customers can only modify their own records
CREATE POLICY customer_equipment_modify ON "CustomerEquipment"
  FOR UPDATE
  USING ("customerId" = current_setting('app.customer_id', true)::uuid)
  WITH CHECK ("customerId" = current_setting('app.customer_id', true)::uuid);

CREATE POLICY customer_equipment_delete ON "CustomerEquipment"
  FOR DELETE
  USING ("customerId" = current_setting('app.customer_id', true)::uuid);
