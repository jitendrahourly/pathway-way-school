import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiIcon, type IconName } from '../../../shared/components/ui-icon/ui-icon';

export type AboutPreviewSection = 'banner' | 'story' | 'pillars' | 'photo' | 'sections';

export interface AboutPreviewPillar {
  readonly icon: IconName;
  readonly title: string;
  readonly text: string;
}

export interface AboutPreviewChapter {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export interface AboutPreviewData {
  readonly banner: {
    readonly title: string;
    readonly subtitle: string;
    readonly imageUrl: string;
    readonly imageAlt: string;
  };
  readonly story: {
    readonly eyebrow: string;
    readonly title: string;
    readonly paragraphs: readonly string[];
  };
  readonly pillars: readonly AboutPreviewPillar[];
  readonly photo: {
    readonly url: string;
    readonly alt: string;
  };
  readonly sections: readonly AboutPreviewChapter[];
}

/**
 * Read-only miniature of the public About page. Each instance renders one
 * section so the editor can place a live preview above that section's fields.
 */
@Component({
  selector: 'app-about-preview',
  imports: [UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-preview.html',
  styleUrl: './about-preview.scss',
})
export class AboutPreview {
  readonly section = input.required<AboutPreviewSection>();
  readonly data = input.required<AboutPreviewData>();
}
