-- ============================================================
-- RLS: Tenant table
-- ============================================================

ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (idempotent)
DROP POLICY IF EXISTS "tenants_select_owner"  ON "Tenant";
DROP POLICY IF EXISTS "tenants_select_admin"  ON "Tenant";
DROP POLICY IF EXISTS "tenants_insert_owner"  ON "Tenant";
DROP POLICY IF EXISTS "tenants_update_owner"  ON "Tenant";
DROP POLICY IF EXISTS "tenants_update_admin"  ON "Tenant";
DROP POLICY IF EXISTS "tenants_delete_admin"  ON "Tenant";

-- Owner can read their own tenant
CREATE POLICY "tenants_select_owner"
  ON "Tenant"
  FOR SELECT
  USING (auth.uid() = "ownerId");

-- platform_admin can read all tenants
CREATE POLICY "tenants_select_admin"
  ON "Tenant"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()
        AND u.role = 'platform_admin'
    )
  );

-- Owner can create their own tenant (ownerId must match caller)
CREATE POLICY "tenants_insert_owner"
  ON "Tenant"
  FOR INSERT
  WITH CHECK (auth.uid() = "ownerId");

-- Owner can update their own tenant (non-privileged fields only —
-- enforce column restrictions at the application layer)
CREATE POLICY "tenants_update_owner"
  ON "Tenant"
  FOR UPDATE
  USING (auth.uid() = "ownerId")
  WITH CHECK (auth.uid() = "ownerId");

-- platform_admin can update any tenant (e.g. set isApproved, tier)
CREATE POLICY "tenants_update_admin"
  ON "Tenant"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()
        AND u.role = 'platform_admin'
    )
  );

-- Only platform_admin can delete tenants
CREATE POLICY "tenants_delete_admin"
  ON "Tenant"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()
        AND u.role = 'platform_admin'
    )
  );
