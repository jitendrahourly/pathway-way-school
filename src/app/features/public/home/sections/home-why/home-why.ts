import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { galleryImages, galleryUrl } from '../../../../../core/data/home-gallery';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { MediaFrame } from '../../../../../shared/components/media-frame/media-frame';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-why',
  imports: [MediaFrame, UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-why.scss',
  templateUrl: './home-why.html',
})
export class HomeWhy {
  private readonly content = inject(HomeContentService).content;

  protected readonly head = computed(() => this.content().headings.why);
  protected readonly points = computed(() => this.content().whyChooseUs);
  protected readonly media = computed(() => this.content().whyMedia);
  protected readonly image = computed(() => {
    const content = this.content();
    return galleryUrl(content.galleryPreview, 2) || content.about.imageUrl;
  });
  protected readonly imageAlt = computed(() => {
    const content = this.content();
    return galleryImages(content.galleryPreview)[2]?.alt || content.about.imageAlt;
  });
}
