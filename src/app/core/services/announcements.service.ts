import { Service, computed, inject, signal } from '@angular/core';
import type {
  Announcement,
  AnnouncementCategoryId,
} from '../models/announcement.model';
import type { AnnouncementRecord } from '../models/supabase.model';
import { SupabaseService } from './supabase.service';

const CATEGORY_IDS: readonly AnnouncementCategoryId[] = [
  'admissions',
  'holidays',
  'events',
  'general-notices',
];

/**
 * Public reads only expose announcements published from the admin dashboard.
 * Drafts are excluded by the query and by RLS for anonymous visitors.
 */
@Service()
export class AnnouncementsService {
  private readonly client = inject(SupabaseService).client;
  private readonly state = signal<readonly Announcement[]>([]);
  private loadPromise: Promise<void> | null = null;

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly published = computed(() =>
    this.state()
      .filter((item) => item.isPublished && item.isActive && item.isConfirmed)
      .slice()
      .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')),
  );

  readonly latest = computed(() => this.published().slice(0, 3));

  readonly drafts = computed(() => this.state().filter((item) => !item.isPublished));

  constructor() {
    void this.load();
  }

  /**
   * Reloads published announcements from Supabase. Concurrent callers share
   * the same request, so opening several public pages does not duplicate work.
   */
  load(): Promise<void> {
    if (this.loadPromise) return this.loadPromise;

    this.loading.set(true);
    this.error.set(null);

    this.loadPromise = this.fetchPublished()
      .then((rows) => {
        this.state.set(rows.map((row) => this.toAnnouncement(row)));
      })
      .catch((err: unknown) => {
        this.error.set(
          err instanceof Error ? err.message : 'Failed to load announcements.',
        );
      })
      .finally(() => {
        this.loading.set(false);
        this.loadPromise = null;
      });

    return this.loadPromise;
  }

  private async fetchPublished(): Promise<AnnouncementRecord[]> {
    const { data, error } = await this.client
      .from('announcements')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as AnnouncementRecord[];
  }

  private toAnnouncement(row: AnnouncementRecord): Announcement {
    const description = row.description?.trim() ?? '';
    const category = CATEGORY_IDS.includes(row.category as AnnouncementCategoryId)
      ? (row.category as AnnouncementCategoryId)
      : 'general-notices';

    return {
      id: String(row.id),
      title: row.title,
      summary: this.excerpt(description),
      description,
      category,
      publishedAt: row.published_at ? row.published_at.slice(0, 10) : null,
      imageUrl: row.image_url ?? undefined,
      imageAlt: row.title,
      isPublished: row.is_published,
      isActive: true,
      isConfirmed: true,
    };
  }

  private excerpt(value: string): string {
    if (value.length <= 180) return value;
    const cut = value.slice(0, 180);
    const lastSpace = cut.lastIndexOf(' ');
    return `${(lastSpace > 120 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
  }
}
