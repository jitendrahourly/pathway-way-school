import type { HomeGalleryEntry, HomeGalleryImage } from '../models/home-content.model';

const FALLBACK_CAPTIONS: readonly string[] = [
  'Sports Day',
  'Classroom learning',
  'School assembly',
  'Science exploration',
];

const FALLBACK_ALTS: readonly string[] = [
  'Students taking part in sports day at Bright Way School',
  'A classroom learning session at Bright Way School',
  'Students gathered for a school assembly',
  'Students working with microscopes in the school science lab',
];

/**
 * Normalises saved gallery photographs. Records saved before captions and alt
 * text were editable store plain URL strings, so both shapes are accepted.
 */
export function galleryImages(
  entries: readonly HomeGalleryEntry[] | undefined,
): readonly HomeGalleryImage[] {
  return (entries ?? [])
    .map((entry, index) => {
      const legacy = typeof entry === 'string';
      const url = legacy ? entry : entry.url;
      const alt = legacy ? '' : entry.alt;
      const caption = legacy ? '' : entry.caption;

      return {
        url,
        alt: alt || FALLBACK_ALTS[index] || `Bright Way School photograph ${index + 1}`,
        caption: caption || FALLBACK_CAPTIONS[index] || `School photograph ${index + 1}`,
      };
    })
    .filter((image) => image.url.trim().length > 0);
}

export function galleryUrl(entries: readonly HomeGalleryEntry[] | undefined, index: number): string {
  return galleryImages(entries)[index]?.url ?? '';
}
