import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { galleryImages } from '../../../../../core/data/home-gallery';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { SiteSettingsService } from '../../../../../core/services/site-settings.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';

interface HeroSlide {
  readonly src: string;
  readonly alt: string;
  readonly position: string;
}

const AUTOPLAY_MS = 5000;

@Component({
  selector: 'app-home-hero',
  imports: [RouterLink, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-hero.scss',
  templateUrl: './home-hero.html',
})
export class HomeHero {
  private readonly content = inject(HomeContentService).content;
  private readonly destroyRef = inject(DestroyRef);
  private timer: ReturnType<typeof setInterval> | null = null;

  protected readonly hero = computed(() => this.content().hero);
  protected readonly settings = inject(SiteSettingsService).settings;

  /**
   * The slider reuses the admin-managed hero photograph plus the about and
   * gallery photographs, so every image on the site remains editable and no
   * unrelated stock photography is introduced.
   */
  protected readonly slides = computed<readonly HeroSlide[]>(() => {
    const content = this.content();
    const candidates: HeroSlide[] = [
      {
        src: content.hero.imageUrl,
        alt: content.hero.imageAlt || 'Bright Way School campus',
        position: content.hero.imagePosition || 'center',
      },
      {
        src: content.about.imageUrl,
        alt: content.about.imageAlt || 'Students at Bright Way School',
        position: 'center',
      },
      ...galleryImages(content.galleryPreview).map((image) => ({
        src: image.url,
        alt: image.alt,
        position: 'center',
      })),
    ];

    const seen = new Set<string>();
    return candidates
      .filter((slide) => {
        if (!slide.src || seen.has(slide.src)) return false;
        seen.add(slide.src);
        return true;
      })
      .slice(0, 4);
  });

  protected readonly active = signal(0);
  protected readonly paused = signal(false);
  protected readonly index = computed(() =>
    Math.min(this.active(), Math.max(this.slides().length - 1, 0)),
  );

  constructor() {
    afterNextRender(() => {
      if (
        this.slides().length < 2 ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }

      this.timer = setInterval(() => {
        if (this.paused() || document.hidden) return;
        this.advance(1);
      }, AUTOPLAY_MS);
    });

    this.destroyRef.onDestroy(() => {
      if (this.timer) clearInterval(this.timer);
    });
  }

  protected goTo(index: number): void {
    const total = this.slides().length;
    if (!total) return;
    this.active.set(((index % total) + total) % total);
  }

  protected next(): void {
    this.advance(1);
  }

  protected previous(): void {
    this.advance(-1);
  }

  protected pause(): void {
    this.paused.set(true);
  }

  protected resume(): void {
    this.paused.set(false);
  }

  protected onFocusOut(event: FocusEvent): void {
    const host = event.currentTarget as HTMLElement | null;
    const next = event.relatedTarget as Node | null;
    if (!host || !next || !host.contains(next)) {
      this.resume();
    }
  }

  protected label(index: number): string {
    return `Show slide ${index + 1} of ${this.slides().length}`;
  }

  protected pad(value: number): string {
    return String(value).padStart(2, '0');
  }

  private advance(step: number): void {
    const total = this.slides().length;
    if (total < 2) return;
    this.active.update((current) => (current + step + total) % total);
  }
}
