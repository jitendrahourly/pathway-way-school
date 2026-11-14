import type { IconName } from '../../shared/components/ui-icon/ui-icon';

export interface HomeHighlight {
  readonly icon: IconName;
  readonly title: string;
  readonly description: string;
}

export interface HomeHero {
  readonly eyebrow: string;
  readonly titleLead: string;
  readonly titleAccent: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly imagePosition: string;
}

export interface HomeAbout {
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly badge: string;
}

export interface HomeContent {
  readonly hero: HomeHero;
  readonly highlights: readonly HomeHighlight[];
  readonly about: HomeAbout;
  readonly facilitiesIntro: string;
  readonly galleryIntro: string;
  readonly announcementsIntro: string;
}
