import { ANNOUNCEMENTS_CONTENT } from './announcements.seed';
import { ABOUT_CONTENT } from './about.seed';
import { ACADEMICS_CONTENT } from './academics.seed';
import { ADMISSIONS_CONTENT } from './admissions.seed';
import { CONTACT_CONTENT } from './contact.seed';
import { FACILITIES_CONTENT } from './facilities.seed';
import { GALLERY_CONTENT } from './gallery.seed';
import { SCHOOL_LIFE_CONTENT } from './school-life.seed';
import { HOME_CONTENT } from './site.seed';

export interface MainPageSeed {
  readonly slug: string;
  readonly title: string;
  readonly content: unknown;
}

/**
 * Top-level public pages whose copy is stored in the page_contents table.
 * Their structured seed objects are used as the default and as the starting
 * point for the admin JSON editor.
 */
export const MAIN_PAGES: readonly MainPageSeed[] = [
  { slug: 'home', title: 'Home', content: HOME_CONTENT },
  { slug: 'about', title: 'About Us', content: ABOUT_CONTENT },
  { slug: 'academics', title: 'Academics', content: ACADEMICS_CONTENT },
  { slug: 'admissions', title: 'Admissions', content: ADMISSIONS_CONTENT },
  { slug: 'contact', title: 'Contact Us', content: CONTACT_CONTENT },
  { slug: 'facilities', title: 'Facilities', content: FACILITIES_CONTENT },
  { slug: 'school-life', title: 'School Life', content: SCHOOL_LIFE_CONTENT },
  { slug: 'gallery', title: 'Gallery', content: GALLERY_CONTENT },
  { slug: 'announcements', title: 'Announcements', content: ANNOUNCEMENTS_CONTENT },
];

export const MAIN_PAGE_SLUGS: ReadonlySet<string> = new Set(MAIN_PAGES.map((page) => page.slug));

export function mainPageSeed(slug: string): MainPageSeed | undefined {
  return MAIN_PAGES.find((page) => page.slug === slug);
}
