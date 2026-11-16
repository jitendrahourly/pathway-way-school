export interface ContentPageData {
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly paragraphs: readonly string[];
  readonly bullets?: readonly string[];
  readonly note?: string;
  readonly faqs?: readonly { readonly question: string; readonly answer: string }[];
}

export const CONTENT_PAGES: Record<string, ContentPageData> = {
  'about-our-school': {
    title: 'Our School',
    subtitle: 'A recognised institution managed by Banashankari Vidya Samsthe',
    imageUrl: '/images/home/about-students.jpg',
    imageAlt: 'Students and teachers together on campus',
    paragraphs: [
      'Bright Way School is a recognised educational institution in Bengaluru, Karnataka, established in 1981 and managed by Banashankari Vidya Samsthe.',
      'The school is committed to providing value based and holistic education that supports the overall development of every student, academically and personally.',
      'Classroom learning is supported by co-curricular activities, sport, the arts and cultural events, with an emphasis on discipline, ethics and leadership.',
    ],
    bullets: ['Established in 1981', 'Managed by Banashankari Vidya Samsthe', 'Recognised by the Government of Karnataka'],
  },
  'about-vision-mission': {
    title: 'Vision & Mission',
    subtitle: 'The values that guide Bright Way School',
    imageUrl: '/images/home/hero-campus.jpg',
    imageAlt: 'Bright Way School campus building',
    paragraphs: [
      'Our vision is to nurture responsible, confident and compassionate individuals who are ready to contribute positively to society.',
      'Our mission is to provide quality education, encourage creativity and build strong character in every student.',
      'These principles guide classroom teaching, co-curricular activities and the everyday life of the school.',
    ],
    bullets: ['Nurture responsible individuals', 'Provide quality education', 'Encourage creativity', 'Build strong character'],
  },
  'about-management': {
    title: 'Management',
    subtitle: 'Guided by Banashankari Vidya Samsthe',
    imageUrl: '/images/home/about-students.jpg',
    imageAlt: 'Students and teachers on campus',
    paragraphs: [
      'Bright Way School is managed by Banashankari Vidya Samsthe, Bengaluru, Karnataka.',
      'The management is committed to maintaining a safe, supportive and inspiring learning environment for all students.',
      'School policies, academic planning and campus development are guided with a focus on student welfare and quality education.',
    ],
  },
  'about-history': {
    title: 'History & Legacy',
    subtitle: 'A legacy of quality education since 1981',
    imageUrl: '/images/home/hero-campus.jpg',
    imageAlt: 'Bright Way School campus building',
    paragraphs: [
      'Bright Way School was established in 1981 in Bengaluru, Karnataka, with a vision to provide value based and holistic education.',
      'Since its founding, the school has worked steadily to support the academic and personal growth of its students.',
      'Over the years, the school has built a reputation for disciplined learning, caring teachers and a strong sense of community.',
    ],
    note: 'Detailed milestones and alumni stories will be published once they are confirmed by the school office.',
  },
  'academics-kindergarten': {
    title: 'Kindergarten',
    subtitle: 'A joyful start to learning',
    imageUrl: '/images/gallery/gallery-02.jpg',
    imageAlt: 'Children learning together in a classroom',
    paragraphs: [
      'The kindergarten programme introduces children to school life through play, exploration and guided discovery.',
      'Activities are designed to develop language, numeracy, motor skills and social confidence in a caring environment.',
      'Teachers focus on nurturing curiosity and a positive attitude towards learning.',
    ],
    bullets: ['Play based learning', 'Language and early numeracy', 'Social and emotional development', 'Caring classroom environment'],
  },
  'academics-primary': {
    title: 'Primary School',
    subtitle: 'Building strong foundations',
    imageUrl: '/images/facilities/library.jpg',
    imageAlt: 'Teacher reading with students in the school library',
    paragraphs: [
      'The primary programme strengthens reading, writing, mathematics and general awareness through structured classroom learning.',
      'Students are encouraged to ask questions, participate actively and develop good study habits.',
      'Co-curricular activities support confidence, creativity and teamwork.',
    ],
    bullets: ['Core subject foundations', 'Reading and comprehension', 'Creative expression', 'Co-curricular participation'],
  },
  'academics-middle': {
    title: 'Middle School',
    subtitle: 'Growing skills and independence',
    imageUrl: '/images/facilities/computer-lab.jpg',
    imageAlt: 'Students working at computers in the computer laboratory',
    paragraphs: [
      'The middle school years deepen subject knowledge and develop independent learning skills.',
      'Students are guided to think critically, solve problems and express ideas clearly.',
      'Sport, arts and cultural activities remain an important part of school life.',
    ],
    bullets: ['Subject depth', 'Critical thinking', 'Problem solving', 'Balanced development'],
  },
  'academics-high': {
    title: 'High School',
    subtitle: 'Preparing for higher studies',
    imageUrl: '/images/facilities/science-lab.jpg',
    imageAlt: 'Science laboratory with workstations and apparatus',
    paragraphs: [
      'The high school programme focuses on academic rigour and preparation for higher studies.',
      'Students receive guidance to strengthen concepts, examination skills and future planning.',
      'Character building, discipline and leadership continue to be emphasised.',
    ],
    bullets: ['Academic rigour', 'Examination readiness', 'Career guidance', 'Leadership development'],
  },
  'school-life-events': {
    title: 'Events & Celebrations',
    subtitle: 'Moments that bring the school together',
    imageUrl: '/images/gallery/gallery-03.jpg',
    imageAlt: 'Students seated together at the morning assembly',
    paragraphs: [
      'School events and celebrations are organised through the academic year to encourage participation and community spirit.',
      'Annual days, festivals and special assemblies give students opportunities to perform, present and celebrate.',
      'Event calendars and photographs will be published once confirmed by the school office.',
    ],
    bullets: ['Annual Day celebrations', 'Festival observances', 'Special assemblies', 'Student performances'],
  },
  'school-life-student-activities': {
    title: 'Student Activities',
    subtitle: 'Learning through participation',
    imageUrl: '/images/gallery/gallery-02.jpg',
    imageAlt: 'Children learning together in a classroom',
    paragraphs: [
      'Students take part in a range of classroom and co-curricular activities that support learning and personal growth.',
      'Activities are planned to encourage teamwork, communication and creativity.',
      'Detailed activity lists and schedules will be published once confirmed.',
    ],
    bullets: ['Classroom activities', 'Group projects', 'Creative expression', 'Team participation'],
  },
  'school-life-sports': {
    title: 'Sports & Games',
    subtitle: 'Fitness, teamwork and team spirit',
    imageUrl: '/images/facilities/playground.jpg',
    imageAlt: 'Shaded school playground with play equipment',
    paragraphs: [
      'The school provides open space for sport, fitness and team spirit.',
      'Physical education and games help students build stamina, discipline and cooperation.',
      'Sports fixtures, teams and results will be published once confirmed.',
    ],
    bullets: ['Physical education', 'Team games', 'Fitness activities', 'Sportsmanship'],
  },
  'school-life-arts-culture': {
    title: 'Arts & Culture',
    subtitle: 'Expressing creativity',
    imageUrl: '/images/gallery/gallery-01.jpg',
    imageAlt: 'Students in uniform on parade at the school sports day',
    paragraphs: [
      'Arts and cultural activities form an important part of school life.',
      'Students explore music, dance, drama and visual arts through classroom and stage opportunities.',
      'Programme details will be published once confirmed by the school office.',
    ],
    bullets: ['Music and dance', 'Drama and theatre', 'Visual arts', 'Cultural programmes'],
  },
  'school-life-clubs': {
    title: 'Clubs & Activities',
    subtitle: 'Exploring interests together',
    imageUrl: '/images/gallery/gallery-04.jpg',
    imageAlt: 'Microscopes set up for a science practical',
    paragraphs: [
      'Clubs and activity groups allow students to explore shared interests beyond the regular timetable.',
      'Participation helps develop leadership, responsibility and collaboration.',
      'Club details and meeting schedules will be published once confirmed.',
    ],
    bullets: ['Interest based clubs', 'Leadership opportunities', 'Collaborative projects', 'Skill development'],
  },
  'school-life-achievements': {
    title: 'Student Achievements',
    subtitle: 'Celebrating student success',
    imageUrl: '/images/gallery/gallery-03.jpg',
    imageAlt: 'Students gathered at the morning assembly',
    paragraphs: [
      'Student achievements in academics, sports, arts and community activities are celebrated by the school.',
      'Recognising effort and success motivates students to continue learning and growing.',
      'Confirmed achievement records will be published here once available.',
    ],
    note: 'Achievement details will be added once they are confirmed by the school office.',
  },
  'admissions-process': {
    title: 'Admission Process',
    subtitle: 'Steps for admission to Bright Way School',
    imageUrl: '/images/home/hero-campus.jpg',
    imageAlt: 'Bright Way School campus building',
    paragraphs: [
      'Admission details are published here once they are confirmed by the school office.',
      'Parents are encouraged to contact the school office for the latest admission steps and availability.',
      'The school will share confirmed information on request.',
    ],
    note: 'Admission process steps will be published once confirmed.',
  },
  'admissions-required-documents': {
    title: 'Required Documents',
    subtitle: 'Documents needed for admission',
    imageUrl: '/images/home/about-students.jpg',
    imageAlt: 'Students and teachers on campus',
    paragraphs: [
      'The list of documents required for admission will be published here once it is confirmed by the school office.',
      'Parents may contact the school office to receive the current document checklist.',
    ],
    note: 'Required documents will be published once confirmed.',
  },
  'admissions-enquiry': {
    title: 'Admission Enquiry',
    subtitle: 'Get in touch with the school office',
    imageUrl: '/images/home/hero-campus.jpg',
    imageAlt: 'Bright Way School campus building',
    paragraphs: [
      'For admission enquiries, please contact the school office directly.',
      'The office will share confirmed admission details, dates and fees on request.',
      'You can reach the school by phone or email using the contact details on the Contact Us page.',
    ],
    bullets: ['Phone: 080-26396720', 'Email: brightways.school@yahoo.in', 'Address: No. 105, 12th Main, Opp. BHCS Layout, Subramanyapura Post, Bangalore - 560061'],
  },
  'admissions-faqs': {
    title: 'Admission FAQs',
    subtitle: 'Common questions about admissions at Bright Way School',
    imageUrl: '/images/home/about-students.jpg',
    imageAlt: 'Students and teachers on campus',
    paragraphs: [
      'Below are answers to questions parents frequently ask about admission to Bright Way School. Please contact the school office for details that are specific to your child.',
    ],
    faqs: [
      {
        question: 'How do I apply for admission?',
        answer: 'Please contact the school office for the current admission form and process. The office will guide you through the steps, including submission of the application and the required documents.',
      },
      {
        question: 'What is the age criteria for admission to LKG and UKG?',
        answer: 'Age eligibility for each class is confirmed by the school office for the academic year. Please enquire with the office for the current cut-off dates.',
      },
      {
        question: 'Are admission tests or interviews conducted?',
        answer: 'Any assessment or interaction for admission is scheduled and communicated by the school office. Details will be shared at the time of application.',
      },
      {
        question: 'What documents are required for admission?',
        answer: 'The document checklist is provided by the school office. Commonly requested items include birth certificate, previous school records and address proof. Please confirm the current list with the office.',
      },
      {
        question: 'What are the school fees?',
        answer: 'Fee structure is shared by the school office on request. Please contact the office for the current fee schedule and payment schedule.',
      },
      {
        question: 'Does the school provide transport?',
        answer: 'Transport availability and routes are confirmed by the school office. Please enquire when you visit the office.',
      },
      {
        question: 'How can I visit the school before admission?',
        answer: 'You are welcome to contact the school office to arrange a visit during working hours. The office will schedule a suitable time for you.',
      },
    ],
  },
  'facilities-classrooms': {
    title: 'Classrooms',
    subtitle: 'Spaces for daily teaching and learning',
    imageUrl: '/images/gallery/gallery-02.jpg',
    imageAlt: 'Students learning together in a classroom',
    paragraphs: [
      'Classrooms at Bright Way School support daily teaching and learning across the school.',
      'Each classroom is arranged to encourage attention, discussion and group participation.',
      'Detailed classroom information will be published once it is confirmed by the school office.',
    ],
    bullets: ['Learning focused layout', 'Teacher led instruction', 'Group participation', 'Age appropriate environment'],
  },
  'facilities-library': {
    title: 'Library',
    subtitle: 'A quiet space for reading and reference',
    imageUrl: '/images/facilities/library.jpg',
    imageAlt: 'Teacher reading with students in the school library',
    paragraphs: [
      'The school library offers a quiet space for reading, reference and research.',
      'Students are encouraged to develop reading habits and use reference material for projects.',
      'Library timings and collection details will be published once confirmed.',
    ],
    bullets: ['Reading space', 'Reference material', 'Story sessions', 'Quiet study area'],
  },
  'facilities-computer-lab': {
    title: 'Computer Lab',
    subtitle: 'Practical digital skills',
    imageUrl: '/images/facilities/computer-lab.jpg',
    imageAlt: 'Students working at computers in the computer laboratory',
    paragraphs: [
      'The computer laboratory provides practical digital skills for a technology driven world.',
      'Students learn basic computing, typing and guided software use under teacher supervision.',
      'Laboratory system details will be published once confirmed.',
    ],
    bullets: ['Guided practical sessions', 'Basic computing skills', 'Teacher supervision', 'Digital learning support'],
  },
  'facilities-sports': {
    title: 'Sports Facilities',
    subtitle: 'Space for sport, fitness and play',
    imageUrl: '/images/facilities/playground.jpg',
    imageAlt: 'Shaded school playground with play equipment',
    paragraphs: [
      'The school playground provides open space for sport, fitness and team spirit.',
      'Outdoor play supports physical development, discipline and cooperation among students.',
      'Specific sports facilities and equipment will be published once confirmed.',
    ],
    bullets: ['Open playground', 'Outdoor games', 'Physical education', 'Team activities'],
  },
  'facilities-other': {
    title: 'Other Facilities',
    subtitle: 'Additional spaces that support school life',
    imageUrl: '/images/facilities/playground.jpg',
    imageAlt: 'School playground with play equipment among trees',
    paragraphs: [
      'Additional facilities that support learning, sport and everyday school life are listed here.',
      'Facility details will be expanded as they are confirmed by the school office.',
    ],
    note: 'Additional facility records will be published once confirmed.',
  },
};
