import { mergeWithSeed } from './seed-merge';
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
      'Use the details below to reach us by phone, email or in person.',
    ],
  },
  form: {
    eyebrow: 'Send a message',
    title: 'How can we help?',
    intro:
      'Share your question with the school office using the form below. Please include a phone number or email address so we can reply.',
    nameLabel: 'Your name',
    emailLabel: 'Email address',
    phoneLabel: 'Phone number (optional)',
    subjectLabel: 'Subject',
    messageLabel: 'Message',
    submitLabel: 'Send message',
    successMessage:
      'Thank you. Your message has been sent to the school office.',
    errorMessage:
      'Sorry, your message could not be sent. Please try again or contact the school office directly.',
  },
  officeHours: {
    title: 'Office Hours',
    lines: [
      'The school office is available during school working days.',
      'Please call ahead before visiting the campus.',
      'For admission enquiries, please contact the school office directly.',
    ],
  },
  cards: {
    phoneTitle: 'Phone',
    emailTitle: 'Email',
    addressTitle: 'Address',
    callLabel: 'Call Now',
    emailActionLabel: 'Send Email',
    mapActionLabel: 'View on Map',
  },
  map: {
    title: 'Our Location',
    intro: 'Find us on the map below.',
    emptyMessage: 'Map link is not configured yet.',
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
    eyebrow: 'Stay connected',
    title: 'Follow Us on Instagram',
    text: 'Stay updated with our latest events, activities and school life.',
    buttonLabel: 'Follow Now',
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

/**
 * Merges a saved contact record with the seed section by section so records
 * saved before a section existed (form, officeHours, cards, map) still render
 * the whole page. Missing groups and fields fall back to the seed; saved
 * values are kept as they are, including deliberately empty strings.
 */
export function resolveContactContent(saved: unknown): ContactContent {
  return mergeWithSeed(CONTACT_CONTENT, saved);
}
