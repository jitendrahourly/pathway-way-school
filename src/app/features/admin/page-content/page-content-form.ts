import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  CONTENT_PAGES,
  type ContentPageData,
  type ContentPageSection,
} from '../../../core/data/content-pages.seed';
import { pageContentPreview } from '../../../core/data/page-content-previews';
import type { PageContentRecord } from '../../../core/models/supabase.model';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { ContentService } from '../../../core/services/content.service';
import { StorageService } from '../../../core/services/storage.service';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  selector: 'app-page-content-form',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: '../announcements/announcement-form.scss',
  templateUrl: './page-content-form.html',
})
export class PageContentForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly content = inject(ContentService);
  private readonly storage = inject(StorageService);
  private readonly adminAuth = inject(AdminAuthService);

  protected readonly isEdit = signal(false);
  protected readonly existingRecord = signal(false);
  protected readonly originalSlug = signal<string | null>(null);
  protected readonly previewUrl = computed(() => {
    const url = pageContentPreview(this.originalSlug() ?? '')?.previewUrl;
    return url ? `${url}?preview=1` : undefined;
  });
  protected readonly hasSeedTemplate = computed(() => {
    const slug = this.originalSlug() || this.form.controls.page_slug.value;
    return !!(slug && CONTENT_PAGES[slug]);
  });
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal<string | null>(null);

  protected readonly selectedFile = signal<File | null>(null);
  protected readonly imagePreviewUrl = signal<string | null>(null);
  protected readonly existingImageUrl = signal<string | null>(null);
  protected readonly originalImageUrl = signal<string | null>(null);
  protected readonly removeImage = signal(false);

  protected readonly knownSlugs = Object.keys(CONTENT_PAGES);

  private newFaqGroup(question = '', answer = '') {
    return this.fb.group({
      question: [question],
      answer: [answer],
    });
  }

  private newSectionGroup(title = '', paragraphs = '', bullets = '') {
    return this.fb.group({
      title: [title],
      paragraphs: [paragraphs],
      bullets: [bullets],
    });
  }

  protected readonly faqs = this.fb.array([this.newFaqGroup()]);
  protected readonly sections = this.fb.array([this.newSectionGroup()]);

  protected readonly form = this.fb.group({
    page_slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    title: ['', [Validators.required]],
    subtitle: [''],
    imageUrl: [''],
    imageAlt: [''],
    paragraphs: ['', [Validators.required]],
    bullets: [''],
    note: [''],
    sections: this.sections,
    is_published: [true],
    faqs: this.faqs,
  });

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.isEdit.set(true);
      this.originalSlug.set(slug);
      await this.load(slug);
    }
  }

  private async load(slug: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const row = await this.content.selectById<PageContentRecord>('page_contents', 'page_slug', slug);
      const seed = CONTENT_PAGES[slug] as ContentPageData | undefined;
      if (!row && !seed) {
        this.error.set('Page content not found.');
        return;
      }

      this.existingRecord.set(row !== null);

      const rowContent = (row?.content ?? {}) as Partial<ContentPageData>;

      const hasPlaceholderText = (paragraphs?: readonly string[]) =>
        paragraphs?.some(
          (p) =>
            p.includes('confirmed by the school office') ||
            p.includes('will be updated soon') ||
            p.includes('published once confirmed'),
        ) ?? false;

      const paragraphs =
        !rowContent.paragraphs || rowContent.paragraphs.length === 0 || hasPlaceholderText(rowContent.paragraphs)
          ? seed?.paragraphs ?? rowContent.paragraphs ?? []
          : rowContent.paragraphs;

      const bullets =
        !rowContent.bullets || rowContent.bullets.length === 0 || (seed?.bullets && rowContent.bullets.length < seed.bullets.length)
          ? seed?.bullets ?? rowContent.bullets
          : rowContent.bullets;

      const sections =
        !rowContent.sections || rowContent.sections.length === 0
          ? seed?.sections ?? rowContent.sections
          : rowContent.sections;

      const faqs =
        !rowContent.faqs || rowContent.faqs.length === 0
          ? seed?.faqs ?? rowContent.faqs
          : rowContent.faqs;

      const data = {
        title: rowContent.title ?? seed?.title ?? '',
        subtitle: rowContent.subtitle ?? seed?.subtitle ?? '',
        imageUrl: rowContent.imageUrl ?? seed?.imageUrl ?? '',
        imageAlt: rowContent.imageAlt ?? seed?.imageAlt ?? '',
        paragraphs,
        bullets,
        sections,
        note: rowContent.note ?? seed?.note ?? '',
        faqs,
      };

      this.form.patchValue({
        page_slug: slug,
        title: data.title ?? '',
        subtitle: data.subtitle ?? '',
        imageUrl: data.imageUrl ?? '',
        imageAlt: data.imageAlt ?? '',
        paragraphs: (data.paragraphs ?? []).join('\n'),
        bullets: (data.bullets ?? []).join('\n'),
        note: data.note ?? '',
        is_published: row?.is_published ?? true,
      });

      this.sections.clear();
      for (const section of data.sections ?? []) {
        this.sections.push(
          this.newSectionGroup(
            section.title,
            (section.paragraphs ?? []).join('\n'),
            (section.bullets ?? []).join('\n'),
          ),
        );
      }

      this.faqs.clear();
      for (const faq of data.faqs ?? []) {
        this.faqs.push(this.newFaqGroup(faq.question, faq.answer));
      }
      if (!this.faqs.length) {
        this.faqs.push(this.newFaqGroup());
      }

      const imageUrl = (data.imageUrl ?? '').trim();
      this.existingImageUrl.set(imageUrl || null);
      this.originalImageUrl.set(imageUrl || null);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load page content.');
    } finally {
      this.loading.set(false);
    }
  }

  protected restoreDefaultContent(): void {
    const slug = this.originalSlug() || this.form.controls.page_slug.value;
    if (!slug) return;
    const seed = CONTENT_PAGES[slug];
    if (!seed) return;

    this.form.patchValue({
      title: seed.title,
      subtitle: seed.subtitle,
      imageUrl: seed.imageUrl,
      imageAlt: seed.imageAlt,
      paragraphs: (seed.paragraphs ?? []).join('\n'),
      bullets: (seed.bullets ?? []).join('\n'),
      note: seed.note ?? '',
    });

    this.sections.clear();
    for (const section of seed.sections ?? []) {
      this.sections.push(
        this.newSectionGroup(
          section.title,
          (section.paragraphs ?? []).join('\n'),
          (section.bullets ?? []).join('\n'),
        ),
      );
    }

    this.faqs.clear();
    for (const faq of seed.faqs ?? []) {
      this.faqs.push(this.newFaqGroup(faq.question, faq.answer));
    }
    if (!this.faqs.length) {
      this.faqs.push(this.newFaqGroup());
    }

    const imageUrl = (seed.imageUrl ?? '').trim();
    this.existingImageUrl.set(imageUrl || null);
    this.success.set(`Default content loaded for "${seed.title}". Click "Save changes" to apply.`);
  }

  protected addFaq(): void {
    this.faqs.push(this.newFaqGroup());
  }

  protected removeFaq(index: number): void {
    this.faqs.removeAt(index);
    if (!this.faqs.length) {
      this.faqs.push(this.newFaqGroup());
    }
  }

  protected addSection(): void {
    this.sections.push(this.newSectionGroup());
  }

  protected removeSection(index: number): void {
    this.sections.removeAt(index);
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
    reader.onload = () => this.imagePreviewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  protected clearSelectedImage(): void {
    this.selectedFile.set(null);
    this.imagePreviewUrl.set(null);
  }

  protected markRemoveImage(): void {
    this.removeImage.set(true);
    this.selectedFile.set(null);
    this.imagePreviewUrl.set(null);
    this.existingImageUrl.set(null);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    this.error.set(null);
    this.success.set(null);

    const v = this.form.getRawValue();
    const slug = (v.page_slug ?? '').trim();
    const paragraphs = this.lines(v.paragraphs);
    if (!paragraphs.length) {
      this.error.set('At least one paragraph is required.');
      this.saving.set(false);
      return;
    }

    const bullets = this.lines(v.bullets);
    const note = (v.note ?? '').trim();
    const sections: ContentPageSection[] = this.sections
      .getRawValue()
      .map((section) => {
        const sectionBullets = this.lines(section.bullets);
        return {
          title: (section.title ?? '').trim(),
          paragraphs: this.lines(section.paragraphs),
          ...(sectionBullets.length ? { bullets: sectionBullets } : {}),
        };
      })
      .filter((section) => section.title && section.paragraphs.length);
    const faqs = this.faqs
      .getRawValue()
      .map((faq) => ({ question: (faq.question ?? '').trim(), answer: (faq.answer ?? '').trim() }))
      .filter((faq) => faq.question && faq.answer);

    let imageUrl = this.removeImage() ? '' : (this.existingImageUrl() ?? '');
    let uploadedPath: string | null = null;
    if (this.selectedFile()) {
      const file = this.selectedFile() as File;
      const path = `page-content/${slug || 'page'}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const res = await this.storage.upload('school-assets', path, file);
      if (res.error || !res.publicUrl) {
        this.error.set(res.error?.message ?? 'Image upload failed.');
        this.saving.set(false);
        return;
      }
      uploadedPath = res.path;
      imageUrl = res.publicUrl;
    }

    const page: ContentPageData = {
      title: (v.title ?? '').trim(),
      subtitle: (v.subtitle ?? '').trim(),
      imageUrl: imageUrl.trim(),
      imageAlt: (v.imageAlt ?? '').trim(),
      paragraphs,
      ...(bullets.length ? { bullets } : {}),
      ...(sections.length ? { sections } : {}),
      ...(note ? { note } : {}),
      ...(faqs.length ? { faqs } : {}),
    };

    const payload: Record<string, unknown> = {
      page_slug: slug,
      content: page,
      is_published: v.is_published === true,
      updated_at: new Date().toISOString(),
      updated_by: this.adminAuth.profile()?.id ?? null,
    };

    try {
      // An edit is only an update when the row already exists. Pages that are
      // still using their seed copy are created here, the same way main pages do.
      if (this.existingRecord() && this.originalSlug()) {
        await this.content.update<PageContentRecord>(
          'page_contents',
          'page_slug',
          this.originalSlug()!,
          payload as Partial<PageContentRecord>,
        );
        if (this.content.error()) {
          throw new Error(this.content.error()?.message ?? 'Failed to update page content.');
        }
      } else {
        await this.content.insert<PageContentRecord>(
          'page_contents',
          payload as Partial<PageContentRecord>,
        );
        if (this.content.error()) {
          throw new Error(this.content.error()?.message ?? 'Failed to create page content.');
        }
      }

      const oldUrl = this.originalImageUrl();
      if (oldUrl && (this.removeImage() || this.selectedFile())) {
        const path = this.storagePathFromUrl(oldUrl);
        if (path) {
          await this.storage.remove('school-assets', path);
        }
      }

      this.success.set(
        this.existingRecord()
          ? 'Page content updated successfully.'
          : 'Page content created successfully.',
      );
      await this.router.navigateByUrl('/admin/page-content');
    } catch (err) {
      if (uploadedPath) {
        await this.storage.remove('school-assets', uploadedPath);
      }
      this.error.set(err instanceof Error ? err.message : 'Failed to save page content.');
    } finally {
      this.saving.set(false);
    }
  }

  private lines(value: string | null | undefined): string[] {
    return (value ?? '')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  private storagePathFromUrl(url: string): string | null {
    const marker = '/storage/v1/object/public/school-assets/';
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.slice(idx + marker.length));
  }

  protected cancel(): void {
    this.router.navigateByUrl('/admin/page-content');
  }
}
