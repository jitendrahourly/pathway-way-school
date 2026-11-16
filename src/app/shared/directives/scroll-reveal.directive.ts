import { Directive, ElementRef, Input, OnInit, OnDestroy, inject } from '@angular/core';

/**
 * Fades an element up once it enters the viewport.
 * Classes are applied directly to the host so the effect does not depend on change detection.
 */
@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private observer: IntersectionObserver | null = null;

  /** Stagger delay in milliseconds. */
  @Input() revealDelay = 0;

  ngOnInit(): void {
    const host = this.el.nativeElement;
    host.classList.add('scroll-reveal');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      host.classList.add('is-revealed');
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      host.classList.add('is-revealed');
      return;
    }

    if (this.revealDelay) {
      host.style.transitionDelay = `${this.revealDelay}ms`;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            host.classList.add('is-revealed');
            this.observer?.disconnect();
            this.observer = null;
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
