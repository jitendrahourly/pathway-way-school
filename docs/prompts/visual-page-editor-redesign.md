# Task: Extend the Home visual page editor to all remaining main pages and subpages

You are working in the repository `D:\Office Projects\bright-way-school`, an Angular 22 standalone application (`@angular/core ^22.2.0`) with reactive forms, signals, `OnPush` change detection, and SCSS component styles.

## Mission

The admin Home page content editor at `/admin/page-content/home/main` has already been redesigned so that it visually mirrors the public home page section-by-section, with a live preview above the fields for each section.

Apply the same treatment to every remaining main page and every content subpage. This is an **admin editor UX redesign only**. Do not redesign the public site, change database content, or alter the saved payload shape.

The result should let an editor open any page, immediately understand where each field appears on the public page, and watch their edits update a live preview while typing.

## Read the canonical implementation first

Before writing code, read these files carefully and treat the Home branch as the source of truth for layout, spacing, naming, and signal patterns:

- `src/app/features/admin/page-content/main-page-content-form.html` — the `@if (slug() === 'home')` block, especially:
  - `.main-form__quick-nav` and `.quick-nav__item`
  - `.home-editor`
  - `.home-card`, `.home-card__head`, `.home-card__step`, `.home-card__head-text`, `.home-card__pill`
  - `.home-card__preview`, `.home-card__preview-label`, `.home-card__preview-dot`
  - `.home-card__body`, `.home-field-row`, `.field__hint`
  - the `hero-preview` mock markup
- `src/app/features/admin/page-content/main-page-content-form.ts` — especially:
  - `homeValue = toSignal(this.form.controls.home.valueChanges.pipe(map(() => ...getRawValue())))`
  - `homePreview = computed(...)`
  - `private text(value: unknown): string`
  - `getHomeHighlightIcon(index)`
  - `scrollToSection(id, event)`
- `src/app/features/admin/page-content/main-page-content-form.scss` — the complete `.home-editor` / `.home-card` / preview styles and responsive rules.
- `src/app/features/admin/page-content/page-content-form.ts` and `.html` — the generic subpage editor.
- `src/app/features/admin/page-content/management-content-form.ts` and `.html` — the About Management editor.
- `src/app/core/data/page-content-previews.ts` — canonical slug, group, and public preview URL list.
- `src/app/core/data/main-pages.seed.ts` and `content-pages.seed.ts` — the real field shapes and seed copy.
- The public templates for each page so the preview matches what visitors actually see.

Do not modify the Home editor's behavior. If you extract shared styles or presentational preview components, keep Home rendering identically.

## Scope

### A. Main pages — `main-page-content-form.html/.ts/.scss`

Home is already complete. Redesign the remaining eight main pages, one at a time:

1. `about`
2. `academics`
3. `admissions`
4. `contact`
5. `facilities`
6. `school-life`
7. `gallery`
8. `announcements`

Each page currently has its own `@if (slug() === '...')` branch in the form template. Keep that routing pattern. For each page:

- Add a page-specific quick-nav with section jumps and live array counts.
- Add a page-specific subtitle in the header explaining that the sections mirror the public page.
- Replace the flat form layout with numbered visual section cards.
- Add a live preview panel above the fields in each card.
- Keep all existing `formGroupName`, `formArrayName`, and `formControlName` bindings unchanged.

Use these public section mappings as the card order:

**About (`/about`, form group `about`)**
1. Banner — `banner.title`, `banner.subtitle`, `banner.imageUrl`, `banner.imageAlt` → public hero.
2. Our Story — `story.eyebrow`, `story.title`, `story.paragraphs` → `ab-story`.
3. Core Pillars — repeatable `pillars` array (icon, title, text) → `ab-pillars`.
4. Feature Photo — `photo.url`, `photo.alt` → `ab-photo`.
5. Page Sections — repeatable `sections` array (title, body/paragraphs, optional bullets) → `ab-chapters` / `ab-chapter`.
6. Publishing.

**Academics (`/academics`, form group `academics`)**
1. Banner.
2. Program Intro — `intro.eyebrow`, `intro.title`, `intro.paragraphs`, `intro.imageUrl`, `intro.imageAlt`, `intro.badge`, plus repeatable `intro.quickStats` (num, label) → intro + stat pills.
3. Academic Stages — `stagesHeading` (eyebrow, title, subtitle), repeatable `stages` array → stage cards.
4. At a Glance — repeatable `cards` array → glance cards.
5. Curriculum Sections — repeatable `sections` array → section blocks.
6. Call to Action — `cta` fields.
7. Publishing.

