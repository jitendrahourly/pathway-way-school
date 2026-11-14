import { Service, signal } from '@angular/core';
import { ADMISSIONS_CONTENT } from '../data/admissions.seed';
import type { AdmissionsContent } from '../models/admissions-content.model';

/**
 * Page copy for the Admissions page. Confirmed school facts come from site
 * settings; admission-specific facts are published only once confirmed.
 * Phase 4 replaces the seed with a Supabase read of the page record.
 */
@Service()
export class AdmissionsContentService {
  private readonly state = signal<AdmissionsContent>(ADMISSIONS_CONTENT);

  readonly content = this.state.asReadonly();
}
