import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-newsletter',
  imports: [UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-newsletter.scss',
  templateUrl: './home-newsletter.html',
})
export class HomeNewsletter {
  protected readonly content = inject(HomeContentService).content;
}
