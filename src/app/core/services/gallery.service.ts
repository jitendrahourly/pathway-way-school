import { Service, computed, signal } from '@angular/core';
import { GALLERY_IMAGES } from '../data/site.seed';
import type { GalleryItem } from '../models/gallery-item.model';

/** Phase 4 replaces the seed with a Supabase read ordered by display_order. */
@Service()
export class GalleryService {
  private readonly state = signal<readonly GalleryItem[]>(GALLERY_IMAGES);
  readonly active = computed(() =>
    this.state()
      .filter((image) => image.isActive)
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder),
  );
  readonly highlights = computed(() => this.active().slice(0, 4));
}
