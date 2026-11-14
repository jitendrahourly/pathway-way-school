import { Service, signal } from '@angular/core';
import { ABOUT_CONTENT } from '../data/about.seed';
import type { AboutContent } from '../models/about-content.model';

/** Phase 4 replaces the seed with a Supabase read of the About page record. */
@Service()
export class AboutContentService {
  private readonly state = signal<AboutContent>(ABOUT_CONTENT);
  readonly content = this.state.asReadonly();
}
