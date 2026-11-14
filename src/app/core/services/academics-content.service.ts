import { Service, signal } from '@angular/core';
import { ACADEMICS_CONTENT } from '../data/academics.seed';
import type { AcademicsContent } from '../models/academics-content.model';

/** Phase 4 replaces the seed with a Supabase read of the Academics page record. */
@Service()
export class AcademicsContentService {
  private readonly state = signal<AcademicsContent>(ACADEMICS_CONTENT);
  readonly content = this.state.asReadonly();
}