**Admissions (`/admissions`, form group `admissions`)**
1. Banner.
2. Intro — `intro.eyebrow`, `intro.title`, `intro.paragraphs`, `intro.note`.
3. Information Sections — repeatable `sections` array (title, message) → pending cards.
4. Contact Block — `contact.title`, `contact.intro`, `contact.note`.
5. Publishing.

**Contact (`/contact`, form group `contact`)**
1. Banner.
2. Intro.
3. Contact Form Copy — `form.eyebrow`, `form.title`, `form.intro`, all field labels, submit label, success/error messages. Preview should render a realistic disabled form mock, not a working form.
4. Contact Cards — `cards` labels and titles.
5. Map — `map.title`, `map.intro`, `map.emptyMessage`.
6. Directions — `directions.title`, `directions.intro`, `directions.steps` (one per line).
7. Office Hours — `officeHours.title`, `officeHours.lines`.
8. Instagram — `instagram.eyebrow`, `instagram.title`, `instagram.text`, `instagram.buttonLabel`.
9. School Details — `schoolDetails.title`, `schoolDetails.lines`.
10. Publishing.

**Facilities (`/facilities`, form group `facilities`)**
1. Banner.
2. Intro — `intro.eyebrow`, `intro.title`, `intro.paragraphs`, `intro.note`.
3. Grid Headings — `gridEyebrow`, `gridHeading`.
4. Details Heading — `detailsHeading`.
5. Additional Facilities — `additionalHeading`, repeatable `additional` array.
6. Publishing.

The facilities stats strip and subpage navigation are derived from other data. Do not add editable fields for them; show a short read-only note inside the relevant preview if useful.

**School Life (`/school-life`, form group `schoolLife`)**
1. Banner.
2. Stats Strip — repeatable `stats` array (value, label).
3. Intro — `intro.eyebrow`, `intro.title`, `intro.paragraphs`.
4. Activity Cards — repeatable `cards` array.
5. Call to Action — `cta` fields.
6. Publishing.

**Gallery (`/gallery`, form group `gallery`)**
1. Banner.
2. Intro — `intro.eyebrow`, `intro.title`, `intro.paragraphs`, `intro.note`.
3. Gallery Controls — `filterLabel`, `emptyTitle`, `emptyMessage`, `resetLabel`, `placeholderLabel`. Preview should show filter chips and placeholder tiles, not live gallery records.
4. Publishing.

**Announcements (`/announcements`, form group `announcements`)**
1. Banner.
2. Intro.
3. List Settings — `listHeading`, `filterLabel`.
4. Empty State — `empty.title`, `empty.message`, `empty.contactNote`.
5. Detail Labels — `detail.backLabel`, `detail.unavailableTitle`, `detail.unavailableMessage`, `detail.unavailableLinkLabel`, `detail.fallbackBannerSubtitle`.
6. Publishing.

Preview sample announcement cards with clearly representative placeholder content. Do not query or embed real announcement records in the editor.

### B. Content subpages — `page-content-form.html/.ts/.scss`

This generic editor serves all subpages registered in `PAGE_CONTENT_PREVIEWS`:

- About: `about-our-school`, `about-vision-mission`, `about-history`
- Academics: `academics-kindergarten`, `academics-primary`, `academics-middle`, `academics-high`
- Events & School Life: `school-life-events`, `school-life-student-activities`, `school-life-sports`, `school-life-arts-culture`, `school-life-clubs`, `school-life-achievements`
- Facilities: `facilities-classrooms`, `facilities-library`, `facilities-computer-lab`, `facilities-sports`, `facilities-other`
- Admissions: `admissions-process`, `admissions-required-documents`, `admissions-enquiry`, `admissions-faqs`

All of these render through `src/app/features/public/content-page/content-page.html`. Mirror that template's actual order, not a generic guess:

1. **Page Banner** — title, subtitle, image, alt.
2. **Intro / Overview** — paragraphs, bullets, optional note, optional media badge.
3. **Stage Summary Card** — only when `hasPageBlocks()` is true. Include tag, title, grades badge, CTA label, and repeatable stage facts (label, value, icon).
4. **Page Headings** — overview eyebrow, highlights heading, sections eyebrow/title, FAQs eyebrow/title/subtitle. Only show the fields the public page actually uses for that page family.
5. **Content Sections** — repeatable `sections` array with title, paragraphs, bullets.
6. **FAQs** — repeatable `faqs` array with question and answer.
7. **Call to Action** — only when the page has a CTA. Tag, title, text, primary label, secondary label.
8. **Publishing** — slug and published state.

