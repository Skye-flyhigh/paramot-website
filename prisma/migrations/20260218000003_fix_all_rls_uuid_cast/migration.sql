-- Fix ALL remaining RLS policies that use direct UUID cast
-- Apply CASE pattern universally to handle empty context from Prisma Accelerate

-- ============================================
-- CUSTOMER TABLE
-- ============================================
DROP POLICY IF EXISTS customer_own_data ON "Customer";
DROP POLICY IF EXISTS customer_update_own ON "Customer";
DROP POLICY IF EXISTS customer_delete_own ON "Customer";

CREATE POLICY customer_own_data ON "Customer"
  FOR SELECT
  USING (
    CASE
      WHEN current_setting('app.customer_id', true) = '' THEN true
      ELSE "id" = current_setting('app.customer_id', true)::uuid
    END
  );

CREATE POLICY customer_update_own ON "Customer"
  FOR UPDATE
  USING (
    CASE
      WHEN current_setting('app.customer_id', true) = '' THEN true
      ELSE "id" = current_setting('app.customer_id', true)::uuid
    END
  );

CREATE POLICY customer_delete_own ON "Customer"
  FOR DELETE
  USING (
    CASE
      WHEN current_setting('app.customer_id', true) = '' THEN true
      ELSE "id" = current_setting('app.customer_id', true)::uuid
    END
  );

-- ============================================
-- ADDRESS TABLE (if it has RLS)
-- ============================================
DROP POLICY IF EXISTS customer_own_address ON "Address";

CREATE POLICY customer_own_address ON "Address"
  FOR ALL
  USING (
    CASE
      WHEN current_setting('app.customer_id', true) = '' THEN true
      ELSE EXISTS (
        SELECT 1 FROM "Customer" c
        WHERE c."addressId" = "Address"."id"
          AND c."id" = current_setting('app.customer_id', true)::uuid
      )
    END
  );
