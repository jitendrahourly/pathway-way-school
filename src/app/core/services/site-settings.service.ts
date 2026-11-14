import { Service, signal } from '@angular/core';
import { SITE_SETTINGS } from '../data/site.seed';
import type { SiteSettings } from '../models/site-settings.model';

/** Phase 4 replaces the seed with a Supabase read. */
@Service()
export class SiteSettingsService {
  private readonly state = signal<SiteSettings>(SITE_SETTINGS);
  readonly settings = this.state.asReadonly();
}
