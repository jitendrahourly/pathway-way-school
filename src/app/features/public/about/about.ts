import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AboutContentService } from '../../../core/services/about-content.service';
import { MediaFrame } from '../../../shared/components/media-frame/media-frame';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

@Component({
  selector: 'app-about',
  imports: [PageBanner, MediaFrame, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './about.scss',
  templateUrl: './about.html',
})
export class About {
  protected readonly content = inject(AboutContentService).content;
  private readonly destroyRef = inject(DestroyRef);

  protected readonly activeId = signal('story');

  protected readonly links = computed(() => [
    { id: 'story', label: 'About Us' },
    { id: 'vision-mission', label: 'Vision & Mission' },
    ...this.content().sections.map((section) => ({ id: section.id, label: section.title })),
  ]);

  constructor() {
    afterNextRender(() => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-about-section]'),
      );
      if (!sections.length || typeof IntersectionObserver === 'undefined') {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const current = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          if (current) {
            this.activeId.set(current.target.id);
          }
        },
        { rootMargin: '-150px 0px -55% 0px' },
      );

      sections.forEach((section) => observer.observe(section));
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected setActive(id: string): void {
    this.activeId.set(id);
  }
}
