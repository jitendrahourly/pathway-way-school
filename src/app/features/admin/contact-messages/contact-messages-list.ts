import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

import type { ContactMessageRecord } from '../../../core/models/supabase.model';
import { ContentService } from '../../../core/services/content.service';

@Component({
  selector: 'app-contact-messages-list',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './contact-messages-list.scss',
  templateUrl: './contact-messages-list.html',
})
export class ContactMessagesList implements OnInit {
  private readonly content = inject(ContentService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly items = signal<ContactMessageRecord[]>([]);
  protected readonly search = signal('');
  protected readonly selected = signal<ContactMessageRecord | null>(null);
  protected readonly deleteTarget = signal<ContactMessageRecord | null>(null);
  protected readonly deleting = signal(false);

  protected readonly filtered = () => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter((item) =>
      `${item.name} ${item.email} ${item.subject ?? ''} ${item.message}`.toLowerCase().includes(q),
    );
  };

  protected readonly unreadCount = () => this.items().filter((item) => !item.is_read).length;

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const rows = await this.content.select<ContactMessageRecord>('contact_messages', '*');
      if (this.content.error()) {
        this.error.set(this.content.error()?.message ?? 'Failed to load contact messages.');
      }
      this.items.set(
        [...rows].sort((a, b) =>
          (b.created_at ?? '').localeCompare(a.created_at ?? ''),
        ),
      );
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load contact messages.');
    } finally {
      this.loading.set(false);
    }
  }

  protected onSearch(value: string): void {
    this.search.set(value);
  }

  protected view(item: ContactMessageRecord): void {
    this.selected.set(item);
    if (!item.is_read && item.id != null) {
      void this.markRead(item);
    }
  }

  protected closeView(): void {
    this.selected.set(null);
  }

  protected async markRead(item: ContactMessageRecord): Promise<void> {
    if (item.id == null) return;
    await this.content.update<ContactMessageRecord>('contact_messages', 'id', item.id, {
      is_read: true,
    });
    if (this.content.error()) {
      this.error.set(this.content.error()?.message ?? 'Failed to update message.');
      return;
    }
    this.items.set(this.items().map((row) => (row.id === item.id ? { ...row, is_read: true } : row)));
    const selected = this.selected();
    if (selected?.id === item.id) {
      this.selected.set({ ...selected, is_read: true });
    }
  }

  protected askDelete(item: ContactMessageRecord): void {
    this.deleteTarget.set(item);
  }

  protected cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  protected async confirmDelete(): Promise<void> {
    const target = this.deleteTarget();
    if (!target?.id) return;
    this.deleting.set(true);
    const ok = await this.content.remove('contact_messages', 'id', target.id);
    this.deleting.set(false);
    if (!ok) {
      this.error.set(this.content.error()?.message ?? 'Failed to delete message.');
      return;
    }
    this.items.set(this.items().filter((row) => row.id !== target.id));
    if (this.selected()?.id === target.id) {
      this.selected.set(null);
    }
    this.deleteTarget.set(null);
  }

  protected formatDate(value?: string): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  }
}
