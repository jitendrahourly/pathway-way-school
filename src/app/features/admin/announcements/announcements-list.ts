import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { ContentService } from '../../../core/services/content.service';
import { StorageService } from '../../../core/services/storage.service';
import type { AnnouncementRecord } from '../../../core/models/supabase.model';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-announcements-list',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './announcements-list.scss',
  templateUrl: './announcements-list.html',
})
export class AnnouncementsList implements OnInit {
  private readonly content = inject(ContentService);
  private readonly storage = inject(StorageService);
  private readonly adminAuth = inject(AdminAuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly items = signal<AnnouncementRecord[]>([]);
  protected readonly search = signal('');
  protected readonly categoryFilter = signal('all');
  protected readonly statusFilter = signal('all');
  protected readonly page = signal(1);

  protected readonly deleteTarget = signal<AnnouncementRecord | null>(null);
  protected readonly deleting = signal(false);

  protected readonly categories = ['Admissions', 'Holidays', 'Events', 'General-Notices'];

  protected formatDate(value: string | null): string {
    if (!value) return '—';
    const date = new Date(`${value.slice(0, 10)}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  protected readonly filtered = () => {
    const q = this.search().trim().toLowerCase();
    return this.items().filter((item) => {
      if (this.categoryFilter() !== 'all' && item.category !== this.categoryFilter()) return false;
      if (this.statusFilter() === 'published' && !item.is_published) return false;
      if (this.statusFilter() === 'draft' && item.is_published) return false;
      if (q) {
        const hay = `${item.title ?? ''} ${item.description ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  };

  protected readonly totalPages = () => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE));

  protected readonly paged = () => {
    const start = (this.page() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  };

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const rows = await this.content.select<AnnouncementRecord>('announcements', '*');
      if (this.content.error()) {
        this.error.set(this.content.error()?.message ?? 'Failed to load announcements.');
      }
      const sorted = [...rows].sort((a, b) =>
        (b.created_at ?? b.published_at ?? '').localeCompare(a.created_at ?? a.published_at ?? ''),
      );
      this.items.set(sorted);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load announcements.');
    } finally {
      this.loading.set(false);
    }
  }

  protected onSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  protected onCategory(value: string): void {
    this.categoryFilter.set(value);
    this.page.set(1);
  }

  protected onStatus(value: string): void {
    this.statusFilter.set(value);
    this.page.set(1);
  }

  protected prevPage(): void {
    this.page.update((p) => Math.max(1, p - 1));
  }

  protected nextPage(): void {
    this.page.update((p) => Math.min(this.totalPages(), p + 1));
  }

  protected async togglePublish(item: AnnouncementRecord): Promise<void> {
    const next = !item.is_published;
    const payload: Partial<AnnouncementRecord> = {
      is_published: next,
      published_at: next
        ? item.published_at ?? new Date().toISOString().slice(0, 10)
        : item.published_at,
      updated_at: new Date().toISOString(),
    };
    await this.content.update<AnnouncementRecord>('announcements', 'id', item.id, payload);
    if (this.content.error()) {
      this.error.set(this.content.error()?.message ?? 'Failed to update status.');
      return;
    }
    await this.load();
  }

  protected askDelete(item: AnnouncementRecord): void {
    this.deleteTarget.set(item);
  }

  protected cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  protected async confirmDelete(): Promise<void> {
    const item = this.deleteTarget();
    if (!item) return;
    this.deleting.set(true);
    try {
      const ok = await this.content.remove('announcements', 'id', item.id);
      if (!ok || this.content.error()) {
        this.error.set(this.content.error()?.message ?? 'Failed to delete announcement.');
        return;
      }
      // Best-effort storage cleanup.
      if (item.image_url) {
        const path = this.storagePathFromUrl(item.image_url);
        if (path) {
          await this.storage.remove('school-assets', path);
        }
      }
      this.deleteTarget.set(null);
      await this.load();
    } finally {
      this.deleting.set(false);
    }
  }

  protected edit(item: AnnouncementRecord): void {
    this.router.navigateByUrl(`/admin/announcements/${item.id}/edit`);
  }

  private storagePathFromUrl(url: string): string | null {
    const marker = '/storage/v1/object/public/school-assets/';
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.slice(idx + marker.length));
  }
}
