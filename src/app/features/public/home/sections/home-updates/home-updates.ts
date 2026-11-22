import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ANNOUNCEMENT_CATEGORY_LABELS } from '../../../../../core/data/announcement-categories';
import type { Announcement } from '../../../../../core/models/announcement.model';
import { AnnouncementsService } from '../../../../../core/services/announcements.service';
import { GalleryService } from '../../../../../core/services/gallery.service';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { MediaFrame } from '../../../../../shared/components/media-frame/media-frame';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-updates',
  imports: [RouterLink, MediaFrame, UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-updates.scss',
  templateUrl: './home-updates.html',
})
export class HomeUpdates implements OnInit {
  private readonly announcementsService = inject(AnnouncementsService);

  protected readonly content = inject(HomeContentService).content;
  protected readonly head = computed(() => this.content().headings.updates);
  protected readonly announcements = this.announcementsService.latest;
  protected readonly gallery = inject(GalleryService).highlights;

  ngOnInit(): void {
    void this.announcementsService.load();
  }

  protected category(item: Announcement): string {
    return ANNOUNCEMENT_CATEGORY_LABELS[item.category] ?? item.category;
  }

  protected date(item: Announcement): string {
    if (!item.publishedAt) return 'School update';
    return new Date(`${item.publishedAt}T00:00:00`).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
