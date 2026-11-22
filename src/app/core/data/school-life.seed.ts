import type { SchoolLifeContent } from '../models/school-life-content.model';

/**
 * School Life landing page copy. This is both the admin editor's default and
 * the fallback the public page renders until the page is saved.
 */
export const SCHOOL_LIFE_CONTENT: SchoolLifeContent = {
  banner: {
    title: 'School Life & Events',
    subtitle: 'Learning, celebrating, and thriving beyond the classroom',
    imageUrl: '/images/gallery/gallery-01.jpg',
    imageAlt: 'Bright Way School students marching in uniform at the annual sports day',
  },
  stats: [
    { value: '1981', label: 'Estd. Tradition' },
    { value: '4', label: 'School Houses' },
    { value: '100%', label: 'Student Involvement' },
    { value: '6', label: 'Co-Curricular Streams' },
  ],
  intro: {
    eyebrow: 'Beyond the Classroom',
    title: 'Life at Bright Way School',
    paragraphs: [
      'Education at Bright Way School is a vibrant journey that combines academic rigor with lively co-curricular activities, competitive sports, artistic expression, and meaningful community celebrations. We nurture well-rounded students grounded in discipline, empathy, and leadership.',
    ],
  },
  cards: [
    {
      id: 'events',
      title: 'Events & Celebrations',
      tag: 'Celebrations & Traditions',
      icon: 'trophy',
      text: 'Annual Day, Sports Meet, festival assemblies, and patriotic ceremonies bringing students, teachers, and families together throughout the academic year.',
      highlights: ['Annual Day', 'Sports Day', 'Festival Assemblies', 'Exhibitions'],
    },
    {
      id: 'activities',
      title: 'Student Activities',
      tag: 'Co-Curricular Life',
      icon: 'users',
      text: 'Morning assemblies, inter-house debates, quizzes, elocution contests, and student leadership roles designed to build confidence, poise, and character.',
      highlights: ['Morning Assembly', 'House Competitions', 'Elocution & Quizzes', 'Leadership Roles'],
    },
    {
      id: 'sports',
      title: 'Sports & Games',
      tag: 'Athletics & Fitness',
      icon: 'target',
      text: 'Regular Physical Education, track-and-field athletics, team sports like football and kho-kho, morning yoga sessions, and inter-school sports tournaments.',
      highlights: ['Football & Kho-Kho', 'Track & Field', 'Morning Yoga', 'Inter-School Meets'],
    },
    {
      id: 'arts',
      title: 'Arts & Culture',
      tag: 'Creative Expression',
      icon: 'heart',
      text: 'Visual drawing, painting, classical and folk dance, theatrical drama, and vocal music integrated into the weekly timetable to cultivate creative minds.',
      highlights: ['Drawing & Crafts', 'Classical & Folk Dance', 'Drama & Skits', 'Vocal Music'],
    },
    {
      id: 'clubs',
      title: 'Clubs & Activities',
      tag: 'Student Societies',
      icon: 'book-open',
      text: 'Science Club, Eco-Club, Literary Society, and Community Service groups providing students opportunities to explore passions beyond the classroom syllabus.',
      highlights: ['Science Club', 'Eco & Nature Club', 'Literary Society', 'Community Service'],
    },
    {
      id: 'achievements',
      title: 'Student Achievements',
      tag: 'Excellence & Honours',
      icon: 'graduation-cap',
      text: 'Celebrating outstanding academic rankings, SSLC board distinctions, district sports medals, and cultural trophies earned by Bright Way students.',
      highlights: ['SSLC Merits', 'Sports Trophies', 'Cultural Medals', 'Honour Boards'],
    },
  ],
  cta: {
    eyebrow: 'Join Our Community',
    title: 'Experience School Life at Bright Way',
    text: 'Discover how our events, activities, and faculty mentorship inspire students to reach their full potential. Schedule a visit or submit an admissions enquiry today.',
    primaryLabel: 'Enquire for Admissions',
    secondaryLabel: 'View Campus Gallery',
  },
};
