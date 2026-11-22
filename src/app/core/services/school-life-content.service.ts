import { Service, inject, signal } from '@angular/core';
import { SCHOOL_LIFE_CONTENT } from '../data/school-life.seed';
import { mergeWithSeed } from '../data/seed-merge';
import type { SchoolLifeContent } from '../models/school-life-content.model';
import { PageContentsService } from './page-contents.service';

@Service()
export class SchoolLifeContentService {
  private readonly pageContents = inject(PageContentsService);
  private readonly state = signal<SchoolLifeContent>(SCHOOL_LIFE_CONTENT);

  readonly content = this.state.asReadonly();

  async load(): Promise<void> {
    const saved = await this.pageContents.load<Partial<SchoolLifeContent>>('school-life');
    if (saved) {
      this.state.set(mergeWithSeed(SCHOOL_LIFE_CONTENT, saved));
    }
  }
}
