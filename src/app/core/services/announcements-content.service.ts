import { Service, computed, inject, signal } from '@angular/core';
import { ANNOUNCEMENT_CATEGORIES } from '../data/announcement-categories';
import { ANNOUNCEMENTS_CONTENT } from '../data/announcements.seed';
import { mergeWithSeed } from '../data/seed-merge';
import type { AnnouncementsContent } from '../models/announcements-content.model';
import type { AnnouncementCategoryId } from '../models/announcement.model';
import { AnnouncementsService } from './announcements.service';
import { PageContentsService } from './page-contents.service';

export interface AnnouncementFilter {
  readonly id: AnnouncementCategoryId | 'all';
  readonly label: string;
  readonly count: number;
}

/**
 * Page copy, the category list and filter counts for the Announcements page.
 * Published notices themselves stay in AnnouncementsService.
 * Phase 4 replaces the seed with a Supabase read of the page record.
 */
@Service()
export class AnnouncementsContentService {
  private readonly announcements = inject(AnnouncementsService);
  private readonly pageContents = inject(PageContentsService);
  private readonly state = signal<AnnouncementsContent>(ANNOUNCEMENTS_CONTENT);

  readonly content = this.state.asReadonly();
  readonly categories = ANNOUNCEMENT_CATEGORIES;
  readonly published = this.announcements.published;

  constructor() {
    void this.loadPageContent();
  }

  async reload(): Promise<void> {
    await Promise.all([this.loadPageContent(), this.announcements.load()]);
  }

  private async loadPageContent(): Promise<void> {
    const saved = await this.pageContents.load<Partial<AnnouncementsContent>>('announcements');
    if (saved) {
      this.state.set(mergeWithSeed(ANNOUNCEMENTS_CONTENT, saved));
    }
  }

  readonly filters = computed<readonly AnnouncementFilter[]>(() => {
    const published = this.published();
    return [
      { id: 'all', label: 'All', count: published.length },
      ...ANNOUNCEMENT_CATEGORIES.map((category) => ({
        id: category.id,
        label: category.label,
        count: published.filter((item) => item.category === category.id).length,
      })),
    ];
  });
}
