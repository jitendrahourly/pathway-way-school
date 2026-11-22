import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ACADEMIC_CTA_COPY,
  ACADEMIC_PAGE_COPY,
  ACADEMIC_STAGE_COPY,
  CONTENT_PAGE_COPY,
  CONTENT_PAGES,
  FACILITIES_CTA_COPY,
  FACILITIES_PAGE_COPY,
  FACILITIES_STAGE_COPY,
  SCHOOL_LIFE_CTA_COPY,
  SCHOOL_LIFE_PAGE_COPY,
  SCHOOL_LIFE_STAGE_COPY,
  type ContentPageCopy,
  type ContentPageData,
} from '../../../core/data/content-pages.seed';
import { PageContentsService } from '../../../core/services/page-contents.service';
import { MediaFrame } from '../../../shared/components/media-frame/media-frame';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { UiIcon, type IconName } from '../../../shared/components/ui-icon/ui-icon';

export interface StageFact {
  readonly label: string;
  readonly value: string;
  readonly icon: IconName;
}

export interface StageDetail {
  readonly tag?: string;
  readonly title?: string;
  readonly gradesBadge: string;
  readonly ctaLabel?: string;
  readonly facts: readonly StageFact[];
}

@Component({
  selector: 'app-content-page',
  imports: [PageBanner, MediaFrame, UiIcon, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './content-page.html',
  styleUrl: './content-page.scss',
})
export class ContentPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pageContents = inject(PageContentsService);

  protected readonly slug = this.route.snapshot.data['slug'] ?? '';
  protected readonly page = signal<ContentPageData | undefined>(CONTENT_PAGES[this.slug]);

  // Shown when an admin leaves one of the shared headings blank.
  protected readonly pageCopy = computed<ContentPageCopy>(() => {
    if (this.isAcademics()) return ACADEMIC_PAGE_COPY;
    if (this.isSchoolLife()) return SCHOOL_LIFE_PAGE_COPY;
    if (this.isFacilities()) return FACILITIES_PAGE_COPY;
    return CONTENT_PAGE_COPY;
  });
  protected readonly stageCopy = ACADEMIC_STAGE_COPY;
  protected readonly ctaCopy = ACADEMIC_CTA_COPY;
  protected readonly schoolLifeStageCopy = SCHOOL_LIFE_STAGE_COPY;
  protected readonly schoolLifeCtaCopy = SCHOOL_LIFE_CTA_COPY;
  protected readonly facilitiesStageCopy = FACILITIES_STAGE_COPY;
  protected readonly facilitiesCtaCopy = FACILITIES_CTA_COPY;

  protected readonly isAcademics = computed(() => this.slug.startsWith('academics-'));
  protected readonly isSchoolLife = computed(() => this.slug.startsWith('school-life-'));
  protected readonly isFacilities = computed(() => this.slug.startsWith('facilities-'));

  protected readonly pageCrumb = computed(() => {
    if (this.isAcademics()) return 'Academics';
    if (this.isSchoolLife()) return 'School Life';
    if (this.isFacilities()) return 'Facilities';
    return undefined;
  });

  protected readonly pageCrumbLink = computed(() => {
    if (this.isAcademics()) return '/academics';
    if (this.isSchoolLife()) return '/events';
    if (this.isFacilities()) return '/facilities';
    return undefined;
  });

  protected readonly academicNav = [
    {
      label: 'Kindergarten',
      sub: 'Pre-KG – UKG',
      slug: 'academics-kindergarten',
      path: '/academics/kindergarten',
    },
    {
      label: 'Primary School',
      sub: 'Grades 1 – 5',
      slug: 'academics-primary',
      path: '/academics/primary-school',
    },
    {
      label: 'Middle School',
      sub: 'Grades 6 – 8',
      slug: 'academics-middle',
      path: '/academics/middle-school',
    },
    {
      label: 'High School',
      sub: 'Grades 9 & 10',
      slug: 'academics-high',
      path: '/academics/high-school',
    },
  ];

  protected readonly schoolLifeNav = [
    { label: 'Events', slug: 'school-life-events', path: '/school-life/events' },
    { label: 'Student Activities', slug: 'school-life-student-activities', path: '/school-life/student-activities' },
    { label: 'Sports & Games', slug: 'school-life-sports', path: '/school-life/sports' },
    { label: 'Arts & Culture', slug: 'school-life-arts-culture', path: '/school-life/arts-culture' },
    { label: 'Clubs', slug: 'school-life-clubs', path: '/school-life/clubs' },
    { label: 'Achievements', slug: 'school-life-achievements', path: '/school-life/achievements' },
  ];

  protected readonly facilitiesNav = [
    { label: 'Classrooms', slug: 'facilities-classrooms', path: '/facilities/classrooms' },
    { label: 'Library', slug: 'facilities-library', path: '/facilities/library' },
    { label: 'Computer Lab', slug: 'facilities-computer-lab', path: '/facilities/computer-lab' },
    { label: 'Sports Facilities', slug: 'facilities-sports', path: '/facilities/sports' },
    { label: 'Campus Amenities', slug: 'facilities-other', path: '/facilities/other' },
  ];

  // The at-a-glance cards are seeded for each family page and overridden by the
  // saved page content, so the templates no longer carry hardcoded copy.
  private readonly stageCard = computed<StageDetail | null>(() => {
    const stage = this.page()?.stage;
    if (!stage) return null;

    return {
      tag: stage.tag,
      title: stage.title,
      gradesBadge: stage.gradesBadge,
      ctaLabel: stage.ctaLabel,
      facts: stage.facts.map((fact) => ({ ...fact, icon: fact.icon as IconName })),
    };
  });

  protected readonly stageDetails = computed<StageDetail | null>(() =>
    this.isAcademics() ? this.stageCard() : null,
  );

  protected readonly schoolLifeDetails = computed<StageDetail | null>(() =>
    this.isSchoolLife() ? this.stageCard() : null,
  );

  protected readonly facilitiesDetails = computed<StageDetail | null>(() =>
    this.isFacilities() ? this.stageCard() : null,
  );

  protected readonly openFaq = signal<number | null>(0);

  ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    try {
      const data = await this.pageContents.load<Partial<ContentPageData>>(this.slug);
      const seed = CONTENT_PAGES[this.slug];
      if (!data) {
        if (seed) this.page.set(seed);
        return;
      }

      // A saved record owns every key it stores. Empty lists and an explicit
      // null stage/CTA are deliberate removals and must not be replaced by the
      // seed; only keys a record never stored (older rows) fall back to it.
      const hasSavedKey = (key: keyof ContentPageData) =>
        Object.prototype.hasOwnProperty.call(data, key);

      const hasPlaceholderText = (paragraphs?: readonly string[]) =>
        paragraphs?.some(
          (p) =>
            p.includes('confirmed by the school office') ||
            p.includes('will be updated soon') ||
            p.includes('published once confirmed'),
        ) ?? false;

      const paragraphs =
        !data.paragraphs || data.paragraphs.length === 0 || hasPlaceholderText(data.paragraphs)
          ? seed?.paragraphs ?? data.paragraphs ?? []
          : data.paragraphs;

      const bullets = hasSavedKey('bullets') ? (data.bullets ?? []) : seed?.bullets;
      const sections = hasSavedKey('sections') ? (data.sections ?? []) : seed?.sections;
      const faqs = hasSavedKey('faqs') ? (data.faqs ?? []) : seed?.faqs;

      this.page.set({
        title: data.title ?? seed?.title ?? '',
        subtitle: data.subtitle ?? seed?.subtitle ?? '',
        imageUrl: data.imageUrl ?? seed?.imageUrl ?? '',
        imageAlt: data.imageAlt ?? seed?.imageAlt ?? '',
        paragraphs,
        bullets,
        sections,
        note: data.note ?? seed?.note,
        faqs,
        overviewEyebrow: data.overviewEyebrow ?? seed?.overviewEyebrow,
        highlightsTitle: data.highlightsTitle ?? seed?.highlightsTitle,
        sectionsEyebrow: data.sectionsEyebrow ?? seed?.sectionsEyebrow,
        sectionsTitle: data.sectionsTitle ?? seed?.sectionsTitle,
        faqsEyebrow: data.faqsEyebrow ?? seed?.faqsEyebrow,
        faqsTitle: data.faqsTitle ?? seed?.faqsTitle,
        faqsSubtitle: data.faqsSubtitle ?? seed?.faqsSubtitle,
        mediaBadge: data.mediaBadge ?? seed?.mediaBadge,
        stage: hasSavedKey('stage') ? (data.stage ?? null) : (seed?.stage ?? null),
        cta: hasSavedKey('cta') ? (data.cta ?? null) : (seed?.cta ?? null),
      });
    } catch {
      // Keep the seeded page when Supabase content is unavailable.
    }
  }

  protected toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? null : index));
  }
}
