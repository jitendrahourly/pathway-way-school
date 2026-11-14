import { Service, computed, inject, signal } from '@angular/core';
import { FACILITIES_CONTENT } from '../data/facilities.seed';
import type { FacilitiesContent } from '../models/facilities-content.model';
import { FacilitiesService } from './facilities.service';

/**
 * Page copy for the Facilities page plus the ordered facility list.
 * Facilities stay in their own store so the admin dashboard edits one source.
 * Phase 4 replaces the seed with a Supabase read of the page record.
 */
@Service()
export class FacilitiesContentService {
  private readonly facilitiesService = inject(FacilitiesService);
  private readonly state = signal<FacilitiesContent>(FACILITIES_CONTENT);

  readonly content = this.state.asReadonly();
  readonly facilities = this.facilitiesService.active;

  readonly additional = computed(() =>
    this.content()
      .additional.filter((facility) => facility.isActive)
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder),
  );
}
