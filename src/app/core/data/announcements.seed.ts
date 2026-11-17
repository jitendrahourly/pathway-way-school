import type { AnnouncementsContent } from '../models/announcements-content.model';

/**
 * Announcements page copy. The notices themselves come from the announcements
 * store and only published, confirmed entries are ever public.
 * Phase 4 replaces the seed with a Supabase read of the page record.
 */
export const ANNOUNCEMENTS_CONTENT: AnnouncementsContent = {
  banner: {
    title: 'Announcements',
    subtitle: 'Notices and updates from the school office',
    imageUrl: '/images/gallery/gallery-02.jpg',
    imageAlt: 'Students learning together in a classroom',
  },
  intro: {
    eyebrow: 'Notice board',
    title: 'Latest Announcements',
    paragraphs: [
      'Official notices from the school office are published here once they are confirmed, including admissions, holidays, events and general information for parents.',
      'Check this page for admission updates, holiday notices, school events and other important information.',
    ],
  },
  listHeading: 'Published Notices',
  filterLabel: 'Filter announcements by category',
  empty: {
    title: 'No announcements published yet',
    message:
      'There are no confirmed notices to display right now. This page is not showing sample content: every notice is published only after the school office confirms it.',
    contactNote: 'For current information, please contact the school office.',
  },
  detail: {
    backLabel: 'Back to Announcements',
    unavailableTitle: 'This announcement is unavailable',
    unavailableMessage:
      'The notice you are looking for has not been published, or is no longer available. Please check the announcements page for current notices.',
    unavailableLinkLabel: 'View all announcements',
    fallbackBannerSubtitle: 'Notices and updates from the school office',
  },
};
