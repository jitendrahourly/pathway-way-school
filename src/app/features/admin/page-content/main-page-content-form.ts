import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { mainPageSeed } from '../../../core/data/main-pages.seed';
import { mergeWithSeed } from '../../../core/data/seed-merge';
import { resolveContactContent } from '../../../core/data/contact.seed';
import { pageContentPreview } from '../../../core/data/page-content-previews';
import type { PageContentRecord } from '../../../core/models/supabase.model';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { ContentService } from '../../../core/services/content.service';
import { ImageUploadFieldComponent } from '../../../shared/components/image-upload-field/image-upload-field';
import { UiIcon, type IconName } from '../../../shared/components/ui-icon/ui-icon';

type FormValue = Record<string, any>;

@Component({
  selector: 'app-main-page-content-form',
  imports: [ReactiveFormsModule, RouterLink, ImageUploadFieldComponent, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './main-page-content-form.scss',
  templateUrl: './main-page-content-form.html',
})
export class MainPageContentForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly content = inject(ContentService);
  private readonly adminAuth = inject(AdminAuthService);

  protected readonly slug = signal('');
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal<string | null>(null);
  protected readonly existingRecord = signal(false);
  protected readonly pageTitle = computed(
    () => mainPageSeed(this.slug())?.title ?? this.slug(),
  );
  protected readonly previewUrl = computed(() => {
    const url = pageContentPreview(this.slug())?.previewUrl;
    return url ? `${url}?preview=1` : undefined;
  });

  protected readonly suggestedIcons = [
    'eye',
    'target',
    'heart',
    'graduation-cap',
    'users',
    'trophy',
    'book-open',
    'flask',
    'check',
    'calendar',
    'clock',
    'image',
  ] as const;

  protected readonly homeHighlights = this.fb.array<FormGroup>([]);
  protected readonly aboutPillars = this.fb.array<FormGroup>([]);
  protected readonly aboutSections = this.fb.array<FormGroup>([]);
  protected readonly academicsCards = this.fb.array<FormGroup>([]);
  protected readonly academicsSections = this.fb.array<FormGroup>([]);
  protected readonly admissionsSections = this.fb.array<FormGroup>([]);
  protected readonly facilitiesAdditional = this.fb.array<FormGroup>([]);

  @ViewChildren(ImageUploadFieldComponent)
  protected imageFields!: QueryList<ImageUploadFieldComponent>;

  protected readonly form = this.fb.group({
    is_published: [true],
    home: this.fb.group({
      hero: this.fb.group({
        eyebrow: [''],
        titleLead: [''],
        titleAccent: [''],
        subtitle: [''],
        imageUrl: [''],
        imageAlt: [''],
        imagePosition: [''],
      }),
      highlights: this.homeHighlights,
      about: this.fb.group({
        eyebrow: [''],
        title: [''],
        body: [''],
        imageUrl: [''],
        imageAlt: [''],
        badge: [''],
      }),
      facilitiesIntro: [''],
      galleryIntro: [''],
      announcementsIntro: [''],
    }),
    about: this.fb.group({
      banner: this.bannerGroup(),
      story: this.fb.group({ eyebrow: [''], title: [''], paragraphs: [''] }),
      pillars: this.aboutPillars,
      photo: this.fb.group({ url: [''], alt: [''] }),
      sections: this.aboutSections,
    }),
    academics: this.fb.group({
      banner: this.bannerGroup(),
      intro: this.fb.group({
        eyebrow: [''],
        title: [''],
        paragraphs: [''],
        imageUrl: [''],
        imageAlt: [''],
      }),
      cards: this.academicsCards,
      sections: this.academicsSections,
    }),
    admissions: this.fb.group({
      banner: this.bannerGroup(),
      intro: this.fb.group({
        eyebrow: [''],
        title: [''],
        paragraphs: [''],
        note: [''],
      }),
      sections: this.admissionsSections,
      contact: this.fb.group({ title: [''], intro: [''], note: [''] }),
    }),
    contact: this.fb.group({
      banner: this.bannerGroup(),
      intro: this.fb.group({ eyebrow: [''], title: [''], paragraphs: [''] }),
      form: this.fb.group({
        eyebrow: [''],
        title: [''],
        intro: [''],
        nameLabel: [''],
        emailLabel: [''],
        phoneLabel: [''],
        subjectLabel: [''],
        messageLabel: [''],
        submitLabel: [''],
        successMessage: [''],
        errorMessage: [''],
      }),
      officeHours: this.fb.group({ title: [''], lines: [''] }),
      cards: this.fb.group({
        phoneTitle: [''],
        emailTitle: [''],
        addressTitle: [''],
        callLabel: [''],
        emailActionLabel: [''],
        mapActionLabel: [''],
      }),
      map: this.fb.group({ title: [''], intro: [''], emptyMessage: [''] }),
      directions: this.fb.group({ title: [''], intro: [''], steps: [''] }),
      instagram: this.fb.group({
        eyebrow: [''],
        title: [''],
        text: [''],
        buttonLabel: [''],
      }),
      schoolDetails: this.fb.group({ title: [''], lines: [''] }),
    }),
    facilities: this.fb.group({
      banner: this.bannerGroup(),
      intro: this.fb.group({
        eyebrow: [''],
        title: [''],
        paragraphs: [''],
        note: [''],
      }),
      gridEyebrow: [''],
      gridHeading: [''],
      detailsHeading: [''],
      additionalHeading: [''],
      additional: this.facilitiesAdditional,
    }),
    gallery: this.fb.group({
      banner: this.bannerGroup(),
      intro: this.fb.group({
        eyebrow: [''],
        title: [''],
        paragraphs: [''],
        note: [''],
      }),
      filterLabel: [''],
      emptyTitle: [''],
      emptyMessage: [''],
      resetLabel: [''],
      placeholderLabel: [''],
    }),
    announcements: this.fb.group({
      banner: this.bannerGroup(),
      intro: this.fb.group({ eyebrow: [''], title: [''], paragraphs: [''] }),
      listHeading: [''],
      filterLabel: [''],
      empty: this.fb.group({ title: [''], message: [''], contactNote: [''] }),
      detail: this.fb.group({
        backLabel: [''],
        unavailableTitle: [''],
        unavailableMessage: [''],
        unavailableLinkLabel: [''],
        fallbackBannerSubtitle: [''],
      }),
    }),
  });

  private bannerGroup(): FormGroup {
    return this.fb.group({ title: [''], subtitle: [''], imageUrl: [''], imageAlt: [''] });
  }

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.slug.set(slug);
    await this.load(slug);
  }

  private async load(slug: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const row = await this.content.selectById<PageContentRecord>(
        'page_contents',
        'page_slug',
        slug,
      );
      const seed = mainPageSeed(slug);
      if (!row && !seed) {
        this.error.set('Page content not found.');
        return;
      }

      this.existingRecord.set(row !== null);
      this.form.controls.is_published.setValue(row?.is_published ?? true);
      const seedContent = seed?.content;
      const data = (row?.content ?? seedContent ?? {}) as FormValue;
      // Saved rows may predate whole sections; merge them over the seed so the
      // editor starts from the same copy the public page renders.
      const merged = (seedContent ? mergeWithSeed(seedContent, data) : data) as FormValue;

      switch (slug) {
        case 'home':
          this.patchHome(merged);
          break;
        case 'about':
          this.patchAbout(merged);
          break;
        case 'academics':
          this.patchAcademics(merged);
          break;
        case 'admissions':
          this.patchAdmissions(merged);
          break;
        case 'contact':
          this.patchContact(merged);
          break;
        case 'facilities':
          this.patchFacilities(merged);
          break;
        case 'gallery':
          this.patchGallery(merged);
          break;
        case 'announcements':
          this.patchAnnouncements(merged);
          break;
      }
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to load page content.');
    } finally {
      this.loading.set(false);
    }
  }

  private patchHome(data: FormValue): void {
    const hero = (data['hero'] ?? {}) as FormValue;
    const about = (data['about'] ?? {}) as FormValue;
    this.form.controls.home.patchValue({
      hero: {
        eyebrow: hero['eyebrow'] ?? '',
        titleLead: hero['titleLead'] ?? '',
        titleAccent: hero['titleAccent'] ?? '',
        subtitle: hero['subtitle'] ?? '',
        imageUrl: hero['imageUrl'] ?? '',
        imageAlt: hero['imageAlt'] ?? '',
        imagePosition: hero['imagePosition'] ?? '',
      },
      about: {
        eyebrow: about['eyebrow'] ?? '',
        title: about['title'] ?? '',
        body: about['body'] ?? '',
        imageUrl: about['imageUrl'] ?? '',
        imageAlt: about['imageAlt'] ?? '',
        badge: about['badge'] ?? '',
      },
      facilitiesIntro: data['facilitiesIntro'] ?? '',
      galleryIntro: data['galleryIntro'] ?? '',
      announcementsIntro: data['announcementsIntro'] ?? '',
    });

    this.homeHighlights.clear();
    for (const item of (data['highlights'] ?? []) as FormValue[]) {
      this.homeHighlights.push(
        this.fb.group({
          icon: [item['icon'] ?? ''],
          title: [item['title'] ?? ''],
          description: [item['description'] ?? ''],
        }),
      );
    }
  }

  private patchAbout(data: FormValue): void {
    const story = (data['story'] ?? {}) as FormValue;
    const photo = (data['photo'] ?? {}) as FormValue;
    this.form.controls.about.patchValue({
      banner: this.bannerValue(data['banner']),
      story: {
        eyebrow: story['eyebrow'] ?? '',
        title: story['title'] ?? '',
        paragraphs: this.join(story['paragraphs']),
      },
      photo: { url: photo['url'] ?? '', alt: photo['alt'] ?? '' },
    });

    this.aboutPillars.clear();
    for (const item of (data['pillars'] ?? []) as FormValue[]) {
      this.aboutPillars.push(
        this.fb.group({
          icon: [item['icon'] ?? ''],
          title: [item['title'] ?? ''],
          text: [item['text'] ?? ''],
        }),
      );
    }

    this.aboutSections.clear();
    for (const item of (data['sections'] ?? []) as FormValue[]) {
      this.aboutSections.push(
        this.fb.group({
          id: [item['id'] ?? ''],
          title: [item['title'] ?? ''],
          paragraphs: [this.join(item['paragraphs'])],
        }),
      );
    }
  }

  private patchAcademics(data: FormValue): void {
    const intro = (data['intro'] ?? {}) as FormValue;
    this.form.controls.academics.patchValue({
      banner: this.bannerValue(data['banner']),
      intro: {
        eyebrow: intro['eyebrow'] ?? '',
        title: intro['title'] ?? '',
        paragraphs: this.join(intro['paragraphs']),
        imageUrl: intro['imageUrl'] ?? '',
        imageAlt: intro['imageAlt'] ?? '',
      },
    });

    this.academicsCards.clear();
    for (const item of (data['cards'] ?? []) as FormValue[]) {
      this.academicsCards.push(
        this.fb.group({
          icon: [item['icon'] ?? ''],
          label: [item['label'] ?? ''],
          value: [item['value'] ?? ''],
          note: [item['note'] ?? ''],
          status: [item['status'] ?? 'pending'],
        }),
      );
    }

    this.academicsSections.clear();
    for (const item of (data['sections'] ?? []) as FormValue[]) {
      this.academicsSections.push(
        this.fb.group({
          id: [item['id'] ?? ''],
          title: [item['title'] ?? ''],
          paragraphs: [this.join(item['paragraphs'])],
          bullets: [this.join(item['bullets'])],
          imageUrl: [item['imageUrl'] ?? ''],
          imageAlt: [item['imageAlt'] ?? ''],
          status: [item['status'] ?? 'pending'],
          note: [item['note'] ?? ''],
        }),
      );
    }
  }

  private patchAdmissions(data: FormValue): void {
    const intro = (data['intro'] ?? {}) as FormValue;
    const contact = (data['contact'] ?? {}) as FormValue;
    this.form.controls.admissions.patchValue({
      banner: this.bannerValue(data['banner']),
      intro: {
        eyebrow: intro['eyebrow'] ?? '',
        title: intro['title'] ?? '',
        paragraphs: this.join(intro['paragraphs']),
        note: intro['note'] ?? '',
      },
      contact: {
        title: contact['title'] ?? '',
        intro: contact['intro'] ?? '',
        note: contact['note'] ?? '',
      },
    });

    this.admissionsSections.clear();
    for (const item of (data['sections'] ?? []) as FormValue[]) {
      this.admissionsSections.push(
        this.fb.group({
          id: [item['id'] ?? ''],
          title: [item['title'] ?? ''],
          message: [item['message'] ?? ''],
        }),
      );
    }
  }

  private patchContact(data: FormValue): void {
    // Older saved records may not include every contact section yet; use the
    // same seed merge as the public page so the editor starts from the copy the
    // site actually renders.
    const content = resolveContactContent(data);
    this.form.controls.contact.patchValue({
      banner: { ...content.banner },
      intro: {
        eyebrow: content.intro.eyebrow,
        title: content.intro.title,
        paragraphs: this.join(content.intro.paragraphs),
      },
      form: { ...content.form },
      officeHours: {
        title: content.officeHours.title,
        lines: this.join(content.officeHours.lines),
      },
      cards: { ...content.cards },
      map: { ...content.map },
      directions: {
        title: content.directions.title,
        intro: content.directions.intro,
        steps: this.join(content.directions.steps),
      },
      instagram: { ...content.instagram },
      schoolDetails: {
        title: content.schoolDetails.title,
        lines: this.join(content.schoolDetails.lines),
      },
    });
  }

  private patchFacilities(data: FormValue): void {
    const intro = (data['intro'] ?? {}) as FormValue;
    this.form.controls.facilities.patchValue({
      banner: this.bannerValue(data['banner']),
      intro: {
        eyebrow: intro['eyebrow'] ?? '',
        title: intro['title'] ?? '',
        paragraphs: this.join(intro['paragraphs']),
        note: intro['note'] ?? '',
      },
      gridEyebrow: data['gridEyebrow'] ?? '',
      gridHeading: data['gridHeading'] ?? '',
      detailsHeading: data['detailsHeading'] ?? '',
      additionalHeading: data['additionalHeading'] ?? '',
    });

    this.facilitiesAdditional.clear();
    for (const item of (data['additional'] ?? []) as FormValue[]) {
      this.facilitiesAdditional.push(
        this.fb.group({
          id: [item['id'] ?? ''],
          title: [item['title'] ?? ''],
          description: [item['description'] ?? ''],
          imageUrl: [item['imageUrl'] ?? ''],
          imageAlt: [item['imageAlt'] ?? ''],
          displayOrder: [item['displayOrder'] ?? 0],
          isActive: [item['isActive'] ?? true],
        }),
      );
    }
  }

  private patchGallery(data: FormValue): void {
    const intro = (data['intro'] ?? {}) as FormValue;
    this.form.controls.gallery.patchValue({
      banner: this.bannerValue(data['banner']),
      intro: {
        eyebrow: intro['eyebrow'] ?? '',
        title: intro['title'] ?? '',
        paragraphs: this.join(intro['paragraphs']),
        note: intro['note'] ?? '',
      },
      filterLabel: data['filterLabel'] ?? '',
      emptyTitle: data['emptyTitle'] ?? '',
      emptyMessage: data['emptyMessage'] ?? '',
      resetLabel: data['resetLabel'] ?? '',
      placeholderLabel: data['placeholderLabel'] ?? '',
    });
  }

  private patchAnnouncements(data: FormValue): void {
    const intro = (data['intro'] ?? {}) as FormValue;
    const empty = (data['empty'] ?? {}) as FormValue;
    const detail = (data['detail'] ?? {}) as FormValue;
    this.form.controls.announcements.patchValue({
      banner: this.bannerValue(data['banner']),
      intro: {
        eyebrow: intro['eyebrow'] ?? '',
        title: intro['title'] ?? '',
        paragraphs: this.join(intro['paragraphs']),
      },
      listHeading: data['listHeading'] ?? '',
      filterLabel: data['filterLabel'] ?? '',
      empty: {
        title: empty['title'] ?? '',
        message: empty['message'] ?? '',
        contactNote: empty['contactNote'] ?? '',
      },
      detail: {
        backLabel: detail['backLabel'] ?? '',
        unavailableTitle: detail['unavailableTitle'] ?? '',
        unavailableMessage: detail['unavailableMessage'] ?? '',
        unavailableLinkLabel: detail['unavailableLinkLabel'] ?? '',
        fallbackBannerSubtitle: detail['fallbackBannerSubtitle'] ?? '',
      },
    });
  }

  protected addHomeHighlight(): void {
    this.homeHighlights.push(this.fb.group({ icon: [''], title: [''], description: [''] }));
  }

  protected addAboutPillar(): void {
    this.aboutPillars.push(this.fb.group({ icon: [''], title: [''], text: [''] }));
  }

  protected addAboutSection(): void {
    this.aboutSections.push(this.fb.group({ id: [''], title: [''], paragraphs: [''] }));
  }

  protected addAcademicsCard(): void {
    this.academicsCards.push(
      this.fb.group({ icon: [''], label: [''], value: [''], note: [''], status: ['pending'] }),
    );
  }

  protected addAcademicsSection(): void {
    this.academicsSections.push(
      this.fb.group({
        id: [''],
        title: [''],
        paragraphs: [''],
        bullets: [''],
        imageUrl: [''],
        imageAlt: [''],
        status: ['pending'],
        note: [''],
      }),
    );
  }

  protected addAdmissionsSection(): void {
    this.admissionsSections.push(this.fb.group({ id: [''], title: [''], message: [''] }));
  }

  protected addFacility(): void {
    this.facilitiesAdditional.push(
      this.fb.group({
        id: [''],
        title: [''],
        description: [''],
        imageUrl: [''],
        imageAlt: [''],
        displayOrder: [0],
        isActive: [true],
      }),
    );
  }

  protected removeHomeHighlight(index: number): void {
    this.homeHighlights.removeAt(index);
  }

  protected removeAboutPillar(index: number): void {
    this.aboutPillars.removeAt(index);
  }

  protected removeAboutSection(index: number): void {
    this.aboutSections.removeAt(index);
  }

  protected getPillarIcon(index: number): IconName {
    const val = this.aboutPillars.at(index)?.get('icon')?.value?.trim();
    const valid: readonly string[] = [
      'phone', 'mail', 'map-pin', 'instagram', 'facebook', 'youtube', 'menu', 'close',
      'arrow-right', 'arrow-up-right', 'graduation-cap', 'users', 'trophy', 'heart',
      'eye', 'target', 'book-open', 'flask', 'monitor', 'calendar', 'megaphone',
      'image', 'chevron-right', 'clock', 'external-link', 'check',
    ];
    return valid.includes(val) ? (val as IconName) : 'target';
  }

  protected scrollToSection(id: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  protected removeAcademicsCard(index: number): void {
    this.academicsCards.removeAt(index);
  }

  protected removeAcademicsSection(index: number): void {
    this.academicsSections.removeAt(index);
  }

  protected removeAdmissionsSection(index: number): void {
    this.admissionsSections.removeAt(index);
  }

  protected removeFacility(index: number): void {
    this.facilitiesAdditional.removeAt(index);
  }

  protected async submit(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    this.error.set(null);
    this.success.set(null);

    const fields = this.imageFields?.toArray() ?? [];
    try {
      for (const field of fields) {
        await field.commit();
      }

      const slug = this.slug();
      const content = this.buildContent(slug);
      const payload: Record<string, unknown> = {
        page_slug: slug,
        content,
        is_published: this.form.controls.is_published.value === true,
        updated_at: new Date().toISOString(),
        updated_by: this.adminAuth.profile()?.id ?? null,
      };

      if (this.existingRecord()) {
        await this.content.update<PageContentRecord>(
          'page_contents',
          'page_slug',
          slug,
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

      for (const field of fields) {
        try {
          await field.finalize();
        } catch {
          // best-effort cleanup of replaced images
        }
      }

      this.success.set('Page content saved successfully.');
      await this.router.navigateByUrl('/admin/page-content');
    } catch (err) {
      for (const field of fields) {
        try {
          await field.rollback();
        } catch {
          // best-effort cleanup
        }
      }
      this.error.set(err instanceof Error ? err.message : 'Failed to save page content.');
    } finally {
      this.saving.set(false);
    }
  }

  private buildContent(slug: string): Record<string, unknown> {
    switch (slug) {
      case 'home':
        return this.buildHome();
      case 'about':
        return this.buildAbout();
      case 'academics':
        return this.buildAcademics();
      case 'admissions':
        return this.buildAdmissions();
      case 'contact':
        return this.buildContact();
      case 'facilities':
        return this.buildFacilities();
      case 'gallery':
        return this.buildGallery();
      case 'announcements':
        return this.buildAnnouncements();
      default:
        return {};
    }
  }

  private buildHome(): Record<string, unknown> {
    const v = this.form.controls.home.getRawValue() as FormValue;
    return {
      hero: { ...(v['hero'] as FormValue) },
      highlights: this.homeHighlights.getRawValue().map((item) => ({ ...item })),
      about: { ...(v['about'] as FormValue) },
      facilitiesIntro: v['facilitiesIntro'] ?? '',
      galleryIntro: v['galleryIntro'] ?? '',
      announcementsIntro: v['announcementsIntro'] ?? '',
    };
  }

  private buildAbout(): Record<string, unknown> {
    const v = this.form.controls.about.getRawValue() as FormValue;
    const story = v['story'] as FormValue;
    const photo = v['photo'] as FormValue;
    return {
      banner: { ...(v['banner'] as FormValue) },
      story: {
        eyebrow: story['eyebrow'] ?? '',
        title: story['title'] ?? '',
        paragraphs: this.lines(story['paragraphs']),
      },
      pillars: this.aboutPillars.getRawValue().map((item) => ({ ...item })),
      photo: { url: photo['url'] ?? '', alt: photo['alt'] ?? '' },
      sections: this.aboutSections.getRawValue().map((item) => {
        const section = item as FormValue;
        return {
          id: section['id'] ?? '',
          title: section['title'] ?? '',
          paragraphs: this.lines(section['paragraphs']),
        };
      }),
    };
  }

  private buildAcademics(): Record<string, unknown> {
    const v = this.form.controls.academics.getRawValue() as FormValue;
    const intro = v['intro'] as FormValue;
    return {
      banner: { ...(v['banner'] as FormValue) },
      intro: {
        eyebrow: intro['eyebrow'] ?? '',
        title: intro['title'] ?? '',
        paragraphs: this.lines(intro['paragraphs']),
        imageUrl: intro['imageUrl'] ?? '',
        imageAlt: intro['imageAlt'] ?? '',
      },
      cards: this.academicsCards.getRawValue().map((item) => ({ ...item })),
      sections: this.academicsSections.getRawValue().map((item) => {
        const section = item as FormValue;
        return {
          id: section['id'] ?? '',
          title: section['title'] ?? '',
          paragraphs: this.lines(section['paragraphs']),
          bullets: this.lines(section['bullets']),
          imageUrl: section['imageUrl'] ?? '',
          imageAlt: section['imageAlt'] ?? '',
          status: section['status'] ?? 'pending',
          note: section['note'] ?? '',
        };
      }),
    };
  }

  private buildAdmissions(): Record<string, unknown> {
    const v = this.form.controls.admissions.getRawValue() as FormValue;
    const intro = v['intro'] as FormValue;
    const contact = v['contact'] as FormValue;
    return {
      banner: { ...(v['banner'] as FormValue) },
      intro: {
        eyebrow: intro['eyebrow'] ?? '',
        title: intro['title'] ?? '',
        paragraphs: this.lines(intro['paragraphs']),
        note: intro['note'] ?? '',
      },
      sections: this.admissionsSections.getRawValue().map((item) => ({ ...item })),
      contact: {
        title: contact['title'] ?? '',
        intro: contact['intro'] ?? '',
        note: contact['note'] ?? '',
      },
    };
  }

  private buildContact(): Record<string, unknown> {
    const v = this.form.controls.contact.getRawValue() as FormValue;
    const intro = v['intro'] as FormValue;
    const form = v['form'] as FormValue;
    const officeHours = v['officeHours'] as FormValue;
    const cards = v['cards'] as FormValue;
    const map = v['map'] as FormValue;
    const directions = v['directions'] as FormValue;
    const instagram = v['instagram'] as FormValue;
    const schoolDetails = v['schoolDetails'] as FormValue;
    return {
      banner: { ...(v['banner'] as FormValue) },
      intro: {
        eyebrow: intro['eyebrow'] ?? '',
        title: intro['title'] ?? '',
        paragraphs: this.lines(intro['paragraphs']),
      },
      form: {
        eyebrow: form['eyebrow'] ?? '',
        title: form['title'] ?? '',
        intro: form['intro'] ?? '',
        nameLabel: form['nameLabel'] ?? '',
        emailLabel: form['emailLabel'] ?? '',
        phoneLabel: form['phoneLabel'] ?? '',
        subjectLabel: form['subjectLabel'] ?? '',
        messageLabel: form['messageLabel'] ?? '',
        submitLabel: form['submitLabel'] ?? '',
        successMessage: form['successMessage'] ?? '',
        errorMessage: form['errorMessage'] ?? '',
      },
      officeHours: {
        title: officeHours['title'] ?? '',
        lines: this.lines(officeHours['lines']),
      },
      cards: {
        phoneTitle: cards['phoneTitle'] ?? '',
        emailTitle: cards['emailTitle'] ?? '',
        addressTitle: cards['addressTitle'] ?? '',
        callLabel: cards['callLabel'] ?? '',
        emailActionLabel: cards['emailActionLabel'] ?? '',
        mapActionLabel: cards['mapActionLabel'] ?? '',
      },
      map: {
        title: map['title'] ?? '',
        intro: map['intro'] ?? '',
        emptyMessage: map['emptyMessage'] ?? '',
      },
      directions: {
        title: directions['title'] ?? '',
        intro: directions['intro'] ?? '',
        steps: this.lines(directions['steps']),
      },
      instagram: {
        eyebrow: instagram['eyebrow'] ?? '',
        title: instagram['title'] ?? '',
        text: instagram['text'] ?? '',
        buttonLabel: instagram['buttonLabel'] ?? '',
      },
      schoolDetails: {
        title: schoolDetails['title'] ?? '',
        lines: this.lines(schoolDetails['lines']),
      },
    };
  }

  private buildFacilities(): Record<string, unknown> {
    const v = this.form.controls.facilities.getRawValue() as FormValue;
    const intro = v['intro'] as FormValue;
    return {
      banner: { ...(v['banner'] as FormValue) },
      intro: {
        eyebrow: intro['eyebrow'] ?? '',
        title: intro['title'] ?? '',
        paragraphs: this.lines(intro['paragraphs']),
        note: intro['note'] ?? '',
      },
      gridEyebrow: v['gridEyebrow'] ?? '',
      gridHeading: v['gridHeading'] ?? '',
      detailsHeading: v['detailsHeading'] ?? '',
      additionalHeading: v['additionalHeading'] ?? '',
      additional: this.facilitiesAdditional.getRawValue().map((item) => {
        const facility = item as FormValue;
        return {
          id: facility['id'] ?? '',
          title: facility['title'] ?? '',
          description: facility['description'] ?? '',
          imageUrl: facility['imageUrl'] ?? '',
          imageAlt: facility['imageAlt'] ?? '',
          displayOrder: Number(facility['displayOrder'] ?? 0),
          isActive: facility['isActive'] === true,
        };
      }),
    };
  }

  private buildGallery(): Record<string, unknown> {
    const v = this.form.controls.gallery.getRawValue() as FormValue;
    const intro = v['intro'] as FormValue;
    return {
      banner: { ...(v['banner'] as FormValue) },
      intro: {
        eyebrow: intro['eyebrow'] ?? '',
        title: intro['title'] ?? '',
        paragraphs: this.lines(intro['paragraphs']),
        note: intro['note'] ?? '',
      },
      filterLabel: v['filterLabel'] ?? '',
      emptyTitle: v['emptyTitle'] ?? '',
      emptyMessage: v['emptyMessage'] ?? '',
      resetLabel: v['resetLabel'] ?? '',
      placeholderLabel: v['placeholderLabel'] ?? '',
    };
  }

  private buildAnnouncements(): Record<string, unknown> {
    const v = this.form.controls.announcements.getRawValue() as FormValue;
    const intro = v['intro'] as FormValue;
    const empty = v['empty'] as FormValue;
    const detail = v['detail'] as FormValue;
    return {
      banner: { ...(v['banner'] as FormValue) },
      intro: {
        eyebrow: intro['eyebrow'] ?? '',
        title: intro['title'] ?? '',
        paragraphs: this.lines(intro['paragraphs']),
      },
      listHeading: v['listHeading'] ?? '',
      filterLabel: v['filterLabel'] ?? '',
      empty: {
        title: empty['title'] ?? '',
        message: empty['message'] ?? '',
        contactNote: empty['contactNote'] ?? '',
      },
      detail: {
        backLabel: detail['backLabel'] ?? '',
        unavailableTitle: detail['unavailableTitle'] ?? '',
        unavailableMessage: detail['unavailableMessage'] ?? '',
        unavailableLinkLabel: detail['unavailableLinkLabel'] ?? '',
        fallbackBannerSubtitle: detail['fallbackBannerSubtitle'] ?? '',
      },
    };
  }

  private bannerValue(value: unknown): FormValue {
    const banner = (value ?? {}) as FormValue;
    return {
      title: banner['title'] ?? '',
      subtitle: banner['subtitle'] ?? '',
      imageUrl: banner['imageUrl'] ?? '',
      imageAlt: banner['imageAlt'] ?? '',
    };
  }

  private join(value: unknown): string {
    if (!Array.isArray(value)) return typeof value === 'string' ? value : '';
    return value.map((item) => String(item)).join('\n');
  }

  private lines(value: unknown): string[] {
    return String(value ?? '')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  protected cancel(): void {
    this.router.navigateByUrl('/admin/page-content');
  }
}
