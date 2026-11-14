import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import type { AnnouncementCategoryId } from '../../../core/models/announcement.model';
import { AnnouncementsContentService } from '../../../core/services/announcements-content.service';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { AnnouncementCard } from '../../../shared/components/announcement-card/announcement-card';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

@Component({
  selector: 'app-announcements',
  imports: [PageBanner, SectionHeading, AnnouncementCard, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './announcements.scss',
  templateUrl: './announcements.html',
})
export class Announcements {
  private readonly service = inject(AnnouncementsContentService);

  protected readonly settings = inject(SiteSettingsService).settings;
  protected readonly content = this.service.content;
  protected readonly categories = this.service.categories;
  protected readonly published = this.service.published;
  protected readonly filters = this.service.filters;
  protected readonly filter = signal<AnnouncementCategoryId | 'all'>('all');
  protected readonly items = computed(() => {
    const id = this.filter();
    const all = this.published();
    return id === 'all' ? all : all.filter((item) => item.category === id);
  });

  protected readonly phoneHref = computed(
    () => `tel:${this.settings().phone.replace(/[^\d+]/g, '')}`,
  );
  protected readonly emailHref = computed(() => `mailto:${this.settings().email}`);

  protected setFilter(id: AnnouncementCategoryId | 'all'): void {
    this.filter.set(id);
  }
}
