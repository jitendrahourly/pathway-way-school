import type { Facility } from './facility.model';
import type { IconName } from '../../shared/components/ui-icon/ui-icon';

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

/** One compact statistic shown in the strip beneath the intro on the facilities page. */
export interface FacilitiesStat {
  readonly value: string;
  readonly label: string;
}

/** One quick-navigation pill linking to an individual facility sub-page. */
export interface FacilitiesNavLink {
  readonly label: string;
  readonly href: string;
  /** UiIcon name shown before the label. */
  readonly icon: IconName;
}

/** Bottom call-to-action encouraging campus visits and admissions enquiries. */
export interface FacilitiesCta {
  readonly badge: string;
  readonly title: string;
  readonly text: string;
  readonly primaryLabel: string;
  readonly primaryHref: string;
  readonly secondaryLabel: string;
  readonly secondaryHref: string;
}

export interface FacilitiesContent {
  readonly banner: FacilitiesBanner;
  readonly intro: FacilitiesIntro;
  /** Statistics strip shown directly below the intro. */
  readonly stats: readonly FacilitiesStat[];
  /** Introductory label for the quick-navigation pill row. */
  readonly exploreLabel: string;
  /** Quick-navigation pills linking to individual facility sub-pages. */
  readonly exploreLinks: readonly FacilitiesNavLink[];
  readonly gridEyebrow: string;
  readonly gridHeading: string;
  readonly detailsHeading: string;
  readonly additionalHeading: string;
  readonly cta: FacilitiesCta;
  /** Rendered only when entries exist; empty until the school confirms more facilities. */
  readonly additional: readonly Facility[];
}
