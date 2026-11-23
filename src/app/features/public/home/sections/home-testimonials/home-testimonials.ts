import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

const AUTOPLAY_MS = 4500;

@Component({
  selector: 'app-home-testimonials',
  imports: [UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-testimonials.scss',
  templateUrl: './home-testimonials.html',
})
export class HomeTestimonials {
  private readonly destroyRef = inject(DestroyRef);
  private timer: ReturnType<typeof setInterval> | null = null;

  protected readonly content = inject(HomeContentService).content;
  protected readonly head = computed(() => this.content().headings.testimonials);
  protected readonly testimonials = computed(() => this.content().testimonials);
  protected readonly active = signal(0);
  protected readonly paused = signal(false);
  protected readonly index = computed(() =>
    Math.min(this.active(), Math.max(this.testimonials().length - 1, 0)),
  );

  constructor() {
    afterNextRender(() => {
      if (
        this.testimonials().length < 2 ||
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
    const total = this.testimonials().length;
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

  protected pad(value: number): string {
    return String(value).padStart(2, '0');
  }

  private advance(step: number): void {
    const total = this.testimonials().length;
    if (total < 2) return;
    this.active.update((current) => (current + step + total) % total);
  }
}
