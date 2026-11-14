export interface GalleryBanner {
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
}

export interface GalleryIntro {
  readonly eyebrow: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  /** Disclosure for placeholder imagery, editable until school photographs arrive. */
  readonly note: string;
}

export interface GalleryContent {
  readonly banner: GalleryBanner;
  readonly intro: GalleryIntro;
  readonly filterLabel: string;
  readonly emptyTitle: string;
  readonly emptyMessage: string;
  readonly resetLabel: string;
  readonly placeholderLabel: string;
}
