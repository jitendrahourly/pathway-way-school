import type { Announcement } from '../models/announcement.model';
import type { Facility } from '../models/facility.model';
import type { GalleryItem } from '../models/gallery-item.model';
import type { HomeContent } from '../models/home-content.model';
import type { SiteSettings } from '../models/site-settings.model';

/**
 * Seed content. Every value below comes from the supplied school references
 * (website specification and UI mockup) or is left generic on purpose.
 * Phase 4 replaces these constants with Supabase reads; the templates do not change.
 */

export const SITE_SETTINGS: SiteSettings = {
  schoolName: 'Bright Way School',
  managementName: 'Banashankari Vidya Samsthe',
  tagline: 'Building Knowledge, Character and a Brighter Future',
  establishedYear: 1981,
  recognition: 'Recognised by Govt. of Karnataka',
  phone: '080-26396720',
  email: 'brightways.school@yahoo.in',
  address:
    'No. 105, 12th Main, Opp. BHCS Layout, Subramanyapura Post, Bangalore - 560061',
  instagramHandle: '@bright_way_school_bhcs',
  instagramUrl: 'https://www.instagram.com/bright_way_school_bhcs/',
  mapsUrl:
    'https://www.google.com/maps?q=No.+105,+12th+Main,+Opp.+BHCS+Layout,+Subramanyapura+Post,+Bangalore+-+560061&output=embed',
  footerDescription:
    'A recognised educational institution in Bengaluru, Karnataka, managed by Banashankari Vidya Samsthe and committed to the overall development of every student since 1981.',
};

export const HOME_CONTENT: HomeContent = {
  hero: {
    eyebrow: 'Banashankari Vidya Samsthe · Estd. 1981',
    titleLead: 'Welcome to',
    titleAccent: 'Bright Way School',
    subtitle: 'Building Knowledge, Character and a Brighter Future.',
    imageUrl: '/images/home/hero-campus.jpg',
    imageAlt: 'Bright Way School campus building',
    imagePosition: '18% 62%',
  },
  highlights: [
    {
      icon: 'graduation-cap',
      title: 'Quality Education',
      description: 'Holistic learning for every child',
    },
    {
      icon: 'users',
      title: 'Experienced Faculty',
      description: 'Dedicated and caring teachers',
    },
    {
      icon: 'trophy',
      title: 'Co-curricular Activities',
      description: 'Sports, arts and cultural events',
    },
    {
      icon: 'heart',
      title: 'Value Based Learning',
      description: 'Discipline, ethics and leadership',
    },
  ],
  about: {
    eyebrow: 'About Us',
    title: 'About Bright Way School',
    body: 'Bright Way School, managed by Banashankari Vidya Samsthe, is a recognised educational institution in Bengaluru, Karnataka. Established in 1981, the school is committed to providing quality education and supporting the overall development of students.',
    imageUrl: '/images/home/about-students.jpg',
    imageAlt: 'Students and teachers of the school together on campus',
    badge: 'Estd. 1981',
  },
  facilitiesIntro:
    'Purpose-built spaces that support learning, exploration and everyday school life.',
  galleryIntro: 'Moments from classrooms, celebrations, sports and campus life.',
  announcementsIntro: 'Notices and updates from the school office.',
};

export const FACILITIES: readonly Facility[] = [
  {
    id: 'library',
    title: 'Library',
    description: 'A quiet space for reading, reference and research.',
    imageUrl: '/images/facilities/library.jpg',
    imageAlt: 'Teacher reading with students in the school library',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'science-laboratory',
    title: 'Science Lab',
    description: 'Hands-on experiments that bring science to life.',
    imageUrl: '/images/facilities/science-lab.jpg',
    imageAlt: 'Science laboratory with workstations and apparatus',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'computer-laboratory',
    title: 'Computer Lab',
    description: 'Practical digital skills for a technology-driven world.',
    imageUrl: '/images/facilities/computer-lab.jpg',
    imageAlt: 'Students working at computers in the computer laboratory',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'playground',
    title: 'Playground',
    description: 'Open space for sport, fitness and team spirit.',
    imageUrl: '/images/facilities/playground.jpg',
    imageAlt: 'Shaded school playground with play equipment',
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'classrooms',
    title: 'Classrooms',
    description: 'Spaces for daily teaching and learning across the school.',
    imageUrl: '/images/gallery/gallery-02.jpg',
    imageAlt: 'Students learning together in a classroom',
    displayOrder: 5,
    isActive: true,
  },
];

