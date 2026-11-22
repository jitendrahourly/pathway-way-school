export type PageContentGroup =
  | 'Main Pages'
  | 'About'
  | 'Academics'
  | 'Events & School Life'
  | 'School Life'
  | 'Facilities'
  | 'Admissions'
  | 'Other';

export interface PageContentPreview {
  readonly group: PageContentGroup;
  readonly previewUrl: string;
}

export const PAGE_CONTENT_GROUPS: readonly PageContentGroup[] = [
  'Main Pages',
  'About',
  'Academics',
  'Events & School Life',
  'School Life',
  'Facilities',
  'Admissions',
  'Other',
];

/**
 * Public route for each page whose content is stored in page_contents.
 * The admin list uses this for grouping and the Preview action.
 */
export const PAGE_CONTENT_PREVIEWS: Record<string, PageContentPreview> = {
  home: { group: 'Main Pages', previewUrl: '/' },
  about: { group: 'Main Pages', previewUrl: '/about' },
  academics: { group: 'Main Pages', previewUrl: '/academics' },
  admissions: { group: 'Main Pages', previewUrl: '/admissions' },
  contact: { group: 'Main Pages', previewUrl: '/contact' },
  facilities: { group: 'Main Pages', previewUrl: '/facilities' },
  gallery: { group: 'Main Pages', previewUrl: '/gallery' },
  announcements: { group: 'Main Pages', previewUrl: '/announcements' },
  'school-life': { group: 'Main Pages', previewUrl: '/school-life' },

  'about-our-school': { group: 'About', previewUrl: '/about/our-school' },
  'about-management': { group: 'About', previewUrl: '/about/management' },
  'about-vision-mission': { group: 'About', previewUrl: '/about/vision-mission' },
  'about-history': { group: 'About', previewUrl: '/about/history' },

  'academics-kindergarten': { group: 'Academics', previewUrl: '/academics/kindergarten' },
  'academics-primary': { group: 'Academics', previewUrl: '/academics/primary-school' },
  'academics-middle': { group: 'Academics', previewUrl: '/academics/middle-school' },
  'academics-high': { group: 'Academics', previewUrl: '/academics/high-school' },

  'school-life-events': { group: 'Events & School Life', previewUrl: '/school-life/events' },
  'school-life-student-activities': {
    group: 'Events & School Life',
    previewUrl: '/school-life/student-activities',
  },
  'school-life-sports': { group: 'Events & School Life', previewUrl: '/school-life/sports' },
  'school-life-arts-culture': {
    group: 'Events & School Life',
    previewUrl: '/school-life/arts-culture',
  },
  'school-life-clubs': { group: 'Events & School Life', previewUrl: '/school-life/clubs' },
  'school-life-achievements': {
    group: 'Events & School Life',
    previewUrl: '/school-life/achievements',
  },

  'facilities-classrooms': { group: 'Facilities', previewUrl: '/facilities/classrooms' },
  'facilities-library': { group: 'Facilities', previewUrl: '/facilities/library' },
  'facilities-computer-lab': {
    group: 'Facilities',
    previewUrl: '/facilities/computer-lab',
  },
  'facilities-sports': { group: 'Facilities', previewUrl: '/facilities/sports' },
  'facilities-other': { group: 'Facilities', previewUrl: '/facilities/other' },

  'admissions-process': { group: 'Admissions', previewUrl: '/admissions/process' },
  'admissions-required-documents': {
    group: 'Admissions',
    previewUrl: '/admissions/required-documents',
  },
  'admissions-enquiry': { group: 'Admissions', previewUrl: '/admissions/enquiry' },
  'admissions-faqs': { group: 'Admissions', previewUrl: '/admissions/faqs' },
};

export function pageContentPreview(slug: string): PageContentPreview | undefined {
  return PAGE_CONTENT_PREVIEWS[slug];
}

/** True when a public page is opened from the admin Preview action. */
export function isPagePreviewMode(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('preview') === '1';
}
