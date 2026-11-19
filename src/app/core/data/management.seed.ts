import type { ManagementContent } from '../models/management-content.model';

/**
 * Management page defaults. The public page and admin editor both read this
 * shape so every section remains editable and renderable.
 */
export const MANAGEMENT_CONTENT: ManagementContent = {
  banner: {
    title: 'Management',
    subtitle: 'Guided by Banashankari Vidya Samsthe',
    imageUrl: '/images/home/hero-campus.jpg',
    imageAlt: 'Bright Way School campus building',
  },
  paragraphs: [
    'Bright Way School is managed by Banashankari Vidya Samsthe, Bengaluru, Karnataka. The management guides academic planning, campus development and school policy with a focus on student welfare.',
    'The school has been part of the community since 1981 and continues to work towards value based, holistic education for every student who joins us.',
  ],
  principal: {
    name: 'Mrs. Sunita Rao',
    role: 'Principal, Bright Way School',
    message:
      'At Bright Way School we believe every child carries a spark that deserves to be noticed and nurtured. Our teachers work to build strong academic foundations while giving equal attention to character, curiosity and confidence.',
    messageSecondary:
      'We encourage our students to ask questions, take part in sport, the arts and cultural activities, and to treat one another with respect. When families and teachers work together, children thrive — and that partnership is at the heart of everything we do here.',
    imageUrl: '',
  },
  facts: [
    { icon: 'calendar', label: 'Established', value: '1981' },
    { icon: 'users', label: 'Managed by', value: 'Banashankari Vidya Samsthe' },
    { icon: 'check', label: 'Recognition', value: 'Govt. of Karnataka' },
  ],
  facultyIntro:
    'Our teachers bring subject expertise and a caring approach to the classroom. The team below reflects the academic leadership and teaching staff who guide students through the school year.',
  faculty: [
    {
      name: 'Mrs. Sunita Rao',
      role: 'Principal',
      subject: 'School Leadership',
      qualification: 'M.A., B.Ed.',
      experience: '22 years of experience',
    },
    {
      name: 'Mr. Ramesh Iyer',
      role: 'Vice Principal',
      subject: 'Science',
      qualification: 'M.Sc., B.Ed.',
      experience: '18 years of experience',
    },
    {
      name: 'Ms. Kavita Sharma',
      role: 'Head of Primary',
      subject: 'Primary Education',
      qualification: 'M.A., B.Ed.',
      experience: '14 years of experience',
    },
    {
      name: 'Mr. Arjun Nair',
      role: 'Senior Teacher',
      subject: 'Mathematics',
      qualification: 'M.Sc., B.Ed.',
      experience: '11 years of experience',
    },
    {
      name: 'Ms. Fatima Khan',
      role: 'Senior Teacher',
      subject: 'Science',
      qualification: 'M.Sc., B.Ed.',
      experience: '9 years of experience',
    },
    {
      name: 'Ms. Ananya Rao',
      role: 'Teacher',
      subject: 'English',
      qualification: 'M.A., B.Ed.',
      experience: '8 years of experience',
    },
    {
      name: 'Ms. Priya Menon',
      role: 'Teacher',
      subject: 'Kindergarten',
      qualification: 'B.Ed., NTT',
      experience: '10 years of experience',
    },
    {
      name: 'Mr. Deepak Kumar',
      role: 'Physical Education Teacher',
      subject: 'Sports & Games',
      qualification: 'M.P.Ed.',
      experience: '12 years of experience',
    },
  ],
  facultyNote: 'Staff photographs will be added once they are supplied by the school office.',
};
