import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';
import { StorageService } from '../../../core/services/storage.service';
import type { FacilityRecord } from '../../../core/models/supabase.model';
import { FacilityPreview, type FacilityPreviewData } from './facility-preview';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  selector: 'app-facility-form',
  imports: [ReactiveFormsModule, RouterLink, FacilityPreview],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './facility-form.scss',
  templateUrl: './facility-form.html',
})
export class FacilityForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly content = inject(ContentService);
  private readonly storage = inject(StorageService);

  protected readonly isEdit = signal(false);
  protected readonly recordId = signal<string | number | null>(null);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly selectedFile = signal<File | null>(null);
  protected readonly previewUrl = signal<string | null>(null);
  protected readonly existingImageUrl = signal<string | null>(null);
  protected readonly originalImageUrl = signal<string | null>(null);
  protected readonly removeImage = signal(false);

  protected readonly form = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    image_alt: [''],
    caption: [''],
    highlight_1: [''],
    highlight_2: [''],
    highlight_3: [''],
    subpage_url: [''],
    display_order: [1, [Validators.required, Validators.min(0)]],
    is_published: [true],
  });

  /** Latest form values bridged into a signal so the preview updates live. */
  private readonly formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });

  /**
   * Data rendered by the live preview. Uses the current (unsaved) form values
   * and the local image state so administrators see their changes immediately.
   */
  protected readonly previewData = computed<FacilityPreviewData>(() => {
    const value = this.formValue();
    const highlights = [value.highlight_1, value.highlight_2, value.highlight_3]
      .map((highlight) => (highlight ?? '').trim())
      .filter((highlight) => highlight.length > 0);

    return {
      title: (value.title ?? '').trim(),
      description: (value.description ?? '').trim(),
      imageUrl: this.previewUrl() ?? (this.removeImage() ? null : this.existingImageUrl()),
      imageAlt: (value.image_alt ?? '').trim(),
      caption: (value.caption ?? '').trim(),
      highlights,
      subpageUrl: (value.subpage_url ?? '').trim(),
      isPublished: value.is_published === true,
    };
  });

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.recordId.set(id);
      await this.load(id);
    }
  }

  private async load(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const row = await this.content.selectById<FacilityRecord>('facilities', 'id', id);
      if (!row) {
        this.error.set('Facility not found.');
        return;
      }
      this.form.patchValue({
        title: row.title ?? '',
        description: row.description ?? '',
        image_alt: row.image_alt ?? '',
        caption: row.caption ?? '',
        highlight_1: row.highlights?.[0] ?? '',
        highlight_2: row.highlights?.[1] ?? '',
        highlight_3: row.highlights?.[2] ?? '',
        subpage_url: row.subpage_url ?? '',
        display_order: row.display_order ?? 1,
        is_published: row.is_published ?? true,
      });
      this.existingImageUrl.set(row.image_url ?? null);
      this.originalImageUrl.set(row.image_url ?? null);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load facility.');
    } finally {
      this.loading.set(false);
    }
  }

  protected onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      this.error.set('Only JPEG, PNG and WebP images are allowed.');
      input.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      this.error.set('Image must be 5 MB or smaller.');
      input.value = '';
      return;
    }
    this.error.set(null);
    this.selectedFile.set(file);
    this.removeImage.set(false);
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  protected clearSelectedImage(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
  }

  protected markRemoveImage(): void {
    this.removeImage.set(true);
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.existingImageUrl.set(null);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    this.error.set(null);

    const v = this.form.getRawValue();
    let imageUrl: string | null = this.removeImage() ? null : this.existingImageUrl();
    let uploadedPath: string | null = null;

    if (this.selectedFile()) {
      const file = this.selectedFile() as File;
      const path = `facilities/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const res = await this.storage.upload('school-assets', path, file);
      if (res.error || !res.publicUrl) {
        this.error.set(res.error?.message ?? 'Image upload failed.');
        this.saving.set(false);
        return;
      }
      uploadedPath = res.path;
      imageUrl = res.publicUrl;
    }

    const payload: Partial<FacilityRecord> = {
      title: v.title!.trim(),
      description: v.description?.trim() || null,
      image_alt: v.image_alt?.trim() || null,
      caption: v.caption?.trim() || null,
      highlights: [v.highlight_1, v.highlight_2, v.highlight_3]
        .map((highlight) => (highlight ?? '').trim())
        .filter((highlight) => highlight.length > 0),
      subpage_url: v.subpage_url?.trim() || null,
      image_url: imageUrl,
      display_order: Number(v.display_order ?? 0),
      is_published: v.is_published === true,
    };

    try {
      if (this.isEdit() && this.recordId() !== null) {
        await this.content.update<FacilityRecord>('facilities', 'id', this.recordId()!, payload);
        if (this.content.error()) {
          throw new Error(this.content.error()?.message ?? 'Failed to update facility.');
        }
      } else {
        await this.content.insert<FacilityRecord>('facilities', payload);
        if (this.content.error()) {
          throw new Error(this.content.error()?.message ?? 'Failed to create facility.');
        }
      }

      const oldUrl = this.originalImageUrl();
      if (oldUrl && (this.removeImage() || this.selectedFile())) {
        const path = this.storage.publicPath(oldUrl);
        if (path) await this.storage.remove('school-assets', path);
      }

      await this.router.navigateByUrl('/admin/facilities');
    } catch (err) {
      if (uploadedPath) await this.storage.remove('school-assets', uploadedPath);
      this.error.set(err instanceof Error ? err.message : 'Failed to save facility.');
    } finally {
      this.saving.set(false);
    }
  }

  protected cancel(): void {
    this.router.navigateByUrl('/admin/facilities');
  }
}
