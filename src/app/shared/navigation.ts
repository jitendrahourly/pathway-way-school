export interface NavChild {
  readonly label: string;
  readonly path: string;
}

export interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly children?: readonly NavChild[];
}

export const PUBLIC_NAV: readonly NavItem[] = [
  { label: 'Home', path: '/' },
  {
    label: 'About Us',
    path: '/about',
    children: [
      { label: 'Our School', path: '/about/our-school' },
      { label: 'Vision & Mission', path: '/about/vision-mission' },
      { label: 'Management', path: '/about/management' },
      { label: 'History & Legacy', path: '/about/history' },
    ],
  },
  {
    label: 'Academics',
    path: '/academics',
    children: [
      { label: 'Kindergarten', path: '/academics/kindergarten' },
      { label: 'Primary School', path: '/academics/primary-school' },
      { label: 'Middle School', path: '/academics/middle-school' },
      { label: 'High School', path: '/academics/high-school' },
    ],
  },
  {
    label: 'School Life',
    path: '/school-life',
    children: [
      { label: 'Events & Celebrations', path: '/school-life/events' },
      { label: 'Student Activities', path: '/school-life/student-activities' },
      { label: 'Sports & Games', path: '/school-life/sports' },
      { label: 'Arts & Culture', path: '/school-life/arts-culture' },
      { label: 'Clubs & Activities', path: '/school-life/clubs' },
      { label: 'Student Achievements', path: '/school-life/achievements' },
    ],
  },
  {
    label: 'Facilities',
    path: '/facilities',
    children: [
      { label: 'Classrooms', path: '/facilities/classrooms' },
      { label: 'Library', path: '/facilities/library' },
      { label: 'Computer Lab', path: '/facilities/computer-lab' },
      { label: 'Sports Facilities', path: '/facilities/sports' },
      { label: 'Other Facilities', path: '/facilities/other' },
    ],
  },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Announcements', path: '/announcements' },
  { label: 'Contact Us', path: '/contact' },
];

export const FOOTER_LINKS: readonly NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Academics', path: '/academics' },
  { label: 'School Life', path: '/school-life' },
  { label: 'Facilities', path: '/facilities' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Announcements', path: '/announcements' },
  { label: 'Contact Us', path: '/contact' },
];