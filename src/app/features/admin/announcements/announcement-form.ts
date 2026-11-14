import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { ContentService } from '../../../core/services/content.service';
import { StorageService } from '../../../core/services/storage.service';
import type { AnnouncementRecord } from '../../../core/models/supabase.model';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  selector: 'app-announcement-form',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './announcement-form.scss',
  templateUrl: './announcement-form.html',
})
export class AnnouncementForm implements OnInit {
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

  protected readonly form = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    published_at: [''],
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
      const row = await this.content.selectById<AnnouncementRecord>('announcements', 'id', id);
      if (!row) {
        this.error.set('Announcement not found.');
        return;
      }
      this.form.patchValue({
        title: row.title ?? '',
        description: row.description ?? '',
        category: row.category ?? '',
        published_at: row.published_at ?? '',
        is_published: row.is_published ?? false,
      });
      this.existingImageUrl.set(row.image_url ?? null);
      this.originalImageUrl.set(row.image_url ?? null);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load announcement.');
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

    // Upload new image if selected.
    let uploadedPath: string | null = null;
    if (this.selectedFile()) {
      const file = this.selectedFile() as File;
      const path = `announcements/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const res = await this.storage.upload('school-assets', path, file);
      if (res.error || !res.publicUrl) {
        this.error.set(res.error?.message ?? 'Image upload failed.');
        this.saving.set(false);
        return;
      }
      uploadedPath = res.path;
      imageUrl = res.publicUrl;
    }

    const isPublished = v.is_published === true;
    const publishedAt = isPublished
      ? (v.published_at?.trim() || new Date().toISOString().slice(0, 10))
      : (v.published_at?.trim() || null);

    const payload: Record<string, unknown> = {
      title: v.title!.trim(),
      description: v.description!.trim(),
      category: v.category!,
      image_url: imageUrl,
      published_at: publishedAt,
      is_published: isPublished,
    };

    try {
      if (this.isEdit() && this.recordId() !== null) {
        payload['updated_at'] = new Date().toISOString();
        await this.content.update<AnnouncementRecord>(
          'announcements',
          'id',
          this.recordId()!,
          payload as Partial<AnnouncementRecord>,
        );
        if (this.content.error()) {
          throw new Error(this.content.error()?.message ?? 'Failed to update announcement.');
        }
      } else {
        await this.content.insert<AnnouncementRecord>('announcements', payload as Partial<AnnouncementRecord>);
        if (this.content.error()) {
          throw new Error(this.content.error()?.message ?? 'Failed to create announcement.');
        }
      }

      const oldUrl = this.originalImageUrl();
      if (oldUrl && (this.removeImage() || this.selectedFile())) {
        const path = this.storagePathFromUrl(oldUrl);
        if (path) {
          await this.storage.remove('school-assets', path);
        }
      }

      this.success.set(this.isEdit() ? 'Announcement updated successfully.' : 'Announcement created successfully.');
      await this.router.navigateByUrl('/admin/announcements');
    } catch (err) {
      // Best-effort cleanup of uploaded file on DB failure.
      if (uploadedPath) {
        await this.storage.remove('school-assets', uploadedPath);
      }
      this.error.set(err instanceof Error ? err.message : 'Failed to save announcement.');
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
    this.router.navigateByUrl('/admin/announcements');
  }
}
