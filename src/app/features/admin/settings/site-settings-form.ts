import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import type { SiteSettings } from '../../../core/models/site-settings.model';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { EditorSectionComponent } from '../page-content/editor-section/editor-section';
import {
  SettingsPreview,
  type SettingsPreviewData,
} from './settings-preview';

const URL_PATTERN = /^https?:\/\/\S+$/i;

/** Collapsed-header completeness pill for one settings section. */
interface SectionStatus {
  readonly label: string;
  readonly live: boolean;
}

@Component({
  selector: 'app-site-settings-form',
  imports: [ReactiveFormsModule, SettingsPreview, EditorSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './site-settings-form.scss',
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

  protected readonly formValue = toSignal(
    this.form.valueChanges.pipe(map(() => this.form.getRawValue())),
    { initialValue: this.form.getRawValue() },
  );

  protected readonly settingsPreview = computed<SettingsPreviewData>(() => {
    const value = this.formValue();
    return {
      schoolName: (value.schoolName ?? '').trim(),
      phone: (value.phone ?? '').trim(),
      email: (value.email ?? '').trim(),
      address: (value.address ?? '').trim(),
      instagramHandle: (value.instagramHandle ?? '').trim(),
      instagramUrl: (value.instagramUrl ?? '').trim(),
      facebookUrl: (value.facebookUrl ?? '').trim(),
      youtubeUrl: (value.youtubeUrl ?? '').trim(),
      mapsUrl: (value.mapsUrl ?? '').trim(),
    };
  });

  /** Accordion state — a single section stays open at a time. */
  protected readonly openSection = signal<string | null>(null);

  /** Fields grouped per accordion section, marking which groups are mandatory. */
  private readonly sectionFields: Record<
    string,
    { readonly fields: readonly string[]; readonly required: boolean }
  > = {
    'settings-identity': { fields: ['schoolName'], required: true },
    'settings-contact': { fields: ['phone', 'email', 'address'], required: true },
    'settings-social': {
      fields: ['instagramHandle', 'instagramUrl', 'facebookUrl', 'youtubeUrl'],
      required: false,
    },
    'settings-location': { fields: ['mapsUrl'], required: false },
  };

  /** Header pill summarising whether each section is complete or optional. */
  protected readonly sectionStatuses = computed<Record<string, SectionStatus>>(() => {
    this.formValue(); // recompute whenever any field changes
    const statuses: Record<string, SectionStatus> = {};
    for (const [id, meta] of Object.entries(this.sectionFields)) {
      const controls = meta.fields.map((name) => this.form.get(name));
      const invalid = controls.some((control) => control?.invalid);
      const anyValue = controls.some((control) => `${control?.value ?? ''}`.trim().length > 0);

      if (invalid) {
        statuses[id] = { label: 'Needs attention', live: false };
      } else if (meta.required) {
        statuses[id] = anyValue ? { label: 'Complete', live: true } : { label: 'Required', live: false };
      } else {
        statuses[id] = anyValue ? { label: 'Configured', live: true } : { label: 'Optional', live: false };
      }
    }
    return statuses;
  });

  protected isSectionOpen(id: string): boolean {
    return this.openSection() === id;
  }

  protected toggleSection(id: string): void {
    this.openSection.update((current) => (current === id ? null : id));
  }

  protected status(id: string): SectionStatus {
    return this.sectionStatuses()[id] ?? { label: '', live: true };
  }

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
