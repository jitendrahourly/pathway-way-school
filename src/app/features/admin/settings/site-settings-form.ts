import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { SiteSettings } from '../../../core/models/site-settings.model';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

const URL_PATTERN = /^https?:\/\/\S+$/i;

@Component({
  selector: 'app-site-settings-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../announcements/announcement-form.scss',
  templateUrl: './site-settings-form.html',
})
export class SiteSettingsForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly settingsService = inject(SiteSettingsService);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    schoolName: ['', [Validators.required, Validators.maxLength(160)]],
    phone: ['', [Validators.required, Validators.maxLength(40)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    address: ['', [Validators.required, Validators.maxLength(400)]],
    instagramHandle: ['', [Validators.maxLength(80)]],
    instagramUrl: ['', [Validators.pattern(URL_PATTERN)]],
    facebookUrl: ['', [Validators.pattern(URL_PATTERN)]],
    youtubeUrl: ['', [Validators.pattern(URL_PATTERN)]],
    mapsUrl: ['', [Validators.pattern(URL_PATTERN)]],
  });

  async ngOnInit(): Promise<void> {
    await this.settingsService.load();
    this.patch(this.settingsService.settings());
    this.loading.set(false);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.saving()) return;

    this.saving.set(true);
    this.error.set(null);
    this.success.set(null);

    const value = this.form.getRawValue();
    const next: SiteSettings = {
      ...this.settingsService.settings(),
      schoolName: value.schoolName.trim(),
      phone: value.phone.trim(),
      email: value.email.trim(),
      address: value.address.trim(),
      instagramHandle: value.instagramHandle.trim(),
      instagramUrl: value.instagramUrl.trim(),
      facebookUrl: value.facebookUrl.trim(),
      youtubeUrl: value.youtubeUrl.trim(),
      mapsUrl: value.mapsUrl.trim(),
    };

    const error = await this.settingsService.save(next);
    if (error) {
      this.error.set(error.message || 'Failed to save site settings.');
    } else {
      this.success.set('Site settings saved.');
      this.form.markAsPristine();
    }

    this.saving.set(false);
  }

  private patch(settings: SiteSettings): void {
    this.form.patchValue({
      schoolName: settings.schoolName,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      instagramHandle: settings.instagramHandle,
      instagramUrl: settings.instagramUrl,
      facebookUrl: settings.facebookUrl,
      youtubeUrl: settings.youtubeUrl,
      mapsUrl: settings.mapsUrl,
    });
  }
}
