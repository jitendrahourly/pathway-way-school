import { Service, computed, inject, signal } from '@angular/core';
import type { GalleryItem, GalleryCategoryId } from '../models/gallery-item.model';
import type { GalleryImageRecord } from '../models/supabase.model';
import { SupabaseService } from './supabase.service';

const CATEGORY_IDS: readonly GalleryCategoryId[] = [
  'school-activities',
  'sports',
  'cultural-events',
  'classroom',
  'celebrations',
];

/**
 * Public reads only expose gallery images published from the admin dashboard.
 * Drafts are excluded by the query and by RLS for anonymous visitors.
 */
@Service()
export class GalleryService {
  private readonly client = inject(SupabaseService).client;
  private readonly state = signal<readonly GalleryItem[]>([]);
  private loadPromise: Promise<void> | null = null;

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly active = computed(() =>
    this.state()
      .filter((image) => image.isActive)
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder),
  );

  readonly highlights = computed(() => this.active().slice(0, 4));

  constructor() {
    void this.load();
  }

  load(): Promise<void> {
    if (this.loadPromise) return this.loadPromise;

    this.loading.set(true);
    this.error.set(null);

    this.loadPromise = this.fetchPublished()
      .then((rows) => {
        this.state.set(rows.map((row) => this.toGalleryItem(row)));
      })
      .catch((err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Failed to load gallery images.');
      })
      .finally(() => {
        this.loading.set(false);
        this.loadPromise = null;
      });

    return this.loadPromise;
  }

  private async fetchPublished(): Promise<GalleryImageRecord[]> {
    const { data, error } = await this.client
      .from('gallery_images')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as GalleryImageRecord[];
  }

  private toGalleryItem(row: GalleryImageRecord): GalleryItem {
    const category = CATEGORY_IDS.includes(row.category as GalleryCategoryId)
      ? (row.category as GalleryCategoryId)
      : 'school-activities';

    return {
      id: String(row.id),
      title: row.title ?? 'Untitled image',
      description: row.description ?? '',
      imageUrl: row.image_url,
      imageAlt: row.title ?? 'Gallery image',
      category,
      displayOrder: row.display_order ?? 0,
      isActive: row.is_published,
      isPlaceholder: false,
    };
  }
}
