import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { galleryImages } from '../../../../../core/data/home-gallery';
import { GalleryService } from '../../../../../core/services/gallery.service';
import { SiteSettingsService } from '../../../../../core/services/site-settings.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

interface SocialShot {
  readonly id: string;
  readonly src: string;
  readonly alt: string;
  readonly title: string;
}

@Component({
  selector: 'app-home-instagram',
  imports: [UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-instagram.scss',
  templateUrl: './home-instagram.html',
})
export class HomeInstagram {
  private readonly gallery = inject(GalleryService);
  private readonly content = inject(HomeContentService).content;

  /** Hides the sample shots when the section appears beneath a full gallery. */
  readonly media = input(true);

  protected readonly settings = inject(SiteSettingsService).settings;
  protected readonly head = computed(() => this.content().headings.instagram);
  protected readonly shots = computed<readonly SocialShot[]>(() => {
    const published = this.gallery
      .active()
      .slice(0, 6)
      .map((item) => ({
        id: item.id,
        src: item.imageUrl,
        alt: item.imageAlt,
        title: item.title,
      }));

    if (published.length) return published;

    return galleryImages(this.content().galleryPreview).map((image) => ({
      id: image.url,
      src: image.url,
      alt: image.alt,
      title: image.caption,
    }));
  });
}
