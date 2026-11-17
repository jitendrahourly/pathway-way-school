import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

@Component({
  selector: 'app-brand-logo',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './brand-logo.scss',
  templateUrl: './brand-logo.html',
})
export class BrandLogo {
  protected readonly settings = inject(SiteSettingsService).settings;
  readonly variant = input<'dark' | 'light'>('dark');
  protected readonly logoFailed = signal(false);
}
