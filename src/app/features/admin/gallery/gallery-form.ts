import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { ContentService } from '../../../core/services/content.service';
import { StorageService } from '../../../core/services/storage.service';
import type { GalleryImageRecord } from '../../../core/models/supabase.model';
import { GALLERY_CATEGORIES } from '../../../core/data/gallery-categories';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  selector: 'app-gallery-form',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../announcements/announcement-form.scss',
  templateUrl: './gallery-form.html',
})
export class GalleryForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly content = inject(ContentService);
  private readonly storage = inject(StorageService);
  private readonly adminAuth = inject(AdminAuthService);

  protected readonly isEdit = signal(false);
  protected readonly recordId = signal<string | number | null>(null);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal<string | null>(null);

  protected readonly selectedFile = signal<File | null>(null);
  protected readonly previewUrl = signal<string | null>(null);
  protected readonly existingImageUrl = signal<string | null>(null);
  protected readonly originalImageUrl = signal<string | null>(null);
  protected readonly removeImage = signal(false);

  protected readonly categories = GALLERY_CATEGORIES;

  protected readonly form = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    category: ['', [Validators.required]],
    display_order: [0, [Validators.required, Validators.min(0)]],
    is_published: [false],
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
      const row = await this.content.selectById<GalleryImageRecord>('gallery_images', 'id', id);
      if (!row) {
        this.error.set('Gallery image not found.');
        return;
      }
      this.form.patchValue({
        title: row.title ?? '',
        description: row.description ?? '',
        category: row.category ?? '',
        display_order: row.display_order ?? 0,
        is_published: row.is_published ?? false,
      });
      this.existingImageUrl.set(row.image_url ?? null);
      this.originalImageUrl.set(row.image_url ?? null);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load gallery image.');
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

    if (!imageUrl && !this.selectedFile()) {
      this.error.set('An image is required.');
      this.saving.set(false);
      return;
    }

    let uploadedPath: string | null = null;
    if (this.selectedFile()) {
      const file = this.selectedFile() as File;
      const path = `gallery/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const res = await this.storage.upload('school-assets', path, file);
      if (res.error || !res.publicUrl) {
        this.error.set(res.error?.message ?? 'Image upload failed.');
        this.saving.set(false);
        return;
      }
      uploadedPath = res.path;
      imageUrl = res.publicUrl;
    }

    const payload: Record<string, unknown> = {
      title: v.title!.trim(),
      description: v.description?.trim() || null,
      category: v.category!,
      image_url: imageUrl,
      display_order: Number(v.display_order ?? 0),
      is_published: v.is_published === true,
    };

    try {
      if (this.isEdit() && this.recordId() !== null) {
        await this.content.update<GalleryImageRecord>(
          'gallery_images',
          'id',
          this.recordId()!,
          payload as Partial<GalleryImageRecord>,
        );
        if (this.content.error()) {
          throw new Error(this.content.error()?.message ?? 'Failed to update gallery image.');
        }
      } else {
        await this.content.insert<GalleryImageRecord>('gallery_images', payload as Partial<GalleryImageRecord>);
        if (this.content.error()) {
          throw new Error(this.content.error()?.message ?? 'Failed to create gallery image.');
        }
      }

      const oldUrl = this.originalImageUrl();
      if (oldUrl && (this.removeImage() || this.selectedFile())) {
        const path = this.storagePathFromUrl(oldUrl);
        if (path) {
          await this.storage.remove('school-assets', path);
        }
      }

      this.success.set(this.isEdit() ? 'Gallery image updated successfully.' : 'Gallery image created successfully.');
      await this.router.navigateByUrl('/admin/gallery');
    } catch (err) {
      if (uploadedPath) {
        await this.storage.remove('school-assets', uploadedPath);
      }
      this.error.set(err instanceof Error ? err.message : 'Failed to save gallery image.');
    } finally {
      this.saving.set(false);
    }
  }

  private storagePathFromUrl(url: string): string | null {
    const marker = '/storage/v1/object/public/school-assets/';
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.slice(idx + marker.length));
  }

  protected cancel(): void {
    this.router.navigateByUrl('/admin/gallery');
  }
}
