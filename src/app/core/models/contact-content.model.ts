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

export interface ContactCardsCopy {
  readonly phoneTitle: string;
  readonly emailTitle: string;
  readonly addressTitle: string;
  readonly callLabel: string;
  readonly emailActionLabel: string;
  readonly mapActionLabel: string;
}

export interface ContactMapCopy {
  readonly title: string;
  readonly intro: string;
  readonly emptyMessage: string;
}

export interface ContactInstagram {
  readonly eyebrow: string;
  readonly title: string;
  readonly text: string;
  readonly buttonLabel: string;
}

export interface ContactSchoolDetails {
  readonly title: string;
  readonly lines: readonly string[];
}

export interface ContactOfficeHours {
  readonly title: string;
  readonly lines: readonly string[];
}

export interface ContactFormCopy {
  readonly eyebrow: string;
  readonly title: string;
  readonly intro: string;
  readonly nameLabel: string;
  readonly emailLabel: string;
  readonly phoneLabel: string;
  readonly subjectLabel: string;
  readonly messageLabel: string;
  readonly submitLabel: string;
  readonly successMessage: string;
  readonly errorMessage: string;
}

export interface ContactContent {
  readonly banner: ContactBanner;
  readonly intro: ContactIntro;
  readonly form: ContactFormCopy;
  readonly officeHours: ContactOfficeHours;
  readonly cards: ContactCardsCopy;
  readonly map: ContactMapCopy;
  readonly directions: ContactDirections;
  readonly instagram: ContactInstagram;
  readonly schoolDetails: ContactSchoolDetails;
}
