import { Service, computed, inject, signal } from '@angular/core';
import { FACILITIES_CONTENT } from '../data/facilities.seed';
import { mergeWithSeed } from '../data/seed-merge';
import type { FacilitiesContent } from '../models/facilities-content.model';
import { resolveRetiredAdmissionsLink } from '../utils/links';
import { FacilitiesService } from './facilities.service';
import { PageContentsService } from './page-contents.service';

@Service()
export class FacilitiesContentService {
  private readonly facilitiesService = inject(FacilitiesService);
  private readonly pageContents = inject(PageContentsService);
  private readonly state = signal<FacilitiesContent>(FACILITIES_CONTENT);

  readonly content = this.state.asReadonly();
  readonly facilities = this.facilitiesService.active;

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    const saved = await this.pageContents.load<Partial<FacilitiesContent>>('facilities');
    if (saved) {
      const merged = mergeWithSeed(FACILITIES_CONTENT, saved);
      const hasPlaceholderText = (paragraphs?: readonly string[]) =>
        paragraphs?.some(
          (p) =>
            p.includes('confirmed by the school office') ||
            p.includes('will be updated soon') ||
            p.includes('published once confirmed'),
        ) ?? false;
      const finalContent = hasPlaceholderText(merged.intro?.paragraphs)
        ? {
            ...merged,
            intro: {
              ...merged.intro,
              paragraphs: FACILITIES_CONTENT.intro.paragraphs,
              note: FACILITIES_CONTENT.intro.note,
            },
          }
        : merged;
      this.state.set({
        ...finalContent,
        cta: {
          ...finalContent.cta,
          primaryHref: resolveRetiredAdmissionsLink(finalContent.cta.primaryHref),
          secondaryHref: resolveRetiredAdmissionsLink(finalContent.cta.secondaryHref),
        },
      });
    }
  }

  readonly additional = computed(() =>
    this.content()
      .additional.filter((facility) => facility.isActive)
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder),
  );
}
