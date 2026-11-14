import { Service, signal } from '@angular/core';
import { HOME_CONTENT } from '../data/site.seed';
import type { HomeContent } from '../models/home-content.model';

/** Phase 4 replaces the seed with a Supabase read of the homepage page record. */
@Service()
export class HomeContentService {
  private readonly state = signal<HomeContent>(HOME_CONTENT);
  readonly content = this.state.asReadonly();
}
