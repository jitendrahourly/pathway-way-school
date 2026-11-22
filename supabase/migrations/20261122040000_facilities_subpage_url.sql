-- Per-facility "Explore … in detail" link target.
--
-- The facilities page links each facility card to a detail sub-page. The target
-- is administrator-managed from the facility editor; when it is empty the app
-- falls back to the built-in mapping for the facility's stable id.
--
-- Idempotent: the column is added only when missing and existing rows are
-- backfilled only while the value is still null.

ALTER TABLE public.facilities ADD COLUMN IF NOT EXISTS subpage_url text;

UPDATE public.facilities f
SET subpage_url = COALESCE(f.subpage_url, v.subpage_url)
FROM (
  VALUES
    ('Library', '/facilities/library'),
    ('Science Lab', '/facilities/other'),
    ('Computer Lab', '/facilities/computer-lab'),
    ('Playground', '/facilities/sports'),
    ('Classrooms', '/facilities/classrooms')
) AS v(title, subpage_url)
WHERE lower(f.title) = lower(v.title);
