import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { ContentService } from '../../../core/services/content.service';
import type {
  AnnouncementRecord,
  FacilityRecord,
  GalleryImageRecord,
} from '../../../core/models/supabase.model';

@Component({
  selector: 'app-dashboard',
  imports: [],
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
  protected readonly facilities = signal<FacilityRecord[]>([]);

  protected readonly totalAnnouncements = computed(() => this.announcements().length);
  protected readonly publishedAnnouncements = computed(
    () => this.announcements().filter((item) => item.is_published).length,
  );
  protected readonly totalGalleryImages = computed(() => this.galleryImages().length);
  protected readonly totalFacilities = computed(() => this.facilities().length);

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
      .slice(0, 5),
  );

  protected readonly recentFacilities = computed(() =>
    [...this.facilities()]
      .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
      .slice(0, 5),
  );

  async ngOnInit(): Promise<void> {
    await this.load();
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

      const facilities = await this.content.select<FacilityRecord>('facilities', '*');
      if (this.content.error()) {
        this.error.set(this.content.error()?.message ?? 'Failed to load facilities.');
      }
      this.facilities.set(facilities);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load dashboard data.');
    } finally {
      this.loading.set(false);
    }
  }
}
