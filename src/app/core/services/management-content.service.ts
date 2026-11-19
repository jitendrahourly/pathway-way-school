import { Service, inject, signal } from '@angular/core';
import { MANAGEMENT_CONTENT } from '../data/management.seed';
import { mergeWithSeed } from '../data/seed-merge';
import type { ManagementContent } from '../models/management-content.model';
import { PageContentsService } from './page-contents.service';

@Service()
export class ManagementContentService {
  private readonly pageContents = inject(PageContentsService);
  private readonly state = signal<ManagementContent>(MANAGEMENT_CONTENT);
  readonly content = this.state.asReadonly();

  async load(): Promise<void> {
    const saved = await this.pageContents.load<Partial<ManagementContent>>('about-management');
    if (saved) {
      this.state.set(mergeWithSeed(MANAGEMENT_CONTENT, saved));
    }
  }
}
