-- Facility photo captions and highlight bullets.
--
-- The public facilities page shows a short caption beneath each photograph and
-- up to three key-feature bullet points beside the description. Both are
-- optional and administrator-managed from the facility editor.
--
-- Idempotent: the columns are added only when missing, captions/highlights are
-- backfilled only while they are still null, and the enriched description
-- replaces the original one-line placeholder only when it has not been edited.

ALTER TABLE public.facilities ADD COLUMN IF NOT EXISTS caption text;
ALTER TABLE public.facilities ADD COLUMN IF NOT EXISTS highlights text[];

UPDATE public.facilities f
SET
  description = CASE
    WHEN f.description IS NULL OR f.description = v.old_description THEN v.new_description
    ELSE f.description
  END,
  caption = COALESCE(f.caption, v.caption),
  highlights = COALESCE(f.highlights, v.highlights)
FROM (
  VALUES
    (
      'Library',
      'A quiet space for reading, reference and research.',
      'A quiet, well-lit reading space stocked with story books, reference material and periodicals, where students borrow books, read independently and gather sources for their projects.',
      'Reading and reference time in the school library',
      ARRAY[
        'Age-appropriate story and reference collection',
        'Quiet reading and study seating',
        'Regular library periods for every class'
      ]::text[]
    ),
    (
      'Science Lab',
      'Hands-on experiments that bring science to life.',
      'A dedicated practical laboratory where students carry out hands-on experiments for physics, chemistry and biology under teacher supervision, building observation, measurement and reasoning skills.',
      'A practical science session in progress',
      ARRAY[
        'Hands-on practical experiments',
        'Teacher-supervised apparatus and safety routines',
        'Separate stations for physics, chemistry and biology'
      ]::text[]
    ),
    (
      'Computer Lab',
      'Practical digital skills for a technology-driven world.',
      'A networked computer laboratory where students build digital literacy — from typing and file handling to introductory coding — through guided, hands-on sessions at individual workstations.',
      'Students at work in the computer laboratory',
      ARRAY[
        'Individual workstations for every student',
        'Guided digital literacy and introductory coding lessons',
        'Structured, teacher-led practical sessions'
      ]::text[]
    ),
    (
      'Playground',
      'Open space for sport, fitness and team spirit.',
      'An open, shaded play area used for daily physical activity, games and team sports, supporting fitness, coordination and healthy competition across all age groups.',
      'The school playground during break',
      ARRAY[
        'Open ground for daily physical activity',
        'Space for team games and sports drills',
        'Shaded areas for outdoor assemblies'
      ]::text[]
    ),
    (
      'Classrooms',
      'Spaces for daily teaching and learning across the school.',
      'Bright, well-ventilated classrooms arranged for daily teaching and learning, with space for group work, discussion and displaying student work throughout the school year.',
      'A classroom during a lesson',
      ARRAY[
        'Well-ventilated, naturally lit rooms',
        'Seating arranged for group work and discussion',
        'Display boards for student work'
      ]::text[]
    )
) AS v(title, old_description, new_description, caption, highlights)
WHERE lower(f.title) = lower(v.title);

-- Refresh PostgREST schema cache so the new columns are visible to the API.
NOTIFY pgrst, 'reload schema';
