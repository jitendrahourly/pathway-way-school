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
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ABOUT_CONTENT, resolveAboutContent } from '../../../core/data/about.seed';
import { FACILITIES_CONTENT } from '../../../core/data/facilities.seed';
import { AboutPreview, type AboutPreviewData } from './about-preview';
import {
  AcademicsPreview,
  type AcademicsAccent,
  type AcademicsPreviewData,
} from './academics-preview';
import {
  AdmissionsPreview,
  type AdmissionsPreviewData,
} from './admissions-preview';
import { ContactPreview, type ContactPreviewData } from './contact-preview';
import { FacilitiesPreview, type FacilitiesPreviewData } from './facilities-preview';
import {
  SchoolLifePreview,
  type SchoolLifePreviewData,
} from './school-life-preview';
import { GalleryPreview, type GalleryPreviewData } from './gallery-preview';
import {
  AnnouncementsPreview,
  type AnnouncementsPreviewData,
} from './announcements-preview';
import { mainPageSeed } from '../../../core/data/main-pages.seed';
import { mergeWithSeed } from '../../../core/data/seed-merge';
import { resolveContactContent } from '../../../core/data/contact.seed';
import { pageContentPreview } from '../../../core/data/page-content-previews';
import type { PageContentRecord } from '../../../core/models/supabase.model';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { ContentService } from '../../../core/services/content.service';
import { ImageUploadFieldComponent } from '../../../shared/components/image-upload-field/image-upload-field';
import { UiIcon, type IconName } from '../../../shared/components/ui-icon/ui-icon';
import { EditorItemComponent } from './editor-item/editor-item';
import { EditorSectionComponent } from './editor-section/editor-section';

type FormValue = Record<string, any>;

