import type { ContactContent } from '../models/contact-content.model';

/**
 * Contact page copy. Confirmed school facts (phone, email, address, Instagram,
 * map URL) come from site settings; this seed holds only page-specific copy.
 * Phase 4 replaces the seed with a Supabase read of the page record.
 */
export const CONTACT_CONTENT: ContactContent = {
  banner: {
    title: 'Contact Us',
    subtitle: 'Get in touch with Bright Way School',
    imageUrl: '/images/home/hero-campus.jpg',
    imageAlt: 'Bright Way School campus building',
  },
  intro: {
    eyebrow: 'Contact Us',
    title: 'We would love to hear from you',
    paragraphs: [
      'Whether you have a question about admissions, academics, facilities or daily school life, the school office is happy to help.',
      'Use the details below to reach us by phone, email or in person. For admission enquiries, please see the Admissions page.',
    ],
  },
  directions: {
    title: 'Directions',
    intro: 'The school is located in Subramanyapura, Bengaluru.',
    steps: [
      'Address: No. 105, 12th Main, Opp. BHCS Layout, Subramanyapura Post, Bangalore - 560061.',
      'Use the map above to plan your route to the school.',
      'For landmark-based directions, contact the school office.',
    ],
  },
  instagram: {
    title: 'Follow Us on Instagram',
    text: 'Stay updated with our latest events, activities and school life.',
  },
  schoolDetails: {
    title: 'School Details',
    lines: [
      'Bright Way School',
      'Managed by Banashankari Vidya Samsthe',
      'Recognised by Govt. of Karnataka',
      'Established 1981',
      'Bangalore - 560061',
    ],
  },
};
