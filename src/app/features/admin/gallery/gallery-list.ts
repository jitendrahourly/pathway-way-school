import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { ContentService } from '../../../core/services/content.service';
import { StorageService } from '../../../core/services/storage.service';
import type { GalleryImageRecord } from '../../../core/models/supabase.model';
import { GALLERY_CATEGORIES } from '../../../core/data/gallery-categories';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-gallery-list',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../announcements/announcements-list.scss',
  templateUrl: './gallery-list.html',
})
export class GalleryList implements OnInit {
  private readonly content = inject(ContentService);
  private readonly storage = inject(StorageService);
  private readonly adminAuth = inject(AdminAuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly items = signal<GalleryImageRecord[]>([]);
  protected readonly search = signal('');
  protected readonly categoryFilter = signal('all');
  protected readonly statusFilter = signal('all');
  protected readonly page = signal(1);

  protected readonly deleteTarget = signal<GalleryImageRecord | null>(null);
  protected readonly deleting = signal(false);

  protected readonly categories = GALLERY_CATEGORIES;

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
      const rows = await this.content.select<GalleryImageRecord>('gallery_images', '*');
      if (this.content.error()) {
        this.error.set(this.content.error()?.message ?? 'Failed to load gallery images.');
      }
      const sorted = [...rows].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
      this.items.set(sorted);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load gallery images.');
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

  protected async togglePublish(item: GalleryImageRecord): Promise<void> {
    const next = !item.is_published;
    const payload: Partial<GalleryImageRecord> = {
      is_published: next,
    };
    await this.content.update<GalleryImageRecord>('gallery_images', 'id', item.id, payload);
    if (this.content.error()) {
      this.error.set(this.content.error()?.message ?? 'Failed to update status.');
      return;
    }
    await this.load();
  }

  protected askDelete(item: GalleryImageRecord): void {
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
      const ok = await this.content.remove('gallery_images', 'id', item.id);
      if (!ok || this.content.error()) {
        this.error.set(this.content.error()?.message ?? 'Failed to delete gallery image.');
        return;
      }
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

  protected edit(item: GalleryImageRecord): void {
    this.router.navigateByUrl(`/admin/gallery/${item.id}/edit`);
  }

  private storagePathFromUrl(url: string): string | null {
    const marker = '/storage/v1/object/public/school-assets/';
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.slice(idx + marker.length));
  }
}
