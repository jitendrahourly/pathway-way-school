import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { GalleryService } from '../../../../../core/services/gallery.service';
import { SiteSettingsService } from '../../../../../core/services/site-settings.service';
import { MediaFrame } from '../../../../../shared/components/media-frame/media-frame';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';

@Component({
  selector: 'app-home-instagram',
  imports: [MediaFrame, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-instagram.scss',
  templateUrl: './home-instagram.html',
})
export class HomeInstagram {
  private readonly gallery = inject(GalleryService);

  /** Hides the sample shots when the section appears beneath a full gallery. */
  readonly media = input(true);

  protected readonly settings = inject(SiteSettingsService).settings;
  protected readonly shots = computed(() => this.gallery.active().slice(0, 3));
}
