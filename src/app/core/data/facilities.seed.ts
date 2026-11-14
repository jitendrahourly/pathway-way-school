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
      'Bright Way School provides spaces that support learning, reading, practical work, sport and play across the school day.',
    ],
    note: 'Photographs on this page are representative placeholders and will be replaced with photographs of the school.',
  },
  gridEyebrow: 'At a glance',
  gridHeading: 'Facilities at a Glance',
  detailsHeading: 'Facility Details',
  additionalHeading: 'Additional Facilities',
  additional: [],
};
