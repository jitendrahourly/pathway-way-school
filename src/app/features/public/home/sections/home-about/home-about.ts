import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { galleryUrl } from '../../../../../core/data/home-gallery';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { SiteSettingsService } from '../../../../../core/services/site-settings.service';
import { MediaFrame } from '../../../../../shared/components/media-frame/media-frame';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-about',
  imports: [RouterLink, MediaFrame, UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-about.scss',
  templateUrl: './home-about.html',
})
export class HomeAbout {
  private readonly content = inject(HomeContentService).content;

  protected readonly about = computed(() => this.content().about);
  protected readonly settings = inject(SiteSettingsService).settings;
  protected readonly accentImage = computed(() => {
    const content = this.content();
    return (
      galleryUrl(content.galleryPreview, 2) ||
      galleryUrl(content.galleryPreview, 0) ||
      content.hero.imageUrl
    );
  });
}
