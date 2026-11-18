import { Service, inject, signal } from '@angular/core';
import { ADMISSIONS_CONTENT } from '../data/admissions.seed';
import { mergeWithSeed } from '../data/seed-merge';
import type { AdmissionsContent } from '../models/admissions-content.model';
import { PageContentsService } from './page-contents.service';

@Service()
export class AdmissionsContentService {
  private readonly pageContents = inject(PageContentsService);
  private readonly state = signal<AdmissionsContent>(ADMISSIONS_CONTENT);

  readonly content = this.state.asReadonly();

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    const saved = await this.pageContents.load<Partial<AdmissionsContent>>('admissions');
    if (saved) {
      this.state.set(mergeWithSeed(ADMISSIONS_CONTENT, saved));
    }
  }
}
