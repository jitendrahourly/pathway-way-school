BEGIN;

-- Make publication depend only on is_published, not on published_at.
DROP POLICY IF EXISTS "announcements_public_select" ON public.announcements;

CREATE POLICY "announcements_public_select"
  ON public.announcements
  FOR SELECT
  USING (is_published = true);

COMMIT;
