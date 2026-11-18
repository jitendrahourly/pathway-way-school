import type { AboutContent } from '../models/about-content.model';

/**
 * About page content. Only facts from the supplied school references are used;
 * nothing about awards, results or statistics is invented.
 * Phase 4 replaces this with a Supabase read of the About page record.
 */
export const ABOUT_CONTENT: AboutContent = {
  banner: {
    title: 'About Us',
    subtitle: 'A legacy of quality education since 1981',
    imageUrl: '/images/home/hero-campus.jpg',
    imageAlt: 'Bright Way School campus building',
  },
  story: {
    eyebrow: 'About Us',
    title: 'Our Story',
    paragraphs: [
      'Bright Way School, managed by Banashankari Vidya Samsthe, was established in 1981 in Bengaluru, Karnataka, with a vision to provide value based and holistic education.',
      'The school is a recognised educational institution committed to supporting the overall development of every student, academically and personally.',
    ],
  },
  pillars: [
    {
      icon: 'eye',
      title: 'Our Vision',
      text: 'To nurture responsible, confident and compassionate individuals.',
    },
    {
      icon: 'target',
      title: 'Our Mission',
      text: 'To provide quality education, encourage creativity and build strong character.',
    },
  ],
  photo: {
    url: '/images/home/about-students.jpg',
    alt: 'Students and teachers together on campus',
  },
  sections: [
    {
      id: 'history',
      title: 'Our History',
      paragraphs: [
        'Bright Way School was established in 1981 in Bengaluru, Karnataka. Since its founding, the school has been managed by Banashankari Vidya Samsthe and has worked to provide value based, holistic education to its students.',
      ],
    },
    {
      id: 'management',
      title: 'Our Management',
      paragraphs: [
        'Bright Way School is managed by Banashankari Vidya Samsthe, Bengaluru, Karnataka.',
      ],
    },
    {
      id: 'philosophy',
      title: 'Educational Philosophy',
      paragraphs: [
        'Learning at Bright Way School combines classroom teaching with co-curricular activities, sport, the arts and cultural events, alongside a strong emphasis on discipline, ethics and leadership.',
      ],
    },
    {
      id: 'recognition',
      title: 'Recognition',
      paragraphs: ['Bright Way School is recognised by the Government of Karnataka.'],
    },
    {
      id: 'values',
      title: 'Our Values',
      paragraphs: [
        'Respect, responsibility and compassion guide the way students and staff work together at Bright Way School.',
        'The school encourages honesty, discipline and care for others alongside academic learning.',
      ],
    },
  ],
};
