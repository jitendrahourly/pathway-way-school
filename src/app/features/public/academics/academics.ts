import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AcademicsContentService } from '../../../core/services/academics-content.service';
import { MediaFrame } from '../../../shared/components/media-frame/media-frame';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';
import { TiltCardDirective } from '../../../shared/directives/tilt-card.directive';

@Component({
  selector: 'app-academics',
  imports: [PageBanner, MediaFrame, SectionHeading, UiIcon, TiltCardDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './academics.scss',
  templateUrl: './academics.html',
})
export class Academics {
  protected readonly content = inject(AcademicsContentService).content;

  /** Alternates the photograph side across rows that have one. */
  protected readonly sections = computed(() => {
    let mediaCount = 0;
    return this.content().sections.map((section) => ({
      ...section,
      mediaLeft: section.imageUrl ? mediaCount++ % 2 === 1 : false,
    }));
  });
}
