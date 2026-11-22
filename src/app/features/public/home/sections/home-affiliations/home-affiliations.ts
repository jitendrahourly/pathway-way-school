import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-affiliations',
  imports: [UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-affiliations.scss',
  templateUrl: './home-affiliations.html',
})
export class HomeAffiliations {
  protected readonly content = inject(HomeContentService).content;
}
