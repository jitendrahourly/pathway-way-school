import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import type { ContactMessageRecord } from '../../../core/models/supabase.model';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { ContactContentService } from '../../../core/services/contact-content.service';
import { ContentService } from '../../../core/services/content.service';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

@Component({
  selector: 'app-contact',
  imports: [PageBanner, UiIcon, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './contact.scss',
  templateUrl: './contact.html',
})
export class Contact implements OnInit {
  private readonly service = inject(ContactContentService);
  private readonly contentService = inject(ContentService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly fb = inject(FormBuilder);

  protected readonly content = this.service.content;
  protected readonly settings = inject(SiteSettingsService).settings;

  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly submitError = signal<string | null>(null);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    phone: ['', [Validators.maxLength(40)]],
    subject: ['', [Validators.required, Validators.maxLength(160)]],
    message: ['', [Validators.required, Validators.maxLength(2000)]],
  });

  protected readonly phoneHref = computed(
    () => `tel:${this.settings().phone.replace(/[^\d+]/g, '')}`,
  );
  protected readonly emailHref = computed(() => `mailto:${this.settings().email}`);

  protected readonly safeMapsUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.settings().mapsUrl),
  );

  ngOnInit(): void {
    void this.service.load();
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.submitting()) return;

    this.submitting.set(true);
    this.submitError.set(null);
    this.submitted.set(false);

    const value = this.form.getRawValue();
    const payload: ContactMessageRecord = {
      name: (value.name ?? '').trim(),
      email: (value.email ?? '').trim(),
      phone: (value.phone ?? '').trim() || null,
      subject: (value.subject ?? '').trim() || null,
      message: (value.message ?? '').trim(),
    };

    await this.contentService.insert<ContactMessageRecord>('contact_messages', payload);
    if (this.contentService.error()) {
      this.submitError.set(
        this.content().form.errorMessage ||
          'Your message could not be sent. Please try again.',
      );
    } else {
      this.submitted.set(true);
      this.form.reset();
    }

    this.submitting.set(false);
  }
}
