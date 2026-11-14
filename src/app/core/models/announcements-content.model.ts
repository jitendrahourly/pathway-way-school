export interface AnnouncementsBanner {
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
}

export interface AnnouncementsIntro {
  readonly eyebrow: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export interface AnnouncementsEmpty {
  readonly title: string;
  readonly message: string;
  readonly contactNote: string;
}

export interface AnnouncementsDetailCopy {
  readonly backLabel: string;
  readonly unavailableTitle: string;
  readonly unavailableMessage: string;
  readonly unavailableLinkLabel: string;
  readonly fallbackBannerSubtitle: string;
}

export interface AnnouncementsContent {
  readonly banner: AnnouncementsBanner;
  readonly intro: AnnouncementsIntro;
  readonly listHeading: string;
  readonly filterLabel: string;
  readonly empty: AnnouncementsEmpty;
  readonly detail: AnnouncementsDetailCopy;
}
