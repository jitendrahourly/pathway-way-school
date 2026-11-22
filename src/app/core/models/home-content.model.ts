import type { IconName } from '../../shared/components/ui-icon/ui-icon';

/** One gallery photograph on the home page. Older records may still be URLs. */
export interface HomeGalleryImage {
  readonly url: string;
  readonly alt: string;
  readonly caption: string;
}

export type HomeGalleryEntry = HomeGalleryImage | string;

/** Head copy for a home section: eyebrow, heading, intro and its link. */
export interface HomeHeading {
  readonly eyebrow: string;
  readonly title: string;
  readonly text: string;
  readonly linkLabel: string;
  readonly linkUrl: string;
}

/** Latest announcements / updates section, including its gallery sidebar. */
export interface HomeUpdatesHeading extends HomeHeading {
  readonly galleryEyebrow: string;
  readonly galleryTitle: string;
  readonly galleryNote: string;
  readonly galleryLinkLabel: string;
  readonly emptyTitle: string;
  readonly emptyText: string;
  readonly emptyLinkLabel: string;
}

/** Visit us section, including its card action and empty-map message. */
export interface HomeLocationHeading extends HomeHeading {
  readonly directionsLabel: string;
  readonly cardCtaLabel: string;
  readonly cardCtaLink: string;
  readonly mapEmptyText: string;
}

export interface HomeInstagramHeading extends HomeHeading {
  readonly followLabel: string;
  readonly emptyText: string;
  readonly emptyLinkLabel: string;
}

export interface HomeFaqHeading extends HomeHeading {
  readonly contactTitle: string;
}

export interface HomeHeadings {
  readonly stats: HomeHeading;
  readonly programs: HomeHeading;
  readonly why: HomeHeading;
  readonly facilities: HomeHeading;
  readonly gallery: HomeHeading;
  readonly video: HomeHeading;
  readonly achievements: HomeHeading;
  readonly affiliations: HomeHeading;
  readonly testimonials: HomeHeading;
  readonly events: HomeHeading;
  readonly updates: HomeUpdatesHeading;
  readonly faqs: HomeFaqHeading;
  readonly location: HomeLocationHeading;
  readonly instagram: HomeInstagramHeading;
}

/** Per-section visibility switches for the public home page. */
export interface HomeVisibility {
  readonly hero: boolean;
  readonly highlights: boolean;
  readonly stats: boolean;
  readonly about: boolean;
  readonly programs: boolean;
  readonly why: boolean;
  readonly facilities: boolean;
  readonly gallery: boolean;
  readonly video: boolean;
  readonly achievements: boolean;
  readonly affiliations: boolean;
  readonly testimonials: boolean;
  readonly events: boolean;
  readonly updates: boolean;
  readonly faqs: boolean;
  readonly admissionsCta: boolean;
  readonly location: boolean;
  readonly newsletter: boolean;
  readonly instagram: boolean;
}

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
  readonly primaryLabel: string;
  readonly primaryLink: string;
  readonly secondaryLabel: string;
  readonly secondaryLink: string;
  readonly trustPrimary: string;
  readonly trustSecondary: string;
}

export interface HomeAbout {
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly badge: string;
  readonly factOneTitle: string;
  readonly factOneText: string;
  readonly factTwoTitle: string;
  readonly factTwoText: string;
  readonly primaryLabel: string;
  readonly primaryLink: string;
  readonly secondaryLabel: string;
  readonly secondaryLink: string;
}

export interface HomeStat {
  readonly value: string;
  readonly label: string;
  readonly icon: IconName;
}

export interface HomeProgram {
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
  readonly link: string;
  /** Optional card photograph. Falls back to a school photograph in the section. */
  readonly imageUrl?: string;
  /** Alt text for the card photograph. Defaults to the program title. */
  readonly imageAlt?: string;
}

export interface HomeWhyPoint {
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
}

/** Floating card shown over the Why Choose Us photograph. */
export interface HomeWhyMedia {
  readonly title: string;
  readonly text: string;
}

export interface HomeTestimonial {
  readonly name: string;
  readonly role: string;
  readonly quote: string;
  readonly imageUrl: string;
  readonly imageAlt?: string;
}

export interface HomeAchievement {
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
}

export interface HomeEvent {
  readonly title: string;
  readonly date: string;
  readonly description: string;
  readonly link: string;
  /** Optional event photograph. Falls back to a school photograph in the section. */
  readonly imageUrl?: string;
  /** Alt text for the event photograph. Defaults to the event title. */
  readonly imageAlt?: string;
}

export interface HomeAdmissionsCta {
  readonly badge: string;
  readonly title: string;
  readonly text: string;
  readonly primaryLabel: string;
  readonly primaryLink: string;
  readonly secondaryLabel: string;
  readonly secondaryLink: string;
  readonly phoneLabel: string;
  readonly mediaTitle: string;
  readonly mediaText: string;
}

export interface HomeFaq {
  readonly question: string;
  readonly answer: string;
}

export interface HomeAffiliation {
  readonly label: string;
  readonly icon: IconName;
}

export interface HomeNewsletter {
  readonly eyebrow: string;
  readonly title: string;
  readonly text: string;
  readonly placeholder: string;
  readonly buttonLabel: string;
}

export interface HomeVideoTour {
  readonly eyebrow: string;
  readonly title: string;
  readonly note: string;
  readonly url: string;
  readonly thumbnailUrl: string;
  readonly thumbnailAlt: string;
  readonly watchLabel: string;
  readonly emptyLabel: string;
}

export interface HomeAchievementsPhoto {
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly badge: string;
}

export interface HomeContent {
  readonly headings: HomeHeadings;
  readonly visibility: HomeVisibility;
  readonly hero: HomeHero;
  readonly highlights: readonly HomeHighlight[];
  readonly about: HomeAbout;
  readonly stats: readonly HomeStat[];
  readonly programs: readonly HomeProgram[];
  readonly whyChooseUs: readonly HomeWhyPoint[];
  readonly whyMedia: HomeWhyMedia;
  readonly testimonials: readonly HomeTestimonial[];
  readonly achievements: readonly HomeAchievement[];
  readonly achievementsPhoto: HomeAchievementsPhoto;
  readonly events: readonly HomeEvent[];
  readonly admissionsCta: HomeAdmissionsCta;
  readonly galleryPreview: readonly HomeGalleryEntry[];
  readonly affiliations: readonly HomeAffiliation[];
  readonly faqs: readonly HomeFaq[];
  readonly newsletter: HomeNewsletter;
  readonly videoTour: HomeVideoTour;
  readonly locationNote: string;
  readonly facilitiesIntro: string;
  readonly galleryIntro: string;
  readonly announcementsIntro: string;
  /**
   * How many facility cards the home page section renders. 0 shows every
   * published facility; a positive number caps the section to that many.
   */
  readonly facilitiesCount: number;
}
