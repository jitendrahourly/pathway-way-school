import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiIcon, type IconName } from '../../../shared/components/ui-icon/ui-icon';

export type SchoolLifePreviewSection = 'banner' | 'stats' | 'intro' | 'cards' | 'cta';

export interface SchoolLifePreviewStat {
  readonly value: string;
  readonly label: string;
}

export interface SchoolLifePreviewCard {
  readonly id: string;
  readonly title: string;
  readonly tag: string;
  readonly icon: IconName;
  readonly text: string;
  readonly highlights: readonly string[];
}

export interface SchoolLifePreviewCta {
  readonly eyebrow: string;
  readonly title: string;
  readonly text: string;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
}

export interface SchoolLifePreviewData {
  readonly banner: {
    readonly title: string;
    readonly subtitle: string;
    readonly imageUrl: string;
    readonly imageAlt: string;
  };
  readonly stats: readonly SchoolLifePreviewStat[];
  readonly intro: {
    readonly eyebrow: string;
    readonly title: string;
    readonly paragraphs: readonly string[];
  };
  readonly cards: readonly SchoolLifePreviewCard[];
  readonly cta: SchoolLifePreviewCta;
}

/**
 * Read-only miniature of the public School Life page. Each instance renders
 * one section so the editor can place a live preview above its fields.
 */
@Component({
  selector: 'app-school-life-preview',
  imports: [UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './school-life-preview.html',
  styleUrl: './school-life-preview.scss',
})
export class SchoolLifePreview {
  readonly section = input.required<SchoolLifePreviewSection>();
  readonly data = input.required<SchoolLifePreviewData>();
}
