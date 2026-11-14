import type { GalleryCategory, GalleryCategoryId } from '../models/gallery-item.model';

export const GALLERY_CATEGORIES: readonly GalleryCategory[] = [
  { id: 'school-activities', label: 'School Activities' },
  { id: 'sports', label: 'Sports' },
  { id: 'cultural-events', label: 'Cultural Events' },
  { id: 'classroom', label: 'Classroom' },
  { id: 'celebrations', label: 'Celebrations' },
];

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategoryId, string> = {
  'school-activities': 'School Activities',
  sports: 'Sports',
  'cultural-events': 'Cultural Events',
  classroom: 'Classroom',
  celebrations: 'Celebrations',
};
