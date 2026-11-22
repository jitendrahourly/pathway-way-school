import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiIcon, type IconName } from '../../../shared/components/ui-icon/ui-icon';

export type AcademicsPreviewSection =
  | 'banner'
  | 'intro'
  | 'stages'
  | 'cards'
  | 'sections'
  | 'cta';

export type AcademicsAccent = 'orange' | 'purple' | 'blue' | 'green';

export interface AcademicsPreviewStat {
  readonly num: string;
  readonly label: string;
}

export interface AcademicsPreviewStage {
  readonly title: string;
  readonly tag: string;
  readonly grades: string;
  readonly ages: string;
  readonly icon: IconName;
  readonly accent: AcademicsAccent;
  readonly description: string;
  readonly highlights: readonly string[];
}

export interface AcademicsPreviewCard {
  readonly icon: IconName;
  readonly label: string;
  readonly value: string;
  readonly note: string;
  readonly status: string;
}

export interface AcademicsPreviewContentSection {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly bullets: readonly string[];
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly status: string;
  readonly note: string;
}

export interface AcademicsPreviewCta {
  readonly badge: string;
  readonly title: string;
  readonly description: string;
  readonly primaryButtonText: string;
  readonly secondaryButtonText: string;
}

export interface AcademicsPreviewData {
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
    readonly imageUrl: string;
    readonly imageAlt: string;
    readonly badge: string;
    readonly quickStats: readonly AcademicsPreviewStat[];
  };
  readonly stagesHeading: {
    readonly eyebrow: string;
    readonly title: string;
    readonly subtitle: string;
  };
  readonly stages: readonly AcademicsPreviewStage[];
  readonly cards: readonly AcademicsPreviewCard[];
  readonly sections: readonly AcademicsPreviewContentSection[];
  readonly cta: AcademicsPreviewCta;
}

/**
 * Read-only miniature of the public Academics page. Each instance renders one
 * section so the editor can place a live preview above that section's fields.
 */
@Component({
  selector: 'app-academics-preview',
  imports: [UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './academics-preview.html',
  styleUrl: './academics-preview.scss',
})
export class AcademicsPreview {
  readonly section = input.required<AcademicsPreviewSection>();
  readonly data = input.required<AcademicsPreviewData>();
}
