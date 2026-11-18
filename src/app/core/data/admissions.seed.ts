import type { AdmissionsContent } from '../models/admissions-content.model';

/**
 * Admissions page copy. Nothing about dates, fees, eligibility, required
 * documents or the admission process is invented; every unconfirmed item is
 * marked as awaiting confirmation. Confirmed school facts come from site settings.
 * Phase 4 replaces the seed with a Supabase read of the page record.
 */
export const ADMISSIONS_CONTENT: AdmissionsContent = {
  banner: {
    title: 'Admissions',
    subtitle: 'Information on admission to Bright Way School',
    imageUrl: '/images/home/hero-campus.jpg',
    imageAlt: 'Bright Way School campus building',
  },
  intro: {
    eyebrow: 'Admissions',
    title: 'Admissions at Bright Way School',
    paragraphs: [
      'Bright Way School, managed by Banashankari Vidya Samsthe, is a recognised educational institution in Bengaluru, Karnataka, established in 1981.',
      'Admission details are published here once they are confirmed by the school office. Until then, each section below is marked as awaiting confirmation rather than showing sample information.',
    ],
    note: 'This page does not show sample admission information. Dates, fees, eligibility, required documents and the admission process are confirmed by the school office before they are published.',
  },
  sections: [
    {
      id: 'process',
      title: 'Admission Process',
      message:
        'The admission process and its steps will be published here once they are confirmed by the school office.',
    },
    {
      id: 'eligibility',
      title: 'Eligibility',
      message:
        'Eligibility criteria for each class will be published here once they are confirmed by the school office.',
    },
    {
      id: 'documents',
      title: 'Required Documents',
      message:
        'The list of documents required for admission will be published here once it is confirmed by the school office.',
    },
    {
      id: 'important',
      title: 'Important Information',
      message:
        'Admission dates, fees and other important information will be published here once they are confirmed by the school office.',
    },
    {
      id: 'fees',
      title: 'Fees',
      message:
        'The fee structure will be published here once it is confirmed by the school office.',
    },
  ],
  contact: {
    title: 'Contact for Admissions',
    intro: 'For admission enquiries, please contact the school office directly.',
    note: 'The office will share confirmed admission details, dates and fees on request.',
  },
};
