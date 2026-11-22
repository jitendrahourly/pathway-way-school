-- Optional alt text for facility photographs.
--
-- When empty the public site falls back to the built-in photograph's alt (for
-- unchanged seed images) or the facility title. Existing rows are left as-is so
-- the fallback keeps working until an admin supplies their own description.

ALTER TABLE public.facilities ADD COLUMN IF NOT EXISTS image_alt text;
