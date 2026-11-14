-- ============================================================================
-- Migration: 0002_security_hardening.sql
-- Purpose:  Correct RLS, admin/editor authorization and Storage policies.
--
-- ADDITIVE ONLY. Does not modify or delete the original initial migration
-- (0001_initial_schema.sql), does not recreate tables/buckets/indexes, and
-- does not change any existing school content or records.
--
-- Verified schema:
--   admin_profiles(id UUID PK/FK -> auth.users.id, full_name TEXT NOT NULL,
--                  role TEXT NOT NULL DEFAULT 'admin', created_at, updated_at)
--   page_contents(..., is_published boolean, ...)
--   announcements(..., is_published boolean, published_at timestamptz, ...)
--   facilities(..., is_published boolean, ...)
--   gallery_images(..., is_published boolean, ...)
--   site_settings(..., is_public boolean, ...)
--   storage buckets: 'gallery', 'school-assets' (both public)
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 0. Remove the specific policies that this migration replaces.
--    Only named legacy policies and the policies created below are dropped.
--    Unrelated policies are left untouched.
-- ---------------------------------------------------------------------------
-- Legacy recursive policy identified in the audit:
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.admin_profiles;

-- Idempotency: drop the policies this migration (re)creates.
DROP POLICY IF EXISTS "admin_profiles_select"            ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_insert_deny"       ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_update"            ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_delete"            ON public.admin_profiles;

DROP POLICY IF EXISTS "page_contents_public_select"      ON public.page_contents;
DROP POLICY IF EXISTS "page_contents_staff_select"       ON public.page_contents;
DROP POLICY IF EXISTS "page_contents_write"             ON public.page_contents;

DROP POLICY IF EXISTS "announcements_public_select"     ON public.announcements;
DROP POLICY IF EXISTS "announcements_staff_select"      ON public.announcements;
DROP POLICY IF EXISTS "announcements_write"            ON public.announcements;

DROP POLICY IF EXISTS "facilities_public_select"        ON public.facilities;
DROP POLICY IF EXISTS "facilities_staff_select"         ON public.facilities;
DROP POLICY IF EXISTS "facilities_write"                ON public.facilities;

DROP POLICY IF EXISTS "gallery_images_public_select"    ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_images_staff_select"     ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_images_write"            ON public.gallery_images;

DROP POLICY IF EXISTS "site_settings_public_select"     ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_staff_select"      ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_write"             ON public.site_settings;

-- Storage: drop only policies scoped to the two application buckets.
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND (
            coalesce(qual,'')        ILIKE '%school-assets%'
         OR coalesce(qual,'')        ILIKE '%gallery%'
         OR coalesce(with_check,'') ILIKE '%school-assets%'
         OR coalesce(with_check,'') ILIKE '%gallery%'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
                   pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- 1. Helper functions
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
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE id = auth.uid()
      AND role = 'editor'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_editor_or_admin()
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
      AND role IN ('admin', 'editor')
  );
$$;

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

REVOKE ALL ON FUNCTION public.is_admin()             FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_editor()            FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_editor_or_admin()   FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(text)         FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.is_admin()           TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_editor()          TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_editor_or_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(text)       TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Ensure RLS is enabled on all application tables (idempotent)
-- ---------------------------------------------------------------------------
ALTER TABLE public.admin_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_contents    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings    ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 3. admin_profiles
-- ---------------------------------------------------------------------------
CREATE POLICY "admin_profiles_select" ON public.admin_profiles
  FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "admin_profiles_insert_deny" ON public.admin_profiles
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "admin_profiles_update" ON public.admin_profiles
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin_profiles_delete" ON public.admin_profiles
  FOR DELETE
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4. Content tables
-- ---------------------------------------------------------------------------
-- page_contents
CREATE POLICY "page_contents_public_select" ON public.page_contents
  FOR SELECT USING (is_published = true);

CREATE POLICY "page_contents_staff_select" ON public.page_contents
  FOR SELECT USING (public.is_editor_or_admin());

CREATE POLICY "page_contents_write" ON public.page_contents
  FOR ALL
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

-- announcements (publication requires published_at <= now())
CREATE POLICY "announcements_public_select" ON public.announcements
  FOR SELECT USING (is_published = true AND published_at <= now());

CREATE POLICY "announcements_staff_select" ON public.announcements
  FOR SELECT USING (public.is_editor_or_admin());

CREATE POLICY "announcements_write" ON public.announcements
  FOR ALL
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

-- facilities
CREATE POLICY "facilities_public_select" ON public.facilities
  FOR SELECT USING (is_published = true);

CREATE POLICY "facilities_staff_select" ON public.facilities
  FOR SELECT USING (public.is_editor_or_admin());

CREATE POLICY "facilities_write" ON public.facilities
  FOR ALL
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

-- gallery_images
CREATE POLICY "gallery_images_public_select" ON public.gallery_images
  FOR SELECT USING (is_published = true);

CREATE POLICY "gallery_images_staff_select" ON public.gallery_images
  FOR SELECT USING (public.is_editor_or_admin());

CREATE POLICY "gallery_images_write" ON public.gallery_images
  FOR ALL
  USING (public.is_editor_or_admin())
  WITH CHECK (public.is_editor_or_admin());

-- site_settings (public rows only; write admin-only)
CREATE POLICY "site_settings_public_select" ON public.site_settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "site_settings_staff_select" ON public.site_settings
  FOR SELECT USING (public.is_editor_or_admin());

CREATE POLICY "site_settings_write" ON public.site_settings
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- 5. Storage: public read on both buckets; writes/deletes admin-only
-- ---------------------------------------------------------------------------
CREATE POLICY "storage_public_read" ON storage.objects
  FOR SELECT
  USING (bucket_id IN ('gallery', 'school-assets'));

CREATE POLICY "storage_admin_insert" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id IN ('gallery', 'school-assets') AND public.is_admin());

CREATE POLICY "storage_admin_update" ON storage.objects
  FOR UPDATE
  USING (bucket_id IN ('gallery', 'school-assets') AND public.is_admin())
  WITH CHECK (bucket_id IN ('gallery', 'school-assets') AND public.is_admin());

CREATE POLICY "storage_admin_delete" ON storage.objects
  FOR DELETE
  USING (bucket_id IN ('gallery', 'school-assets') AND public.is_admin());

COMMIT;

-- ============================================================================
-- End of migration 0002_security_hardening.sql
-- ============================================================================
