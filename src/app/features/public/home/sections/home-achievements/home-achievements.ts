import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { galleryUrl } from '../../../../../core/data/home-gallery';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-achievements',
  imports: [RouterLink, UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-achievements.scss',
  templateUrl: './home-achievements.html',
})
export class HomeAchievements {
  private readonly content = inject(HomeContentService).content;

  protected readonly achievements = computed(() => this.content().achievements);
  protected readonly head = computed(() => this.content().headings.achievements);
  protected readonly photo = computed(() => this.content().achievementsPhoto);
  protected readonly image = computed(() => {
    const content = this.content();
    return (
      content.achievementsPhoto.imageUrl ||
      galleryUrl(content.galleryPreview, 0) ||
      content.about.imageUrl
    );
  });
}
