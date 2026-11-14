import { Service, computed, signal } from '@angular/core';
import { FACILITIES } from '../data/site.seed';
import type { Facility } from '../models/facility.model';

/** Phase 4 replaces the seed with a Supabase read ordered by display_order. */
@Service()
export class FacilitiesService {
  private readonly state = signal<readonly Facility[]>(FACILITIES);
  readonly active = computed(() =>
    this.state()
      .filter((facility) => facility.isActive)
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder),
  );
  readonly preview = computed(() => this.active().slice(0, 4));
}
