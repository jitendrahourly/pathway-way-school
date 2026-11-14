export interface NavItem {
  readonly label: string;
  readonly path: string;
}

export const PUBLIC_NAV: readonly NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Academics', path: '/academics' },
  { label: 'Facilities', path: '/facilities' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Announcements', path: '/announcements' },
  { label: 'Admissions', path: '/admissions' },
  { label: 'Contact Us', path: '/contact' },
];

export const FOOTER_LINKS: readonly NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Academics', path: '/academics' },
  { label: 'Facilities', path: '/facilities' },
  { label: 'Admissions', path: '/admissions' },
  { label: 'Contact Us', path: '/contact' },
];
