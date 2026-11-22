import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import {
  ACADEMIC_CTA_COPY,
  ACADEMIC_PAGE_COPY,
  ACADEMIC_STAGE_COPY,
  CONTENT_PAGES,
  FACILITIES_CTA_COPY,
  FACILITIES_PAGE_COPY,
  FACILITIES_STAGE_COPY,
  SCHOOL_LIFE_CTA_COPY,
  SCHOOL_LIFE_PAGE_COPY,
  SCHOOL_LIFE_STAGE_COPY,
  type ContentPageData,
  type ContentPageSection,
} from '../../../core/data/content-pages.seed';
import { pageContentPreview } from '../../../core/data/page-content-previews';
import type { PageContentRecord } from '../../../core/models/supabase.model';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { ContentService } from '../../../core/services/content.service';
import { StorageService } from '../../../core/services/storage.service';
import type { IconName } from '../../../shared/components/ui-icon/ui-icon';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';
import {
  ContentPagePreview,
  type ContentPagePreviewData,
} from './content-page-preview';
import { EditorItemComponent } from './editor-item/editor-item';
import { EditorSectionComponent } from './editor-section/editor-section';

type FormValue = Record<string, any>;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const STAGE_ICON_OPTIONS: readonly IconName[] = [
  'book-open',
  'users',
  'clock',
  'heart',
  'eye',
  'graduation-cap',
  'target',
  'check',
  'calendar',
  'flask',
  'monitor',
  'trophy',
];

