import { Service, inject, signal } from '@angular/core';
import { ABOUT_CONTENT } from '../data/about.seed';
import { mergeWithSeed } from '../data/seed-merge';
import type { AboutContent } from '../models/about-content.model';
import { PageContentsService } from './page-contents.service';

@Service()
export class AboutContentService {
  private readonly pageContents = inject(PageContentsService);
  private readonly state = signal<AboutContent>(ABOUT_CONTENT);
  readonly content = this.state.asReadonly();

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    const saved = await this.pageContents.load<Partial<AboutContent>>('about');
    if (saved) {
      this.state.set(mergeWithSeed(ABOUT_CONTENT, saved));
    }
  }
}
