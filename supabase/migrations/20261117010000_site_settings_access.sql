BEGIN;

-- site_settings holds the editable school details shown in the site header,
-- footer and Contact page. The public site reads the single 'site' row
-- anonymously, while admin users must be able to insert and update it.
-- This migration makes that access explicit and idempotent, so a project whose
-- policies drifted from the baseline can be repaired by running it.

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_public_select" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_staff_select" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_write" ON public.site_settings;

CREATE POLICY "site_settings_public_select" ON public.site_settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "site_settings_staff_select" ON public.site_settings
  FOR SELECT USING (public.is_editor_or_admin());

CREATE POLICY "site_settings_write" ON public.site_settings
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.site_settings_id_seq TO authenticated;

-- The site reads exactly one settings row. Create it up front so admins always
-- edit an existing row and anonymous visitors can read the full settings object.
INSERT INTO public.site_settings (setting_key, setting_value, is_public)
VALUES ('site', '{}'::jsonb, true)
ON CONFLICT (setting_key) DO NOTHING;

-- A settings row left private is invisible to the public site; the site row
-- exists to be read anonymously, so make that explicit.
UPDATE public.site_settings SET is_public = true WHERE setting_key = 'site';

COMMIT;
