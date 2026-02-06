-- Allow SELECT during onboarding mode
-- Required because INSERT operations need SELECT permission to verify row creation
-- See: https://github.com/orgs/supabase/discussions/36619

CREATE POLICY customer_select_onboarding ON "Customer"
  FOR SELECT
  USING (current_setting('app.onboarding_mode', true) = 'true');
