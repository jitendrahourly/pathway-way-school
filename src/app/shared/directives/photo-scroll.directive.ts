import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

interface TrackedPhoto {
  el: HTMLElement;
  active: boolean;
}

/** Must match the resting `scale()` of `.photo-scroll.is-in img` in media-frame.scss. */
const PHOTO_ZOOM = 1.06;
/** Preferred drift in pixels; shortened when a frame is too short to hide it. */
const MAX_DRIFT = 8;

/** Shared registry so every photograph reuses one scroll listener and one rAF. */
const tracked = new Set<TrackedPhoto>();
let frameId = 0;

/**
 * Largest safe drift for a frame: the scaling leaves (zoom - 1) / 2 of the height
 * as overscan, but the independent `translate` happens before the scale, so the
 * visible movement is drift * zoom. One extra pixel guards sub-pixel rounding.
 */
function driftLimit(height: number): number {
  const overscan = (height * (PHOTO_ZOOM - 1)) / 2 / PHOTO_ZOOM;
  return Math.max(0, Math.floor(overscan) - 1);
}

function update(): void {
  frameId = 0;
  const viewport = window.innerHeight || 1;
  for (const photo of tracked) {
    if (!photo.active) continue;
    const rect = photo.el.getBoundingClientRect();
    const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - viewport / 2) / viewport));
    const drift = Math.min(MAX_DRIFT, driftLimit(rect.height));
    photo.el.style.setProperty('--photo-shift', `${(-progress * drift).toFixed(2)}px`);
  }
}

function schedule(): void {
  if (!frameId) frameId = requestAnimationFrame(update);
}

function onScroll(): void {
  schedule();
}

function attach(): void {
  if (tracked.size !== 1) return;
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

function detach(): void {
  if (tracked.size > 0) return;
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
  if (frameId) cancelAnimationFrame(frameId);
  frameId = 0;
}

/**
 * Scroll effect for photographs: the frame lifts in once, the image eases out
 * of a slight zoom, and it drifts a few pixels against the scroll.
 * Disabled for reduced motion.
 */
@Directive({
  selector: '[appPhotoScroll]',
  standalone: true,
})
export class PhotoScrollDirective implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private observer: IntersectionObserver | null = null;
  private photo: TrackedPhoto | null = null;

  ngOnInit(): void {
    const host = this.host;
    host.classList.add('photo-scroll');

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
      host.classList.add('is-in');
      return;
    }

    this.photo = { el: host, active: false };
    tracked.add(this.photo);
    attach();

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            host.classList.add('is-in');
          }
          if (this.photo) {
            this.photo.active = entry.isIntersecting;
          }
        }
        schedule();
      },
      { threshold: 0.05, rootMargin: '12% 0px 12% 0px' },
    );
    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
    if (this.photo) {
      tracked.delete(this.photo);
      this.host.style.removeProperty('--photo-shift');
      this.photo = null;
    }
    detach();
  }
}
