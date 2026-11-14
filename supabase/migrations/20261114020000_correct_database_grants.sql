BEGIN;

-- ============================================================================
-- Application tables: remove broad default-inherited privileges, then grant
-- only the approved least-privilege access.
-- ============================================================================

REVOKE ALL ON TABLE
  public.admin_profiles,
  public.page_contents,
  public.announcements,
  public.facilities,
  public.gallery_images,
  public.site_settings
FROM anon, authenticated;

GRANT SELECT ON
  public.page_contents,
  public.announcements,
  public.facilities,
  public.gallery_images,
  public.site_settings
TO anon;

GRANT SELECT, UPDATE, DELETE ON public.admin_profiles TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.page_contents,
  public.announcements,
  public.facilities,
  public.gallery_images,
  public.site_settings
TO authenticated;

-- Preserve full access for the trusted server role.
GRANT ALL ON TABLE
  public.admin_profiles,
  public.page_contents,
  public.announcements,
  public.facilities,
  public.gallery_images,
  public.site_settings
TO service_role;

-- ============================================================================
-- Application sequences: anon gets nothing; authenticated gets USAGE/SELECT;
-- service_role retains full access.
-- ============================================================================

REVOKE ALL ON SEQUENCE
  public.announcements_id_seq,
  public.facilities_id_seq,
  public.gallery_images_id_seq,
  public.page_contents_id_seq,
  public.site_settings_id_seq
FROM anon, authenticated;

GRANT USAGE, SELECT ON SEQUENCE
  public.announcements_id_seq,
  public.facilities_id_seq,
  public.gallery_images_id_seq,
  public.page_contents_id_seq,
  public.site_settings_id_seq
TO authenticated;

GRANT ALL ON SEQUENCE
  public.announcements_id_seq,
  public.facilities_id_seq,
  public.gallery_images_id_seq,
  public.page_contents_id_seq,
  public.site_settings_id_seq
TO service_role;

-- ============================================================================
-- Storage ACL exception:
-- storage.buckets and storage.objects are owned and granted by
-- supabase_storage_admin. The postgres migration role cannot revoke or
-- modify those ACLs. Storage access is therefore enforced by the existing
-- four Storage RLS policies (storage_public_read, storage_admin_insert,
-- storage_admin_update, storage_admin_delete). No Storage GRANT or REVOKE
-- statements are included in this migration.
-- ============================================================================

-- ============================================================================
-- Default privileges for future objects created by the migration role.
-- Remove broad anon/authenticated defaults; retain service_role defaults.
-- ============================================================================

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON TABLES FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON SEQUENCES FROM anon, authenticated;

COMMIT;
