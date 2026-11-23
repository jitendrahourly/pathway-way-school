import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  OnInit,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  CONTENT_PAGES,
  type ContentPageData,
  type ContentPageSection,
} from '../../../core/data/content-pages.seed';
import { PageContentsService } from '../../../core/services/page-contents.service';
import { buildContentBlocks } from '../../../core/utils/content-blocks';
import { UiIcon, type IconName } from '../../../shared/components/ui-icon/ui-icon';

const SECTION_ICONS: readonly IconName[] = [
  'book-open',
  'users',
  'target',
  'heart',
  'graduation-cap',
  'check',
  'calendar',
];

const EXPLORE_LINKS = [
  { slug: 'about-our-school', label: 'Our School', path: '/about/our-school' },
  { slug: 'about-vision-mission', label: 'Vision & Mission', path: '/about/vision-mission' },
  { slug: 'about-management', label: 'Management', path: '/about/management' },
  { slug: 'about-history', label: 'History & Legacy', path: '/about/history' },
] as const;

const ABOUT_SUBNAV = [
  { label: 'Our School', path: '/about/our-school', slug: 'about-our-school' },
  { label: 'Vision & Mission', path: '/about/vision-mission', slug: 'about-vision-mission' },
  { label: 'Management', path: '/about/management', slug: 'about-management' },
  { label: 'History & Legacy', path: '/about/history', slug: 'about-history' },
] as const;

@Component({
  selector: 'app-about-story',
  imports: [RouterLink, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-story.html',
  styleUrl: './about-story.scss',
})
export class AboutStory implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pageContents = inject(PageContentsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  protected readonly slug = this.route.snapshot.data['slug'] ?? '';
  protected readonly eyebrow = this.route.snapshot.data['eyebrow'] ?? 'About Us';
  protected readonly page = signal<ContentPageData | undefined>(CONTENT_PAGES[this.slug]);
  protected readonly activeId = signal('');
  protected readonly openFaq = signal<number | null>(0);

  protected readonly aboutSubNav = ABOUT_SUBNAV;
  protected readonly isActiveSubNav = (slug: string): boolean => slug === this.slug;

  protected readonly sections = computed(() => this.page()?.sections ?? []);
  protected readonly introParagraphs = computed(() => this.page()?.paragraphs.slice(1) ?? []);
  protected readonly introBlocks = computed(() =>
    buildContentBlocks(this.introParagraphs(), this.page()?.bullets ?? []),
  );
  protected readonly sectionViews = computed(() =>
    this.sections().map((section, index) => ({
      ...section,
      id: this.sectionId(section, index),
      number: index + 1,
      icon: this.iconFor(index),
      blocks: buildContentBlocks(section.paragraphs, section.bullets ?? []),
    })),
  );
  protected readonly links = computed(() =>
    this.sections().map((section, index) => ({
      id: this.sectionId(section, index),
      title: section.title,
    })),
  );
  protected readonly exploreLinks = computed(() =>
    EXPLORE_LINKS.filter((link) => link.slug !== this.slug),
  );

  ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    try {
      const data = await this.pageContents.load<Partial<ContentPageData>>(this.slug);
      if (!data) {
        this.setupScrollSpy();
        return;
      }

      const seed = CONTENT_PAGES[this.slug];
      this.page.set({
        title: data.title ?? seed?.title ?? '',
        subtitle: data.subtitle ?? seed?.subtitle ?? '',
        imageUrl: data.imageUrl ?? seed?.imageUrl ?? '',
        imageAlt: data.imageAlt ?? seed?.imageAlt ?? '',
        paragraphs: data.paragraphs ?? seed?.paragraphs ?? [],
        bullets: data.bullets ?? seed?.bullets,
        sections: data.sections ?? seed?.sections,
        note: data.note ?? seed?.note,
        faqs: data.faqs ?? seed?.faqs,
      });
      this.setupScrollSpy();
    } catch {
      // Keep the seeded page when Supabase content is unavailable.
      this.setupScrollSpy();
    }
  }

  private setupScrollSpy(): void {
    afterNextRender(
      () => {
        const sections = Array.from(
          document.querySelectorAll<HTMLElement>('[data-our-school-section]'),
        );
        if (!sections.length) {
          return;
        }

        const update = () => {
          let current = sections[0];
          for (const section of sections) {
            if (section.getBoundingClientRect().top <= 180) {
              current = section;
            }
          }
          this.activeId.set(current.id);
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
        this.destroyRef.onDestroy(() => window.removeEventListener('scroll', update));
      },
      { injector: this.injector },
    );
  }

  protected sectionId(section: ContentPageSection, index: number): string {
    const slug = section.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `section-${index + 1}${slug ? `-${slug}` : ''}`;
  }

  protected iconFor(index: number): IconName {
    return SECTION_ICONS[index % SECTION_ICONS.length];
  }

  protected scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.activeId.set(id);
  }

  protected toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? null : index));
  }
}
