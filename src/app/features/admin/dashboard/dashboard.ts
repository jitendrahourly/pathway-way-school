<<<<<<< HEAD
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { ContentService } from '../../../core/services/content.service';

interface AnnouncementRow {
  readonly id?: string | number;
  readonly title?: string;
  readonly is_published?: boolean;
  readonly published_at?: string | null;
  readonly created_at?: string;
  readonly updated_at?: string;
}

interface GalleryRow {
  readonly id?: string | number;
  readonly title?: string;
  readonly image_url?: string;
  readonly created_at?: string;
  readonly updated_at?: string;
}

interface FacilityRow {
  readonly id?: string | number;
  readonly title?: string;
  readonly is_published?: boolean;
  readonly created_at?: string;
  readonly updated_at?: string;
}

@Component({
  selector: 'app-dashboard',
=======
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
>>>>>>> dropdown
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private readonly adminAuth = inject(AdminAuthService);
  private readonly content = inject(ContentService);
  private readonly router = inject(Router);

  protected readonly profile = this.adminAuth.profile;
<<<<<<< HEAD
  protected readonly loadingAuth = this.adminAuth.loading;

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly announcements = signal<AnnouncementRow[]>([]);
  protected readonly gallery = signal<GalleryRow[]>([]);
  protected readonly facilities = signal<FacilityRow[]>([]);

  protected readonly totalAnnouncements = () => this.announcements().length;
  protected readonly publishedAnnouncements = () =>
    this.announcements().filter((a) => a.is_published === true).length;
  protected readonly galleryCount = () => this.gallery().length;
  protected readonly facilitiesCount = () => this.facilities().length;

  protected readonly recentAnnouncements = () =>
    [...this.announcements()]
      .sort((a, b) => this.dateOf(b).localeCompare(this.dateOf(a)))
      .slice(0, 5);

  protected readonly recentGallery = () =>
    [...this.gallery()]
      .sort((a, b) => this.dateOf(b).localeCompare(this.dateOf(a)))
      .slice(0, 5);

  protected readonly recentFacilities = () =>
    [...this.facilities()]
      .sort((a, b) => this.dateOf(b).localeCompare(this.dateOf(a)))
      .slice(0, 5);

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const [announcements, gallery, facilities] = await Promise.all([
        this.content.select<AnnouncementRow>('announcements'),
        this.content.select<GalleryRow>('gallery_images'),
        this.content.select<FacilityRow>('facilities'),
      ]);
      if (this.content.error()) {
        this.error.set(this.content.error()?.message ?? 'Failed to load dashboard data.');
      }
      this.announcements.set(announcements);
      this.gallery.set(gallery);
      this.facilities.set(facilities);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load dashboard data.');
    } finally {
      this.loading.set(false);
    }
  }

  private dateOf(row: { created_at?: string; updated_at?: string; published_at?: string | null }): string {
    return row.updated_at ?? row.created_at ?? row.published_at ?? '';
  }
=======
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
>>>>>>> dropdown

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