@Component({
  selector: 'app-main-page-content-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ImageUploadFieldComponent,
    UiIcon,
    AboutPreview,
    AcademicsPreview,
    AdmissionsPreview,
    ContactPreview,
    FacilitiesPreview,
    SchoolLifePreview,
    GalleryPreview,
    AnnouncementsPreview,
    EditorSectionComponent,
    EditorItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(window:scroll)': 'onEditorScroll()' },
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
  protected readonly hasSeedTemplate = computed(() => !!mainPageSeed(this.slug()));
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

  /** Icons offered for the facilities quick-navigation pills. */
  protected readonly facilityNavIcons = [
    'book-open',
    'monitor',
    'flask',
    'trophy',
    'graduation-cap',
    'users',
    'target',
    'heart',
    'eye',
    'calendar',
    'clock',
    'image',
  ] as const;

  /** Sections whose head copy is edited in the "Section headings" card. */
  protected readonly homeHeadingSections: readonly {
    key: string;
    label: string;
    hint?: string;
  }[] = [
    { key: 'stats', label: 'Stats strip', hint: 'Heading above the statistics cards.' },
    { key: 'programs', label: 'Academic programs', hint: 'Header above the program cards.' },
    { key: 'why', label: 'Why choose us' },
    { key: 'facilities', label: 'Facilities' },
    { key: 'gallery', label: 'Gallery highlights' },
    { key: 'video', label: 'Campus video tour' },
    { key: 'achievements', label: 'Achievements' },
    { key: 'affiliations', label: 'Affiliations' },
    { key: 'testimonials', label: 'Testimonials' },
    { key: 'events', label: 'Events' },
    { key: 'updates', label: 'Latest announcements' },
    { key: 'faqs', label: 'FAQs' },
    { key: 'location', label: 'Visit us / location' },
    { key: 'instagram', label: 'Instagram' },
  ] as const;

  /** Sections the administrator can hide from the public home page. */
  protected readonly homeVisibilityKeys = [
    { key: 'hero', label: 'Hero' },
    { key: 'highlights', label: 'Highlights' },
    { key: 'stats', label: 'Stats strip' },
    { key: 'about', label: 'About' },
    { key: 'programs', label: 'Academic programs' },
    { key: 'why', label: 'Why choose us' },
    { key: 'facilities', label: 'Facilities' },
    { key: 'gallery', label: 'Gallery highlights' },
    { key: 'video', label: 'Video tour' },
    { key: 'achievements', label: 'Achievements' },
    { key: 'affiliations', label: 'Affiliations' },
    { key: 'testimonials', label: 'Testimonials' },
    { key: 'events', label: 'Events' },
    { key: 'updates', label: 'Latest announcements' },
    { key: 'faqs', label: 'FAQs' },
    { key: 'admissionsCta', label: 'Admissions CTA' },
    { key: 'location', label: 'Visit us / location' },
    { key: 'newsletter', label: 'Newsletter' },
    { key: 'instagram', label: 'Instagram' },
  ] as const;

  protected readonly homeHighlights = this.fb.array<FormGroup>([]);
  protected readonly homeStats = this.fb.array<FormGroup>([]);
  protected readonly homePrograms = this.fb.array<FormGroup>([]);
  protected readonly homeWhyChooseUs = this.fb.array<FormGroup>([]);
  protected readonly homeTestimonials = this.fb.array<FormGroup>([]);
  protected readonly homeAchievements = this.fb.array<FormGroup>([]);
  protected readonly homeEvents = this.fb.array<FormGroup>([]);
  protected readonly homeGalleryPreview = this.fb.array<FormGroup>([]);
  protected readonly homeAffiliations = this.fb.array<FormGroup>([]);
  protected readonly homeFaqs = this.fb.array<FormGroup>([]);
  protected readonly aboutPillars = this.fb.array<FormGroup>([]);
  protected readonly aboutSections = this.fb.array<FormGroup>([]);
  protected readonly academicsQuickStats = this.fb.array<FormGroup>([]);
  protected readonly academicsStages = this.fb.array<FormGroup>([]);
  protected readonly academicsCards = this.fb.array<FormGroup>([]);
  protected readonly academicsSections = this.fb.array<FormGroup>([]);
  protected readonly admissionsSections = this.fb.array<FormGroup>([]);
  protected readonly facilitiesAdditional = this.fb.array<FormGroup>([]);
  protected readonly facilitiesStats = this.fb.array<FormGroup>([]);
  protected readonly facilitiesNavLinks = this.fb.array<FormGroup>([]);
  protected readonly schoolLifeStats = this.fb.array<FormGroup>([]);
  protected readonly schoolLifeCards = this.fb.array<FormGroup>([]);

  /** Home-page facility card count (0 = show all). Mirrors the seed default. */
  protected readonly facilitiesCountControl = this.fb.control(6, { nonNullable: true });

  @ViewChildren(ImageUploadFieldComponent)
  protected imageFields!: QueryList<ImageUploadFieldComponent>;

  protected readonly form = this.fb.group({
    is_published: [true],
    home: this.fb.group({
      headings: this.homeHeadingsGroup(),
      visibility: this.homeVisibilityGroup(),
      hero: this.fb.group({
        eyebrow: [''],
        titleLead: [''],
        titleAccent: [''],
        subtitle: [''],
        imageUrl: [''],
        imageAlt: [''],
        imagePosition: [''],
        primaryLabel: [''],
        primaryLink: [''],
        secondaryLabel: [''],
        secondaryLink: [''],
        trustPrimary: [''],
        trustSecondary: [''],
      }),
      highlights: this.homeHighlights,
      about: this.fb.group({
        eyebrow: [''],
        title: [''],
        body: [''],
        imageUrl: [''],
        imageAlt: [''],
        badge: [''],
        factOneTitle: [''],
        factOneText: [''],
        factTwoTitle: [''],
        factTwoText: [''],
        primaryLabel: [''],
        primaryLink: [''],
        secondaryLabel: [''],
        secondaryLink: [''],
      }),
      stats: this.homeStats,
      programs: this.homePrograms,
      whyChooseUs: this.homeWhyChooseUs,
      whyMedia: this.fb.group({
        title: [''],
        text: [''],
      }),
      testimonials: this.homeTestimonials,
      achievements: this.homeAchievements,
      achievementsPhoto: this.fb.group({
        imageUrl: [''],
        imageAlt: [''],
        badge: [''],
      }),
      events: this.homeEvents,
      galleryPreview: this.homeGalleryPreview,
      affiliations: this.homeAffiliations,
      faqs: this.homeFaqs,
      newsletter: this.fb.group({
        eyebrow: [''],
        title: [''],
        text: [''],
        placeholder: [''],
        buttonLabel: [''],
      }),
      videoTour: this.fb.group({
        eyebrow: [''],
        title: [''],
        note: [''],
        url: [''],
        thumbnailUrl: [''],
        thumbnailAlt: [''],
        watchLabel: [''],
        emptyLabel: [''],
      }),
      locationNote: [''],
      facilitiesCount: this.facilitiesCountControl,
      admissionsCta: this.fb.group({
        badge: [''],
        title: [''],
        text: [''],
        primaryLabel: [''],
        primaryLink: [''],
        secondaryLabel: [''],
        secondaryLink: [''],
        phoneLabel: [''],
        mediaTitle: [''],
        mediaText: [''],
      }),
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
        badge: [''], // intro badge
        quickStats: this.academicsQuickStats, // quick‑stats pills
      }),
      stagesHeading: this.fb.group({
        eyebrow: [''],
        title: [''],
        subtitle: [''],
      }),
      stages: this.academicsStages,
      cards: this.academicsCards,
      sections: this.academicsSections,
      cta: this.fb.group({
        badge: [''],
        title: [''],
        description: [''],
        primaryButtonText: [''],
        primaryButtonLink: [''],
        secondaryButtonText: [''],
        secondaryButtonLink: [''],
      }),

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
      stats: this.facilitiesStats,
      exploreLabel: [''],
      exploreLinks: this.facilitiesNavLinks,
      gridEyebrow: [''],
      gridHeading: [''],
      detailsHeading: [''],
      additionalHeading: [''],
      cta: this.fb.group({
        badge: [''],
        title: [''],
        text: [''],
        primaryLabel: [''],
        primaryHref: [''],
        secondaryLabel: [''],
        secondaryHref: [''],
      }),
      additional: this.facilitiesAdditional,
    }),
    schoolLife: this.fb.group({
      banner: this.bannerGroup(),
      stats: this.schoolLifeStats,
      intro: this.fb.group({ eyebrow: [''], title: [''], paragraphs: [''] }),
      cards: this.schoolLifeCards,
      cta: this.fb.group({
        eyebrow: [''],
        title: [''],
        text: [''],
        primaryLabel: [''],
        secondaryLabel: [''],
      }),
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

  private headingGroup(): FormGroup {
    return this.fb.group({
      eyebrow: [''],
      title: [''],
      text: [''],
      linkLabel: [''],
      linkUrl: [''],
    });
  }

  private homeHeadingsGroup(): FormGroup {
    return this.fb.group({
      stats: this.headingGroup(),
      programs: this.headingGroup(),
      why: this.headingGroup(),
      facilities: this.headingGroup(),
      gallery: this.headingGroup(),
      video: this.headingGroup(),
      achievements: this.headingGroup(),
      affiliations: this.headingGroup(),
      testimonials: this.headingGroup(),
      events: this.headingGroup(),
      updates: this.fb.group({
        ...this.headingGroupControls(),
        galleryEyebrow: [''],
        galleryTitle: [''],
        galleryNote: [''],
        galleryLinkLabel: [''],
        emptyTitle: [''],
        emptyText: [''],
        emptyLinkLabel: [''],
      }),
      faqs: this.fb.group({ ...this.headingGroupControls(), contactTitle: [''] }),
      location: this.fb.group({
        ...this.headingGroupControls(),
        directionsLabel: [''],
        cardCtaLabel: [''],
        cardCtaLink: [''],
        mapEmptyText: [''],
      }),
      instagram: this.fb.group({
        ...this.headingGroupControls(),
        followLabel: [''],
        emptyText: [''],
        emptyLinkLabel: [''],
      }),
    });
  }

  private headingGroupControls(): Record<string, FormControl<string>> {
    return {
      eyebrow: this.fb.control('', { nonNullable: true }),
      title: this.fb.control('', { nonNullable: true }),
      text: this.fb.control('', { nonNullable: true }),
      linkLabel: this.fb.control('', { nonNullable: true }),
      linkUrl: this.fb.control('', { nonNullable: true }),
    };
  }

  private homeVisibilityGroup(): FormGroup {
    const controls: Record<string, FormControl<boolean>> = {};
    for (const item of this.homeVisibilityKeys) {
      controls[item.key] = this.fb.control(true, { nonNullable: true });
    }
    return this.fb.group(controls);
  }

  /**
   * Live copy of the home form used by the visual editor previews. The public
   * home page is rebuilt from the same fields, so editors can see exactly what
   * their changes will look like while typing.
   */
  private readonly homeValue = toSignal(
    this.form.controls.home.valueChanges.pipe(
      map(() => this.form.controls.home.getRawValue() as FormValue),
    ),
    { initialValue: this.form.controls.home.getRawValue() as FormValue },
  );

  /** Ordered ids of the collapsible home editor sections. */
  protected readonly homeSectionIds = [
    'home-hero',
    'home-highlights',
    'home-about',
    'home-stats',
    'home-programs',
    'home-why',
    'home-testimonials',
    'home-achievements',
    'home-events',
    'home-gallery-preview',
    'home-affiliations',
    'home-faqs',
    'home-newsletter',
    'home-video-tour',
    'home-location',
    'home-admissions-cta',
    'home-headings',
    'home-visibility',
  ] as const;

  /** Section cards the administrator has expanded (collapsed by default). */
  protected readonly openHomeSections = signal<ReadonlySet<string>>(new Set<string>());

  /** Repeated content items the administrator has expanded, keyed `array:index`. */
  protected readonly openHomeItems = signal<ReadonlySet<string>>(new Set<string>());

  /** Home section currently nearest the top of the viewport, for the JUMP TO bar. */
  protected readonly activeHomeSection = signal<string>('home-hero');

  /** Live visibility flags for each home section, read from the visibility group. */
  private readonly homeVisibilityValue = computed(
    () => (this.homeValue()['visibility'] ?? {}) as Record<string, boolean>,
  );

  protected isHomeSectionOpen(id: string): boolean {
    return this.openHomeSections().has(id);
  }

  protected toggleHomeSection(id: string): void {
    this.openHomeSections.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  protected isHomeItemOpen(array: string, index: number | string): boolean {
    return this.openHomeItems().has(`${array}:${index}`);
  }

  protected toggleHomeItem(array: string, index: number | string): void {
    const key = `${array}:${index}`;
    this.openHomeItems.update((current) => {
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
  private openNewHomeItem(array: string, index: number): void {
    this.openHomeItems.update((current) => new Set(current).add(`${array}:${index}`));
  }

  protected isHomeSectionEnabled(key: string): boolean {
    return this.homeVisibilityValue()[key] !== false;
  }

  /**
   * Non-home (about/academics/admissions/contact/facilities/school-life/
   * gallery/announcements) editor accordion state. Mirrors the home editor so
   * every page-content editing screen collapses and expands the same way.
   */
  protected readonly openSections = signal<ReadonlySet<string>>(new Set<string>());

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

  /** Highlights the JUMP TO entry for whichever home section is in view. */
  protected onEditorScroll(): void {
    if (this.slug() !== 'home') return;
    let current: string = this.homeSectionIds[0];
    for (const id of this.homeSectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      // Skip collapsed sections (display:none reports a zero-height rect).
      if (rect.height === 0) continue;
      if (rect.top <= 140) {
        current = id;
      }
    }
    if (this.activeHomeSection() !== current) {
      this.activeHomeSection.set(current);
    }
  }

  protected readonly homePreview = computed(() => {
    const value = this.homeValue();
    const hero = (value['hero'] ?? {}) as FormValue;
    const about = (value['about'] ?? {}) as FormValue;
    return {
      hero: {
        eyebrow: this.text(hero['eyebrow']),
        titleLead: this.text(hero['titleLead']),
        titleAccent: this.text(hero['titleAccent']),
        subtitle: this.text(hero['subtitle']),
        imageUrl: this.text(hero['imageUrl']),
        imageAlt: this.text(hero['imageAlt']),
        imagePosition: this.text(hero['imagePosition']),
        primaryLabel: this.text(hero['primaryLabel']),
        secondaryLabel: this.text(hero['secondaryLabel']),
        trustPrimary: this.text(hero['trustPrimary']),
      },
      about: {
        eyebrow: this.text(about['eyebrow']),
        title: this.text(about['title']),
        body: this.text(about['body']),
        imageUrl: this.text(about['imageUrl']),
        imageAlt: this.text(about['imageAlt']),
        badge: this.text(about['badge']),
        primaryLabel: this.text(about['primaryLabel']),
      },
      stats: ((value['stats'] ?? []) as FormValue[]).map((item) => ({
        value: this.text(item['value']),
        label: this.text(item['label']),
        icon: this.iconName(item['icon'], 'calendar'),
      })),
      programs: ((value['programs'] ?? []) as FormValue[]).map((item) => ({
        title: this.text(item['title']),
        description: this.text(item['description']),
        icon: this.iconName(item['icon'], 'book-open'),
        link: this.text(item['link']),
        imageUrl: this.text(item['imageUrl']),
      })),
      whyChooseUs: ((value['whyChooseUs'] ?? []) as FormValue[]).map((item) => ({
        title: this.text(item['title']),
        description: this.text(item['description']),
        icon: this.iconName(item['icon'], 'check'),
      })),
      testimonials: ((value['testimonials'] ?? []) as FormValue[]).map((item) => ({
        name: this.text(item['name']),
        role: this.text(item['role']),
        quote: this.text(item['quote']),
        imageUrl: this.text(item['imageUrl']),
      })),
      achievements: ((value['achievements'] ?? []) as FormValue[]).map((item) => ({
        title: this.text(item['title']),
        description: this.text(item['description']),
        icon: this.iconName(item['icon'], 'trophy'),
      })),
      events: ((value['events'] ?? []) as FormValue[]).map((item) => ({
        title: this.text(item['title']),
        date: this.text(item['date']),
        description: this.text(item['description']),
        link: this.text(item['link']),
        imageUrl: this.text(item['imageUrl']),
      })),
      galleryPreview: ((value['galleryPreview'] ?? []) as FormValue[]).map((item) => this.text(item['url'] ?? item)),
      affiliations: ((value['affiliations'] ?? []) as FormValue[]).map((item) => ({
        label: this.text(item['label']),
        icon: this.iconName(item['icon'], 'check'),
      })),
      faqs: ((value['faqs'] ?? []) as FormValue[]).map((item) => ({
        question: this.text(item['question']),
        answer: this.text(item['answer']),
      })),
      newsletter: {
        title: this.text((value['newsletter'] as FormValue)?.['title']),
        text: this.text((value['newsletter'] as FormValue)?.['text']),
        placeholder: this.text((value['newsletter'] as FormValue)?.['placeholder']),
        buttonLabel: this.text((value['newsletter'] as FormValue)?.['buttonLabel']),
      },
      videoTour: {
        title: this.text((value['videoTour'] as FormValue)?.['title']),
        url: this.text((value['videoTour'] as FormValue)?.['url']),
        thumbnailUrl: this.text((value['videoTour'] as FormValue)?.['thumbnailUrl']),
      },
      locationNote: this.text(value['locationNote']),
      admissionsCta: {
        badge: this.text((value['admissionsCta'] as FormValue)?.['badge']),
        title: this.text((value['admissionsCta'] as FormValue)?.['title']),
        text: this.text((value['admissionsCta'] as FormValue)?.['text']),
        primaryLabel: this.text((value['admissionsCta'] as FormValue)?.['primaryLabel']),
        primaryLink: this.text((value['admissionsCta'] as FormValue)?.['primaryLink']),
        secondaryLabel: this.text((value['admissionsCta'] as FormValue)?.['secondaryLabel']),
        secondaryLink: this.text((value['admissionsCta'] as FormValue)?.['secondaryLink']),
      },
      facilitiesIntro: this.text(
        ((value['headings'] as FormValue)?.['facilities'] as FormValue)?.['text'],
      ),
      galleryIntro: this.text(((value['headings'] as FormValue)?.['gallery'] as FormValue)?.['text']),
      announcementsIntro: this.text(
        ((value['headings'] as FormValue)?.['updates'] as FormValue)?.['text'],
      ),
    };
  });

  /**
   * Live copy of the About form used by the visual editor previews. Mirrors
   * the public About page so editors can see changes while typing.
   */
  private readonly aboutValue = toSignal(
    this.form.controls.about.valueChanges.pipe(
      map(() => this.form.controls.about.getRawValue() as FormValue),
    ),
    { initialValue: this.form.controls.about.getRawValue() as FormValue },
  );

  protected readonly aboutPreview = computed<AboutPreviewData>(() => {
    const value = this.aboutValue();
    const banner = (value['banner'] ?? {}) as FormValue;
    const story = (value['story'] ?? {}) as FormValue;
    const photo = (value['photo'] ?? {}) as FormValue;
    return {
      banner: {
        title: this.text(banner['title']),
        subtitle: this.text(banner['subtitle']),
        imageUrl: this.text(banner['imageUrl']),
        imageAlt: this.text(banner['imageAlt']),
      },
      story: {
        eyebrow: this.text(story['eyebrow']),
        title: this.text(story['title']),
        paragraphs: this.lines(story['paragraphs']),
      },
      pillars: ((value['pillars'] ?? []) as FormValue[]).map((pillar) => ({
        icon: this.iconName(pillar['icon'], 'target'),
        title: this.text(pillar['title']),
        text: this.text(pillar['text']),
      })),
      photo: {
        url: this.text(photo['url']),
        alt: this.text(photo['alt']),
      },
      sections: ((value['sections'] ?? []) as FormValue[]).map((section) => ({
        id: this.text(section['id']),
        title: this.text(section['title']),
        paragraphs: this.lines(section['paragraphs']),
      })),
    };
  });

  /**
   * Live copy of the Academics form used by the visual editor previews.
   */
  private readonly academicsValue = toSignal(
    this.form.controls.academics.valueChanges.pipe(
      map(() => this.form.controls.academics.getRawValue() as FormValue),
    ),
    { initialValue: this.form.controls.academics.getRawValue() as FormValue },
  );

  protected readonly academicsPreview = computed<AcademicsPreviewData>(() => {
    const value = this.academicsValue();
    const banner = (value['banner'] ?? {}) as FormValue;
    const intro = (value['intro'] ?? {}) as FormValue;
    const stagesHeading = (value['stagesHeading'] ?? {}) as FormValue;
    const cta = (value['cta'] ?? {}) as FormValue;
    return {
      banner: {
        title: this.text(banner['title']),
        subtitle: this.text(banner['subtitle']),
        imageUrl: this.text(banner['imageUrl']),
        imageAlt: this.text(banner['imageAlt']),
      },
      intro: {
        eyebrow: this.text(intro['eyebrow']),
        title: this.text(intro['title']),
        paragraphs: this.lines(intro['paragraphs']),
        imageUrl: this.text(intro['imageUrl']),
        imageAlt: this.text(intro['imageAlt']),
        badge: this.text(intro['badge']),
        quickStats: ((intro['quickStats'] ?? []) as FormValue[]).map((stat) => ({
          num: this.text(stat['num']),
          label: this.text(stat['label']),
        })),
      },
      stagesHeading: {
        eyebrow: this.text(stagesHeading['eyebrow']),
        title: this.text(stagesHeading['title']),
        subtitle: this.text(stagesHeading['subtitle']),
      },
      stages: ((value['stages'] ?? []) as FormValue[]).map((stage) => ({
        title: this.text(stage['title']),
        tag: this.text(stage['tag']),
        grades: this.text(stage['grades']),
        ages: this.text(stage['ages']),
        icon: this.iconName(stage['icon'], 'book-open'),
        accent: this.accent(stage['accent']),
        description: this.text(stage['description']),
        highlights: this.lines(stage['highlights']),
      })),
      cards: ((value['cards'] ?? []) as FormValue[]).map((card) => ({
        icon: this.iconName(card['icon'], 'book-open'),
        label: this.text(card['label']),
        value: this.text(card['value']),
        note: this.text(card['note']),
        status: this.text(card['status']) || 'pending',
      })),
      sections: ((value['sections'] ?? []) as FormValue[]).map((section) => ({
        id: this.text(section['id']),
        title: this.text(section['title']),
        paragraphs: this.lines(section['paragraphs']),
        bullets: this.lines(section['bullets']),
        imageUrl: this.text(section['imageUrl']),
        imageAlt: this.text(section['imageAlt']),
        status: this.text(section['status']) || 'pending',
        note: this.text(section['note']),
      })),
      cta: {
        badge: this.text(cta['badge']),
        title: this.text(cta['title']),
        description: this.text(cta['description']),
        primaryButtonText: this.text(cta['primaryButtonText']),
        secondaryButtonText: this.text(cta['secondaryButtonText']),
      },
    };
  });

  /**
   * Live copy of the Admissions form used by the visual editor previews.
   */
  private readonly admissionsValue = toSignal(
    this.form.controls.admissions.valueChanges.pipe(
      map(() => this.form.controls.admissions.getRawValue() as FormValue),
    ),
    { initialValue: this.form.controls.admissions.getRawValue() as FormValue },
  );

  protected readonly admissionsPreview = computed<AdmissionsPreviewData>(() => {
    const value = this.admissionsValue();
    const banner = (value['banner'] ?? {}) as FormValue;
    const intro = (value['intro'] ?? {}) as FormValue;
    const contact = (value['contact'] ?? {}) as FormValue;
    return {
      banner: {
        title: this.text(banner['title']),
        subtitle: this.text(banner['subtitle']),
        imageUrl: this.text(banner['imageUrl']),
        imageAlt: this.text(banner['imageAlt']),
      },
      intro: {
        eyebrow: this.text(intro['eyebrow']),
        title: this.text(intro['title']),
        paragraphs: this.lines(intro['paragraphs']),
        note: this.text(intro['note']),
      },
      sections: ((value['sections'] ?? []) as FormValue[]).map((section) => ({
        id: this.text(section['id']),
        title: this.text(section['title']),
        message: this.text(section['message']),
      })),
      contact: {
        title: this.text(contact['title']),
        intro: this.text(contact['intro']),
        note: this.text(contact['note']),
      },
    };
  });

  /**
   * Live copy of the Contact form used by the visual editor previews.
   */
  private readonly contactValue = toSignal(
    this.form.controls.contact.valueChanges.pipe(
      map(() => this.form.controls.contact.getRawValue() as FormValue),
    ),
    { initialValue: this.form.controls.contact.getRawValue() as FormValue },
  );

  protected readonly contactPreview = computed<ContactPreviewData>(() => {
    const value = this.contactValue();
    const banner = (value['banner'] ?? {}) as FormValue;
    const intro = (value['intro'] ?? {}) as FormValue;
    const form = (value['form'] ?? {}) as FormValue;
    const cards = (value['cards'] ?? {}) as FormValue;
    const map = (value['map'] ?? {}) as FormValue;
    const directions = (value['directions'] ?? {}) as FormValue;
    const officeHours = (value['officeHours'] ?? {}) as FormValue;
    const instagram = (value['instagram'] ?? {}) as FormValue;
    const schoolDetails = (value['schoolDetails'] ?? {}) as FormValue;
    return {
      banner: {
        title: this.text(banner['title']),
        subtitle: this.text(banner['subtitle']),
        imageUrl: this.text(banner['imageUrl']),
        imageAlt: this.text(banner['imageAlt']),
      },
      intro: {
        eyebrow: this.text(intro['eyebrow']),
        title: this.text(intro['title']),
        paragraphs: this.lines(intro['paragraphs']),
      },
      form: {
        eyebrow: this.text(form['eyebrow']),
        title: this.text(form['title']),
        intro: this.text(form['intro']),
        nameLabel: this.text(form['nameLabel']),
        emailLabel: this.text(form['emailLabel']),
        phoneLabel: this.text(form['phoneLabel']),
        subjectLabel: this.text(form['subjectLabel']),
        messageLabel: this.text(form['messageLabel']),
        submitLabel: this.text(form['submitLabel']),
        successMessage: this.text(form['successMessage']),
        errorMessage: this.text(form['errorMessage']),
      },
      cards: {
        phoneTitle: this.text(cards['phoneTitle']),
        emailTitle: this.text(cards['emailTitle']),
        addressTitle: this.text(cards['addressTitle']),
        callLabel: this.text(cards['callLabel']),
        emailActionLabel: this.text(cards['emailActionLabel']),
        mapActionLabel: this.text(cards['mapActionLabel']),
      },
      map: {
        title: this.text(map['title']),
        intro: this.text(map['intro']),
        emptyMessage: this.text(map['emptyMessage']),
      },
      directions: {
        title: this.text(directions['title']),
        intro: this.text(directions['intro']),
        steps: this.lines(directions['steps']),
      },
      officeHours: {
        title: this.text(officeHours['title']),
        lines: this.lines(officeHours['lines']),
      },
      instagram: {
        eyebrow: this.text(instagram['eyebrow']),
        title: this.text(instagram['title']),
        text: this.text(instagram['text']),
        buttonLabel: this.text(instagram['buttonLabel']),
      },
      schoolDetails: {
        title: this.text(schoolDetails['title']),
        lines: this.lines(schoolDetails['lines']),
      },
    };
  });

  /**
   * Live copy of the Facilities form used by the visual editor previews.
   */
  private readonly facilitiesValue = toSignal(
    this.form.controls.facilities.valueChanges.pipe(
      map(() => this.form.controls.facilities.getRawValue() as FormValue),
    ),
    { initialValue: this.form.controls.facilities.getRawValue() as FormValue },
  );

  protected readonly facilitiesPreview = computed<FacilitiesPreviewData>(() => {
    const value = this.facilitiesValue();
    const banner = (value['banner'] ?? {}) as FormValue;
    const intro = (value['intro'] ?? {}) as FormValue;
    const cta = (value['cta'] ?? {}) as FormValue;
    return {
      banner: {
        title: this.text(banner['title']),
        subtitle: this.text(banner['subtitle']),
        imageUrl: this.text(banner['imageUrl']),
        imageAlt: this.text(banner['imageAlt']),
      },
      intro: {
        eyebrow: this.text(intro['eyebrow']),
        title: this.text(intro['title']),
        paragraphs: this.lines(intro['paragraphs']),
        note: this.text(intro['note']),
      },
      stats: ((value['stats'] ?? []) as FormValue[]).map((stat) => ({
        value: this.text(stat['value']),
        label: this.text(stat['label']),
      })),
      nav: {
        label: this.text(value['exploreLabel']),
        links: ((value['exploreLinks'] ?? []) as FormValue[]).map((link) => ({
          label: this.text(link['label']),
          href: this.text(link['href']),
          icon: this.facilityNavIcon(link['icon']),
        })),
      },
      headings: {
        gridEyebrow: this.text(value['gridEyebrow']),
        gridHeading: this.text(value['gridHeading']),
        detailsHeading: this.text(value['detailsHeading']),
        additionalHeading: this.text(value['additionalHeading']),
      },
      cta: {
        badge: this.text(cta['badge']),
        title: this.text(cta['title']),
        text: this.text(cta['text']),
        primaryLabel: this.text(cta['primaryLabel']),
        primaryHref: this.text(cta['primaryHref']),
        secondaryLabel: this.text(cta['secondaryLabel']),
        secondaryHref: this.text(cta['secondaryHref']),
      },
      additional: ((value['additional'] ?? []) as FormValue[]).map((facility) => ({
        id: this.text(facility['id']),
        title: this.text(facility['title']),
        description: this.text(facility['description']),
        imageUrl: this.text(facility['imageUrl']),
        imageAlt: this.text(facility['imageAlt']),
        isActive: facility['isActive'] !== false,
      })),
    };
  });

  /**
   * Live copy of the School Life form used by the visual editor previews.
   */
  private readonly schoolLifeValue = toSignal(
    this.form.controls.schoolLife.valueChanges.pipe(
      map(() => this.form.controls.schoolLife.getRawValue() as FormValue),
    ),
    { initialValue: this.form.controls.schoolLife.getRawValue() as FormValue },
  );

  protected readonly schoolLifePreview = computed<SchoolLifePreviewData>(() => {
    const value = this.schoolLifeValue();
    const banner = (value['banner'] ?? {}) as FormValue;
    const intro = (value['intro'] ?? {}) as FormValue;
    const cta = (value['cta'] ?? {}) as FormValue;
    return {
      banner: {
        title: this.text(banner['title']),
        subtitle: this.text(banner['subtitle']),
        imageUrl: this.text(banner['imageUrl']),
        imageAlt: this.text(banner['imageAlt']),
      },
      stats: ((value['stats'] ?? []) as FormValue[]).map((stat) => ({
        value: this.text(stat['value']),
        label: this.text(stat['label']),
      })),
      intro: {
        eyebrow: this.text(intro['eyebrow']),
        title: this.text(intro['title']),
        paragraphs: this.lines(intro['paragraphs']),
      },
      cards: ((value['cards'] ?? []) as FormValue[]).map((card) => ({
        id: this.text(card['id']),
        title: this.text(card['title']),
        tag: this.text(card['tag']),
        icon: this.iconName(card['icon'], 'users'),
        text: this.text(card['text']),
        highlights: this.lines(card['highlights']),
      })),
      cta: {
        eyebrow: this.text(cta['eyebrow']),
        title: this.text(cta['title']),
        text: this.text(cta['text']),
        primaryLabel: this.text(cta['primaryLabel']),
        secondaryLabel: this.text(cta['secondaryLabel']),
      },
    };
  });

  /**
   * Live copy of the Gallery form used by the visual editor previews.
   */
  private readonly galleryValue = toSignal(
    this.form.controls.gallery.valueChanges.pipe(
      map(() => this.form.controls.gallery.getRawValue() as FormValue),
    ),
    { initialValue: this.form.controls.gallery.getRawValue() as FormValue },
  );

  protected readonly galleryPreview = computed<GalleryPreviewData>(() => {
    const value = this.galleryValue();
    const banner = (value['banner'] ?? {}) as FormValue;
    const intro = (value['intro'] ?? {}) as FormValue;
    return {
      banner: {
        title: this.text(banner['title']),
        subtitle: this.text(banner['subtitle']),
        imageUrl: this.text(banner['imageUrl']),
        imageAlt: this.text(banner['imageAlt']),
      },
      intro: {
        eyebrow: this.text(intro['eyebrow']),
        title: this.text(intro['title']),
        paragraphs: this.lines(intro['paragraphs']),
        note: this.text(intro['note']),
      },
      controls: {
        filterLabel: this.text(value['filterLabel']),
        emptyTitle: this.text(value['emptyTitle']),
        emptyMessage: this.text(value['emptyMessage']),
        resetLabel: this.text(value['resetLabel']),
        placeholderLabel: this.text(value['placeholderLabel']),
      },
    };
  });

  /**
   * Live copy of the Announcements form used by the visual editor previews.
   */
  private readonly announcementsValue = toSignal(
    this.form.controls.announcements.valueChanges.pipe(
      map(() => this.form.controls.announcements.getRawValue() as FormValue),
    ),
    { initialValue: this.form.controls.announcements.getRawValue() as FormValue },
  );

  protected readonly announcementsPreview = computed<AnnouncementsPreviewData>(() => {
    const value = this.announcementsValue();
    const banner = (value['banner'] ?? {}) as FormValue;
    const intro = (value['intro'] ?? {}) as FormValue;
    const empty = (value['empty'] ?? {}) as FormValue;
    const detail = (value['detail'] ?? {}) as FormValue;
    return {
      banner: {
        title: this.text(banner['title']),
        subtitle: this.text(banner['subtitle']),
        imageUrl: this.text(banner['imageUrl']),
        imageAlt: this.text(banner['imageAlt']),
      },
      intro: {
        eyebrow: this.text(intro['eyebrow']),
        title: this.text(intro['title']),
        paragraphs: this.lines(intro['paragraphs']),
      },
      list: {
        listHeading: this.text(value['listHeading']),
        filterLabel: this.text(value['filterLabel']),
      },
      empty: {
        title: this.text(empty['title']),
        message: this.text(empty['message']),
        contactNote: this.text(empty['contactNote']),
      },
      detail: {
        backLabel: this.text(detail['backLabel']),
        unavailableTitle: this.text(detail['unavailableTitle']),
        unavailableMessage: this.text(detail['unavailableMessage']),
        unavailableLinkLabel: this.text(detail['unavailableLinkLabel']),
        fallbackBannerSubtitle: this.text(detail['fallbackBannerSubtitle']),
      },
    };
  });

  private text(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  /** Normalises the home facilities card count to a clean integer (0 = show all). */
  private coerceFacilitiesCount(value: unknown, fallback: number): number {
    const n = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
  }

  private accent(value: unknown): AcademicsAccent {
    return value === 'purple' || value === 'blue' || value === 'green'
      ? value
      : 'orange';
  }

  private iconName(value: unknown, fallback: IconName): IconName {
    const val = typeof value === 'string' ? value.trim() : '';
    const valid: readonly string[] = [
      'phone', 'mail', 'map-pin', 'instagram', 'facebook', 'youtube', 'menu', 'close',
      'arrow-right', 'arrow-up-right', 'graduation-cap', 'users', 'trophy', 'heart',
      'eye', 'target', 'book-open', 'flask', 'monitor', 'calendar', 'megaphone',
      'image', 'chevron-right', 'clock', 'external-link', 'check',
    ];
    return valid.includes(val) ? (val as IconName) : fallback;
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
      const merged = (
        slug === 'about'
          ? resolveAboutContent(data)
          : seedContent
            ? mergeWithSeed(seedContent, data)
            : data
      ) as FormValue;

      if (slug === 'facilities') {
        const hasPlaceholder = (p?: readonly string[]) =>
          p?.some(
            (t) =>
              t.includes('confirmed by the school office') ||
              t.includes('will be updated soon') ||
              t.includes('published once confirmed'),
          ) ?? false;
        const facMerged = merged as { intro?: { paragraphs?: string[]; note?: string } };
        if (hasPlaceholder(facMerged.intro?.paragraphs)) {
          facMerged.intro = {
            ...facMerged.intro,
            paragraphs: [...FACILITIES_CONTENT.intro.paragraphs],
            note: FACILITIES_CONTENT.intro.note,
          };
        }
      }

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
        case 'school-life':
          this.patchSchoolLife(merged);
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

  private headingValue(value: unknown): FormValue {
    const heading = (value ?? {}) as FormValue;
    return {
      eyebrow: heading['eyebrow'] ?? '',
      title: heading['title'] ?? '',
      text: heading['text'] ?? '',
      linkLabel: heading['linkLabel'] ?? '',
      linkUrl: heading['linkUrl'] ?? '',
    };
  }

  private updatesHeadingValue(value: unknown): FormValue {
    const heading = (value ?? {}) as FormValue;
    return {
      ...this.headingValue(heading),
      galleryEyebrow: heading['galleryEyebrow'] ?? '',
      galleryTitle: heading['galleryTitle'] ?? '',
      galleryNote: heading['galleryNote'] ?? '',
      galleryLinkLabel: heading['galleryLinkLabel'] ?? '',
      emptyTitle: heading['emptyTitle'] ?? '',
      emptyText: heading['emptyText'] ?? '',
      emptyLinkLabel: heading['emptyLinkLabel'] ?? '',
    };
  }

  private patchHome(data: FormValue): void {
    const hero = (data['hero'] ?? {}) as FormValue;
    const about = (data['about'] ?? {}) as FormValue;
    const cta = (data['admissionsCta'] ?? {}) as FormValue;
    const photo = (data['achievementsPhoto'] ?? {}) as FormValue;
    const headings = (data['headings'] ?? {}) as FormValue;
    // Records saved before the headings editor keep their intros as top-level
    // strings; seed those slots from them so no saved copy is lost.
    const legacyIntro = (key: string, legacy: unknown): unknown =>
      (headings[key] as FormValue | undefined)?.['text'] ?? legacy;

    this.form.controls.home.patchValue({
      headings: {
        stats: this.headingValue(headings['stats']),
        programs: this.headingValue(headings['programs']),
        why: this.headingValue(headings['why']),
        facilities: this.headingValue({
          ...(headings['facilities'] as FormValue),
          text: legacyIntro('facilities', data['facilitiesIntro']),
        }),
        gallery: this.headingValue({
          ...(headings['gallery'] as FormValue),
          text: legacyIntro('gallery', data['galleryIntro']),
        }),
        video: this.headingValue(headings['video']),
        achievements: this.headingValue(headings['achievements']),
        affiliations: this.headingValue(headings['affiliations']),
        testimonials: this.headingValue(headings['testimonials']),
        events: this.headingValue(headings['events']),
        updates: this.updatesHeadingValue({
          ...(headings['updates'] as FormValue),
          text: legacyIntro('updates', data['announcementsIntro']),
        }),
        faqs: {
          ...this.headingValue(headings['faqs']),
          contactTitle: (headings['faqs'] as FormValue)?.['contactTitle'] ?? '',
        },
        location: {
          ...this.headingValue(headings['location']),
          directionsLabel: (headings['location'] as FormValue)?.['directionsLabel'] ?? '',
          cardCtaLabel: (headings['location'] as FormValue)?.['cardCtaLabel'] ?? '',
          cardCtaLink: (headings['location'] as FormValue)?.['cardCtaLink'] ?? '',
          mapEmptyText: (headings['location'] as FormValue)?.['mapEmptyText'] ?? '',
        },
        instagram: {
          ...this.headingValue(headings['instagram']),
          followLabel: (headings['instagram'] as FormValue)?.['followLabel'] ?? '',
          emptyText: (headings['instagram'] as FormValue)?.['emptyText'] ?? '',
          emptyLinkLabel: (headings['instagram'] as FormValue)?.['emptyLinkLabel'] ?? '',
        },
      },
      visibility: { ...((data['visibility'] ?? {}) as FormValue) },
      hero: {
        eyebrow: hero['eyebrow'] ?? '',
        titleLead: hero['titleLead'] ?? '',
        titleAccent: hero['titleAccent'] ?? '',
        subtitle: hero['subtitle'] ?? '',
        imageUrl: hero['imageUrl'] ?? '',
        imageAlt: hero['imageAlt'] ?? '',
        imagePosition: hero['imagePosition'] ?? '',
        primaryLabel: hero['primaryLabel'] ?? '',
        primaryLink: hero['primaryLink'] ?? '',
        secondaryLabel: hero['secondaryLabel'] ?? '',
        secondaryLink: hero['secondaryLink'] ?? '',
        trustPrimary: hero['trustPrimary'] ?? '',
        trustSecondary: hero['trustSecondary'] ?? '',
      },
      about: {
        eyebrow: about['eyebrow'] ?? '',
        title: about['title'] ?? '',
        body: about['body'] ?? '',
        imageUrl: about['imageUrl'] ?? '',
        imageAlt: about['imageAlt'] ?? '',
        badge: about['badge'] ?? '',
        factOneTitle: about['factOneTitle'] ?? '',
        factOneText: about['factOneText'] ?? '',
        factTwoTitle: about['factTwoTitle'] ?? '',
        factTwoText: about['factTwoText'] ?? '',
        primaryLabel: about['primaryLabel'] ?? '',
        primaryLink: about['primaryLink'] ?? '',
        secondaryLabel: about['secondaryLabel'] ?? '',
        secondaryLink: about['secondaryLink'] ?? '',
      },
      whyMedia: {
        title: ((data['whyMedia'] ?? {}) as FormValue)['title'] ?? '',
        text: ((data['whyMedia'] ?? {}) as FormValue)['text'] ?? '',
      },
      achievementsPhoto: {
        imageUrl: photo['imageUrl'] ?? '',
        imageAlt: photo['imageAlt'] ?? '',
        badge: photo['badge'] ?? '',
      },
      admissionsCta: {
        badge: cta['badge'] ?? '',
        title: cta['title'] ?? '',
        text: cta['text'] ?? '',
        primaryLabel: cta['primaryLabel'] ?? '',
        primaryLink: cta['primaryLink'] ?? '',
        secondaryLabel: cta['secondaryLabel'] ?? '',
        secondaryLink: cta['secondaryLink'] ?? '',
        phoneLabel: cta['phoneLabel'] ?? '',
        mediaTitle: cta['mediaTitle'] ?? '',
        mediaText: cta['mediaText'] ?? '',
      },
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

    this.homeStats.clear();
    for (const item of (data['stats'] ?? []) as FormValue[]) {
      this.homeStats.push(
        this.fb.group({
          value: [item['value'] ?? ''],
          label: [item['label'] ?? ''],
          icon: [item['icon'] ?? 'calendar'],
        }),
      );
    }

    this.homePrograms.clear();
    for (const item of (data['programs'] ?? []) as FormValue[]) {
      this.homePrograms.push(
        this.fb.group({
          title: [item['title'] ?? ''],
          description: [item['description'] ?? ''],
          icon: [item['icon'] ?? 'book-open'],
          link: [item['link'] ?? ''],
          imageUrl: [item['imageUrl'] ?? ''],
          imageAlt: [item['imageAlt'] ?? ''],
        }),
      );
    }

    this.homeWhyChooseUs.clear();
    for (const item of (data['whyChooseUs'] ?? []) as FormValue[]) {
      this.homeWhyChooseUs.push(
        this.fb.group({
          title: [item['title'] ?? ''],
          description: [item['description'] ?? ''],
          icon: [item['icon'] ?? 'check'],
        }),
      );
    }

    this.homeTestimonials.clear();
    for (const item of (data['testimonials'] ?? []) as FormValue[]) {
      this.homeTestimonials.push(
        this.fb.group({
          name: [item['name'] ?? ''],
          role: [item['role'] ?? ''],
          quote: [item['quote'] ?? ''],
          imageUrl: [item['imageUrl'] ?? ''],
          imageAlt: [item['imageAlt'] ?? ''],
        }),
      );
    }

    this.homeAchievements.clear();
    for (const item of (data['achievements'] ?? []) as FormValue[]) {
      this.homeAchievements.push(
        this.fb.group({
          title: [item['title'] ?? ''],
          description: [item['description'] ?? ''],
          icon: [item['icon'] ?? 'trophy'],
        }),
      );
    }

    this.homeEvents.clear();
    for (const item of (data['events'] ?? []) as FormValue[]) {
      this.homeEvents.push(
        this.fb.group({
          title: [item['title'] ?? ''],
          date: [item['date'] ?? ''],
          description: [item['description'] ?? ''],
          link: [item['link'] ?? ''],
          imageUrl: [item['imageUrl'] ?? ''],
          imageAlt: [item['imageAlt'] ?? ''],
        }),
      );
    }

    this.homeGalleryPreview.clear();
    for (const item of (data['galleryPreview'] ?? []) as (string | FormValue)[]) {
      const legacy = typeof item === 'string';
      const entry = (legacy ? { url: item } : item) as FormValue;
      this.homeGalleryPreview.push(
        this.fb.group({
          url: [String(entry['url'] ?? '')],
          alt: [legacy ? '' : String(entry['alt'] ?? '')],
          caption: [legacy ? '' : String(entry['caption'] ?? '')],
        }),
      );
    }

    this.homeAffiliations.clear();
    for (const item of (data['affiliations'] ?? []) as FormValue[]) {
      this.homeAffiliations.push(
        this.fb.group({
          label: [item['label'] ?? ''],
          icon: [item['icon'] ?? 'check'],
        }),
      );
    }

    this.homeFaqs.clear();
    for (const item of (data['faqs'] ?? []) as FormValue[]) {
      this.homeFaqs.push(
        this.fb.group({
          question: [item['question'] ?? ''],
          answer: [item['answer'] ?? ''],
        }),
      );
    }

    const newsletter = (data['newsletter'] ?? {}) as FormValue;
    const videoTour = (data['videoTour'] ?? {}) as FormValue;
    this.form.controls.home.patchValue({
      newsletter: {
        eyebrow: newsletter['eyebrow'] ?? '',
        title: newsletter['title'] ?? '',
        text: newsletter['text'] ?? '',
        placeholder: newsletter['placeholder'] ?? '',
        buttonLabel: newsletter['buttonLabel'] ?? '',
      },
      videoTour: {
        eyebrow: videoTour['eyebrow'] ?? '',
        title: videoTour['title'] ?? '',
        note: videoTour['note'] ?? '',
        url: videoTour['url'] ?? '',
        thumbnailUrl: videoTour['thumbnailUrl'] ?? '',
        thumbnailAlt: videoTour['thumbnailAlt'] ?? '',
        watchLabel: videoTour['watchLabel'] ?? '',
        emptyLabel: videoTour['emptyLabel'] ?? '',
      },
      locationNote: data['locationNote'] ?? '',
      facilitiesCount: this.coerceFacilitiesCount(data['facilitiesCount'], 6),
    });
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
    const stagesHeading = (data['stagesHeading'] ?? {}) as FormValue;
    const cta = (data['cta'] ?? {}) as FormValue;
    this.form.controls.academics.patchValue({
      banner: this.bannerValue(data['banner']),
      intro: {
        eyebrow: intro['eyebrow'] ?? '',
        title: intro['title'] ?? '',
        paragraphs: this.join(intro['paragraphs']),
        imageUrl: intro['imageUrl'] ?? '',
        imageAlt: intro['imageAlt'] ?? '',
        badge: intro['badge'] ?? '',
      },
      stagesHeading: {
        eyebrow: stagesHeading['eyebrow'] ?? '',
        title: stagesHeading['title'] ?? '',
        subtitle: stagesHeading['subtitle'] ?? '',
      },
      cta: {
        badge: cta['badge'] ?? '',
        title: cta['title'] ?? '',
        description: cta['description'] ?? '',
        primaryButtonText: cta['primaryButtonText'] ?? '',
        primaryButtonLink: cta['primaryButtonLink'] ?? '',
        secondaryButtonText: cta['secondaryButtonText'] ?? '',
        secondaryButtonLink: cta['secondaryButtonLink'] ?? '',
      },
    });

    this.academicsQuickStats.clear();
    for (const stat of (intro['quickStats'] ?? []) as FormValue[]) {
      this.academicsQuickStats.push(
        this.fb.group({
          num: [stat['num'] ?? ''],
          label: [stat['label'] ?? ''],
        }),
      );
    }

    this.academicsStages.clear();
    for (const item of (data['stages'] ?? []) as FormValue[]) {
      this.academicsStages.push(
        this.fb.group({
          title: [item['title'] ?? ''],
          tag: [item['tag'] ?? ''],
          grades: [item['grades'] ?? ''],
          ages: [item['ages'] ?? ''],
          path: [item['path'] ?? ''],
          icon: [item['icon'] ?? 'book-open'],
          accent: [item['accent'] ?? 'orange'],
          description: [item['description'] ?? ''],
          highlights: [this.join(item['highlights'])],
        }),
      );
    }

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
    const cta = (data['cta'] ?? {}) as FormValue;
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
      exploreLabel: data['exploreLabel'] ?? '',
      cta: {
        badge: cta['badge'] ?? '',
        title: cta['title'] ?? '',
        text: cta['text'] ?? '',
        primaryLabel: cta['primaryLabel'] ?? '',
        primaryHref: cta['primaryHref'] ?? '',
        secondaryLabel: cta['secondaryLabel'] ?? '',
        secondaryHref: cta['secondaryHref'] ?? '',
      },
    });

    this.facilitiesAdditional.clear();
    for (const item of (data['additional'] ?? []) as FormValue[]) {
      this.facilitiesAdditional.push(
        this.fb.group({
          id: [item['id'] ?? ''],
          title: [item['title'] ?? ''],
          description: [item['description'] ?? ''],
          detailedDescription: [item['detailedDescription'] ?? ''],
          imageUrl: [item['imageUrl'] ?? ''],
          imageAlt: [item['imageAlt'] ?? ''],
          imageCaption: [item['caption'] ?? ''],
          highlight_1: [item['highlights']?.[0] ?? ''],
          highlight_2: [item['highlights']?.[1] ?? ''],
          highlight_3: [item['highlights']?.[2] ?? ''],
          buttonLabel: [item['buttonLabel'] ?? ''],
          buttonLink: [item['buttonLink'] ?? ''],
          displayOrder: [item['displayOrder'] ?? 0],
          isActive: [item['isActive'] ?? true],
        }),
      );
    }

    this.facilitiesStats.clear();
    for (const stat of (data['stats'] ?? []) as FormValue[]) {
      this.facilitiesStats.push(
        this.fb.group({ value: [stat['value'] ?? ''], label: [stat['label'] ?? ''] }),
      );
    }

    this.facilitiesNavLinks.clear();
    for (const link of (data['exploreLinks'] ?? []) as FormValue[]) {
      this.facilitiesNavLinks.push(
        this.fb.group({
          label: [link['label'] ?? ''],
          href: [link['href'] ?? ''],
          icon: [this.facilityNavIcon(link['icon'])],
        }),
      );
    }
  }

  private patchSchoolLife(data: FormValue): void {
    const intro = (data['intro'] ?? {}) as FormValue;
    const cta = (data['cta'] ?? {}) as FormValue;
    this.form.controls.schoolLife.patchValue({
      banner: this.bannerValue(data['banner']),
      intro: {
        eyebrow: intro['eyebrow'] ?? '',
        title: intro['title'] ?? '',
        paragraphs: this.join(intro['paragraphs']),
      },
      cta: {
        eyebrow: cta['eyebrow'] ?? '',
        title: cta['title'] ?? '',
        text: cta['text'] ?? '',
        primaryLabel: cta['primaryLabel'] ?? '',
        secondaryLabel: cta['secondaryLabel'] ?? '',
      },
    });

    this.schoolLifeStats.clear();
    for (const item of (data['stats'] ?? []) as FormValue[]) {
      this.schoolLifeStats.push(
        this.fb.group({ value: [item['value'] ?? ''], label: [item['label'] ?? ''] }),
      );
    }

    this.schoolLifeCards.clear();
    for (const item of (data['cards'] ?? []) as FormValue[]) {
      this.schoolLifeCards.push(
        this.fb.group({
          id: [item['id'] ?? ''],
          title: [item['title'] ?? ''],
          tag: [item['tag'] ?? ''],
          icon: [item['icon'] ?? 'book-open'],
          text: [item['text'] ?? ''],
          highlights: [this.join(item['highlights'])],
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
    this.openNewHomeItem('highlights', this.homeHighlights.length - 1);
  }

  protected addAboutPillar(): void {
    this.aboutPillars.push(this.fb.group({ icon: [''], title: [''], text: [''] }));
    this.openNewItem('pillars', this.aboutPillars.length - 1);
  }

  protected addAboutSection(): void {
    this.aboutSections.push(this.fb.group({ id: [''], title: [''], paragraphs: [''] }));
    this.openNewItem('sections', this.aboutSections.length - 1);
  }

  protected addAcademicsQuickStat(): void {
    this.academicsQuickStats.push(this.fb.group({ num: [''], label: [''] }));
    this.openNewItem('quickStats', this.academicsQuickStats.length - 1);
  }

  protected removeAcademicsQuickStat(index: number): void {
    this.academicsQuickStats.removeAt(index);
  }

  protected addAcademicsStage(): void {
    this.academicsStages.push(
      this.fb.group({
        title: [''],
        tag: [''],
        grades: [''],
        ages: [''],
        path: [''],
        icon: ['book-open'],
        accent: ['orange'],
        description: [''],
        highlights: [''],
      }),
    );
    this.openNewItem('stages', this.academicsStages.length - 1);
  }

  protected removeAcademicsStage(index: number): void {
    this.academicsStages.removeAt(index);
  }

  protected getAcademicsStageIcon(index: number): IconName {
    return this.iconName(this.academicsStages.at(index)?.get('icon')?.value, 'book-open');
  }

  protected addAcademicsCard(): void {
    this.academicsCards.push(
      this.fb.group({ icon: [''], label: [''], value: [''], note: [''], status: ['pending'] }),
    );
    this.openNewItem('cards', this.academicsCards.length - 1);
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
    this.openNewItem('sections', this.academicsSections.length - 1);
  }

  protected addAdmissionsSection(): void {
    this.admissionsSections.push(this.fb.group({ id: [''], title: [''], message: [''] }));
    this.openNewItem('sections', this.admissionsSections.length - 1);
  }

  protected addFacility(): void {
    this.facilitiesAdditional.push(
      this.fb.group({
        id: [''],
        title: [''],
        description: [''],
        detailedDescription: [''],
        imageUrl: [''],
        imageAlt: [''],
        imageCaption: [''],
        highlight_1: [''],
        highlight_2: [''],
        highlight_3: [''],
        buttonLabel: [''],
        buttonLink: [''],
        displayOrder: [0],
        isActive: [true],
      }),
    );
    this.openNewItem('additional', this.facilitiesAdditional.length - 1);
  }

  protected addFacilityStat(): void {
    this.facilitiesStats.push(this.fb.group({ value: [''], label: [''] }));
    this.openNewItem('facility-stats', this.facilitiesStats.length - 1);
  }

  protected removeFacilityStat(index: number): void {
    this.facilitiesStats.removeAt(index);
  }

  protected addFacilityNavLink(): void {
    this.facilitiesNavLinks.push(
      this.fb.group({ label: [''], href: [''], icon: ['book-open'] }),
    );
    this.openNewItem('facility-nav', this.facilitiesNavLinks.length - 1);
  }

  protected removeFacilityNavLink(index: number): void {
    this.facilitiesNavLinks.removeAt(index);
  }

  protected addSchoolLifeStat(): void {
    this.schoolLifeStats.push(this.fb.group({ value: [''], label: [''] }));
    this.openNewItem('stats', this.schoolLifeStats.length - 1);
  }

  protected removeSchoolLifeStat(index: number): void {
    this.schoolLifeStats.removeAt(index);
  }

  protected addSchoolLifeCard(): void {
    this.schoolLifeCards.push(
      this.fb.group({
        id: [''],
        title: [''],
        tag: [''],
        icon: ['book-open'],
        text: [''],
        highlights: [''],
      }),
    );
    this.openNewItem('cards', this.schoolLifeCards.length - 1);
  }

  protected removeSchoolLifeCard(index: number): void {
    this.schoolLifeCards.removeAt(index);
  }

  private schoolLifeCardIcon(value: string | null | undefined): string {
    const valid: readonly string[] = this.suggestedIcons;
    return value && valid.includes(value) ? value : 'book-open';
  }

  /** Keeps the facilities nav icon within the supported UiIcon set. */
  private facilityNavIcon(value: unknown): IconName {
    const valid: readonly string[] = this.facilityNavIcons;
    const icon = typeof value === 'string' ? value : '';
    return (valid.includes(icon) ? icon : 'book-open') as IconName;
  }

  protected removeHomeHighlight(index: number): void {
    this.homeHighlights.removeAt(index);
  }

  protected getHomeHighlightIcon(index: number): IconName {
    const val = this.homeHighlights.at(index)?.get('icon')?.value?.trim();
    const valid: readonly string[] = [
      'phone', 'mail', 'map-pin', 'instagram', 'facebook', 'youtube', 'menu', 'close',
      'arrow-right', 'arrow-up-right', 'graduation-cap', 'users', 'trophy', 'heart',
      'eye', 'target', 'book-open', 'flask', 'monitor', 'calendar', 'megaphone',
      'image', 'chevron-right', 'clock', 'external-link', 'check',
    ];
    return valid.includes(val) ? (val as IconName) : 'graduation-cap';
  }

  protected removeAboutPillar(index: number): void {
    this.aboutPillars.removeAt(index);
  }

  protected removeAboutSection(index: number): void {
    this.aboutSections.removeAt(index);
  }

  protected getPillarIcon(index: number): IconName {
    return this.iconName(this.aboutPillars.at(index)?.get('icon')?.value, 'target');
  }

  protected getHomeStatIcon(index: number): IconName {
    return this.iconName(this.homeStats.at(index)?.get('icon')?.value, 'calendar');
  }

  protected getHomeProgramIcon(index: number): IconName {
    return this.iconName(this.homePrograms.at(index)?.get('icon')?.value, 'book-open');
  }

  protected getHomeWhyIcon(index: number): IconName {
    return this.iconName(this.homeWhyChooseUs.at(index)?.get('icon')?.value, 'check');
  }

  protected getHomeAchievementIcon(index: number): IconName {
    return this.iconName(this.homeAchievements.at(index)?.get('icon')?.value, 'trophy');
  }

  protected getHomeAffiliationIcon(index: number): IconName {
    return this.iconName(this.homeAffiliations.at(index)?.get('icon')?.value, 'check');
  }

  protected addHomeStat(): void {
    this.homeStats.push(this.fb.group({ value: [''], label: [''], icon: ['calendar'] }));
    this.openNewHomeItem('stats', this.homeStats.length - 1);
  }

  protected removeHomeStat(index: number): void {
    this.homeStats.removeAt(index);
  }

  protected addHomeProgram(): void {
    this.homePrograms.push(
      this.fb.group({
        title: [''],
        description: [''],
        icon: ['book-open'],
        link: [''],
        imageUrl: [''],
        imageAlt: [''],
      }),
    );
    this.openNewHomeItem('programs', this.homePrograms.length - 1);
  }

  protected removeHomeProgram(index: number): void {
    this.homePrograms.removeAt(index);
  }

  protected addHomeWhy(): void {
    this.homeWhyChooseUs.push(this.fb.group({ title: [''], description: [''], icon: ['check'] }));
    this.openNewHomeItem('whyChooseUs', this.homeWhyChooseUs.length - 1);
  }

  protected removeHomeWhy(index: number): void {
    this.homeWhyChooseUs.removeAt(index);
  }

  protected getHomeTestimonialIcon(index: number): IconName {
    return 'users';
  }

  protected addHomeTestimonial(): void {
    this.homeTestimonials.push(
      this.fb.group({ name: [''], role: [''], quote: [''], imageUrl: [''], imageAlt: [''] }),
    );
    this.openNewHomeItem('testimonials', this.homeTestimonials.length - 1);
  }

  protected removeHomeTestimonial(index: number): void {
    this.homeTestimonials.removeAt(index);
  }

  protected addHomeAchievement(): void {
    this.homeAchievements.push(this.fb.group({ title: [''], description: [''], icon: ['trophy'] }));
    this.openNewHomeItem('achievements', this.homeAchievements.length - 1);
  }

  protected removeHomeAchievement(index: number): void {
    this.homeAchievements.removeAt(index);
  }

  protected addHomeEvent(): void {
    this.homeEvents.push(
      this.fb.group({
        title: [''],
        date: [''],
        description: [''],
        link: [''],
        imageUrl: [''],
        imageAlt: [''],
      }),
    );
    this.openNewHomeItem('events', this.homeEvents.length - 1);
  }

  protected removeHomeEvent(index: number): void {
    this.homeEvents.removeAt(index);
  }

  protected addHomeGalleryImage(): void {
    this.homeGalleryPreview.push(this.fb.group({ url: [''], alt: [''], caption: [''] }));
    this.openNewHomeItem('galleryPreview', this.homeGalleryPreview.length - 1);
  }

  protected removeHomeGalleryImage(index: number): void {
    this.homeGalleryPreview.removeAt(index);
  }

  protected addHomeAffiliation(): void {
    this.homeAffiliations.push(this.fb.group({ label: [''], icon: ['check'] }));
    this.openNewHomeItem('affiliations', this.homeAffiliations.length - 1);
  }

  protected removeHomeAffiliation(index: number): void {
    this.homeAffiliations.removeAt(index);
  }

  protected addHomeFaq(): void {
    this.homeFaqs.push(this.fb.group({ question: [''], answer: [''] }));
    this.openNewHomeItem('faqs', this.homeFaqs.length - 1);
  }

  protected removeHomeFaq(index: number): void {
    this.homeFaqs.removeAt(index);
  }

  /**
   * Swaps an item with its neighbour so the public page shows the new order.
   * Values are swapped instead of the controls so open inputs keep their state.
   */
  protected moveHomeItem(
    list:
      | 'highlights'
      | 'stats'
      | 'programs'
      | 'whyChooseUs'
      | 'testimonials'
      | 'achievements'
      | 'events'
      | 'galleryPreview'
      | 'affiliations'
      | 'faqs',
    index: number,
    delta: number,
  ): void {
    const arrays: Record<string, FormArray> = {
      highlights: this.homeHighlights,
      stats: this.homeStats,
      programs: this.homePrograms,
      whyChooseUs: this.homeWhyChooseUs,
      testimonials: this.homeTestimonials,
      achievements: this.homeAchievements,
      events: this.homeEvents,
      galleryPreview: this.homeGalleryPreview,
      affiliations: this.homeAffiliations,
      faqs: this.homeFaqs,
    };
    const array = arrays[list];
    const target = index + delta;
    if (!array || target < 0 || target >= array.length) return;
    const current = array.at(index);
    const neighbour = array.at(target);
    const currentValue = current.getRawValue();
    const neighbourValue = neighbour.getRawValue();
    current.patchValue(neighbourValue);
    neighbour.patchValue(currentValue);
    array.markAsDirty();
  }

  protected scrollToSection(id: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    // Jumping into a home section should also expand its collapsed panel.
    if (id.startsWith('home-')) {
      this.openHomeSections.update((current) => {
        if (current.has(id)) return current;
        const next = new Set(current);
        next.add(id);
        return next;
      });
    } else {
      // Non-home page sections (including the shared publish panel) expand the
      // same way so the jump target is visible.
      this.openSections.update((current) => {
        if (current.has(id)) return current;
        const next = new Set(current);
        next.add(id);
        return next;
      });
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
      case 'school-life':
        return this.buildSchoolLife();
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
    const headings = (v['headings'] ?? {}) as FormValue;
    const heading = (key: string): FormValue => ({ ...((headings[key] ?? {}) as FormValue) });
    const headingText = (key: string): string =>
      String(((headings[key] ?? {}) as FormValue)['text'] ?? '');

    return {
      headings: {
        stats: heading('stats'),
        programs: heading('programs'),
        why: heading('why'),
        facilities: heading('facilities'),
        gallery: heading('gallery'),
        video: heading('video'),
        achievements: heading('achievements'),
        affiliations: heading('affiliations'),
        testimonials: heading('testimonials'),
        events: heading('events'),
        updates: heading('updates'),
        faqs: heading('faqs'),
        location: heading('location'),
        instagram: heading('instagram'),
      },
      visibility: { ...(v['visibility'] as FormValue) },
      hero: { ...(v['hero'] as FormValue) },
      highlights: this.homeHighlights.getRawValue().map((item) => ({ ...item })),
      about: { ...(v['about'] as FormValue) },
      stats: this.homeStats.getRawValue().map((item) => ({ ...item })),
      programs: this.homePrograms.getRawValue().map((item) => ({ ...item })),
      whyChooseUs: this.homeWhyChooseUs.getRawValue().map((item) => ({ ...item })),
      testimonials: this.homeTestimonials.getRawValue().map((item) => ({ ...item })),
      achievements: this.homeAchievements.getRawValue().map((item) => ({ ...item })),
      whyMedia: { ...(v['whyMedia'] as FormValue) },
      achievementsPhoto: { ...(v['achievementsPhoto'] as FormValue) },
      events: this.homeEvents.getRawValue().map((item) => ({ ...item })),
      galleryPreview: this.homeGalleryPreview.getRawValue().map((item) => ({
        url: item['url'] ?? '',
        alt: item['alt'] ?? '',
        caption: item['caption'] ?? '',
      })),
      affiliations: this.homeAffiliations.getRawValue().map((item) => ({ ...item })),
      faqs: this.homeFaqs.getRawValue().map((item) => ({ ...item })),
      newsletter: { ...(v['newsletter'] as FormValue) },
      videoTour: { ...(v['videoTour'] as FormValue) },
      locationNote: v['locationNote'] ?? '',
      facilitiesCount: this.coerceFacilitiesCount(v['facilitiesCount'], 0),
      admissionsCta: { ...(v['admissionsCta'] as FormValue) },
      // Kept in sync for any older reader of the original intro keys.
      facilitiesIntro: headingText('facilities'),
      galleryIntro: headingText('gallery'),
      announcementsIntro: headingText('updates'),
    };
  }

  private buildAbout(): Record<string, unknown> {
    const v = this.form.controls.about.getRawValue() as FormValue;
    const story = v['story'] as FormValue;
    const photo = v['photo'] as FormValue;
    return {
      contentVersion: ABOUT_CONTENT.contentVersion,
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
    const stagesHeading = v['stagesHeading'] as FormValue;
    const cta = (v['cta'] ?? {}) as FormValue;
    return {
      banner: { ...(v['banner'] as FormValue) },
      intro: {
        eyebrow: intro['eyebrow'] ?? '',
        title: intro['title'] ?? '',
        paragraphs: this.lines(intro['paragraphs']),
        imageUrl: intro['imageUrl'] ?? '',
        imageAlt: intro['imageAlt'] ?? '',
        badge: intro['badge'] ?? '',
        quickStats: this.academicsQuickStats.getRawValue().map((item) => ({ ...item })),
      },
      stagesHeading: {
        eyebrow: stagesHeading['eyebrow'] ?? '',
        title: stagesHeading['title'] ?? '',
        subtitle: stagesHeading['subtitle'] ?? '',
      },
      stages: this.academicsStages.getRawValue().map((item) => {
        const stage = item as FormValue;
        return {
          title: stage['title'] ?? '',
          tag: stage['tag'] ?? '',
          grades: stage['grades'] ?? '',
          ages: stage['ages'] ?? '',
          path: stage['path'] ?? '',
          icon: stage['icon'] ?? 'book-open',
          accent: stage['accent'] ?? 'orange',
          description: stage['description'] ?? '',
          highlights: this.lines(stage['highlights']),
        };
      }),
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
      cta: {
        badge: cta['badge'] ?? '',
        title: cta['title'] ?? '',
        description: cta['description'] ?? '',
        primaryButtonText: cta['primaryButtonText'] ?? '',
        primaryButtonLink: cta['primaryButtonLink'] ?? '',
        secondaryButtonText: cta['secondaryButtonText'] ?? '',
        secondaryButtonLink: cta['secondaryButtonLink'] ?? '',
      },
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
    const cta = (v['cta'] ?? {}) as FormValue;
    return {
      banner: { ...(v['banner'] as FormValue) },
      intro: {
        eyebrow: intro['eyebrow'] ?? '',
        title: intro['title'] ?? '',
        paragraphs: this.lines(intro['paragraphs']),
        note: intro['note'] ?? '',
      },
      stats: this.facilitiesStats.getRawValue().map((item) => {
        const stat = item as FormValue;
        return { value: stat['value'] ?? '', label: stat['label'] ?? '' };
      }),
      exploreLabel: v['exploreLabel'] ?? '',
      exploreLinks: this.facilitiesNavLinks.getRawValue().map((item) => {
        const link = item as FormValue;
        return {
          label: link['label'] ?? '',
          href: link['href'] ?? '',
          icon: this.facilityNavIcon(link['icon']),
        };
      }),
      gridEyebrow: v['gridEyebrow'] ?? '',
      gridHeading: v['gridHeading'] ?? '',
      detailsHeading: v['detailsHeading'] ?? '',
      additionalHeading: v['additionalHeading'] ?? '',
      cta: {
        badge: cta['badge'] ?? '',
        title: cta['title'] ?? '',
        text: cta['text'] ?? '',
        primaryLabel: cta['primaryLabel'] ?? '',
        primaryHref: cta['primaryHref'] ?? '',
        secondaryLabel: cta['secondaryLabel'] ?? '',
        secondaryHref: cta['secondaryHref'] ?? '',
      },
      additional: this.facilitiesAdditional.getRawValue().map((item) => {
        const facility = item as FormValue;
        return {
          id: facility['id'] ?? '',
          title: facility['title'] ?? '',
          description: facility['description'] ?? '',
           detailedDescription: (facility['detailedDescription'] ?? '').toString().trim() || null,
           caption: (facility['imageCaption'] ?? '').toString().trim() || null,
           highlights: [facility['highlight_1'], facility['highlight_2'], facility['highlight_3']]
             .map((h) => (h ?? '').toString().trim())
             .filter((h) => h.length > 0),
           buttonLabel: (facility['buttonLabel'] ?? '').toString().trim() || null,
           buttonLink: (facility['buttonLink'] ?? '').toString().trim() || null,
          imageUrl: facility['imageUrl'] ?? '',
          imageAlt: facility['imageAlt'] ?? '',
          displayOrder: Number(facility['displayOrder'] ?? 0),
          isActive: facility['isActive'] === true,
        };
      }),
    };
  }

  private buildSchoolLife(): Record<string, unknown> {
    const v = this.form.controls.schoolLife.getRawValue() as FormValue;
    const intro = v['intro'] as FormValue;
    const cta = v['cta'] as FormValue;
    return {
      banner: { ...(v['banner'] as FormValue) },
      stats: this.schoolLifeStats.getRawValue().map((item) => {
        const stat = item as FormValue;
        return { value: stat['value'] ?? '', label: stat['label'] ?? '' };
      }),
      intro: {
        eyebrow: intro['eyebrow'] ?? '',
        title: intro['title'] ?? '',
        paragraphs: this.lines(intro['paragraphs']),
      },
      cards: this.schoolLifeCards.getRawValue().map((item) => {
        const card = item as FormValue;
        return {
          id: (card['id'] ?? '').trim(),
          title: card['title'] ?? '',
          tag: card['tag'] ?? '',
          icon: this.schoolLifeCardIcon(card['icon']),
          text: card['text'] ?? '',
          highlights: this.lines(card['highlights']),
        };
      }),
      cta: {
        eyebrow: cta['eyebrow'] ?? '',
        title: cta['title'] ?? '',
        text: cta['text'] ?? '',
        primaryLabel: cta['primaryLabel'] ?? '',
        secondaryLabel: cta['secondaryLabel'] ?? '',
      },
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

  protected restoreDefaultContent(): void {
    const slug = this.slug();
    const seed = mainPageSeed(slug);
    if (!seed) return;

    this.error.set(null);
    this.success.set(null);
    this.form.controls.is_published.setValue(true);

    const seedContent = (seed.content ?? {}) as FormValue;
    let merged: FormValue = seedContent;

    if (slug === 'about') {
      merged = resolveAboutContent(seedContent) as FormValue;
    } else if (seedContent) {
      merged = mergeWithSeed(seedContent, seedContent) as FormValue;
    }

    if (slug === 'facilities') {
      const hasPlaceholder = (p?: readonly string[]) =>
        p?.some(
          (t) =>
            t.includes('confirmed by the school office') ||
            t.includes('will be updated soon') ||
            t.includes('published once confirmed'),
        ) ?? false;
      const facMerged = merged as { intro?: { paragraphs?: string[]; note?: string } };
      if (hasPlaceholder(facMerged.intro?.paragraphs)) {
        facMerged.intro = {
          ...facMerged.intro,
          paragraphs: [...FACILITIES_CONTENT.intro.paragraphs],
          note: FACILITIES_CONTENT.intro.note,
        };
      }
    }

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
      case 'school-life':
        this.patchSchoolLife(merged);
        break;
      case 'gallery':
        this.patchGallery(merged);
        break;
      case 'announcements':
        this.patchAnnouncements(merged);
        break;
    }

    this.success.set(`Default content loaded for "${seed.title}". Click "Save changes" to apply.`);
  }

  protected cancel(): void {
    this.router.navigateByUrl('/admin/page-content');
  }
}
