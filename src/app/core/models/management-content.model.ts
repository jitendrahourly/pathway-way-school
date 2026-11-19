import type { IconName } from '../../shared/components/ui-icon/ui-icon';

export interface ManagementBanner {
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
}

export interface ManagementPrincipal {
  readonly name: string;
  readonly role: string;
  readonly message: string;
  readonly messageSecondary: string;
  readonly imageUrl: string;
}

export interface ManagementFact {
  readonly icon: IconName;
  readonly label: string;
  readonly value: string;
}

export interface ManagementFaculty {
  readonly name: string;
  readonly role: string;
  readonly subject: string;
  readonly qualification: string;
  readonly experience: string;
  readonly imageUrl?: string;
}

export interface ManagementContent {
  readonly banner: ManagementBanner;
  readonly paragraphs: readonly string[];
  readonly principal: ManagementPrincipal;
  readonly facts: readonly ManagementFact[];
  readonly facultyIntro: string;
  readonly faculty: readonly ManagementFaculty[];
  readonly facultyNote: string;
}
