import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiIcon, type IconName } from '../../../shared/components/ui-icon/ui-icon';

export type FacilitiesPreviewSection =
  | 'banner'
  | 'intro'
  | 'stats'
  | 'nav'
  | 'headings'
  | 'additional'
  | 'cta';

export interface FacilitiesPreviewStat {
  readonly value: string;
  readonly label: string;
}

export interface FacilitiesPreviewNavLink {
  readonly label: string;
  readonly href: string;
  readonly icon: IconName;
}

export interface FacilitiesPreviewAdditional {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly detailedDescription?: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly caption?: string;
  readonly highlights?: readonly string[];
  readonly buttonLabel?: string;
  readonly buttonLink?: string;
  readonly isActive: boolean;
}

export interface FacilitiesPreviewData {
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
  readonly stats: readonly FacilitiesPreviewStat[];
  readonly nav: {
    readonly label: string;
    readonly links: readonly FacilitiesPreviewNavLink[];
  };
  readonly headings: {
    readonly gridEyebrow: string;
    readonly gridHeading: string;
    readonly detailsHeading: string;
    readonly additionalHeading: string;
  };
  readonly cta: {
    readonly badge: string;
    readonly title: string;
    readonly text: string;
    readonly primaryLabel: string;
    readonly primaryHref: string;
    readonly secondaryLabel: string;
    readonly secondaryHref: string;
  };
  readonly additional: readonly FacilitiesPreviewAdditional[];
}

/**
 * Read-only miniature of the public Facilities page. Each instance renders one
 * section so the editor can place a live preview above that section's fields.
 */
@Component({
  selector: 'app-facilities-preview',
  imports: [UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './facilities-preview.html',
  styleUrl: './facilities-preview.scss',
})
export class FacilitiesPreview {
  readonly section = input.required<FacilitiesPreviewSection>();
  readonly data = input.required<FacilitiesPreviewData>();
}
