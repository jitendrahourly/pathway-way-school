import type { AnnouncementCategoryId } from '../models/announcement.model';

export interface AnnouncementCategory {
  readonly id: AnnouncementCategoryId;
  readonly label: string;
  readonly description: string;
}

export const ANNOUNCEMENT_CATEGORIES: readonly AnnouncementCategory[] = [
  {
    id: 'admissions',
    label: 'Admissions',
    description: 'Admission updates, eligibility and important dates.',
  },
  {
    id: 'holidays',
    label: 'Holidays',
    description: 'School holidays and closures announced by the office.',
  },
  {
    id: 'events',
    label: 'Events',
    description: 'School events, celebrations and activities.',
  },
  {
    id: 'general-notices',
    label: 'General Notices',
    description: 'Everyday information and notices for parents.',
  },
];

export const ANNOUNCEMENT_CATEGORY_LABELS: Record<AnnouncementCategoryId, string> = {
  admissions: 'Admissions',
  holidays: 'Holidays',
  events: 'Events',
  'general-notices': 'General Notices',
};
