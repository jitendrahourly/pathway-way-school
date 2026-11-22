import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

export type GalleryPreviewSection = 'banner' | 'intro' | 'controls';

export interface GalleryPreviewData {
  readonly banner: {
    readonly title: string;
    readonly subtitle: string;
    readonly imageUrl: string;
    readonly imageAlt: string;
  };
  readonly intro: {
    readonly eyebrow: string;
    readonly title: string;
    readonly paragraphs: readonly string[];
    readonly note: string;
  };
  readonly controls: {
    readonly filterLabel: string;
    readonly emptyTitle: string;
    readonly emptyMessage: string;
    readonly resetLabel: string;
    readonly placeholderLabel: string;
  };
}

/**
 * Read-only miniature of the public Gallery page. Each instance renders one
 * section so the editor can place a live preview above that section's fields.
 */
@Component({
  selector: 'app-gallery-preview',
  imports: [UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery-preview.html',
  styleUrl: './gallery-preview.scss',
})
export class GalleryPreview {
  readonly section = input.required<GalleryPreviewSection>();
  readonly data = input.required<GalleryPreviewData>();
}
