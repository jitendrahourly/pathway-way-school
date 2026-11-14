import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ANNOUNCEMENT_CATEGORY_LABELS } from '../../../core/data/announcement-categories';
import { AnnouncementsContentService } from '../../../core/services/announcements-content.service';
import { AnnouncementsService } from '../../../core/services/announcements.service';
import { MediaFrame } from '../../../shared/components/media-frame/media-frame';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

@Component({
  selector: 'app-announcement-detail',
  imports: [PageBanner, MediaFrame, UiIcon, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './announcement-detail.scss',
  templateUrl: './announcement-detail.html',
})
export class AnnouncementDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly announcements = inject(AnnouncementsService);
  private readonly contentService = inject(AnnouncementsContentService);

  protected readonly content = this.contentService.content;
  private readonly id = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: this.route.snapshot.paramMap.get('id') },
  );

  ngOnInit(): void {
    void this.announcements.load();
  }

  protected readonly notice = computed(
    () => this.announcements.published().find((item) => item.id === this.id()) ?? null,
  );

  protected readonly categoryLabel = computed(() => {
    const notice = this.notice();
    return notice ? ANNOUNCEMENT_CATEGORY_LABELS[notice.category] : '';
  });

  protected readonly date = computed(() => {
    const iso = this.notice()?.publishedAt;
    return iso
      ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : null;
  });

  protected readonly body = computed(
    () => this.notice()?.description ?? this.notice()?.summary ?? '',
  );

  protected readonly bannerTitle = computed(() => this.notice()?.title ?? 'Announcements');

  protected readonly bannerSubtitle = computed(() => {
    const notice = this.notice();
    if (!notice) {
      return this.content().detail.fallbackBannerSubtitle;
    }
    const parts = [this.categoryLabel(), this.date()].filter(Boolean);
    return parts.join(' · ');
  });
}