export const GALLERY_IMAGES: readonly GalleryItem[] = [
  {
    id: 'sports-day',
    title: 'Sports Day',
    description: 'Students on parade during the annual sports meet.',
    imageUrl: '/images/gallery/gallery-01.jpg',
    imageAlt: 'Students in uniform on parade at the school sports day',
    category: 'sports',
    displayOrder: 1,
    isActive: true,
    isPlaceholder: true,
  },
  {
    id: 'classroom-learning',
    title: 'Classroom Learning',
    description: 'A day in the life of a primary classroom.',
    imageUrl: '/images/gallery/gallery-02.jpg',
    imageAlt: 'Children learning together in a classroom',
    category: 'classroom',
    displayOrder: 2,
    isActive: true,
    isPlaceholder: true,
  },
  {
    id: 'morning-assembly',
    title: 'Morning Assembly',
    description: 'The school gathers to begin the day together.',
    imageUrl: '/images/gallery/gallery-03.jpg',
    imageAlt: 'Students seated together at the morning assembly',
    category: 'school-activities',
    displayOrder: 3,
    isActive: true,
    isPlaceholder: true,
  },
  {
    id: 'science-practical',
    title: 'Science Practical',
    description: 'Learning through observation and experiment.',
    imageUrl: '/images/gallery/gallery-04.jpg',
    imageAlt: 'Microscopes set up for a science practical',
    category: 'classroom',
    displayOrder: 4,
    isActive: true,
    isPlaceholder: true,
  },
  {
    id: 'reading-time',
    title: 'Reading Time',
    description: 'A teacher shares a storybook with a group of students.',
    imageUrl: '/images/facilities/library.jpg',
    imageAlt: 'Teacher reading a storybook to students in the library',
    category: 'school-activities',
    displayOrder: 5,
    isActive: true,
    isPlaceholder: true,
  },
  {
    id: 'campus-life',
    title: 'Campus Life',
    description: 'Students and teachers together on the school campus.',
    imageUrl: '/images/home/about-students.jpg',
    imageAlt: 'Students and teachers standing together on the school campus',
    category: 'school-activities',
    displayOrder: 6,
    isActive: true,
    isPlaceholder: true,
  },
  {
    id: 'outdoor-play',
    title: 'Outdoor Play',
    description: 'The school playground, used for games and outdoor activity.',
    imageUrl: '/images/facilities/playground.jpg',
    imageAlt: 'School playground with play equipment among trees',
    category: 'sports',
    displayOrder: 7,
    isActive: true,
    isPlaceholder: true,
  },
];

/**
 * Unconfirmed drafts only. No dates are invented and nothing here is published,
 * so the public homepage keeps its empty state until the school office confirms
 * and publishes an entry from the admin dashboard.
 */
export const ANNOUNCEMENTS: readonly Announcement[] = [
  {
    id: 'admission-2026-27',
    title: 'Admission 2026-27',
    summary:
      'Draft placeholder. Admission details for the 2026-27 academic year are awaiting confirmation from the school office.',
    category: 'admissions',
    publishedAt: null,
    isPublished: false,
    isActive: true,
    isConfirmed: false,
  },
  {
    id: 'childrens-day-holiday',
    title: "Children's Day Holiday",
    summary:
      'Draft placeholder. The holiday notice is awaiting the confirmed date from the school office.',
    category: 'holidays',
    publishedAt: null,
    isPublished: false,
    isActive: true,
    isConfirmed: false,
  },
  {
    id: 'annual-day-celebration',
    title: 'Annual Day Celebration',
    summary:
      'Draft placeholder. Annual Day details are awaiting confirmation from the school office.',
    category: 'events',
    publishedAt: null,
    isPublished: false,
    isActive: true,
    isConfirmed: false,
  },
];
