import { Service, inject, signal } from '@angular/core';
import { HOME_CONTENT } from '../data/site.seed';
import { mergeWithSeed } from '../data/seed-merge';
import type { HomeContent } from '../models/home-content.model';
import { PageContentsService } from './page-contents.service';

@Service()
export class HomeContentService {
  private readonly pageContents = inject(PageContentsService);
  private readonly state = signal<HomeContent>(HOME_CONTENT);
  readonly content = this.state.asReadonly();

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    const saved = await this.pageContents.load<Partial<HomeContent>>('home');
    if (saved) {
      this.state.set(this.migrate(mergeWithSeed(HOME_CONTENT, saved), saved));
    }
  }

  /**
   * Records saved before section headings were editable stored the facilities,
   * gallery and announcements intros as top-level strings. Those values are
   * carried into their new heading slots so no saved copy is lost.
   */
  private migrate(content: HomeContent, saved: Partial<HomeContent>): HomeContent {
    const savedHeadings = (saved as Record<string, unknown>)['headings'] as
      | Record<string, { text?: string }>
      | undefined;

    const text = (key: keyof HomeContent['headings'], legacy: string): string =>
      savedHeadings?.[key]?.text ?? legacy;

    return {
      ...content,
      headings: {
        ...content.headings,
        facilities: {
          ...content.headings.facilities,
          text: text('facilities', content.facilitiesIntro),
        },
        gallery: {
          ...content.headings.gallery,
          text: text('gallery', content.galleryIntro),
        },
        updates: {
          ...content.headings.updates,
          text: text('updates', content.announcementsIntro),
        },
      },
    };
  }
}
