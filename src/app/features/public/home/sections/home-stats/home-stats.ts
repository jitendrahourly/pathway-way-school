import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import type { HomeStat } from '../../../../../core/models/home-content.model';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

interface ParsedStat extends HomeStat {
  readonly target: number | null;
  readonly prefix: string;
  readonly suffix: string;
}

function parseStat(stat: HomeStat): ParsedStat {
  const value = stat.value.trim();
  // Ranges and text values ("K – 10", "Govt.") stay exactly as written.
  if (/[-–—]/.test(value)) {
    return { ...stat, target: null, prefix: '', suffix: '' };
  }

  const match = /^(\D*?)(\d[\d,]*)(\D*)$/.exec(value);
  if (!match) {
    return { ...stat, target: null, prefix: '', suffix: '' };
  }

  const target = Number(match[2].replace(/,/g, ''));
  if (!Number.isFinite(target)) {
    return { ...stat, target: null, prefix: '', suffix: '' };
  }

  return { ...stat, target, prefix: match[1], suffix: match[3] };
}

const COUNT_DURATION_MS = 1600;

@Component({
  selector: 'app-home-stats',
  imports: [UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-stats.scss',
  templateUrl: './home-stats.html',
})
export class HomeStats {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private observer: IntersectionObserver | null = null;
  private frame = 0;

  protected readonly content = inject(HomeContentService).content;
  protected readonly head = computed(() => this.content().headings.stats);
  protected readonly stats = computed<readonly ParsedStat[]>(() =>
    this.content().stats.map(parseStat),
  );
  protected readonly values = signal<readonly string[] | null>(null);

  constructor() {
    afterNextRender(() => {
      const parsed = this.stats();

      if (
        !parsed.some((stat) => stat.target !== null) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        typeof IntersectionObserver === 'undefined'
      ) {
        this.values.set(parsed.map((stat) => stat.value));
        return;
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          this.observer?.disconnect();
          this.observer = null;
          this.run();
        },
        { threshold: 0.3 },
      );
      this.observer.observe(this.host.nativeElement);
    });

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
      if (this.frame) cancelAnimationFrame(this.frame);
    });
  }

  protected display(index: number, stat: ParsedStat): string {
    return this.values()?.[index] ?? stat.value;
  }

  private run(): void {
    const stats = this.stats();
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / COUNT_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      this.values.set(
        stats.map((stat) =>
          stat.target === null
            ? stat.value
            : `${stat.prefix}${Math.round(stat.target * eased)}${stat.suffix}`,
        ),
      );

      if (progress < 1) {
        this.frame = requestAnimationFrame(tick);
      }
    };

    this.frame = requestAnimationFrame(tick);
  }
}
