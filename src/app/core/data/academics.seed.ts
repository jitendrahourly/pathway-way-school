import type { AcademicsContent } from '../models/academics-content.model';

/**
 * Academics page content. Only copy supplied in the school references is used;
 * classes, curriculum and teaching practice details are marked as pending
 * because the school has not confirmed them for publication.
 * Phase 4 replaces this with a Supabase read of the Academics page record.
 */
export const ACADEMICS_CONTENT: AcademicsContent = {
  banner: {
    title: 'Academics',
    subtitle: 'A strong academic foundation for lifelong success',
    imageUrl: '/images/facilities/science-lab.jpg',
    imageAlt: 'Science laboratory at the school',
  },
  intro: {
    eyebrow: 'Academics',
    title: 'Our Academic Program',
    paragraphs: [
      'Bright Way School offers a comprehensive and balanced academic programme that focuses on academic excellence, critical thinking and overall development.',
      'As a recognised institution managed by Banashankari Vidya Samsthe, the school combines classroom learning with co-curricular activities, sport, the arts and cultural events.',
    ],
    imageUrl: '/images/gallery/gallery-02.jpg',
    imageAlt: 'Students learning together in a classroom',
  },
  cards: [
    {
      icon: 'users',
      label: 'Classes Offered',
      value: 'To be confirmed',
      note: 'The class list is awaiting confirmation from the school office.',
      status: 'pending',
    },
    {
      icon: 'book-open',
      label: 'Curriculum',
      value: 'To be confirmed',
      note: 'Board and curriculum details are awaiting confirmation.',
      status: 'pending',
    },
    {
      icon: 'target',
      label: 'Approach',
      value: 'To be confirmed',
      note: 'Teaching approach details are awaiting confirmation.',
      status: 'pending',
    },
    {
      icon: 'book-open',
      label: 'Assessment',
      value: 'To be confirmed',
      note: 'Assessment and progress reporting details are awaiting confirmation.',
      status: 'pending',
    },
  ],
  sections: [
    {
      id: 'classes',
      title: 'Classes Offered',
      paragraphs: [
        'The classes offered at Bright Way School have not been provided for publication yet.',
      ],
      status: 'pending',
      note: 'The confirmed class list will appear here once the school office publishes it.',
    },
    {
      id: 'curriculum',
      title: 'Curriculum Information',
      paragraphs: [
        'Curriculum details, including the board followed and the subject structure, are being confirmed with the school office.',
      ],
      imageUrl: '/images/facilities/library.jpg',
      imageAlt: 'Teacher reading with students in the school library',
      status: 'pending',
      note: 'Curriculum information will be added once it is confirmed.',
    },
    {
      id: 'methodology',
      title: 'Teaching Methodology',
      paragraphs: [
        "A description of the school's teaching methodology is being prepared with the school office.",
      ],
      status: 'pending',
      note: 'Teaching methodology details will be published once they are confirmed.',
    },
    {
      id: 'learning',
      title: 'Learning Approach',
      paragraphs: [
        'Learning at Bright Way School is planned around the overall development of every student.',
        'Classroom teaching is supported by co-curricular activities, sport, the arts and cultural events, with an emphasis on discipline, ethics and leadership.',
      ],
      bullets: [
        'Holistic learning for every child',
        'Value based learning',
        'Co-curricular participation',
      ],
      imageUrl: '/images/facilities/computer-lab.jpg',
      imageAlt: 'Students working at computers in the computer laboratory',
      status: 'confirmed',
    },
    {
      id: 'activities',
      title: 'Academic Activities',
      paragraphs: [
        "The school's academic calendar and activity list are being confirmed with the school office.",
      ],
      imageUrl: '/images/gallery/gallery-01.jpg',
      imageAlt: 'Students in uniform on parade at the school sports day',
      status: 'pending',
      note: 'Academic activities will be published here once they are confirmed.',
    },
    {
      id: 'assessment',
      title: 'Assessment & Progress',
      paragraphs: [
        'Assessment and progress reporting details are being confirmed with the school office.',
      ],
      status: 'pending',
      note: 'Assessment information will be published once it is confirmed.',
    },
  ],
};
