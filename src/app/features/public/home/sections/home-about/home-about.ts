import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { MediaFrame } from '../../../../../shared/components/media-frame/media-frame';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';

@Component({
  selector: 'app-home-about',
  imports: [RouterLink, MediaFrame, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-about.scss',
  templateUrl: './home-about.html',
})
export class HomeAbout {
  protected readonly content = inject(HomeContentService).content;
}
