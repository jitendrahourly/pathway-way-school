import type { AboutContent } from '../models/about-content.model';
import { mergeWithSeed } from './seed-merge';

/**
 * About page content. Only facts from the supplied school references are used;
 * nothing about awards, results or statistics is invented.
 * Phase 4 replaces this with a Supabase read of the About page record.
 */
export const ABOUT_CONTENT: AboutContent = {
  contentVersion: 2,
  banner: {
    title: 'About Bright Way School',
    subtitle: 'Education That Builds a Brighter Future',
    imageUrl: '/images/home/hero-campus.jpg',
    imageAlt: 'Bright Way School campus building',
  },
  story: {
    eyebrow: 'Welcome',
    title: 'Education That Builds a Brighter Future',
    paragraphs: [
      'Welcome to Bright Way School, an educational institution established in 1981 and managed by Banashankari Vidya Samsthe. Located in Bengaluru, Karnataka, our school is committed to providing students with an educational environment that encourages learning, personal growth, discipline, and positive values.',
      'We believe that education plays an important role in shaping the future of every child. Our approach focuses not only on academic learning but also on developing confidence, creativity, responsibility, and respect for others.',
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
    {
      icon: 'heart',
      title: 'Our Values',
      text: 'Discipline, honesty, respect, responsibility and care for others.',
    },
  ],
  photo: {
    url: '/images/home/about-students.jpg',
    alt: 'Students and teachers together on campus',
  },
  sections: [
    {
      id: 'who-we-are',
      title: 'Who We Are',
      paragraphs: [
        'Bright Way School has been serving the educational community since 1981. Over the years, the institution has continued its commitment to education and the overall development of students.',
        'Managed by Banashankari Vidya Samsthe, the school aims to create a learning environment where students are encouraged to explore their abilities, develop essential skills, and build a strong foundation for their future.',
      ],
    },
    {
      id: 'approach',
      title: 'Our Approach to Education',
      paragraphs: [
        'We believe that every student has unique abilities, interests, and potential. Education should provide opportunities for children to discover these strengths and develop them through meaningful learning experiences.',
        'Our educational approach emphasizes:',
        '• Building strong academic foundations.',
        '• Encouraging curiosity and independent thinking.',
        '• Developing discipline and positive behaviour.',
        '• Promoting creativity and communication skills.',
        '• Encouraging teamwork and social responsibility.',
        '• Supporting the overall development of every student.',
      ],
    },
    {
      id: 'what-makes-us-special',
      title: 'What Makes Our School Special',
      paragraphs: [
        'A Legacy of Education: Established in 1981, Bright Way School has a long-standing commitment to education.',
        'Value-Based Learning: We emphasize discipline, honesty, respect, and responsibility alongside academic development.',
        'Holistic Development: We recognize the importance of academic, personal, social, and creative development.',
        'Student-Centred Approach: We believe in encouraging students to participate, explore, learn, and grow.',
      ],
    },
    {
      id: 'commitment',
      title: 'Our Commitment',
      paragraphs: [
        'At Bright Way School, we understand that every child deserves opportunities to learn and develop. We strive to support students in building knowledge, confidence, good character, and the skills needed to face future challenges.',
        "We also recognize the important role parents and teachers play in a child's educational journey. Through cooperation and shared responsibility, we aim to create a supportive learning community.",
      ],
    },
    {
      id: 'explore',
      title: 'Explore Bright Way School',
      paragraphs: [
        'Discover more about our educational philosophy, leadership, and journey.',
        'Our School – Learn about our institution and learning environment.',
        'Vision & Mission – Understand our educational goals and values.',
        'Management – Know about the organization responsible for our institution.',
        'History & Legacy – Explore our journey since 1981.',
      ],
    },
  ],
};

/**
 * Older rows were saved before the expanded About copy existed. Rows without
 * the current version fall back to the seed; rows saved afterwards keep their
 * edited values and merge over the seed shape.
 */
export function resolveAboutContent(saved: unknown): AboutContent {
  const version =
    saved && typeof saved === 'object'
      ? (saved as { contentVersion?: unknown }).contentVersion
      : undefined;
  if (version !== ABOUT_CONTENT.contentVersion) {
    return ABOUT_CONTENT;
  }
  return mergeWithSeed(ABOUT_CONTENT, saved);
}
