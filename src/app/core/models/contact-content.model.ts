export interface ContactBanner {
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
}

export interface ContactIntro {
  readonly eyebrow: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export interface ContactDirections {
  readonly title: string;
  readonly intro: string;
  readonly steps: readonly string[];
}

export interface ContactInstagram {
  readonly title: string;
  readonly text: string;
}

export interface ContactSchoolDetails {
  readonly title: string;
  readonly lines: readonly string[];
}

export interface ContactContent {
  readonly banner: ContactBanner;
  readonly intro: ContactIntro;
  readonly directions: ContactDirections;
  readonly instagram: ContactInstagram;
  readonly schoolDetails: ContactSchoolDetails;
}
