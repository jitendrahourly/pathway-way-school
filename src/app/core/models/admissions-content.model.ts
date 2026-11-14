export interface AdmissionsBanner {
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
}

export interface AdmissionsIntro {
  readonly eyebrow: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly note: string;
}

export interface AdmissionsSection {
  readonly id: string;
  readonly title: string;
  readonly message: string;
}

export interface AdmissionsContact {
  readonly title: string;
  readonly intro: string;
  readonly note: string;
}

export interface AdmissionsContent {
  readonly banner: AdmissionsBanner;
  readonly intro: AdmissionsIntro;
  readonly sections: readonly AdmissionsSection[];
  readonly contact: AdmissionsContact;
}