Adapt framing by page family without changing fields:

- About subpages: "Our School", "Vision & Mission", "History" framing.
- Academics subpages: stage/grade framing, e.g. "Kindergarten", "Primary School".
- Events & School Life: activity/event framing.
- Facilities: facility-detail framing.
- Admissions: process/document/enquiry/FAQ framing.

Use `CONTENT_PAGES[slug]`, `hasPageBlocks()`, `isAcademicPage()`, and existing copy defaults so previews show sensible fallbacks. Keep "Load Default Content" working exactly as before.

### C. About Management — `management-content-form.html/.ts/.scss`

Public page: `/about/management`, with sections `mg-hero`, `mg-facts`, `mg-governance`, `mg-faculty`, `mg-cta`.

Redesign in this order:

1. Banner.
2. Principal's Message — `principal.name`, `principal.role`, `principal.message`, `principal.messageSecondary`, `principal.imageUrl`.
3. School Facts — repeatable `facts` array (icon, label, value).
4. Faculty Intro — `facultyIntro`.
5. Faculty — repeatable `faculty` array.
6. Faculty Note — `facultyNote`.
7. Publishing.

The public CTA is static. Do not add editable CTA fields.

## Visual anatomy for every section card

Reuse the Home editor's structure and class naming for consistency. If you prefer neutral naming, add aliases rather than removing the `.home-card` classes.

Each card must contain:

1. **Header**
   - Zero-padded step number: `01`, `02`, ...
   - Title.
   - Optional pill describing the section: "First screen", "Repeatable", "Optional", "Auto-generated", etc.
   - One-sentence description of where this appears on the public page.

2. **Live preview panel**
   - A realistic miniature of the public section.
   - The `.home-card__preview-label` "Live preview" badge with dot.
   - Decorative mock controls must be `aria-hidden="true"` and non-interactive.
   - Sensible empty states, e.g. "No image selected", "No items yet — add one below".
   - Preview text must fall back to placeholders when fields are empty, as Home does.

3. **Fields**
   - Labels in plain language, not raw field names.
   - Hints for non-obvious fields (image dimensions, line-per-item textareas, where the copy appears).
   - Two-column `.form-grid.form-grid--2` where appropriate, collapsing to one column on mobile.
   - `.home-field-row` spacing between rows.

4. **Repeatable arrays**
   - Count shown in the card title and quick-nav.
   - Each item visually grouped with an index or mini-heading.
   - Add and remove buttons consistent with the Home highlights pattern.
   - Empty state in both the list and preview.
   - Preserve every existing array control name and item shape.

5. **Publishing card**
   - Published toggle/state.
   - Existing save, cancel/back, preview, and status/error messaging.
   - Keep it at the end with a quick-nav jump.

## Quick navigation

Add a page-specific `.main-form__quick-nav` for each main page, and one for the subpage editor and management editor.

- Label: "Jump to:".
- One button per card, using the same `scrollToSection(id, $event)` behavior.
- Show array counts where relevant, e.g. "Core Pillars (4)".
- Horizontal scroll on narrow screens, no wrapping into a tall block.
- `aria-label` must identify the page, e.g. "About Page Sections Navigation".

## Live preview implementation rules

Use the exact Home pattern. For each page group, create a signal-backed snapshot and a computed view model:

```ts
private readonly aboutValue = toSignal(
  this.form.controls.about.valueChanges.pipe(
    map(() => this.form.controls.about.getRawValue() as FormValue),
  ),
  { initialValue: this.form.controls.about.getRawValue() as FormValue },
);

protected readonly aboutPreview = computed(() => {
  const value = this.aboutValue();
  const banner = (value['banner'] ?? {}) as FormValue;
  return {
    banner: {
      title: this.text(banner['title']),
      subtitle: this.text(banner['subtitle']),
      imageUrl: this.text(banner['imageUrl']),
      imageAlt: this.text(banner['imageAlt']),
    },
    // ...
  };
});
```

Rules:

