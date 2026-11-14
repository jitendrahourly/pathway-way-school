export type AnnouncementCategoryId = 'admissions' | 'holidays' | 'events' | 'general-notices';

export interface Announcement {
  readonly id: string;
  readonly title: string;
  /** Short excerpt shown on cards. */
  readonly summary: string;
  /** Full text shown on the detail page; falls back to the summary. */
  readonly description?: string;
  readonly category: AnnouncementCategoryId;
  /** ISO date (yyyy-mm-dd) once the school confirms the announcement. */
  readonly publishedAt: string | null;
  readonly imageUrl?: string;
  readonly imageAlt?: string;
  readonly isPublished: boolean;
  readonly isActive: boolean;
  /** False while the entry is an unconfirmed placeholder drafted by the school office. */
  readonly isConfirmed: boolean;
}
