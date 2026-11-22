import type { IconName } from '../../shared/components/ui-icon/ui-icon';

export type AcademicsStatus = 'confirmed' | 'pending';

export interface AcademicsBanner {
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
}

export interface AcademicsStatPill {
  readonly num: string;
  readonly label: string;
}

export interface AcademicsIntro {
  readonly eyebrow: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly quickStats?: readonly AcademicsStatPill[];
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly badge?: string;
}

export interface AcademicStage {
  readonly title: string;
  readonly stage?: string;
  readonly grades: string;
  readonly ages: string;
  readonly path: string;
  readonly icon: IconName;
  readonly tag: string;
  readonly description: string;
  readonly highlights: readonly string[];
  readonly accent: string;
}

export interface AcademicsStagesHeading {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
}

export interface AcademicsGlanceHeading {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
}

export interface AcademicsCard {
  readonly icon: IconName;
  readonly label: string;
  readonly value: string;
  readonly note: string;
  readonly status: AcademicsStatus;
}

export interface AcademicsSection {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly bullets?: readonly string[];
  readonly imageUrl?: string;
  readonly imageAlt?: string;
  readonly status: AcademicsStatus;
  /** Shown as a callout when the section is still awaiting school confirmation. */
  readonly note?: string;
}

export interface AcademicsCta {
  readonly badge: string;
  readonly title: string;
  readonly description: string;
  readonly primaryButtonText: string;
  readonly primaryButtonLink: string;
  readonly secondaryButtonText: string;
  readonly secondaryButtonLink: string;
}

export interface AcademicsContent {
  readonly banner: AcademicsBanner;
  readonly intro: AcademicsIntro;
  readonly stagesHeading?: AcademicsStagesHeading;
  readonly stages?: readonly AcademicStage[];
  readonly glanceHeading?: AcademicsGlanceHeading;
  readonly cards: readonly AcademicsCard[];
  readonly sections: readonly AcademicsSection[];
  readonly cta?: AcademicsCta;
}
