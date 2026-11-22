import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { SiteSettingsService } from '../../../../../core/services/site-settings.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-location',
  imports: [RouterLink, UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-location.scss',
  templateUrl: './home-location.html',
})
export class HomeLocation {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly content = inject(HomeContentService).content;

  protected readonly settings = inject(SiteSettingsService).settings;
  protected readonly head = computed(() => this.content().headings.location);
  protected readonly note = computed(() => this.content().locationNote);
  protected readonly mapUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.settings().mapsUrl.trim();
    if (!url) return null;

    const embed = url.includes('output=embed')
      ? url
      : `${url}${url.includes('?') ? '&' : '?'}output=embed`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(embed);
  });
}
