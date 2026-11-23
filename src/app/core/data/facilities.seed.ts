import type { FacilitiesContent } from '../models/facilities-content.model';

/**
 * Facilities page copy. The facility records themselves come from the shared
 * facility store (site.seed / Supabase `facilities` table) so the homepage and
 * this page always show the same, ordered list.
 * Phase 4 replaces the seed with a Supabase read of the page record.
 */
export const FACILITIES_CONTENT: FacilitiesContent = {
  banner: {
    title: 'Facilities',
    subtitle: 'A learning environment that inspires',
    imageUrl: '/images/facilities/playground.jpg',
    imageAlt: 'School playground with trees and play equipment',
  },
  intro: {
    eyebrow: 'Campus',
    title: 'Our Facilities',
    paragraphs: [
      'Bright Way School provides purposeful spaces that support learning, reading, scientific practicals, sport, and creative play across the school day.',
      'Our campus infrastructure is planned to support both rigorous academic development and joyful co-curricular growth in a safe, child-centred environment.',
    ],
    note: 'Campus visits and guided tours are available on all school working days by appointment through the admissions office.',
  },
  stats: [
    { value: 'K – 10', label: 'Spacious Classrooms' },
    { value: '5,000+', label: 'Library Volumes' },
    { value: '1:1', label: 'Computer Workstations' },
    { value: 'Open', label: 'Sports Grounds' },
  ],
  exploreLabel: 'Explore Facilities:',
  exploreLinks: [
    { label: 'Classrooms', href: '/facilities/classrooms', icon: 'book-open' },
    { label: 'Library', href: '/facilities/library', icon: 'book-open' },
    { label: 'Computer Lab', href: '/facilities/computer-lab', icon: 'monitor' },
    { label: 'Sports Facilities', href: '/facilities/sports', icon: 'trophy' },
    { label: 'Science & Campus', href: '/facilities/other', icon: 'flask' },
  ],
  gridEyebrow: 'At a glance',
  gridHeading: 'Facilities at a Glance',
  detailsHeading: 'Facility Details',
  additionalHeading: 'Additional Facilities',
  cta: {
    badge: 'Campus Visits & Tours',
    title: 'Experience Our Campus Firsthand',
    text: 'We invite prospective parents and students to visit Bright Way School. Walk through our well-ventilated classrooms, explore our science and computer laboratories, tour the library, and see our play areas in action.',
    primaryLabel: 'Schedule a Campus Visit',
    primaryHref: '/contact',
    secondaryLabel: 'Admissions Enquiry',
    secondaryHref: '/contact',
  },
  additional: [],
};
