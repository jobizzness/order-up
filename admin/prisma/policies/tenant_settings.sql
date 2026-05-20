-- ============================================================
-- RLS: TenantSettings table
-- ============================================================

ALTER TABLE "TenantSettings" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (idempotent)
DROP POLICY IF EXISTS "tenant_settings_select_owner" ON "TenantSettings";
DROP POLICY IF EXISTS "tenant_settings_select_admin" ON "TenantSettings";
DROP POLICY IF EXISTS "tenant_settings_insert_owner" ON "TenantSettings";
DROP POLICY IF EXISTS "tenant_settings_update_owner" ON "TenantSettings";
DROP POLICY IF EXISTS "tenant_settings_update_admin" ON "TenantSettings";

-- Owner can read settings for their tenant
CREATE POLICY "tenant_settings_select_owner"
  ON "TenantSettings"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Tenant" t
      WHERE t.id = "tenantId"
        AND t."ownerId" = auth.uid()
    )
  );

-- platform_admin can read all settings
CREATE POLICY "tenant_settings_select_admin"
  ON "TenantSettings"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()
        AND u.role = 'platform_admin'
    )
  );

-- Owner can insert settings for their tenant
CREATE POLICY "tenant_settings_insert_owner"
  ON "TenantSettings"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Tenant" t
      WHERE t.id = "tenantId"
        AND t."ownerId" = auth.uid()
    )
  );

-- Owner can update settings for their tenant
CREATE POLICY "tenant_settings_update_owner"
  ON "TenantSettings"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "Tenant" t
      WHERE t.id = "tenantId"
        AND t."ownerId" = auth.uid()
    )
  );

-- platform_admin can update any tenant's settings
CREATE POLICY "tenant_settings_update_admin"
  ON "TenantSettings"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()
        AND u.role = 'platform_admin'
    )
  );