@Component({
  selector: 'app-page-content-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ContentPagePreview,
    EditorSectionComponent,
    EditorItemComponent,
    UiIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './page-content-form.scss',
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

  /** Section panels the administrator has expanded (first one open by default). */
  protected readonly openSections = signal<ReadonlySet<string>>(new Set<string>(['cp-banner']));

  /** Repeated content items the administrator has expanded, keyed `array:index`. */
  protected readonly openItems = signal<ReadonlySet<string>>(new Set<string>());

  protected isSectionOpen(id: string): boolean {
    return this.openSections().has(id);
  }

  protected toggleSection(id: string): void {
    this.openSections.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  protected isItemOpen(array: string, index: number | string): boolean {
    return this.openItems().has(`${array}:${index}`);
  }

  protected toggleItem(array: string, index: number | string): void {
    const key = `${array}:${index}`;
    this.openItems.update((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  /** Expands a freshly added repeatable item so its fields are ready to edit. */
  private openNewItem(array: string, index: number): void {
    this.openItems.update((current) => new Set(current).add(`${array}:${index}`));
  }

  private text(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

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

  private newStageFactGroup(label = '', value = '', icon: IconName = 'check') {
    return this.fb.group({
      label: [label],
      value: [value],
      icon: [icon],
    });
  }

  protected readonly stageIcons = STAGE_ICON_OPTIONS;
  protected readonly faqs = this.fb.array([this.newFaqGroup()]);
  protected readonly sections = this.fb.array([this.newSectionGroup()]);
  protected readonly stageFacts = this.fb.array([this.newStageFactGroup()]);

  protected readonly form = this.fb.group({
    page_slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    title: ['', [Validators.required]],
    subtitle: [''],
    imageUrl: [''],
    imageAlt: [''],
    paragraphs: ['', [Validators.required]],
    bullets: [''],
    note: [''],
    mediaBadge: [''],
    overviewEyebrow: [''],
    highlightsTitle: [''],
    sectionsEyebrow: [''],
    sectionsTitle: [''],
    faqsEyebrow: [''],
    faqsTitle: [''],
    faqsSubtitle: [''],
    stage: this.fb.group({
      tag: [''],
      title: [''],
      gradesBadge: [''],
      ctaLabel: [''],
      facts: this.stageFacts,
    }),
    cta: this.fb.group({
      tag: [''],
      title: [''],
      text: [''],
      primaryLabel: [''],
      secondaryLabel: [''],
    }),
    sections: this.sections,
    is_published: [true],
    faqs: this.faqs,
  });

  protected readonly formValue = toSignal(
    this.form.valueChanges.pipe(map(() => this.form.getRawValue() as FormValue)),
    { initialValue: this.form.getRawValue() as FormValue },
  );

  protected readonly contentPreview = computed<ContentPagePreviewData>(() => {
    const value = this.formValue();
    const stage = (value['stage'] ?? {}) as FormValue;
    const cta = (value['cta'] ?? {}) as FormValue;
    const family = this.pageFamily();
    const hasPageBlocks = this.hasPageBlocks();
    const isAcademic = this.isAcademicPage();
    return {
      family,
      hasPageBlocks,
      isAcademic,
      title: this.text(value['title']),
      subtitle: this.text(value['subtitle']),
      imageUrl: this.text(value['imageUrl']),
      imageAlt: this.text(value['imageAlt']),
      paragraphs: this.lines(value['paragraphs']),
      bullets: this.lines(value['bullets']),
      note: this.text(value['note']),
      mediaBadge: this.text(value['mediaBadge']),
      overviewEyebrow: this.text(value['overviewEyebrow']),
      highlightsTitle: this.text(value['highlightsTitle']),
      sectionsEyebrow: this.text(value['sectionsEyebrow']),
      sectionsTitle: this.text(value['sectionsTitle']),
      faqsEyebrow: this.text(value['faqsEyebrow']),
      faqsTitle: this.text(value['faqsTitle']),
      faqsSubtitle: this.text(value['faqsSubtitle']),
      stage: hasPageBlocks
        ? {
            tag: this.text(stage['tag']),
            title: this.text(stage['title']),
            gradesBadge: this.text(stage['gradesBadge']),
            ctaLabel: this.text(stage['ctaLabel']),
            facts: ((stage['facts'] ?? []) as FormValue[]).map((fact) => ({
              icon: this.stageIcon(this.text(fact['icon'])),
              label: this.text(fact['label']),
              value: this.text(fact['value']),
            })),
          }
        : null,
      sections: ((value['sections'] ?? []) as FormValue[]).map((section) => ({
        title: this.text(section['title']),
        paragraphs: this.lines(section['paragraphs']),
        bullets: this.lines(section['bullets']),
      })),
      faqs: ((value['faqs'] ?? []) as FormValue[]).map((faq) => ({
        question: this.text(faq['question']),
        answer: this.text(faq['answer']),
      })),
      cta:
        hasPageBlocks && (cta['title'] || cta['text'] || cta['primaryLabel'])
          ? {
              tag: this.text(cta['tag']),
              title: this.text(cta['title']),
              text: this.text(cta['text']),
              primaryLabel: this.text(cta['primaryLabel']),
              secondaryLabel: this.text(cta['secondaryLabel']),
            }
          : hasPageBlocks
            ? {
                tag: this.text(cta['tag']),
                title: this.text(cta['title']),
                text: this.text(cta['text']),
                primaryLabel: this.text(cta['primaryLabel']),
                secondaryLabel: this.text(cta['secondaryLabel']),
              }
            : null,
    };
  });


  /** Academic, School Life and Facilities pages share the stage card, headings and CTA. */
  protected hasPageBlocks(): boolean {
    return this.pageFamily() !== null;
  }

  /** Academic level pages also show an image badge above the media frame. */
  protected isAcademicPage(): boolean {
    return this.pageFamily() === 'academics-';
  }

  private pageFamily(): 'academics-' | 'school-life-' | 'facilities-' | null {
    const slug = this.originalSlug() || this.form.controls.page_slug.value;
    if (!slug) return null;
    if (slug.startsWith('academics-')) return 'academics-';
    if (slug.startsWith('school-life-')) return 'school-life-';
    if (slug.startsWith('facilities-')) return 'facilities-';
    return null;
  }

  /** Defaults for the page being edited, shown as field placeholders. */
  protected readonly copyDefaults = computed(() => {
    switch (this.pageFamily()) {
      case 'school-life-':
        return {
          headings: SCHOOL_LIFE_PAGE_COPY,
          stage: SCHOOL_LIFE_STAGE_COPY,
          cta: SCHOOL_LIFE_CTA_COPY,
        };
      case 'facilities-':
        return {
          headings: FACILITIES_PAGE_COPY,
          stage: FACILITIES_STAGE_COPY,
          cta: FACILITIES_CTA_COPY,
        };
      default:
        return {
          headings: ACADEMIC_PAGE_COPY,
          stage: ACADEMIC_STAGE_COPY,
          cta: ACADEMIC_CTA_COPY,
        };
    }
  });

  private stageIcon(value: string | null | undefined): IconName {
    return STAGE_ICON_OPTIONS.includes(value as IconName) ? (value as IconName) : 'check';
  }

  /** Fills the form from a page's content. Shared by load and default restore. */
  private applyContent(data: Partial<ContentPageData>): void {
    this.form.patchValue({
      title: data.title ?? '',
      subtitle: data.subtitle ?? '',
      imageUrl: data.imageUrl ?? '',
      imageAlt: data.imageAlt ?? '',
      paragraphs: (data.paragraphs ?? []).join('\n'),
      bullets: (data.bullets ?? []).join('\n'),
      note: data.note ?? '',
      mediaBadge: data.mediaBadge ?? '',
      overviewEyebrow: data.overviewEyebrow ?? '',
      highlightsTitle: data.highlightsTitle ?? '',
      sectionsEyebrow: data.sectionsEyebrow ?? '',
      sectionsTitle: data.sectionsTitle ?? '',
      faqsEyebrow: data.faqsEyebrow ?? '',
      faqsTitle: data.faqsTitle ?? '',
      faqsSubtitle: data.faqsSubtitle ?? '',
      stage: {
        tag: data.stage?.tag ?? '',
        title: data.stage?.title ?? '',
        gradesBadge: data.stage?.gradesBadge ?? '',
        ctaLabel: data.stage?.ctaLabel ?? '',
      },
      cta: {
        tag: data.cta?.tag ?? '',
        title: data.cta?.title ?? '',
        text: data.cta?.text ?? '',
        primaryLabel: data.cta?.primaryLabel ?? '',
        secondaryLabel: data.cta?.secondaryLabel ?? '',
      },
    });

    this.stageFacts.clear();
    for (const fact of data.stage?.facts ?? []) {
      this.stageFacts.push(this.newStageFactGroup(fact.label, fact.value, this.stageIcon(fact.icon)));
    }
    if (!this.stageFacts.length) {
      this.stageFacts.push(this.newStageFactGroup());
    }

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
  }

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

      // A saved record owns every key it stores: empty lists and an explicit
      // null stage/CTA are removals, not missing data. Only keys an older record
      // never stored fall back to the seed, so legacy rows still load fully.
      const hasSavedKey = (key: keyof ContentPageData) =>
        Object.prototype.hasOwnProperty.call(rowContent, key);

      const paragraphs =
        !rowContent.paragraphs || rowContent.paragraphs.length === 0 || hasPlaceholderText(rowContent.paragraphs)
          ? seed?.paragraphs ?? rowContent.paragraphs ?? []
          : rowContent.paragraphs;

      const bullets = hasSavedKey('bullets') ? (rowContent.bullets ?? []) : seed?.bullets ?? [];
      const sections = hasSavedKey('sections') ? (rowContent.sections ?? []) : seed?.sections ?? [];
      const faqs = hasSavedKey('faqs') ? (rowContent.faqs ?? []) : seed?.faqs ?? [];

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
        mediaBadge: rowContent.mediaBadge ?? seed?.mediaBadge ?? '',
        overviewEyebrow: rowContent.overviewEyebrow ?? seed?.overviewEyebrow ?? '',
        highlightsTitle: rowContent.highlightsTitle ?? seed?.highlightsTitle ?? '',
        sectionsEyebrow: rowContent.sectionsEyebrow ?? seed?.sectionsEyebrow ?? '',
        sectionsTitle: rowContent.sectionsTitle ?? seed?.sectionsTitle ?? '',
        faqsEyebrow: rowContent.faqsEyebrow ?? seed?.faqsEyebrow ?? '',
        faqsTitle: rowContent.faqsTitle ?? seed?.faqsTitle ?? '',
        faqsSubtitle: rowContent.faqsSubtitle ?? seed?.faqsSubtitle ?? '',
        stage: hasSavedKey('stage') ? (rowContent.stage ?? undefined) : seed?.stage,
        cta: hasSavedKey('cta') ? (rowContent.cta ?? undefined) : seed?.cta,
      };

      this.form.controls.page_slug.setValue(slug);
      this.form.controls.is_published.setValue(row?.is_published ?? true);
      this.applyContent(data);

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

    this.applyContent(seed);

    const imageUrl = (seed.imageUrl ?? '').trim();
    this.existingImageUrl.set(imageUrl || null);
    this.success.set(`Default content loaded for "${seed.title}". Click "Save changes" to apply.`);
  }

  protected addFaq(): void {
    this.faqs.push(this.newFaqGroup());
    this.openNewItem('faqs', this.faqs.length - 1);
  }

  protected removeFaq(index: number): void {
    this.faqs.removeAt(index);
    if (!this.faqs.length) {
      this.faqs.push(this.newFaqGroup());
    }
  }

  protected addSection(): void {
    this.sections.push(this.newSectionGroup());
    this.openNewItem('sections', this.sections.length - 1);
  }

  protected removeSection(index: number): void {
    this.sections.removeAt(index);
  }

  protected addStageFact(): void {
    this.stageFacts.push(this.newStageFactGroup());
    this.openNewItem('stageFacts', this.stageFacts.length - 1);
  }

  protected removeStageFact(index: number): void {
    this.stageFacts.removeAt(index);
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

    const hasStage = this.hasPageBlocks();
    const stageFacts = this.stageFacts
      .getRawValue()
      .map((fact) => ({
        label: (fact.label ?? '').trim(),
        value: (fact.value ?? '').trim(),
        icon: this.stageIcon(fact.icon),
      }))
      .filter((fact) => fact.label && fact.value);
    const hasStageContent = Boolean(
      (v.stage?.tag ?? '').trim() ||
        (v.stage?.title ?? '').trim() ||
        (v.stage?.gradesBadge ?? '').trim() ||
        (v.stage?.ctaLabel ?? '').trim() ||
        stageFacts.length,
    );
    const stage = hasStage && hasStageContent
      ? {
          tag: (v.stage?.tag ?? '').trim(),
          title: (v.stage?.title ?? '').trim(),
          gradesBadge: (v.stage?.gradesBadge ?? '').trim(),
          ctaLabel: (v.stage?.ctaLabel ?? '').trim(),
          facts: stageFacts,
        }
      : null;
    const hasCtaContent = Boolean(
      (v.cta?.tag ?? '').trim() ||
        (v.cta?.title ?? '').trim() ||
        (v.cta?.text ?? '').trim() ||
        (v.cta?.primaryLabel ?? '').trim() ||
        (v.cta?.secondaryLabel ?? '').trim(),
    );
    const cta = hasStage && hasCtaContent
      ? {
          tag: (v.cta?.tag ?? '').trim(),
          title: (v.cta?.title ?? '').trim(),
          text: (v.cta?.text ?? '').trim(),
          primaryLabel: (v.cta?.primaryLabel ?? '').trim(),
          secondaryLabel: (v.cta?.secondaryLabel ?? '').trim(),
        }
      : null;

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
      // Always stored, so an emptied list stays empty instead of reverting to
      // the seed list on the public page.
      bullets,
      sections,
      note,
      faqs,
      ...(hasStage
        ? {
            mediaBadge: (v.mediaBadge ?? '').trim(),
            overviewEyebrow: (v.overviewEyebrow ?? '').trim(),
            highlightsTitle: (v.highlightsTitle ?? '').trim(),
            sectionsEyebrow: (v.sectionsEyebrow ?? '').trim(),
            sectionsTitle: (v.sectionsTitle ?? '').trim(),
            faqsEyebrow: (v.faqsEyebrow ?? '').trim(),
            faqsTitle: (v.faqsTitle ?? '').trim(),
            faqsSubtitle: (v.faqsSubtitle ?? '').trim(),
          }
        : {}),
      // `null` records that the block was cleared, so the public page hides it
      // instead of rendering the seed card or CTA again.
      ...(hasStage ? { stage, cta } : {}),
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

  private lines(value: unknown): string[] {
    return String(value ?? '')
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
