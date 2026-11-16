BEGIN;

-- Drop verified legacy duplicate admin-management policies.
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can manage facilities" ON public.facilities;
DROP POLICY IF EXISTS "Admins can manage gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can manage page contents" ON public.page_contents;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can view own profile" ON public.admin_profiles;

-- Drop verified legacy duplicate public-read policies.
DROP POLICY IF EXISTS "Public can view published announcements" ON public.announcements;
DROP POLICY IF EXISTS "Public can view published facilities" ON public.facilities;
DROP POLICY IF EXISTS "Public can view published gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Public can view published pages" ON public.page_contents;
DROP POLICY IF EXISTS "Public can view public settings" ON public.site_settings;

COMMIT;
