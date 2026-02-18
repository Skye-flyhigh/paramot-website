-- Fix infinite recursion in RLS policies
-- The issue: CustomerEquipment policy queries ServiceRecords, which queries CustomerEquipment (cycle!)

-- Drop the circular policies
DROP POLICY IF EXISTS technician_view_customers ON "Customer";
DROP POLICY IF EXISTS technician_view_equipment_ownership ON "CustomerEquipment";

-- Recreate WITHOUT circular dependencies
-- Technicians can view all customers (they're trusted service staff)
CREATE POLICY technician_view_customers ON "Customer"
  FOR SELECT
  USING (current_setting('app.mechanic_id', true) IS NOT NULL);

-- Technicians can view all equipment ownership (needed for service work)
CREATE POLICY technician_view_equipment_ownership ON "CustomerEquipment"
  FOR SELECT
  USING (current_setting('app.mechanic_id', true) IS NOT NULL);