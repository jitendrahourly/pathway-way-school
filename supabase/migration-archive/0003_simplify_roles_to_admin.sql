-- ============================================================================
-- Migration: 0003_simplify_roles_to_admin.sql
-- Purpose:  Simplify admin authorization to a single role: 'admin'.
--
-- STATUS: PROPOSED ONLY. Do not run until reviewed and approved. This file does
-- not execute itself; apply manually in the Supabase SQL Editor after approval.
--
-- Safety properties:
--   * Wrapped in a single transaction (BEGIN/COMMIT) so it is all-or-nothing.
--   * Aborts if any admin_profiles row has a role other than 'admin', so no
--     account is silently changed or removed and no existing access is lost
--     without an explicit decision.
--   * Does not delete auth users or profile rows.
--   * Does not drop or recreate content/storage policies (they keep their
--     names and definitions; only the helper functions they call are redefined).
--   * Additive to 0001/0002; does not modify prior migrations.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 0. Pre-flight: identify and block on non-admin roles.
--    Run this query FIRST (outside the transaction) to see affected accounts:
--
--      SELECT id, full_name, role, created_at
--      FROM public.admin_profiles
--      WHERE role <> 'admin';
--
--    To promote existing editors to full admin before applying:
--
--      UPDATE public.admin_profiles
--         SET role = 'admin', updated_at = now()
--       WHERE role = 'editor';
--
--    To revoke an editor's access instead (profile row only, auth user kept):
--
--      DELETE FROM public.admin_profiles WHERE role = 'editor';
--
--    Choose one of the above explicitly; this migration never decides for you.
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
        SELECT 1
        FROM public.admin_profiles
        WHERE role IS DISTINCT FROM 'admin'
  ) THEN
    RAISE EXCEPTION
      'Migration aborted: admin_profiles contains non-admin roles. '
      'Resolve them explicitly (promote to admin or remove the profile row) '
      'before applying this migration.';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 1. Constrain admin_profiles.role to 'admin' only.
-- ---------------------------------------------------------------------------
ALTER TABLE public.admin_profiles
  DROP CONSTRAINT IF EXISTS admin_profiles_role_check;

ALTER TABLE public.admin_profiles
  ADD CONSTRAINT admin_profiles_role_check
  CHECK (role = 'admin');

-- Default is already 'admin'; keep it explicit.
ALTER TABLE public.admin_profiles
  ALTER COLUMN role SET DEFAULT 'admin';

-- ---------------------------------------------------------------------------
-- 2. Redefine helper functions so authorization is admin-only.
--    is_editor() becomes a constant false (no editor role exists anymore).
--    is_editor_or_admin() becomes equivalent to is_admin(), preserving the
--    existing policy definitions without renaming them.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT false;
$$;

CREATE OR REPLACE FUNCTION public.is_editor_or_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT public.is_admin();
$$;

-- has_role() stays generic but now only 'admin' can ever match.
CREATE OR REPLACE FUNCTION public.has_role(required_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE id = auth.uid()
      AND role = required_role
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Permissions (unchanged from 0002; re-asserted for clarity).
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.is_admin()             FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_editor()            FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_editor_or_admin()   FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(text)         FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.is_admin()           TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_editor()          TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_editor_or_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(text)       TO anon, authenticated;

COMMIT;

-- ============================================================================
-- Post-migration verification (run after COMMIT):
--
--   SELECT count(*) FROM public.admin_profiles WHERE role <> 'admin';  -- 0
--   SELECT public.is_admin();                                         -- true (as admin)
--
-- Content policies keep their names and now grant access only to admins.
-- No policies were dropped or recreated by this migration.
-- ============================================================================
