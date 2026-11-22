export interface Facility {
  readonly id: string;
  readonly title: string;
  /** Short description shown on the facility card. */
  readonly description: string;
  /** Longer description shown in the detail view. */
  readonly detailedDescription?: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  /** Optional short photo caption shown beneath the image on the facilities page. */
  readonly caption?: string;
  /** Optional key features shown as bullet highlights on the facilities page. */
  readonly highlights?: readonly string[];
  /** Optional sub-page target for the "Explore … in detail" link. */
  readonly subpageUrl?: string;
  /** Optional call-to-action button label. */
  readonly buttonLabel?: string;
  /** Optional call-to-action button link. */
  readonly buttonLink?: string;
  readonly displayOrder: number;
  readonly isActive: boolean;
}
