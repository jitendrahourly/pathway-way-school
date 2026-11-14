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
import { GALLERY_CATEGORY_LABELS } from '../../../core/data/gallery-categories';
import type { GalleryCategoryId } from '../../../core/models/gallery-item.model';
import { GalleryContentService } from '../../../core/services/gallery-content.service';
import { MediaFrame } from '../../../shared/components/media-frame/media-frame';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';
import { HomeInstagram } from '../home/sections/home-instagram/home-instagram';

type GalleryFilterId = GalleryCategoryId | 'all';

@Component({
  selector: 'app-gallery',
  imports: [PageBanner, MediaFrame, UiIcon, HomeInstagram],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './gallery.scss',
  templateUrl: './gallery.html',
})
export class Gallery {
  private readonly service = inject(GalleryContentService);
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');
  private trigger: HTMLElement | null = null;

  protected readonly content = this.service.content;
  protected readonly filters = this.service.filters;
  protected readonly filter = signal<GalleryFilterId>('all');
  protected readonly items = computed(() => {
    const id = this.filter();
    const all = this.service.items();
    return id === 'all' ? all : all.filter((item) => item.category === id);
  });

  protected readonly index = signal<number | null>(null);
  protected readonly current = computed(() => {
    const position = this.index();
    return position === null ? null : (this.items()[position] ?? null);
  });
  protected readonly position = computed(() => {
    const current = this.index();
    return current === null ? '' : `${current + 1} / ${this.items().length}`;
  });

  constructor() {
    // Background scrolling is locked only while the lightbox is open.
    effect(() => {
      document.body.style.overflow = this.current() ? 'hidden' : '';
    });
    inject(DestroyRef).onDestroy(() => {
      document.body.style.overflow = '';
    });
  }

  protected labelFor(category: GalleryCategoryId): string {
    return GALLERY_CATEGORY_LABELS[category];
  }

  protected setFilter(id: GalleryFilterId): void {
    this.filter.set(id);
    this.index.set(null);
  }

  protected open(position: number, event: Event): void {
    this.trigger = event.currentTarget as HTMLElement | null;
    this.index.set(position);
    this.preload(position + 1);
    setTimeout(() => this.closeButton()?.nativeElement.focus());
  }

  protected close(): void {
    this.index.set(null);
    this.trigger?.focus();
    this.trigger = null;
  }

  protected step(delta: number): void {
    const total = this.items().length;
    const position = this.index();
    if (position === null || total === 0) {
      return;
    }
    const next = (position + delta + total) % total;
    this.index.set(next);
    this.preload(next + delta);
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (this.index() === null) {
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.step(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.step(-1);
    }
  }

  /** Warms the browser cache for the neighbouring photograph. */
  private preload(position: number): void {
    const total = this.items().length;
    if (total === 0 || typeof Image === 'undefined') {
      return;
    }
    const item = this.items()[((position % total) + total) % total];
    if (item) {
      const image = new Image();
      image.src = item.imageUrl;
    }
  }
}
