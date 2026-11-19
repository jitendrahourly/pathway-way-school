import { Service, inject, signal } from '@angular/core';
import { ABOUT_CONTENT, resolveAboutContent } from '../data/about.seed';
import type { AboutContent } from '../models/about-content.model';
import { PageContentsService } from './page-contents.service';

@Service()
export class AboutContentService {
  private readonly pageContents = inject(PageContentsService);
  private readonly state = signal<AboutContent>(ABOUT_CONTENT);
  private loadPromise: Promise<void> | null = null;

  readonly content = this.state.asReadonly();

  constructor() {
    void this.load();
  }

  load(): Promise<void> {
    if (!this.loadPromise) {
      this.loadPromise = this.fetchContent().catch(() => {
        this.loadPromise = null;
      });
    }
    return this.loadPromise;
  }

  private async fetchContent(): Promise<void> {
    const saved = await this.pageContents.load<Partial<AboutContent>>('about');
    if (saved) {
      this.state.set(resolveAboutContent(saved));
    }
  }
}
