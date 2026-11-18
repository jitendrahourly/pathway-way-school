import type { GalleryContent } from '../models/gallery-content.model';

/**
 * Gallery page copy. The photographs themselves live in the shared gallery store
 * (site.seed / Supabase `gallery_images` table) so the homepage highlights and
 * this page always read the same ordered records.
 * Phase 4 replaces the seed with a Supabase read of the page record.
 */
export const GALLERY_CONTENT: GalleryContent = {
  banner: {
    title: 'Gallery',
    subtitle: 'Moments from school life',
    imageUrl: '/images/gallery/gallery-03.jpg',
    imageAlt: 'Students seated together at the morning assembly',
  },
  intro: {
    eyebrow: 'Our Gallery',
    title: 'Life at Bright Way School',
    paragraphs: [
      'Photographs of learning, sport, play and celebrations from across the school year.',
      'New photographs are added as they are confirmed by the school office.',
    ],
    note: 'Photographs in this gallery are representative placeholders and will be replaced with photographs of the school.',
  },
  filterLabel: 'Filter photographs by category',
  emptyTitle: 'No photographs in this category yet',
  emptyMessage:
    'Photographs for this category will be added once they are confirmed by the school office.',
  resetLabel: 'Show all photographs',
  placeholderLabel: 'Placeholder photograph — school photograph pending',
};
