import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { AdmissionsContentService } from '../../../core/services/admissions-content.service';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

@Component({
  selector: 'app-admissions',
  imports: [PageBanner, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './admissions.scss',
  templateUrl: './admissions.html',
})
export class Admissions {
  private readonly service = inject(AdmissionsContentService);

  protected readonly content = this.service.content;
  private readonly settings = inject(SiteSettingsService).settings;

  protected readonly phoneHref = computed(
    () => `tel:${this.settings().phone.replace(/[^\d+]/g, '')}`,
  );
  protected readonly emailHref = computed(() => `mailto:${this.settings().email}`);

  protected readonly phone = this.settings().phone;
  protected readonly email = this.settings().email;
  protected readonly address = this.settings().address;
}
