import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-video-tour',
  imports: [UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-video-tour.scss',
  templateUrl: './home-video-tour.html',
})
export class HomeVideoTour {
  private readonly content = inject(HomeContentService).content;
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = viewChild<ElementRef<HTMLElement>>('videoDialog');
  private previouslyFocused: HTMLElement | null = null;
  private previousOverflow = '';

  protected readonly video = computed(() => this.content().videoTour);
  protected readonly head = computed(() => this.content().headings.video);
  protected readonly videoSrc = computed(() => this.video().url);
  protected readonly thumbnail = computed(
    () => this.video().thumbnailUrl || this.content().hero.imageUrl,
  );
  protected readonly hasVideo = computed(() => this.video().url.trim().length > 0);
  protected readonly isFile = computed(() =>
    /\.(mp4|webm|ogg)(\?|#|$)/i.test(this.video().url.trim()),
  );
  protected readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.toEmbed(this.video().url.trim());
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });
  protected readonly playing = signal(false);

  constructor() {
    effect(() => {
      if (this.playing()) {
        this.previouslyFocused = document.activeElement as HTMLElement | null;
        this.previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        setTimeout(() => this.dialog()?.nativeElement.focus(), 0);
      } else {
        document.body.style.overflow = this.previousOverflow;
        this.previouslyFocused?.focus({ preventScroll: true });
      }
    });

    this.destroyRef.onDestroy(() => {
      document.body.style.overflow = this.previousOverflow;
    });
  }

  protected open(): void {
    if (!this.hasVideo()) return;
    this.playing.set(true);
  }

  protected close(): void {
    this.playing.set(false);
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (!this.playing()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (event.key === 'Tab') {
      const dialog = this.dialog()?.nativeElement;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>('button:not([disabled])'),
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  private toEmbed(url: string): string | null {
    if (!url) return null;

    if (this.isFile()) return url;

    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '');

      if (host === 'youtu.be') {
        const id = parsed.pathname.split('/').filter(Boolean)[0];
        return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : null;
      }

      if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
        const id =
          parsed.searchParams.get('v') ??
          parsed.pathname.match(/\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1];
        return id
          ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
          : null;
      }

      if (host === 'vimeo.com') {
        const id = parsed.pathname.split('/').filter(Boolean).pop();
        return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
      }

      return url;
    } catch {
      return null;
    }
  }
}
