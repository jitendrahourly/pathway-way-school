import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageBanner } from '../page-banner/page-banner';
import { IconName, UiIcon } from '../ui-icon/ui-icon';

@Component({
  selector: 'app-page-coming-soon',
  imports: [RouterLink, PageBanner, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './page-coming-soon.scss',
  templateUrl: './page-coming-soon.html',
})
export class PageComingSoon {
  readonly title = input.required<string>();
  readonly icon = input<IconName>('clock');
  readonly message = input(
    'This page is being prepared. In the meantime, please explore the homepage or contact the school office for details.',
  );
}
