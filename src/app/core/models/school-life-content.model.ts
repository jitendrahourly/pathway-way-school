/** Copy for the School Life landing page, stored in page_contents('school-life'). */
export interface SchoolLifeBanner {
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
}

export interface SchoolLifeStat {
  readonly value: string;
  readonly label: string;
}

export interface SchoolLifeIntro {
  readonly eyebrow: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export interface SchoolLifeCard {
  /** Stable id; also selects the sub-page the card links to. */
  readonly id: string;
  readonly title: string;
  readonly tag: string;
  readonly icon: string;
  readonly text: string;
  readonly highlights: readonly string[];
}

export interface SchoolLifeCta {
  readonly eyebrow: string;
  readonly title: string;
  readonly text: string;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
}

export interface SchoolLifeContent {
  readonly banner: SchoolLifeBanner;
  readonly stats: readonly SchoolLifeStat[];
  readonly intro: SchoolLifeIntro;
  readonly cards: readonly SchoolLifeCard[];
  readonly cta: SchoolLifeCta;
}
