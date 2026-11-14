import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { FOOTER_LINKS } from '../../navigation';
import { BrandLogo } from '../brand-logo/brand-logo';
import { UiIcon } from '../ui-icon/ui-icon';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, BrandLogo, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './site-footer.scss',
  templateUrl: './site-footer.html',
})
export class SiteFooter {
  protected readonly settings = inject(SiteSettingsService).settings;
  protected readonly links = FOOTER_LINKS;
  protected readonly year = new Date().getFullYear();
}
