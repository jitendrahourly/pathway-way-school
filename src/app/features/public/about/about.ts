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
import { RouterLink } from '@angular/router';
import { AboutContentService } from '../../../core/services/about-content.service';
import { buildContentBlocks } from '../../../core/utils/content-blocks';
import { UiIcon, type IconName } from '../../../shared/components/ui-icon/ui-icon';

const SECTION_ICONS: readonly IconName[] = [
  'book-open',
  'target',
  'heart',
  'check',
  'arrow-up-right',
];

const ABOUT_LINKS = [
  {
    path: '/about/our-school',
    label: 'Our School',
    text: 'Our institution, learning environment and approach.',
    icon: 'book-open',
  },
  {
    path: '/about/vision-mission',
    label: 'Vision & Mission',
    text: 'The goals and values that guide our school.',
    icon: 'target',
  },
  {
    path: '/about/management',
    label: 'Management',
    text: 'The people and trust behind Bright Way School.',
    icon: 'users',
  },
  {
    path: '/about/history',
    label: 'History & Legacy',
    text: 'Our journey, milestones and the legacy behind our school.',
    icon: 'calendar',
  },
] as const satisfies readonly {
  path: string;
  label: string;
  text: string;
  icon: IconName;
}[];

@Component({
  selector: 'app-about',
  imports: [RouterLink, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './about.scss',
  templateUrl: './about.html',
})
export class About implements OnInit {
  private readonly service = inject(AboutContentService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  protected readonly content = this.service.content;
  protected readonly activeId = signal('story');
  protected readonly aboutLinks = ABOUT_LINKS;

  protected readonly storyParagraphs = computed(() => this.content().story.paragraphs.slice(1));
  protected readonly sectionViews = computed(() =>
    this.content().sections.map((section, index) => ({
      ...section,
      number: index + 1,
      icon: this.sectionIcon(index),
      blocks: buildContentBlocks(section.paragraphs),
    })),
  );
  protected readonly links = computed(() => [
    { id: 'story', label: 'Our Story' },
    { id: 'vision-mission', label: 'Vision & Mission' },
    ...this.content().sections.map((section) => ({ id: section.id, label: section.title })),
  ]);

  ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    try {
      await this.service.load();
    } catch {
      // Keep the seeded About content when Supabase is unavailable.
    }
    this.setupScrollSpy();
  }

  private setupScrollSpy(): void {
    afterNextRender(
      () => {
        const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-about-section]'));
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

  protected setActive(id: string): void {
    this.activeId.set(id);
  }

  protected scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.setActive(id);
  }

  protected sectionIcon(index: number): IconName {
    return SECTION_ICONS[index % SECTION_ICONS.length];
  }
}
