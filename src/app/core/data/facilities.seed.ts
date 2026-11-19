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
  gridEyebrow: 'At a glance',
  gridHeading: 'Facilities at a Glance',
  detailsHeading: 'Facility Details',
  additionalHeading: 'Additional Facilities',
  additional: [],
};
