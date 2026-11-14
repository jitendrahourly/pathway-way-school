export type GalleryCategoryId =
  | 'school-activities'
  | 'sports'
  | 'cultural-events'
  | 'classroom'
  | 'celebrations';

export interface GalleryCategory {
  readonly id: GalleryCategoryId;
  readonly label: string;
}

export interface GalleryItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly category: GalleryCategoryId;
  readonly displayOrder: number;
  readonly isActive: boolean;
  /** True while the image is a stand-in rather than a photograph of the school. */
  readonly isPlaceholder: boolean;
}
