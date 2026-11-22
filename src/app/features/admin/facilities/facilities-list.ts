import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';
import { StorageService } from '../../../core/services/storage.service';
import type { FacilityRecord } from '../../../core/models/supabase.model';

@Component({
  selector: 'app-facilities-list',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './facilities-list.scss',
  templateUrl: './facilities-list.html',
})
export class FacilitiesList implements OnInit {
  private readonly content = inject(ContentService);
  private readonly storage = inject(StorageService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly items = signal<FacilityRecord[]>([]);
  protected readonly deleteTarget = signal<FacilityRecord | null>(null);
  protected readonly deleting = signal(false);

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const rows = await this.content.select<FacilityRecord>('facilities', '*');
      if (this.content.error()) {
        this.error.set(this.content.error()?.message ?? 'Failed to load facilities.');
      }
      this.items.set([...rows].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)));
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load facilities.');
    } finally {
      this.loading.set(false);
    }
  }

  protected async togglePublish(item: FacilityRecord): Promise<void> {
    await this.content.update<FacilityRecord>('facilities', 'id', item.id, {
      is_published: !item.is_published,
    });
    if (this.content.error()) {
      this.error.set(this.content.error()?.message ?? 'Failed to update status.');
      return;
    }
    await this.load();
  }

  protected askDelete(item: FacilityRecord): void {
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
      const ok = await this.content.remove('facilities', 'id', item.id);
      if (!ok || this.content.error()) {
        this.error.set(this.content.error()?.message ?? 'Failed to delete facility.');
        return;
      }
      if (item.image_url) {
        const path = this.storage.publicPath(item.image_url);
        if (path) await this.storage.remove('school-assets', path);
      }
      this.deleteTarget.set(null);
      await this.load();
    } finally {
      this.deleting.set(false);
    }
  }

}
