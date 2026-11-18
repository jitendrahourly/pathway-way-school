import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  selector: 'app-image-upload-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="upload-area" [class.upload-area--has-image]="value() || previewDataUrl()">
      @if (uploading()) {
        <div class="upload-area__placeholder">
          <span class="upload-area__icon upload-area__icon--spinner" aria-hidden="true">↻</span>
          <strong>Uploading image…</strong>
          <span>Please wait while your image is uploaded.</span>
        </div>
      } @else if (previewDataUrl()) {
        <div class="upload-area__preview-wrap">
          <img [src]="previewDataUrl()" alt="Selected image preview" class="upload-area__preview" />
          <span class="upload-area__badge">Pending Save</span>
        </div>
      } @else if (removePending()) {
        <div class="upload-area__placeholder upload-area__placeholder--remove">
          <span class="upload-area__icon" aria-hidden="true">✕</span>
          <strong>Image marked for removal</strong>
          <span>This image will be removed when you save changes.</span>
        </div>
      } @else if (value()) {
        <div class="upload-area__preview-wrap">
          <img [src]="value()" alt="Current image" class="upload-area__preview" />
          <span class="upload-area__badge upload-area__badge--current">Current Image</span>
        </div>
      } @else {
        <div class="upload-area__placeholder">
          <span class="upload-area__icon" aria-hidden="true">↑</span>
          <strong>Choose an image to upload</strong>
          <span>JPEG, PNG or WebP, up to 5 MB</span>
        </div>
      }

      <div class="upload-area__actions">
        <label class="btn btn--purple upload-area__button" [class.disabled]="uploading() || disabled()">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
          <span>{{ value() || previewDataUrl() ? 'Replace Image' : 'Select Image' }}</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" (change)="onFileChange($event)" hidden [disabled]="uploading() || disabled()" />
        </label>
        @if ((value() || previewDataUrl()) && !uploading()) {
          <button type="button" class="btn btn--ghost upload-area__remove-btn" (click)="remove()" [disabled]="disabled()">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
            <span>Remove Image</span>
          </button>
        }
      </div>
      @if (error()) {
        <p class="field__error">{{ error() }}</p>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .upload-area {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.25rem;
      border: 1.5px dashed var(--bw-line, #e2e8f0);
      border-radius: 14px;
      background: #fafafc;
      transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
    }

    .upload-area:hover {
      border-color: var(--bw-purple, #30205d);
      background: #ffffff;
    }

    .upload-area--has-image {
      background: #ffffff;
      border-style: solid;
      border-color: var(--bw-line, #e2e8f0);
    }

    .upload-area__preview-wrap {
      position: relative;
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
      background: #f1f0f5;
      border: 1px solid var(--bw-line, #e2e8f0);
      box-shadow: 0 4px 14px rgba(48, 32, 93, 0.06);
    }

    .upload-area__preview {
      display: block;
      width: 100%;
      max-height: 280px;
      object-fit: cover;
      object-position: center;
      transition: transform 0.25s ease;
    }

    .upload-area__badge {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      background: rgba(232, 121, 39, 0.92);
      color: #ffffff;
      backdrop-filter: blur(4px);
    }

    .upload-area__badge--current {
      background: rgba(48, 32, 93, 0.82);
    }

    .upload-area__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.8rem 1rem;
      text-align: center;
      gap: 0.35rem;
      color: var(--bw-body, #64748b);
    }

    .upload-area__placeholder--remove {
      color: #b03a2e;
      background: rgba(176, 58, 46, 0.04);
      border-radius: 10px;
    }

    .upload-area__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: var(--bw-purple-soft, #f2eff9);
      color: var(--bw-purple, #30205d);
      font-size: 1.35rem;
      font-weight: 700;
      margin-bottom: 0.35rem;
    }

    .upload-area__placeholder--remove .upload-area__icon {
      background: rgba(176, 58, 46, 0.12);
      color: #b03a2e;
    }

    .upload-area__icon--spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .upload-area__placeholder strong {
      color: var(--bw-ink, #1f1a2e);
      font-size: 0.95rem;
      font-weight: 600;
    }

    .upload-area__placeholder span {
      font-size: 0.82rem;
      color: var(--bw-muted, #8b859f);
    }

    .upload-area__actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .upload-area__button {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      height: 40px;
      padding: 0 1.2rem;
      font-size: 0.88rem;
      font-weight: 600;
      border-radius: 10px;
      background: var(--bw-purple, #30205d);
      color: #ffffff;
      border: 1px solid transparent;
      box-shadow: 0 4px 12px rgba(48, 32, 93, 0.15);
      transition: all 0.2s ease;
    }

    .upload-area__button:hover:not(.disabled) {
      background: var(--bw-purple-dark, #251747);
      transform: translateY(-1px);
    }

    .upload-area__button.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .upload-area__remove-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      height: 40px;
      padding: 0 1rem;
      font-size: 0.86rem;
      font-weight: 600;
      border-radius: 10px;
      color: #b03a2e;
      background: rgba(176, 58, 46, 0.07);
      border: 1px solid rgba(176, 58, 46, 0.22);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .upload-area__remove-btn:hover:not(:disabled) {
      background: rgba(176, 58, 46, 0.14);
      border-color: rgba(176, 58, 46, 0.38);
    }

    .field__error {
      margin: 0;
      font-size: 0.82rem;
      color: #b03a2e;
      font-weight: 500;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadFieldComponent),
      multi: true,
    },
  ],
})
export class ImageUploadFieldComponent implements ControlValueAccessor {
  private readonly storage = inject(StorageService);

  protected readonly value = signal<string>('');
  protected readonly originalValue = signal<string>('');
  protected readonly previewDataUrl = signal<string | null>(null);
  protected readonly pendingFile = signal<File | null>(null);
  protected readonly removePending = signal(false);
  protected readonly uploading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly disabled = signal(false);

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};
  private initialized = false;
  private uploadedPath: string | null = null;
  private pendingDeletionPath: string | null = null;

  writeValue(v: unknown): void {
    const val = typeof v === 'string' ? v : v == null ? '' : String(v);
    this.value.set(val);
    if (!this.initialized) {
      this.originalValue.set(val);
      this.initialized = true;
    }
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
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
    this.pendingFile.set(file);
    this.removePending.set(false);
    const reader = new FileReader();
    reader.onload = () => this.previewDataUrl.set(reader.result as string);
    reader.readAsDataURL(file);
    input.value = '';
  }

  protected remove(): void {
    this.pendingFile.set(null);
    this.previewDataUrl.set(null);
    this.removePending.set(true);
    this.error.set(null);
  }

  async commit(): Promise<void> {
    this.error.set(null);
    const previous = this.value();

    if (this.removePending()) {
      if (previous) {
        this.pendingDeletionPath = this.storagePathFromUrl(previous);
      }
      this.value.set('');
      this.onChange('');
      this.onTouched();
      this.removePending.set(false);
      return;
    }

    const file = this.pendingFile();
    if (!file) return;

    this.uploading.set(true);
    const path = `page-content/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const res = await this.storage.upload('school-assets', path, file);
    this.uploading.set(false);
    if (res.error || !res.publicUrl) {
      this.error.set(res.error?.message ?? 'Image upload failed.');
      throw new Error(this.error() ?? 'Image upload failed.');
    }
    this.uploadedPath = res.path;

    if (previous && previous !== res.publicUrl) {
      this.pendingDeletionPath = this.storagePathFromUrl(previous);
    }

    this.value.set(res.publicUrl);
    this.onChange(res.publicUrl);
    this.onTouched();
    this.pendingFile.set(null);
    this.previewDataUrl.set(null);
  }

  async finalize(): Promise<void> {
    if (this.pendingDeletionPath) {
      await this.storage.remove('school-assets', this.pendingDeletionPath);
      this.pendingDeletionPath = null;
    }
    this.originalValue.set(this.value());
  }

  async rollback(): Promise<void> {
    if (this.uploadedPath) {
      await this.storage.remove('school-assets', this.uploadedPath);
      this.uploadedPath = null;
    }
    // restore original value and keep the previous image (no deletion)
    this.value.set(this.originalValue());
    this.onChange(this.originalValue());
    this.pendingFile.set(null);
    this.previewDataUrl.set(null);
    this.removePending.set(false);
    this.pendingDeletionPath = null;
    this.error.set(null);
  }

  private storagePathFromUrl(url: string): string | null {
    const marker = '/storage/v1/object/public/school-assets/';
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.slice(idx + marker.length));
  }
}