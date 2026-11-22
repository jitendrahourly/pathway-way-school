-- Seed the facilities table with the school's built-in facilities.
--
-- The public site reads facilities from this table as soon as it has any rows,
-- so without these records the first facility an admin creates replaces every
-- built-in card. Idempotent: existing titles are left untouched, and nothing is
-- overwritten or duplicated when this migration is re-run.

INSERT INTO public.facilities (title, description, image_url, display_order, is_published)
SELECT v.title, v.description, v.image_url, v.display_order, true
FROM (
  VALUES
    ('Library', 'A quiet space for reading, reference and research.', '/images/facilities/library.jpg', 1),
    ('Science Lab', 'Hands-on experiments that bring science to life.', '/images/facilities/science-lab.jpg', 2),
    ('Computer Lab', 'Practical digital skills for a technology-driven world.', '/images/facilities/computer-lab.jpg', 3),
    ('Playground', 'Open space for sport, fitness and team spirit.', '/images/facilities/playground.jpg', 4),
    ('Classrooms', 'Spaces for daily teaching and learning across the school.', '/images/gallery/gallery-02.jpg', 5)
) AS v(title, description, image_url, display_order)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.facilities f
  WHERE lower(f.title) = lower(v.title)
);
