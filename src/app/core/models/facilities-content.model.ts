import type { Facility } from './facility.model';

export interface FacilitiesBanner {
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
}

export interface FacilitiesIntro {
  readonly eyebrow: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  /** Disclosure for placeholder imagery, editable until school photographs arrive. */
  readonly note: string;
}

export interface FacilitiesContent {
  readonly banner: FacilitiesBanner;
  readonly intro: FacilitiesIntro;
  readonly gridEyebrow: string;
  readonly gridHeading: string;
  readonly detailsHeading: string;
  readonly additionalHeading: string;
  /** Rendered only when entries exist; empty until the school confirms more facilities. */
  readonly additional: readonly Facility[];
}
