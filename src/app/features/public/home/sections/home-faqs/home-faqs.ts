import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { SiteSettingsService } from '../../../../../core/services/site-settings.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-faqs',
  imports: [RouterLink, UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-faqs.scss',
  templateUrl: './home-faqs.html',
})
export class HomeFaqs {
  private readonly content = inject(HomeContentService).content;

  protected readonly faqs = computed(() => this.content().faqs);
  protected readonly head = computed(() => this.content().headings.faqs);
  protected readonly settings = inject(SiteSettingsService).settings;
  protected readonly openIndex = signal<number | null>(0);

  protected toggle(index: number): void {
    this.openIndex.update((current) => (current === index ? null : index));
  }
}
