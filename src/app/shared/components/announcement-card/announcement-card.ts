import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ANNOUNCEMENT_CATEGORY_LABELS } from '../../../core/data/announcement-categories';
import type { Announcement } from '../../../core/models/announcement.model';
import { UiIcon } from '../ui-icon/ui-icon';

@Component({
  selector: 'app-announcement-card',
  imports: [RouterLink, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './announcement-card.scss',
  templateUrl: './announcement-card.html',
})
export class AnnouncementCard {
  readonly announcement = input.required<Announcement>();

  protected readonly categoryLabel = computed(
    () => ANNOUNCEMENT_CATEGORY_LABELS[this.announcement().category] ?? this.announcement().category,
  );

  protected readonly date = computed(() => {
    const iso = this.announcement().publishedAt;
    if (!iso) {
      return null;
    }
    const value = new Date(`${iso}T00:00:00`);
    return {
      day: value.getDate().toString().padStart(2, '0'),
      month: value.toLocaleString('en-IN', { month: 'short' }),
      year: value.getFullYear(),
    };
  });
}
