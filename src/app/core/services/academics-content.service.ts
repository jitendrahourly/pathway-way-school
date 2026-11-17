import { Service, inject, signal } from '@angular/core';
import { ACADEMICS_CONTENT } from '../data/academics.seed';
import { mergeWithSeed } from '../data/seed-merge';
import type { AcademicsContent } from '../models/academics-content.model';
import { PageContentsService } from './page-contents.service';

@Service()
export class AcademicsContentService {
  private readonly pageContents = inject(PageContentsService);
  private readonly state = signal<AcademicsContent>(ACADEMICS_CONTENT);
  readonly content = this.state.asReadonly();

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    const saved = await this.pageContents.load<Partial<AcademicsContent>>('academics');
    if (saved) {
      this.state.set(mergeWithSeed(ACADEMICS_CONTENT, saved));
    }
  }
}
