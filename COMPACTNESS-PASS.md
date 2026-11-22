# Homepage Admin Editor Compactness Pass

## Summary
Reduced font sizes, image dimensions, and spacing throughout the /admin/page-content/home/main editor to make the page more compact and fit more content on screen. All changes are scoped to this form's SCSS (main-page-content-form.scss) — shared components and other admin pages are untouched.

## Changes by Section

### Page Header
- Title: clamp(1.65–2.15rem) → 1.3rem (≈21px)

### Card Architecture
**Section cards (About, Academics, etc.)**
- Header padding: 1.35rem/1.6rem → 1rem/1.2rem
- Icon size: 44px → 36px, border-radius 12px → 10px
- h2: 1.22rem → 1.05rem
- Description: 0.86rem → 0.8rem
- Body padding: 1.6rem → 1.2rem, gap 1.25rem → 1rem

**Home cards (Hero, Highlights, etc.)**
- Head padding: 1.2rem/1.5rem → 1rem/1.2rem
- Step badge: 38px → 32px, font 0.8rem → 0.75rem, shadow reduced
- h2: 1.15rem → 1rem
- Description: 0.85rem → 0.8rem
- Preview padding: 1.5rem → 1.2rem
- Body padding: 1.4–1.5rem → 1.2rem, gap 1.15rem → 1rem

**Item cards (array items inside home sections)**
- Padding: 1.3rem → 1rem
- Gap: 1.15rem → 0.85rem
- Header padding-bottom: 0.85rem → 0.6rem

### Preview Blocks
**Hero preview**
- min-height: 300px → 220px
- Copy width: 430px → 390px, padding 2rem/2.1rem → 1.5rem/1.6rem
- Eyebrow: 0.67rem → 0.63rem
- Title: clamp(1.4–1.9rem) → 1.25rem
- Subtitle: 0.9rem → 0.83rem, max-width 34ch → 32ch
- Buttons: padding 0.55/1rem → 0.5/0.9rem, font 0.78rem → 0.73rem

**Highlights preview**
- Card padding: 1.1/0.85rem → 0.9/0.7rem
- Icon: 46px → 38px
- h3: 0.86rem → 0.8rem
- p: 0.75rem → 0.7rem

**About preview**
- Padding: 1.25rem → 1rem, gap 1.5rem → 1.2rem
- Image aspect-ratio: 4/3 → 5/4 (shorter)
- Badge: padding 0.5/0.8rem → 0.4/0.7rem, font 0.78rem → 0.7rem
- h3: 1.3rem → 1.05rem
- Text: 0.84rem → 0.76rem
- Button: padding 0.6/1.05rem → 0.5/0.9rem, font 0.8rem → 0.73rem

**Section intros preview**
- Gap: 0.9rem → 0.7rem
- Padding: 1.15/1.2rem → 0.85/0.95rem
- Centered padding: 1.4/1.2rem → 1/0.95rem
- Centered h3: 1.3rem → 1.05rem, margin-bottom 0.85rem → 0.6rem
- Centered p: 0.85rem → 0.78rem
- Icon: 34px → 28px
- h4: 0.9rem → 0.82rem
- p: 0.8rem → 0.74rem

**Smaller previews (stats, programs, events, why, admissions-cta)**
- Preview wrapper padding: 1rem → 0.75rem (stats, programs, events, why)
- Events media: 46px → 38px
- Admissions CTA: padding 1.25rem → 1rem, h3 1.1rem → 0.95rem

## Impact
- **Vertical space saved:** ~20–25% per card (measured across header + preview + body)
- **Image size:** Hero preview 80px shorter, about preview tighter aspect ratio (5:4 vs 4:3)
- **Typography:** ~10–20% smaller across all headings/body text in previews
- **Visual density:** More content visible per scroll, especially on laptop screens

## Preserved
- Form input fields (unchanged)
- Shared image-upload-field component (unchanged)
- Page structure (single-column cards, no layout changes)
- Color scheme, borders, shadows (proportionally adjusted but theme intact)
- Other admin pages (About, Academics, etc. editors keep original scale)

## Build Status
✓ npm run build passes (exit 0)
