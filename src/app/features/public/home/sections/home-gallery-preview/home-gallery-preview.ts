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
import { RouterLink } from '@angular/router';
import { galleryImages } from '../../../../../core/data/home-gallery';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-gallery-preview',
  imports: [RouterLink, UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-gallery-preview.scss',
  templateUrl: './home-gallery-preview.html',
})
export class HomeGalleryPreview {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = viewChild<ElementRef<HTMLElement>>('lightbox');
  private previouslyFocused: HTMLElement | null = null;
  private previousOverflow = '';

  protected readonly content = inject(HomeContentService).content;
  protected readonly head = computed(() => this.content().headings.gallery);
  protected readonly images = computed(() => galleryImages(this.content().galleryPreview));
  protected readonly openIndex = signal<number | null>(null);
  protected readonly current = computed(() => {
    const index = this.openIndex();
    if (index === null) return null;
    const images = this.images();
    const image = images[index];
    if (!image) return null;
    return {
      index,
      src: image.url,
      alt: image.alt,
      caption: image.caption,
      total: images.length,
    };
  });

  constructor() {
    effect(() => {
      const open = this.openIndex() !== null;

      if (open) {
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

  protected open(index: number): void {
    this.openIndex.set(index);
  }

  protected close(): void {
    this.openIndex.set(null);
  }

  protected next(): void {
    const total = this.images().length;
    if (!total) return;
    this.openIndex.update((index) => (index === null ? 0 : (index + 1) % total));
  }

  protected previous(): void {
    const total = this.images().length;
    if (!total) return;
    this.openIndex.update((index) => (index === null ? 0 : (index - 1 + total) % total));
  }

  protected caption(index: number): string {
    return this.images()[index]?.caption ?? `School photograph ${index + 1}`;
  }

  protected alt(index: number): string {
    return this.images()[index]?.alt ?? `Bright Way School photograph ${index + 1}`;
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (this.openIndex() === null) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previous();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private trapFocus(event: KeyboardEvent): void {
    const dialog = this.dialog()?.nativeElement;
    if (!dialog) return;

    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>('button:not([disabled])'),
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
