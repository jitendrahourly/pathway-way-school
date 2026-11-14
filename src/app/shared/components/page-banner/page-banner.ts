import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-banner',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './page-banner.scss',
  templateUrl: './page-banner.html',
})
export class PageBanner {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  /** Optional parent crumb shown between Home and the page title. */
  readonly crumb = input<string>();
  readonly crumbLink = input<string>();
  readonly imageUrl = input<string>();
  readonly imageAlt = input('');
}
