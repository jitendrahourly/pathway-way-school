import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MediaFrame } from '../../../shared/components/media-frame/media-frame';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

/** Shape of the data rendered by the facility live preview. */
export interface FacilityPreviewData {
  readonly title: string;
  readonly description: string;
  readonly imageUrl: string | null;
  readonly imageAlt: string;
  readonly caption: string;
  readonly highlights: readonly string[];
  readonly subpageUrl: string;
  readonly isPublished: boolean;
}

/**
 * Renders a facility exactly as the public detail block presents it, so the
 * administrator can see unsaved changes before saving. Mirrors the markup and
 * styling of the facilities page detail section.
 */
@Component({
  selector: 'app-facility-preview',
  imports: [MediaFrame, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './facility-preview.scss',
  templateUrl: './facility-preview.html',
})
export class FacilityPreview {
  readonly data = input.required<FacilityPreviewData>();
}
