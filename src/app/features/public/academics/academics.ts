import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  DEFAULT_ACADEMIC_CTA,
  DEFAULT_ACADEMIC_GLANCE_HEADING,
  DEFAULT_ACADEMIC_STAGES_HEADING,
} from '../../../core/data/academics.seed';
import { AcademicsContentService } from '../../../core/services/academics-content.service';
import { MediaFrame } from '../../../shared/components/media-frame/media-frame';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';
import { TiltCardDirective } from '../../../shared/directives/tilt-card.directive';

@Component({
  selector: 'app-academics',
  imports: [PageBanner, MediaFrame, SectionHeading, UiIcon, TiltCardDirective, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './academics.scss',
  templateUrl: './academics.html',
})
export class Academics implements OnInit {
  private readonly service = inject(AcademicsContentService);
  protected readonly content = this.service.content;

  protected readonly stagesHeading = computed(
    () => this.content().stagesHeading ?? DEFAULT_ACADEMIC_STAGES_HEADING,
  );

  // No seed fallback: an emptied stages list hides the whole section.
  protected readonly stages = computed(() => this.content().stages ?? []);

  protected readonly glanceHeading = computed(
    () => this.content().glanceHeading ?? DEFAULT_ACADEMIC_GLANCE_HEADING,
  );

  protected readonly cta = computed(
    () => this.content().cta ?? DEFAULT_ACADEMIC_CTA,
  );

  /** Alternates the photograph side across rows that have one. */
  protected readonly sections = computed(() => {
    let mediaCount = 0;
    return this.content().sections.map((section) => ({
      ...section,
      mediaLeft: section.imageUrl ? mediaCount++ % 2 === 1 : false,
    }));
  });

  ngOnInit(): void {
    void this.service.load();
  }
}
