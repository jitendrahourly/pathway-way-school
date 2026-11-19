import type { IconName } from '../../shared/components/ui-icon/ui-icon';

export interface AboutBanner {
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
}

export interface AboutStory {
  readonly eyebrow: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export interface AboutPillar {
  readonly icon: IconName;
  readonly title: string;
  readonly text: string;
}

export interface AboutSection {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export interface AboutContent {
  /** Bumped when the default About copy changes so older saved rows can be refreshed. */
  readonly contentVersion: number;
  readonly banner: AboutBanner;
  readonly story: AboutStory;
  readonly pillars: readonly AboutPillar[];
  readonly photo: { readonly url: string; readonly alt: string };
  readonly sections: readonly AboutSection[];
}
