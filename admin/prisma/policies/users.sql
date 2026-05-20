-- ============================================================
-- RLS: User table
-- ============================================================

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (idempotent)
DROP POLICY IF EXISTS "users_select_own"   ON "User";
DROP POLICY IF EXISTS "users_select_admin" ON "User";
DROP POLICY IF EXISTS "users_update_own"   ON "User";

-- A user can read their own record
CREATE POLICY "users_select_own"
  ON "User"
  FOR SELECT
  USING (auth.uid() = id);

-- platform_admin can read all users
CREATE POLICY "users_select_admin"
  ON "User"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "User" u
      WHERE u.id = auth.uid()
        AND u.role = 'platform_admin'
    )
  );

-- A user can update only their own record
CREATE POLICY "users_update_own"
  ON "User"
  FOR UPDATE
  USING (auth.uid() = id);
