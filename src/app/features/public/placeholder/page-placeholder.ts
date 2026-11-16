import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

@Component({
  selector: 'app-page-placeholder',
  imports: [PageBanner, UiIcon, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-placeholder.html',
  styleUrl: './page-placeholder.scss',
})
export class PagePlaceholder {
  private readonly route = inject(ActivatedRoute);

  protected readonly title =
    this.route.snapshot.data['title'] ?? 'Information';
  protected readonly subtitle =
    this.route.snapshot.data['subtitle'] ?? 'Information will be updated soon.';
}