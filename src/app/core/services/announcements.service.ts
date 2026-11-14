import { Service, computed, signal } from '@angular/core';
import { ANNOUNCEMENTS } from '../data/site.seed';
import type { Announcement } from '../models/announcement.model';

/**
 * Public reads only expose entries that are published, active and confirmed.
 * Drafts stay in `drafts` for the admin dashboard.
 */
@Service()
export class AnnouncementsService {
  private readonly state = signal<readonly Announcement[]>(ANNOUNCEMENTS);

  readonly published = computed(() =>
    this.state()
      .filter((item) => item.isPublished && item.isActive && item.isConfirmed && item.publishedAt)
      .slice()
      .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')),
  );

  readonly latest = computed(() => this.published().slice(0, 3));

  readonly drafts = computed(() => this.state().filter((item) => !item.isPublished));
}
