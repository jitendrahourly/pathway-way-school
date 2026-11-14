import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BrandLogo } from '../../../shared/components/brand-logo/brand-logo';

@Component({
  selector: 'app-admin-placeholder',
  imports: [BrandLogo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './admin-placeholder.scss',
  templateUrl: './admin-placeholder.html',
})
export class AdminPlaceholder {
  private readonly route = inject(ActivatedRoute);
  protected readonly title = this.route.snapshot.title ?? 'Coming soon';
}
