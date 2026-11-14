import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnnouncementsService } from '../../../../../core/services/announcements.service';
import { GalleryService } from '../../../../../core/services/gallery.service';
import { AnnouncementCard } from '../../../../../shared/components/announcement-card/announcement-card';
import { MediaFrame } from '../../../../../shared/components/media-frame/media-frame';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';

@Component({
  selector: 'app-home-updates',
  imports: [RouterLink, AnnouncementCard, MediaFrame, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-updates.scss',
  templateUrl: './home-updates.html',
})
export class HomeUpdates {
  protected readonly announcements = inject(AnnouncementsService).latest;
  protected readonly gallery = inject(GalleryService).highlights;
}
