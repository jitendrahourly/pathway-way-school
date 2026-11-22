import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { galleryUrl } from '../../../../../core/data/home-gallery';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { SiteSettingsService } from '../../../../../core/services/site-settings.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-admissions-cta',
  imports: [RouterLink, UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-admissions-cta.scss',
  templateUrl: './home-admissions-cta.html',
})
export class HomeAdmissionsCta {
  private readonly content = inject(HomeContentService).content;

  protected readonly cta = computed(() => this.content().admissionsCta);
  protected readonly settings = inject(SiteSettingsService).settings;
  protected readonly image = computed(() => {
    const content = this.content();
    return galleryUrl(content.galleryPreview, 2) || content.about.imageUrl;
  });
}
