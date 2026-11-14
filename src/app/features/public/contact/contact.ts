import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { ContactContentService } from '../../../core/services/contact-content.service';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

@Component({
  selector: 'app-contact',
  imports: [PageBanner, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './contact.scss',
  templateUrl: './contact.html',
})
export class Contact {
  private readonly service = inject(ContactContentService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly content = this.service.content;
  protected readonly settings = inject(SiteSettingsService).settings;

  protected readonly phoneHref = computed(
    () => `tel:${this.settings().phone.replace(/[^\d+]/g, '')}`,
  );
  protected readonly emailHref = computed(() => `mailto:${this.settings().email}`);

  protected readonly safeMapsUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.settings().mapsUrl),
  );
}
