# Supabase Security Audit and First Admin Preparation

Project: Bright Way School  
Frontend: Angular 22  
Backend / Database: Supabase

This document is the security audit report for the existing Supabase project. It does
not recreate tables or buckets and does not modify school content or records.

Existing tables (unchanged): `admin_profiles`, `page_contents`, `facilities`,
`gallery_images`, `announcements`, `site_settings`.  
Existing buckets (unchanged): `gallery`, `school-assets` (both public).

---

## Part 1 - Review of existing setup

The initial schema is assumed to live in `supabase/migrations/0001_initial_schema.sql`
(not present in this repository). That migration is **not** modified by this audit.

Verified schema used by this audit:

- `admin_profiles(id UUID PK/FK -> auth.users.id, full_name TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'admin', created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ)`
- `page_contents(..., is_published BOOLEAN, ...)`
- `announcements(..., is_published BOOLEAN, published_at TIMESTAMPTZ, ...)`
- `facilities(..., is_published BOOLEAN, ...)`
- `gallery_images(..., is_published BOOLEAN, ...)`
- `site_settings(..., is_public BOOLEAN, ...)`
- Storage buckets: `gallery`, `school-assets` (both public)

---

## Part 2 - Identified vulnerabilities and fixes

### V1. Infinite recursion in `admin_profiles` policies (HIGH)

Policies queried `admin_profiles` inside a policy on `admin_profiles`, causing
`infinite recursion detected in policy for relation "admin_profiles"`.

**Fix:** all authorization goes through `SECURITY DEFINER` helpers that bypass RLS
internally. No policy subqueries `admin_profiles` directly.

### V2. Unsafe function `search_path` (MEDIUM)

**Fix:** helpers use `SECURITY DEFINER`, `STABLE`, and `SET search_path = ''`,
with fully qualified references (`public.admin_profiles`, `auth.uid()`). `EXECUTE`
is revoked from `PUBLIC` and granted only to `anon` and `authenticated`.

### V3. `is_admin()` conflated admin and editor (HIGH)

The existing `is_admin()` returned `true` for both `admin` and `editor`, so editors
received administrative permissions.

**Fix:** `is_admin()` now returns `true` only for `role = 'admin'`. New helpers
`is_editor()` and `is_editor_or_admin()` provide the editor scope. Content writes
use `is_editor_or_admin()`; admin-only operations use `is_admin()`.

### V4. Self-assignment of admin role (HIGH)

Public users could insert their own `admin_profiles` row or change their role.

**Fix:** `admin_profiles` has no INSERT policy for clients (explicit
`WITH CHECK (false)`). UPDATE and DELETE require `is_admin()`. Provisioning is
done only via the service role in the SQL Editor.

### V5. Editor over-permission (MEDIUM)

Editors must not manage `admin_profiles`, `site_settings`, or Storage files.

**Fix:** `site_settings` write and all Storage writes require `is_admin()`.
`admin_profiles` write requires `is_admin()`. Editors keep content management on
`page_contents`, `facilities`, `gallery_images`, `announcements`.

### V6. Storage write/delete not admin-only (MEDIUM)

**Fix:** `storage.objects` INSERT/UPDATE/DELETE on `gallery` and `school-assets`
require `public.is_admin()`. Public SELECT remains allowed.

### V7. Unpublished content readable publicly (MEDIUM)

**Fix:** public SELECT on `page_contents`, `announcements`, `facilities`,
`gallery_images` requires `is_published = true`; `site_settings` public SELECT
requires `is_public = true`. Staff policies allow reading all rows.

### V8. RLS not guaranteed enabled (LOW)

**Fix:** migration re-issues `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` for all
six tables (idempotent).

---

## Part 3 - First administrator provisioning (manual, trusted)

The first administrator is **never** created automatically and **never** via the
Angular frontend or any public API.

Steps:

1. Create the Auth user in Supabase Dashboard -> Authentication -> Users ->
   "Add user" (or via the Auth admin API using the service role key only in a
   trusted context). Note the user's UUID.

2. Retrieve the UUID:
   - Dashboard -> Authentication -> Users -> copy the user's `id`, or
   - SQL Editor (service role): `SELECT id, email FROM auth.users WHERE email = 'admin@example.com';`

3. Insert the admin profile using the SQL Editor (service role / trusted process):

