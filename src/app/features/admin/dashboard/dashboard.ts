import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { ContentService } from '../../../core/services/content.service';
import { MAIN_PAGES } from '../../../core/data/main-pages.seed';
import { CONTENT_PAGES } from '../../../core/data/content-pages.seed';
import type {
  AnnouncementRecord,
  GalleryImageRecord,
  PageContentRecord,
} from '../../../core/models/supabase.model';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private readonly adminAuth = inject(AdminAuthService);
  private readonly content = inject(ContentService);
  private readonly router = inject(Router);

  protected readonly profile = this.adminAuth.profile;
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly announcements = signal<AnnouncementRecord[]>([]);
  protected readonly galleryImages = signal<GalleryImageRecord[]>([]);
  protected readonly pageContents = signal<PageContentRecord[]>([]);

  protected readonly totalAnnouncements = computed(() => this.announcements().length);
  protected readonly publishedAnnouncements = computed(
    () => this.announcements().filter((item) => item.is_published).length,
  );
  protected readonly totalGalleryImages = computed(() => this.galleryImages().length);

  protected readonly totalPageContents = computed(() => this.pageContents().length);
  protected readonly publishedPageContents = computed(
    () => this.pageContents().filter((item) => item.is_published).length,
  );
  protected readonly draftPageContents = computed(
    () => this.pageContents().filter((item) => !item.is_published).length,
  );

  protected readonly knownPageSlugs = computed(() => [
    ...MAIN_PAGES.map((page) => page.slug),
    ...Object.keys(CONTENT_PAGES),
  ]);

  protected readonly configuredPageCount = computed(() => {
    const known = new Set(this.knownPageSlugs());
    return this.pageContents().filter((record) => known.has(record.page_slug)).length;
  });

  protected readonly defaultPageCount = computed(
    () => this.knownPageSlugs().length - this.configuredPageCount(),
  );

  protected readonly recentlyUpdatedPages = computed(() =>
    [...this.pageContents()]
      .sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''))
      .slice(0, 5),
  );

  protected readonly recentAnnouncements = computed(() =>
    [...this.announcements()]
      .sort((a, b) =>
        (b.created_at ?? b.published_at ?? '').localeCompare(a.created_at ?? a.published_at ?? ''),
      )
      .slice(0, 5),
  );

  protected readonly recentGalleryImages = computed(() =>
    [...this.galleryImages()]
      .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
      .slice(0, 3),
  );

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  protected editLink(slug: string): string {
    return MAIN_PAGES.some((page) => page.slug === slug)
      ? `/admin/page-content/${slug}/main`
      : `/admin/page-content/${slug}/edit`;
  }

  protected formatDate(value?: string | null): string {
    if (!value) return '—';
    // Date-only values would otherwise shift by a day in western time zones.
    const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const announcements = await this.content.select<AnnouncementRecord>('announcements', '*');
      if (this.content.error()) {
        this.error.set(this.content.error()?.message ?? 'Failed to load announcements.');
      }
      this.announcements.set(announcements);

      const galleryImages = await this.content.select<GalleryImageRecord>('gallery_images', '*');
      if (this.content.error()) {
        this.error.set(this.content.error()?.message ?? 'Failed to load gallery images.');
      }
      this.galleryImages.set(galleryImages);

      const pageContents = await this.content.select<PageContentRecord>('page_contents', '*');
      if (this.content.error()) {
        this.error.set(this.content.error()?.message ?? 'Failed to load page content.');
      }
      this.pageContents.set(pageContents);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load dashboard data.');
    } finally {
      this.loading.set(false);
    }
  }
}
