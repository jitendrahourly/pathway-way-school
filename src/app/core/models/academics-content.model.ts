import type { IconName } from '../../shared/components/ui-icon/ui-icon';

export type AcademicsStatus = 'confirmed' | 'pending';

export interface AcademicsBanner {
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
}

export interface AcademicsIntro {
  readonly eyebrow: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly imageUrl: string;
  readonly imageAlt: string;
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

export interface AcademicsContent {
  readonly banner: AcademicsBanner;
  readonly intro: AcademicsIntro;
  readonly cards: readonly AcademicsCard[];
  readonly sections: readonly AcademicsSection[];
}
