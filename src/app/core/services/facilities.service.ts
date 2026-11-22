import { Service, computed, inject, signal } from '@angular/core';
import { FACILITIES } from '../data/site.seed';
import type { Facility } from '../models/facility.model';
import type { FacilityRecord } from '../models/supabase.model';
import { ContentService } from './content.service';

@Service()
export class FacilitiesService {
  private readonly content = inject(ContentService);
  private readonly state = signal<readonly Facility[]>(FACILITIES);

  readonly active = computed(() =>
    this.state()
      .filter((facility) => facility.isActive)
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder),
  );

  /**
   * Facilities come from the `facilities` table once an admin has saved any
   * records; the seed stays the fallback so the page is never empty. The seed
   * also supplies each card's stable id, which selects its detail sub-page.
   */
  async load(): Promise<void> {
    const rows = await this.content.select<FacilityRecord>('facilities', '*');
    if (this.content.error() || rows.length === 0) return;
    this.state.set(rows.map((row) => this.toFacility(row)));
  }

  private toFacility(row: FacilityRecord): Facility {
    const title = (row.title ?? '').trim();
    const seed = FACILITIES.find((item) => item.title.toLowerCase() === title.toLowerCase());
    return {
      id: seed?.id ?? String(row.id),
      title,
      description: row.description ?? '',
      imageUrl: row.image_url ?? '',
      imageAlt:
        (row.image_alt ?? '').trim() ||
        (seed && row.image_url === seed.imageUrl ? seed.imageAlt : title) ||
        'School facility',
      caption: (row.caption ?? '').trim() || seed?.caption || '',
detailedDescription: (row.detailed_description ?? '').trim() || undefined,
      highlights:
        row.highlights && row.highlights.length ? row.highlights : (seed?.highlights ?? []),
buttonLabel: (row.button_label ?? '').trim() || undefined,
buttonLink: (row.button_link ?? '').trim() || undefined,
      subpageUrl: (row.subpage_url ?? '').trim() || seed?.subpageUrl || '',
      displayOrder: Number(row.display_order ?? 0),
      isActive: row.is_published !== false,
    };
  }
}