- Use `getRawValue()` so disabled controls still preview.
- Initialize with the current raw value, because `patchValue()` runs after the signal is created.
- Normalize strings with the existing `text()` helper.
- For repeatable arrays, read `this.<array>.controls` directly in the template, or include them in the computed snapshot. Adding/removing an item must update both the preview and the count.
- Preview icon fields through the existing icon registry/helper pattern (`IconName`, `UiIcon`, `getHomeHighlightIcon`-style helper). Never render arbitrary icon strings directly.
- If the generic subpage editor needs many previews, use one `formValue = toSignal(this.form.valueChanges...)` signal plus computed slices, rather than one signal per field.
- Do not use `ngModel`, manual subscriptions, or `ChangeDetectorRef.detectChanges()`.
- Keep components `standalone` and `ChangeDetectionStrategy.OnPush`.

If a page template becomes too large, extract **presentational preview components** that accept plain values as `input()` and render mock markup. Do not pass `FormGroup` into child components unless you also wire `ControlContainer` correctly; keeping form bindings in the parent is safer.

## Hard constraints and guardrails

- **Do not rename** any form control, form group, or form array. Existing names include `is_published`, `page_slug`, `banner`, `intro`, `story`, `pillars`, `photo`, `sections`, `stages`, `cards`, `cta`, `stage`, `facts`, `faqs`, `additional`, `stats`, `empty`, `detail`, `principal`, `faculty`, etc.
- **Do not change** `submit()`, `load()`, `applyContent()`, `restoreDefaultContent()`, seed merging, slug handling, publish handling, image upload handling, or saved payload shape.
- **Do not change** public templates, routes, seed content, `PAGE_CONTENT_PREVIEWS`, or Supabase models.
- Keep `formControlName`, `formGroupName`, and `formArrayName` bindings exactly as they are.
- Keep the existing "Load Default Content", "Preview page", and "Back to list" actions.
- Keep the existing loading, error, success, and saving states.
- Do not remove validators or make previously optional fields required.
- Do not add fields that have no storage/public rendering counterpart.
- Do not overwrite unrelated uncommitted changes in the repository.

## Styling

- Match the Home editor's visual language: soft card surfaces, subtle borders, rounded corners, step badges, preview panels, dotted "Live preview" labels, and clear field grouping.
- Reuse existing SCSS tokens/custom properties and admin form styles. Do not introduce a new design system.
- Use `.home-card` styles as the baseline. If the same rules are needed by three or more components, extract a shared SCSS partial (for example `src/app/features/admin/page-content/visual-editor.scss`) and `@use` it, rather than copy-pasting 500+ lines into every stylesheet.
- Responsive requirements:
  - Desktop: two-column field grids where appropriate.
  - Tablet (~900px): collapse to one column.
  - Mobile (~640px): full-width cards, horizontal-scrolling quick-nav, previews remain readable without horizontal overflow.
- Respect `prefers-reduced-motion` for any new transitions.
- Keep focus-visible styles on buttons and form controls.
- The current `anyComponentStyle` budget in `angular.json` is warning 28kB / error 32kB. Keep each component stylesheet under that. Prefer shared partials over raising the budget again. If a budget increase is truly unavoidable, make the smallest possible change and explain why.

## Implementation order

1. Read the canonical Home editor and all public templates listed above.
2. Redesign main pages in this order: About, Academics, Admissions, Contact, Facilities, School Life, Gallery, Announcements.
3. Run `npm run build` after every two pages to catch template/style errors early.
4. Redesign the generic subpage editor with family-aware labels and previews.
5. Redesign About Management.
6. Run the full verification checklist.

## Verification checklist

For each redesigned page:

- [ ] The editor loads seed content and any saved record correctly.
- [ ] Every existing field is still present and bound to the same control name.
- [ ] Editing text updates the live preview immediately.
- [ ] Changing an image URL updates the preview image; clearing it shows the empty state.
- [ ] Adding/removing a repeatable item updates the list, the preview, and the quick-nav count.
- [ ] Icon fields render a real icon preview.
- [ ] Saving persists the same payload shape as before; reload shows the saved values.
- [ ] "Load Default Content" still repopulates the form.
- [ ] "Preview page" opens the correct public URL with `?preview=1`.
- [ ] No console errors or Angular template errors.
- [ ] Layout works at 1440px, 1024px, 768px, and 390px with no horizontal overflow.
- [ ] Public pages are visually unchanged.
- [ ] `npm run build` passes.

Finally, report:

- Every file changed.
- Which pages are complete.
- Any shared style/preview extraction performed.
- Any page whose public layout could not be mirrored exactly, with the reason.
- Build result and any remaining risks.
