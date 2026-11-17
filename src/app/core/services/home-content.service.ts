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
      this.state.set(mergeWithSeed(HOME_CONTENT, saved));
    }
  }
}