```sql
INSERT INTO public.admin_profiles (id, full_name, role)
VALUES ('<AUTH_USER_UUID>', 'School Administrator', 'admin')
ON CONFLICT (id) DO NOTHING;
```

4. Verify:

```sql
SELECT id, full_name, role, created_at FROM public.admin_profiles WHERE id = '<AUTH_USER_UUID>';
```

Never expose the service-role key to Angular. Never create a frontend function that
grants admin privileges.

---

## Part 4 - Migration management

- Original initial migration (`0001_initial_schema.sql`) is **not** modified or
  deleted.
- Security corrections live in the separate, additive migration
  `supabase/migrations/0002_security_hardening.sql`.
- The migration is idempotent (`DROP POLICY IF EXISTS` via a `DO` block,
  `CREATE OR REPLACE FUNCTION`, `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) and
  contains no `DELETE`/`TRUNCATE` or data changes.
- Review every statement in the Supabase SQL Editor before running.

### Applying the migration

1. Open Supabase Dashboard -> SQL Editor.
2. Paste the contents of `supabase/migrations/0002_security_hardening.sql`.
3. Review all statements.
4. Click "Run".
5. Confirm no errors in the output.

### Rollback considerations

The migration only adds/replaces policies and functions and enables RLS. To roll
back:

- Drop the policies created by this migration (names listed in the migration).
- Restore the previous `is_admin()` definition if needed.
- Disabling RLS (`ALTER TABLE ... DISABLE ROW LEVEL SECURITY`) is **not**
  recommended; instead re-apply a corrected policy set.
- No data or schema objects are destroyed, so rollback does not affect content.

---

## Part 5 - Verification SQL

Run these in the Supabase SQL Editor.

### RLS enabled on all tables

```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('admin_profiles','page_contents','facilities','gallery_images','announcements','site_settings');
```

Expected: `rowsecurity = true` for all six.

### Policies present

```sql
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname IN ('public','storage')
ORDER BY tablename, policyname;
```

### Helper functions

```sql
SELECT proname, prosecdef, provolatile, proconfig
FROM pg_proc
WHERE proname IN ('is_admin','is_editor','is_editor_or_admin','has_role')
  AND pronamespace = 'public'::regnamespace;
```

Expected: `prosecdef = true`, `provolatile = 's'` (STABLE), `proconfig` contains
`search_path=` (empty).

### Anonymous access: only published content visible

```sql
SET ROLE anon;
SELECT count(*) AS unpublished_page_contents FROM public.page_contents WHERE is_published = false;
SELECT count(*) AS unpublished_announcements FROM public.announcements WHERE is_published = false OR published_at > now();
SELECT count(*) AS unpublished_facilities FROM public.facilities WHERE is_published = false;
SELECT count(*) AS unpublished_gallery FROM public.gallery_images WHERE is_published = false;
SELECT count(*) AS non_public_settings FROM public.site_settings WHERE is_public = false;
RESET ROLE;
```

Expected: each count returns `0` (no rows visible to anon).

### Anonymous cannot create admin profile

```sql
SET ROLE anon;
-- Expected to fail with an RLS policy violation:
INSERT INTO public.admin_profiles (id, full_name, role)
VALUES (gen_random_uuid(), 'Hacker', 'admin');
RESET ROLE;
```

### Anonymous can read, cannot write Storage

```sql
SET ROLE anon;
SELECT count(*) FROM storage.objects WHERE bucket_id IN ('gallery','school-assets');
-- Expected to fail:
INSERT INTO storage.objects (bucket_id, name) VALUES ('gallery', 'test.txt');
RESET ROLE;
```

### Authenticated non-admin has no admin privileges

```sql
-- As an authenticated user without an admin_profiles row:
SELECT public.is_admin();            -- false
SELECT public.is_editor_or_admin();  -- false
```

### Admin vs editor role checks

```sql
-- As an admin user:
SELECT public.is_admin();            -- true
SELECT public.is_editor();           -- false
SELECT public.is_editor_or_admin();  -- true

-- As an editor user:
SELECT public.is_admin();            -- false
SELECT public.is_editor();           -- true
SELECT public.is_editor_or_admin();  -- true
```

### Storage: only admins can write

```sql
SET ROLE authenticated;
-- As a non-admin authenticated user, expected to fail:
INSERT INTO storage.objects (bucket_id, name, owner)
VALUES ('gallery', 'test.txt', auth.uid());
RESET ROLE;
```
