import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-highlights',
  imports: [UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-highlights.scss',
  templateUrl: './home-highlights.html',
})
export class HomeHighlights {
  protected readonly content = inject(HomeContentService).content;
}
