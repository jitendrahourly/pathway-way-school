import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CONTENT_PAGES } from '../../../core/data/content-pages.seed';
import { MAIN_PAGES } from '../../../core/data/main-pages.seed';
import {
  PAGE_CONTENT_GROUPS,
  pageContentPreview,
  type PageContentGroup,
} from '../../../core/data/page-content-previews';
import type { PageContentRecord } from '../../../core/models/supabase.model';
import { ContentService } from '../../../core/services/content.service';

const SCROLL_STORAGE_KEY = 'admin-page-content:scroll';

/** Superseded slugs whose old records must not resurface as custom rows. */
const RETIRED_SLUGS: ReadonlySet<string> = new Set([
  'events',
  'admissions',
  'admissions-process',
  'admissions-required-documents',
  'admissions-enquiry',
  'admissions-faqs',
]);

interface PageContentRow {
  readonly slug: string;
  readonly title: string;
  readonly kind: 'main' | 'content';
  readonly group: PageContentGroup;
  readonly previewUrl?: string;
  readonly isPublished: boolean;
  readonly configured: boolean;
  readonly updatedAt?: string;
}

@Component({
  selector: 'app-page-content-list',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './page-content-list.scss',
  templateUrl: './page-content-list.html',
})
export class PageContentList implements OnInit {
  private readonly content = inject(ContentService);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly rows = signal<PageContentRow[]>([]);
  protected readonly search = signal('');

  protected readonly deleteTarget = signal<PageContentRow | null>(null);
  protected readonly deleting = signal(false);

  protected readonly filtered = () => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.rows();
    return this.rows().filter((row) => {
      const slug = row.slug.toLowerCase();
      return (
        slug.includes(q) ||
        this.formatSlug(row.slug).toLowerCase().includes(q) ||
        row.title.toLowerCase().includes(q)
      );
    });
  };

  protected readonly grouped = () => {
    const groups = new Map<PageContentGroup, PageContentRow[]>();
    for (const row of this.filtered()) {
      const list = groups.get(row.group) ?? [];
      list.push(row);
      groups.set(row.group, list);
    }

    return PAGE_CONTENT_GROUPS.filter((group) => groups.has(group)).map((group) => ({
      name: group,
      rows: (groups.get(group) ?? []).sort((a, b) => a.slug.localeCompare(b.slug)),
    }));
  };

  async ngOnInit(): Promise<void> {
    await this.load();
    this.restoreScrollPosition();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const records = await this.content.select<PageContentRecord>('page_contents', '*');
      if (this.content.error()) {
        this.error.set(this.content.error()?.message ?? 'Failed to load page content.');
      }

      const bySlug = new Map(records.map((record) => [record.page_slug, record]));
      const main = MAIN_PAGES.map((page) =>
        this.toRow(page.slug, page.title, 'main', bySlug.get(page.slug)),
      );
      const content = Object.entries(CONTENT_PAGES).map(([slug, seed]) =>
        this.toRow(slug, seed.title, 'content', bySlug.get(slug)),
      );
      const knownSlugs = new Set([
        ...MAIN_PAGES.map((page) => page.slug),
        ...Object.keys(CONTENT_PAGES),
      ]);
      const custom = records
        .filter(
          (record) =>
            !knownSlugs.has(record.page_slug) && !RETIRED_SLUGS.has(record.page_slug),
        )
        .map((record) =>
          this.toRow(record.page_slug, record.page_slug, 'content', record),
        );

      this.rows.set([...main, ...content, ...custom]);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load page content.');
    } finally {
      this.loading.set(false);
    }
  }

  private toRow(
    slug: string,
    fallbackTitle: string,
    kind: 'main' | 'content',
    record?: PageContentRecord,
  ): PageContentRow {
    const title = record?.content?.['title'];
    const preview = pageContentPreview(slug);
    return {
      slug,
      title: typeof title === 'string' && title.trim() ? title : fallbackTitle,
      kind,
      group: preview?.group ?? (kind === 'main' ? 'Main Pages' : 'Other'),
      previewUrl: preview?.previewUrl,
      isPublished: record?.is_published ?? false,
      configured: record !== undefined,
      updatedAt: record?.updated_at,
    };
  }

  protected onSearch(value: string): void {
    this.search.set(value);
  }

  /**
   * Stores the list position so coming back from the editor returns to the row
   * that was being edited instead of the top of the page.
   */
  protected rememberScrollPosition(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(SCROLL_STORAGE_KEY, String(window.scrollY));
    } catch {
      // Storage may be unavailable (private mode); the list then opens at the top.
    }
  }

  private restoreScrollPosition(): void {
    if (typeof window === 'undefined') return;

    let offset = 0;
    try {
      offset = Number(sessionStorage.getItem(SCROLL_STORAGE_KEY) ?? 0);
      sessionStorage.removeItem(SCROLL_STORAGE_KEY);
    } catch {
      return;
    }
    if (!Number.isFinite(offset) || offset <= 0) return;

    // Wait for the loaded rows to render so the page is tall enough to scroll to.
    afterNextRender(
      () => window.scrollTo({ top: offset, left: 0, behavior: 'instant' }),
      { injector: this.injector },
    );
  }

  protected formatSlug(slug: string): string {
    return slug
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  protected formatDate(value?: string): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  protected previewLink(row: PageContentRow): { href: string; label: string } | null {
    if (!row.previewUrl) return null;
    const isDraft = row.configured && !row.isPublished;
    return {
      href: isDraft ? `${row.previewUrl}?preview=1` : row.previewUrl,
      label: isDraft ? 'Preview' : 'View page',
    };
  }

  protected edit(row: PageContentRow): void {
    this.rememberScrollPosition();
    if (row.kind === 'main') {
      this.router.navigateByUrl(`/admin/page-content/${row.slug}/main`);
      return;
    }
    this.router.navigateByUrl(`/admin/page-content/${row.slug}/edit`);
  }

  protected async togglePublish(row: PageContentRow): Promise<void> {
    if (!row.configured) {
      this.error.set('Save this page content before publishing it.');
      return;
    }
    await this.content.update<PageContentRecord>('page_contents', 'page_slug', row.slug, {
      is_published: !row.isPublished,
      updated_at: new Date().toISOString(),
    });
    if (this.content.error()) {
      this.error.set(this.content.error()?.message ?? 'Failed to update status.');
      return;
    }
    await this.load();
  }

  protected askDelete(row: PageContentRow): void {
    if (!row.configured) return;
    this.deleteTarget.set(row);
  }

  protected cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  protected async confirmDelete(): Promise<void> {
    const row = this.deleteTarget();
    if (!row) return;
    this.deleting.set(true);
    try {
      const ok = await this.content.remove('page_contents', 'page_slug', row.slug);
      if (!ok || this.content.error()) {
        this.error.set(this.content.error()?.message ?? 'Failed to delete page content.');
        return;
      }
      this.deleteTarget.set(null);
      await this.load();
    } finally {
      this.deleting.set(false);
    }
  }
}
