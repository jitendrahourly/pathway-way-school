import { Service, computed, inject, signal } from '@angular/core';
import { GALLERY_CATEGORIES } from '../data/gallery-categories';
import { GALLERY_CONTENT } from '../data/gallery.seed';
import { mergeWithSeed } from '../data/seed-merge';
import type { GalleryContent } from '../models/gallery-content.model';
import type { GalleryCategoryId } from '../models/gallery-item.model';
import { GalleryService } from './gallery.service';
import { PageContentsService } from './page-contents.service';

export interface GalleryFilter {
  readonly id: GalleryCategoryId | 'all';
  readonly label: string;
  readonly count: number;
}

/**
 * Page copy for the Gallery page, the filter list with live counts and the
 * ordered photographs from the shared gallery store.
 * Phase 4 replaces the seed with a Supabase read of the page record.
 */
@Service()
export class GalleryContentService {
  private readonly gallery = inject(GalleryService);
  private readonly pageContents = inject(PageContentsService);
  private readonly state = signal<GalleryContent>(GALLERY_CONTENT);

  readonly content = this.state.asReadonly();
  readonly items = this.gallery.active;

  constructor() {
    void this.loadPageContent();
  }

  async reload(): Promise<void> {
    await Promise.all([this.loadPageContent(), this.gallery.load()]);
  }

  private async loadPageContent(): Promise<void> {
    const saved = await this.pageContents.load<Partial<GalleryContent>>('gallery');
    if (saved) {
      this.state.set(mergeWithSeed(GALLERY_CONTENT, saved));
    }
  }

  readonly filters = computed<readonly GalleryFilter[]>(() => {
    const items = this.items();
    return [
      { id: 'all', label: 'All', count: items.length },
      ...GALLERY_CATEGORIES.map((category) => ({
        ...category,
        count: items.filter((item) => item.category === category.id).length,
      })),
    ];
  });
}
