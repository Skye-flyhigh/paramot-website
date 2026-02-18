-- Fix CustomerEquipment SELECT policy to handle empty context
-- Issue: Prisma create() does SELECT after INSERT to return the row
-- When app.customer_id context is empty, UUID cast fails

DROP POLICY IF EXISTS customer_equipment_select ON "CustomerEquipment";
DROP POLICY IF EXISTS customer_equipment_modify ON "CustomerEquipment";
DROP POLICY IF EXISTS customer_equipment_delete ON "CustomerEquipment";

-- SELECT: Allow when context is empty (application handles auth), enforce when set
CREATE POLICY customer_equipment_select ON "CustomerEquipment"
  FOR SELECT
  USING (
    CASE
      WHEN current_setting('app.customer_id', true) = '' THEN true
      ELSE "customerId" = current_setting('app.customer_id', true)::uuid
    END
  );

-- UPDATE: Same pattern - allow when no context, enforce when set
CREATE POLICY customer_equipment_modify ON "CustomerEquipment"
  FOR UPDATE
  USING (
    CASE
      WHEN current_setting('app.customer_id', true) = '' THEN true
      ELSE "customerId" = current_setting('app.customer_id', true)::uuid
    END
  )
  WITH CHECK (
    CASE
      WHEN current_setting('app.customer_id', true) = '' THEN true
      ELSE "customerId" = current_setting('app.customer_id', true)::uuid
    END
  );

-- DELETE: Same pattern
CREATE POLICY customer_equipment_delete ON "CustomerEquipment"
  FOR DELETE
  USING (
    CASE
      WHEN current_setting('app.customer_id', true) = '' THEN true
      ELSE "customerId" = current_setting('app.customer_id', true)::uuid
    END
  );
