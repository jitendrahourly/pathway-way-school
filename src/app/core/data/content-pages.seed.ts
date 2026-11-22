export interface ContentPageSection {
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly bullets?: readonly string[];
}

export interface ContentPageStageFact {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
}

export interface ContentPageStage {
  readonly tag: string;
  readonly title: string;
  readonly gradesBadge: string;
  readonly ctaLabel: string;
  readonly facts: readonly ContentPageStageFact[];
}

export interface ContentPageCta {
  readonly tag: string;
  readonly title: string;
  readonly text: string;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
}

export interface ContentPageData {
  readonly title: string;
  readonly subtitle: string;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly paragraphs: readonly string[];
  readonly bullets?: readonly string[];
  readonly sections?: readonly ContentPageSection[];
  readonly note?: string;
  readonly faqs?: readonly { readonly question: string; readonly answer: string }[];
  readonly overviewEyebrow?: string;
  readonly highlightsTitle?: string;
  readonly sectionsEyebrow?: string;
  readonly sectionsTitle?: string;
  readonly faqsEyebrow?: string;
  readonly faqsTitle?: string;
  readonly faqsSubtitle?: string;
  readonly mediaBadge?: string;
  /** `null` records a deliberate removal of the stage card. */
  readonly stage?: ContentPageStage | null;
  /** `null` records a deliberate removal of the call to action. */
  readonly cta?: ContentPageCta | null;
}

export interface ContentPageCopy {
  readonly mediaBadge: string;
  readonly overviewEyebrow: string;
  readonly highlightsTitle: string;
  readonly sectionsEyebrow: string;
  readonly sectionsTitle: string;
  readonly faqsEyebrow: string;
  readonly faqsTitle: string;
  readonly faqsSubtitle: string;
}

/**
 * Headings used by every content page. The academic, School Life and Facilities
 * families override the ones that differ, and the public page falls back to
 * these values when an editor leaves a heading blank.
 */
export const CONTENT_PAGE_COPY: ContentPageCopy = {
  mediaBadge: '',
  overviewEyebrow: '',
  highlightsTitle: 'Highlights',
  sectionsEyebrow: 'Programme Details',
  sectionsTitle: 'More About This Programme',
  faqsEyebrow: 'Common Questions',
  faqsTitle: 'Frequently Asked Questions',
  faqsSubtitle: 'Answers to common queries about curriculum, routines, and admissions.',
};

/** Headings shared by the four academic level pages. */
export const ACADEMIC_PAGE_COPY: ContentPageCopy = {
  ...CONTENT_PAGE_COPY,
  mediaBadge: 'Bright Way School · Estd. 1981',
  overviewEyebrow: 'Academic Stage Overview',
  highlightsTitle: 'Key Programme Highlights',
  sectionsEyebrow: 'Curriculum & Methodology',
  sectionsTitle: 'In-Depth Programme Structure',
};

/** Headings shared by the School Life sub-pages. */
export const SCHOOL_LIFE_PAGE_COPY: ContentPageCopy = {
  ...CONTENT_PAGE_COPY,
  overviewEyebrow: 'School Life at Bright Way',
};

/** Headings shared by the Facilities sub-pages. */
export const FACILITIES_PAGE_COPY: ContentPageCopy = {
  ...CONTENT_PAGE_COPY,
  overviewEyebrow: 'Campus Infrastructure & Learning Spaces',
};

/** Labels shared by the stage summary card on every academic level. */
export const ACADEMIC_STAGE_COPY = {
  tag: 'Stage Summary',
  title: 'Quick Stage Facts',
  ctaLabel: 'Enquire for Admissions',
} as const;

/** Labels shared by the at-a-glance card on every School Life sub-page. */
export const SCHOOL_LIFE_STAGE_COPY = {
  tag: 'School Life At a Glance',
  ctaLabel: 'Explore All School Life',
} as const;

/** Labels shared by the at-a-glance card on every Facilities sub-page. */
export const FACILITIES_STAGE_COPY = {
  tag: 'Campus Infrastructure',
  ctaLabel: 'Explore All Facilities',
} as const;

/** Admissions call to action shared by the four academic level pages. */
export const ACADEMIC_CTA_COPY: ContentPageCta = {
  tag: 'Admissions Enquiries',
  // Each academic page seeds its own heading; this one is only the editor placeholder.
  title: 'Interested in Enrolling for This Level?',
  text: 'Admissions are open for the academic year. Contact our admissions office to schedule a campus visit, meet our faculty, or receive an admission application.',
  primaryLabel: 'Submit Admission Enquiry',
  secondaryLabel: 'View All Academic Levels',
};

/** Call to action shared by the School Life sub-pages. */
export const SCHOOL_LIFE_CTA_COPY: ContentPageCta = {
  tag: 'Explore School Life',
  title: "There's More to Discover at Bright Way School",
  text: 'From sporting competitions to cultural performances and student clubs, school life at Bright Way is rich and rewarding. Browse all areas of school life below.',
  primaryLabel: 'All School Life Areas',
  secondaryLabel: 'Contact the School',
};

/** Call to action shared by the Facilities sub-pages. */
export const FACILITIES_CTA_COPY: ContentPageCta = {
  tag: 'Campus Visit & Tour',
  title: 'Experience Our Campus Firsthand',
  text: 'We invite parents and prospective students to tour our classrooms, laboratories, library, and sports grounds. Schedule a visit with our admissions office today.',
  primaryLabel: 'Schedule a Campus Visit',
  secondaryLabel: 'View All Facilities',
};

const EVENTS_SEED: ContentPageData = {
  title: 'Events & Celebrations',
  subtitle: 'Moments that Bring the School Together',
  imageUrl: '/images/gallery/gallery-01.jpg',
  imageAlt: 'Students in uniform on parade at the school sports day',
  paragraphs: [
    'Events and celebrations are woven into the rhythm of the school year at Bright Way School. From the grandeur of Annual Day to the warmth of festival gatherings, each occasion strengthens the bond between students, teachers, and families.',
    'Our calendar includes cultural programmes, national observances, sports meets, and special assemblies — giving every student a stage to shine and a reason to participate with pride.',
    'These shared moments build lasting memories, foster community spirit, and remind students that school life is about far more than examinations.',
  ],
  bullets: [
    'Annual Day — a full-evening showcase of student talent in music, dance, drama and oratory',
    'Independence Day and Republic Day — flag-hoisting ceremonies with cultural performances',
    'Teachers\' Day — student-led celebrations honouring the school\'s educators',
    'Children\'s Day — special events, games and activities planned for every class',
    'Diwali, Dasara and Eid — festival assemblies celebrating India\'s cultural diversity',
    'Sports Day — inter-house athletic competitions, march past and prize distribution',
    'Science and Arts Exhibition — student project showcases for parents and visitors',
    'Farewell events for outgoing students',
  ],
  sections: [
    {
      title: 'Annual Day & Cultural Performances',
      paragraphs: [
        'The Annual Day is the highlight of the school calendar — an evening event where students from every class perform before an audience of parents, guests, and the school community.',
        'Preparations begin months in advance: students rehearse dances, dramas, skits, group songs, and instrumental performances under the guidance of teachers and activity coordinators.',
        'Award ceremonies recognise outstanding academic performance, sporting achievement, and co-curricular excellence, making Annual Day a celebration of the whole school community.',
      ],
    },
    {
      title: 'National Days & Civic Ceremonies',
      paragraphs: [
        'Bright Way School observes Independence Day (15 August) and Republic Day (26 January) with full school assemblies, the hoisting of the national flag, and patriotic performances by students.',
        'These ceremonies instil civic pride, an appreciation of India\'s heritage, and a sense of responsibility towards the nation. Senior students take leadership roles as parade marshals and anchors.',
      ],
    },
    {
      title: 'Festival Celebrations',
      paragraphs: [
        'The school celebrates a range of Indian festivals to nurture cultural awareness and togetherness. Diwali, Dasara, Pongal, Eid, and Christmas are marked with special assemblies, art activities, and class-level programmes.',
        'Festival celebrations teach students to respect diverse traditions and appreciate the richness of India\'s multicultural heritage.',
      ],
    },
    {
      title: 'Sports Day',
      paragraphs: [
        'Sports Day is a full-day inter-house event featuring track-and-field competitions, relay races, march past, and opening and closing ceremonies.',
        'Students compete under four school houses, earning points for their house. Prizes and trophies are presented to outstanding athletes at the closing ceremony attended by parents and dignitaries.',
      ],
    },
  ],
  faqs: [
    {
      question: 'When is the Annual Day held?',
      answer: 'Annual Day is typically held in the third term of the academic year. The confirmed date and venue are announced to parents well in advance through school circulars.',
    },
    {
      question: 'Can parents attend school events?',
      answer: 'Yes, parents are warmly invited to Annual Day, Sports Day, and other major celebrations. Specific invitation and entry details are shared through school notices and the student handbook.',
    },
    {
      question: 'How are students selected to perform on Annual Day?',
      answer: 'All students are encouraged to participate in rehearsals. Final performers are selected by activity teachers based on rehearsal attendance, effort, and aptitude for the specific programme.',
    },
    {
      question: 'Are class-wise events held during celebrations?',
      answer: 'Yes. For events like Children\'s Day and Teachers\' Day, class teachers organise activities, games, and special programmes within each class, ensuring every student participates.',
    },
  ],
};

export const CONTENT_PAGES: Record<string, ContentPageData> = {
  'about-our-school': {
    title: 'Our School',
    subtitle: 'A Place Where Learning Meets Growth',
    imageUrl: '/images/home/about-students.jpg',
    imageAlt: 'Students and teachers together on campus',
    paragraphs: [
      'Bright Way School is a recognised educational institution located in Bengaluru, Karnataka. Established in 1981 and managed by Banashankari Vidya Samsthe, the school is committed to providing education that supports the academic and personal development of students.',
      'We believe that a school is more than a place where students attend classes and complete examinations. It is an environment where children develop knowledge, discover their interests, build friendships, and learn the values that guide them throughout life.',
    ],
    sections: [
      {
        title: 'About Our Institution',
        paragraphs: [
          'Since its establishment in 1981, Bright Way School has remained committed to the purpose of education and student development.',
          'Our institution aims to provide students with opportunities to strengthen their academic understanding, develop essential life skills, and become responsible members of society.',
          'We believe that every child should be encouraged to learn at their own pace, ask questions, express ideas, and participate actively in the learning process.',
        ],
      },
      {
        title: 'Our Learning Environment',
        paragraphs: [
          "A positive learning environment plays an important role in a student's educational journey.",
          'At Bright Way School, we value an atmosphere that encourages:',
        ],
        bullets: [
          'Active participation in classroom learning.',
          'Respect between students and teachers.',
          'Discipline and responsible behaviour.',
          'Curiosity and the desire to learn.',
          'Cooperation, friendship, and teamwork.',
          'Confidence in expressing thoughts and ideas.',
        ],
      },
      {
        title: 'Academic Development',
        paragraphs: [
          'Academic education provides the foundation for future learning and opportunities.',
          'Our educational approach focuses on helping students understand concepts, develop knowledge, improve their learning abilities, and build confidence in their academic journey.',
          'We recognize the importance of reading, writing, communication, logical thinking, and problem-solving as essential parts of education.',
        ],
      },
      {
        title: 'Beyond Classroom Learning',
        paragraphs: [
          'Education is not limited to textbooks and classroom lessons. Activities outside regular academic learning can help students discover their interests and develop additional skills.',
          'Sports and Physical Activities: Supporting physical fitness, teamwork, and sportsmanship.',
          'Arts and Creativity: Providing opportunities for creative expression and imagination.',
          'Cultural Activities: Appreciating cultural traditions, celebrations, and artistic talents.',
          'Group Participation: Developing cooperation, communication, and mutual respect.',
          'Leadership Development: Encouraging students to take responsibility and participate confidently.',
        ],
      },
      {
        title: 'Student Development',
        paragraphs: [
          'Every student has different abilities, interests, and aspirations. We believe that education should help children recognize their strengths and work towards improving themselves.',
          'Our focus extends to:',
        ],
        bullets: [
          'Building self-confidence.',
          'Developing communication skills.',
          'Encouraging independent thinking.',
          'Practising discipline and responsibility.',
          'Developing positive relationships.',
          'Understanding the importance of respect and kindness.',
        ],
      },
      {
        title: 'Our Relationship with Parents',
        paragraphs: [
          'Parents are important partners in a child\'s education.',
          'We believe that communication and cooperation between parents and the school contribute to a supportive educational environment.',
          'A shared commitment to learning, discipline, and personal development helps students receive consistent guidance and encouragement.',
        ],
      },
      {
        title: 'Looking Ahead',
        paragraphs: [
          'Bright Way School continues its commitment to providing meaningful educational opportunities and supporting the growth of future generations.',
          'We aim to inspire students to become knowledgeable, confident, responsible, and compassionate individuals.',
        ],
      },
    ],
  },
  'about-management': {
    title: 'Management',
    subtitle: 'Guided by Banashankari Vidya Samsthe',
    imageUrl: '/images/home/hero-campus.jpg',
    imageAlt: 'Bright Way School campus building',
    paragraphs: [],
  },
  'about-vision-mission': {
    title: 'Vision & Mission',
    subtitle: 'Building Foundations for a Brighter Future',
    imageUrl: '/images/gallery/gallery-03.jpg',
    imageAlt: 'Students gathered together at morning assembly reflecting school values',
    paragraphs: [
      'At Bright Way School, we believe that education is one of the most powerful tools for shaping individuals and society. Our vision and mission reflect our commitment to nurturing young minds through knowledge, values, discipline, and meaningful learning experiences.',
      'We believe that every child deserves the opportunity to learn, grow, explore, and achieve their potential.',
    ],
    sections: [
      {
        title: 'Our Vision',
        paragraphs: [
          'To create an educational environment that inspires every student to become a knowledgeable, confident, responsible, and compassionate individual.',
          'We aspire to nurture young minds who are equipped with strong values, independent thinking abilities, and a willingness to contribute positively to society.',
          'Our vision is to make learning a meaningful journey that prepares students for future opportunities and responsibilities.',
        ],
      },
      {
        title: 'Our Mission',
        paragraphs: [
          'Our mission is to provide meaningful educational experiences that encourage academic development, personal growth, and character building.',
          'We are committed to:',
        ],
        bullets: [
          'Promoting quality education and strong academic foundations.',
          'Encouraging curiosity, creativity, and independent thinking.',
          'Developing discipline, honesty, and respect for others.',
          'Providing opportunities for personal and social development.',
          'Encouraging teamwork, cooperation, and leadership.',
          'Building awareness of social and environmental responsibilities.',
          'Creating a positive and supportive learning environment.',
        ],
      },
      {
        title: 'Our Educational Philosophy',
        paragraphs: [
          'We believe that true education extends beyond academic knowledge.',
          'It involves developing the ability to think, communicate, make responsible decisions, and understand the world around us.',
          'Our educational philosophy is based on the following principles:',
          '1. Learning with Understanding: We believe students should understand concepts rather than simply memorize information. Meaningful learning helps children develop knowledge that they can apply in everyday situations.',
          '2. Individual Potential: Every student is unique. We believe in encouraging children to recognize their abilities, develop their interests, and continuously improve themselves.',
          '3. Character and Values: Education should help students understand the importance of honesty, kindness, respect, discipline, and responsibility.',
          '4. Creativity and Innovation: Students should be encouraged to ask questions, explore ideas, think independently, and approach challenges with curiosity.',
          '5. Learning Through Participation: Active participation in classroom discussions, activities, and collaborative experiences helps students develop confidence and practical skills.',
        ],
      },
      {
        title: 'Our Core Values',
        paragraphs: [
          'Integrity: Practising honesty, fairness, and ethical behaviour.',
          'Discipline: Developing self-control, consistency, and responsible habits.',
          'Respect: Treating teachers, classmates, parents, and community members with consideration.',
          'Knowledge: Valuing education, curiosity, and continuous learning.',
          'Responsibility: Understanding our duties towards ourselves and society.',
          'Compassion: Developing kindness, empathy, and concern for others.',
        ],
      },
      {
        title: 'Our Commitment to Students',
        paragraphs: [
          'We are committed to encouraging students to become lifelong learners who value knowledge, appreciate differences, and approach challenges with confidence.',
          'We believe that a strong educational foundation, combined with positive values and practical life skills, can help every child move towards a brighter future.',
        ],
      },
      {
        title: 'Our Belief',
        paragraphs: [
          'Every child has the potential to learn, grow, and make a difference. Our responsibility is to encourage that potential through education, guidance, and values.',
        ],
      },
    ],
  },
  'about-history': {
    title: 'History & Legacy',
    subtitle: 'A Journey of Education Since 1981',
    imageUrl: '/images/gallery/gallery-01.jpg',
    imageAlt: 'Students in uniform on parade at the school sports day',
    paragraphs: [
      'Every institution has a story, and the story of Bright Way School is rooted in its commitment to education and the development of young minds.',
      'Established in 1981 and managed by Banashankari Vidya Samsthe, Bright Way School has been part of the educational community in Bengaluru for more than four decades.',
      'Our journey reflects the importance of education, the dedication of educators, and the shared efforts of everyone associated with the institution.',
    ],
    sections: [
      {
        title: 'The Beginning – 1981',
        paragraphs: [
          'Bright Way School was established in 1981 with the purpose of contributing to education and supporting the learning and development of students.',
          'The establishment of the institution marked the beginning of a journey focused on creating educational opportunities and building a foundation for future generations.',
        ],
      },
      {
        title: 'Our Journey Through the Years',
        paragraphs: [
          'Over the years, educational institutions continue to evolve in response to the changing needs of students and society.',
          "Bright Way School's journey since 1981 represents its continued association with education and its commitment to student development.",
          'The school remains focused on the importance of academic learning, discipline, positive values, and the overall growth of students.',
        ],
      },
      {
        title: 'A Legacy of Learning',
        paragraphs: [
          'The true legacy of a school is reflected not only in the number of years it has existed but also in its contribution to education and the lives of students.',
          'At Bright Way School, we recognize the importance of:',
          'Education: Providing opportunities for students to develop knowledge and understanding.',
          'Values: Encouraging honesty, discipline, respect, and responsibility.',
          'Growth: Supporting the academic and personal development of students.',
          'Community: Building positive relationships between the school, parents, and the wider community.',
        ],
      },
      {
        title: 'The Role of Teachers and Students',
        paragraphs: [
          "Every chapter in a school's history is shaped by the people who contribute to it.",
          'Teachers play an important role in guiding students, sharing knowledge, and encouraging young minds.',
          "Students bring energy, curiosity, and new aspirations to the institution. Their learning experiences and achievements become an important part of the school's continuing journey.",
          'Parents and the school community also contribute through their trust, cooperation, and support.',
        ],
      },
      {
        title: 'Continuing Our Journey',
        paragraphs: [
          'As Bright Way School continues its educational journey, it remains focused on the importance of learning, personal development, and positive values.',
          "The educational environment continues to evolve, but the importance of providing meaningful learning opportunities remains central to the institution's purpose.",
        ],
      },
      {
        title: 'Looking Towards the Future',
        paragraphs: [
          'With its foundation established in 1981, Bright Way School looks forward to continuing its commitment to education and the development of future generations.',
          'We believe that every student who walks through our doors represents an opportunity to make a positive difference through education.',
          'Bright Way School – Building a Brighter Future Through Education Since 1981.',
        ],
      },
    ],
  },
  'academics-kindergarten': {
    title: 'Kindergarten',
    subtitle: 'Nurturing Curiosity and Joy in Early Childhood',
    imageUrl: '/images/gallery/gallery-02.jpg',
    imageAlt: 'Children learning together in an engaging kindergarten classroom',
    paragraphs: [
      'The Kindergarten programme at Bright Way School provides a warm, stimulating, and joyful foundation for children stepping into their educational journey. We understand that early childhood is a golden window of rapid cognitive, linguistic, and emotional growth, where learning is most effective when driven by natural curiosity and playful exploration.',
      'Our curriculum is designed to respect the unique developmental pace of each child. Through a thoughtful blend of guided play, sensory activities, interactive storytelling, and hands-on discovery, we foster a lifelong love for learning while instilling confidence, empathy, and social cooperation.',
      'Under the compassionate mentorship of trained early-years educators, our young learners develop foundational communication, numerical thinking, and motor skills in a secure, vibrant, and nurturing environment.',
    ],
    bullets: [
      'Child-centred play-way and activity-based learning approach',
      'Phonics-driven early literacy, vocabulary, and expressive communication',
      'Foundational numeracy through concrete objects, patterns, and logic games',
      'Sensory and cognitive exploration via nature walks, building blocks, and crafts',
      'Fine and gross motor development through music, movement, yoga, and games',
      'Social-emotional growth: sharing, active listening, teamwork, and independence',
      'Warm, secure, hygienic classrooms with dedicated activity and reading corners',
    ],
    note: 'Kindergarten hours are gently paced with structured activity-rest rhythms. Teachers maintain continuous communication with parents to support every child\'s milestone progress.',
    ...ACADEMIC_PAGE_COPY,
    stage: {
      ...ACADEMIC_STAGE_COPY,
      gradesBadge: 'Pre-KG · LKG · UKG',
      facts: [
        { label: 'Classes Offered', value: 'Pre-KG, LKG & UKG', icon: 'book-open' },
        { label: 'Age Group', value: '3 to 5.5 Years', icon: 'users' },
        { label: 'School Hours', value: '8:45 AM – 12:30 PM (Mon–Fri)', icon: 'clock' },
        { label: 'Teacher-Student Ratio', value: '15:1 (Individual Care)', icon: 'heart' },
        { label: 'Learning Pedagogy', value: 'Play-Way & Hands-on Discovery', icon: 'eye' },
        { label: 'Board / Affiliation', value: 'Karnataka State Educational Board', icon: 'graduation-cap' },
      ],
    },
    cta: {
      ...ACADEMIC_CTA_COPY,
      title: 'Interested in Enrolling for Kindergarten?',
    },
    sections: [
      {
        title: 'Our Early Learning Approach',
        paragraphs: [
          'We believe that children learn best when they feel safe, valued, and genuinely excited about exploring the world around them. Our early learning framework moves away from rote learning, focusing instead on joyful inquiry and concept building.',
          'Every day is structured to strike a harmonious balance between teacher-guided lessons and child-initiated exploration. Children are encouraged to ask questions, experiment with materials, express their thoughts, and celebrate little discoveries.',
        ],
        bullets: [
          'Encouraging natural inquisitiveness and creative imagination',
          'Nurturing emotional resilience, self-help skills, and self-esteem',
          'Positive reinforcement and gentle, loving guidance',
        ],
      },
      {
        title: 'Core Developmental Areas',
        paragraphs: [
          'Our comprehensive early childhood syllabus encompasses all key domains of early childhood development, ensuring children build well-rounded capabilities before entering primary school:',
          '1. Language & Early Literacy: Storytelling, rhymes, phonemic awareness, picture reading, and conversational exercises to build rich vocabulary and clear articulation.',
          '2. Numeracy & Analytical Concepts: Understanding numbers through hands-on counters, recognizing shapes, sorting, comparing sizes, and basic spatial orientation.',
          '3. Environmental & Social Awareness: Learning about family, community helpers, plants, animals, weather, and basic safety through experiential themes.',
          '4. Creative Expression: Drawing, finger painting, clay modelling, role-play, dramatisation, and rhythm-based musical games that unlock individual imagination.',
        ],
      },
      {
        title: 'A Typical Day in Kindergarten',
        paragraphs: [
          'A typical day in our kindergarten is lively, purposeful, and structured to maintain high energy without overwhelming young minds.',
          'The morning begins with circle time and prayers, followed by interactive literacy or numeracy periods, healthy snack intervals, outdoor physical play, creative arts, and soothing story sessions before dismissal.',
        ],
      },
      {
        title: 'Partnership with Parents',
        paragraphs: [
          'We view parents as essential co-educators in their child\'s developmental journey. Regular communication, parent-teacher interactions, and developmental portfolios ensure families stay closely connected with their child\'s milestones, strengths, and daily joy in school.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What age groups are admitted to the Kindergarten programme?',
        answer: 'Our kindergarten covers Pre-KG (Nursery), Lower Kindergarten (LKG), and Upper Kindergarten (UKG), admitting children typically between 3 and 5.5 years of age based on standard entry guidelines.',
      },
      {
        question: 'How does Bright Way School support children with separation anxiety?',
        answer: 'Our educators employ a gentle orientation approach during initial weeks, using comforting routines, circle activities, and high teacher-student attention to help children adapt happily and overcome separation anxiety.',
      },
      {
        question: 'What is the teaching methodology followed in Kindergarten?',
        answer: 'We follow a child-centred, activity-oriented methodology inspired by proven early childhood practices, emphasizing multi-sensory play, storytelling, phonics, and hands-on materials rather than passive desk learning.',
      },
      {
        question: 'How are health, hygiene, and child safety ensured on campus?',
        answer: 'Child safety is our foremost priority. Kindergarten areas feature rounded furniture, child-safe play equipment, dedicated clean washrooms, constant female attendant supervision, and secure campus surveillance.',
      },
      {
        question: 'How are parents informed about their child\'s daily progress?',
        answer: 'We maintain open communication through student handbooks, periodic one-on-one parent-teacher conferences, and developmental observation records celebrating each child\'s social and academic progress.',
      },
    ],
  },
  'academics-primary': {
    title: 'Primary School',
    subtitle: 'Building Strong Foundations for Lifelong Learning (Grades 1 to 5)',
    imageUrl: '/images/facilities/library.jpg',
    imageAlt: 'Teacher reading with students in the school library',
    paragraphs: [
      'The Primary School programme at Bright Way School (Grades 1 to 5) serves as the vital bridge between early childhood discovery and structured academic disciplines. During these formative years, children develop fundamental literacy, numeracy, critical inquiry, and study habits that shape their future academic success.',
      'Managed by Banashankari Vidya Samsthe and recognised by the Government of Karnataka, our primary curriculum creates a stimulating, disciplined, and supportive classroom environment. We ensure that every child learns with deep conceptual clarity, develops the courage to ask questions, and discovers the joy of cooperative learning.',
      'Alongside academic excellence, we place equal importance on character development, moral ethics, physical fitness, and creative arts, nurturing well-grounded students who show respect for peers, teachers, and their community.',
    ],
    bullets: [
      'Strong conceptual curriculum in Languages, Mathematics, Science, and Social Studies',
      'Three-language foundation: English, Kannada, and Hindi',
      'Experiential teaching methodologies that connect textbook concepts to real-world context',
      'Dedicated weekly library, computer literacy, and hands-on science activities',
      'Daily sports, physical education, yoga, and team games for physical vitality',
      'Creative arts, vocal music, drama, and craft integrated into the weekly timetable',
      'Continuous, constructive assessment designed to encourage mastery without undue stress',
    ],
    note: 'Primary school hours balance academic rigor with creative expression, library exploration, and outdoor play. Regular assessments provide constructive feedback on academic and personal growth.',
    ...ACADEMIC_PAGE_COPY,
    stage: {
      ...ACADEMIC_STAGE_COPY,
      gradesBadge: 'Grades 1 to 5',
      facts: [
        { label: 'Classes Offered', value: 'Class 1 to Class 5', icon: 'book-open' },
        { label: 'Age Group', value: '6 to 10 Years', icon: 'users' },
        { label: 'School Hours', value: '8:30 AM – 3:15 PM (Mon–Fri)', icon: 'clock' },
        { label: 'Class Strength', value: '25 – 30 Students per Section', icon: 'users' },
        { label: 'Languages Offered', value: 'English (Medium), Kannada, Hindi', icon: 'trophy' },
        { label: 'Curriculum', value: 'Karnataka State Educational Board', icon: 'graduation-cap' },
      ],
    },
    cta: {
      ...ACADEMIC_CTA_COPY,
      title: 'Interested in Enrolling for Primary School?',
    },
    sections: [
      {
        title: 'Core Academic Curriculum',
        paragraphs: [
          'The primary curriculum follows prescribed state educational standards and is enriched with interactive teaching aids to ensure comprehensive subject comprehension:',
          '1. Languages: Rigorous training in English reading comprehension, grammar, creative writing, and spoken fluency. Kannada is cultivated with cultural pride and literary appreciation, alongside foundational Hindi.',
          '2. Mathematics: Moving from concrete objects to abstract mathematical thinking, arithmetic fluency, geometry concepts, word problem analysis, and speed arithmetic.',
          '3. Environmental Studies & General Science: Exploring natural phenomena, living systems, health, nutrition, and environmental conservation through observation and experiments.',
          '4. Social Studies: Introducing community heritage, Indian history, geography, governance, and civic responsibilities.',
          '5. Computer Education: Foundational digital literacy, keyboarding skills, basic software applications, and responsible technology usage.',
        ],
      },
      {
        title: 'Teaching Methodology & Classroom Life',
        paragraphs: [
          'Our teachers create vibrant, interactive classrooms where students are active participants rather than passive listeners. We utilize group discussions, audio-visual presentations, chart-making projects, field observations, and educational quizzes to bring subjects to life.',
          'Homework is carefully calibrated to reinforce classroom learning without overburdening young minds or replacing precious family and playtime.',
        ],
      },
      {
        title: 'Co-Curricular & Personality Development',
        paragraphs: [
          'Education at Bright Way School extends far beyond examinations. Every primary student participates in scheduled co-curricular periods including visual arts, music, dance, elocution, and physical education.',
          'Morning assemblies provide every student with opportunities to lead prayers, recite thoughts of the day, present news bulletins, and overcome stage hesitation in front of the school community.',
        ],
      },
      {
        title: 'Remedial Support & Individual Attention',
        paragraphs: [
          'Recognizing that every child learns at their own rhythm, our faculty offers dedicated remedial assistance for students requiring extra clarity in core concepts. Regular diagnostic evaluations allow teachers to identify learning gaps early and provide tailored support.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the curriculum followed in the Primary School?',
        answer: 'Bright Way School adheres to the curriculum prescribed by the Department of School Education, Government of Karnataka, enriched with experiential projects, language enrichment, and computer literacy.',
      },
      {
        question: 'What languages are taught from Grade 1 to 5?',
        answer: 'English is the primary medium of instruction. Kannada is taught as the state language with dedicated curriculum from Grade 1, and Hindi is introduced to build multi-lingual competence.',
      },
      {
        question: 'How is student progress assessed in Primary School?',
        answer: 'We follow a continuous, comprehensive evaluation approach consisting of classroom participation, project work, periodic unit tests, and term evaluations, prioritizing conceptual clarity over stress.',
      },
      {
        question: 'How does the school support students who need extra academic help?',
        answer: 'Teachers identify learning needs through continuous observation and offer guided remedial sessions after regular classes, working hand-in-hand with parents to ensure steady improvement.',
      },
      {
        question: 'What sports and co-curricular facilities are accessible to primary students?',
        answer: 'Primary students have structured physical education periods, access to our playground for athletics, football, and kho-kho, alongside weekly art, music, yoga, and library sessions.',
      },
    ],
  },
  'academics-middle': {
    title: 'Middle School',
    subtitle: 'Deepening Subject Mastery and Independent Thinking (Grades 6 to 8)',
    imageUrl: '/images/facilities/computer-lab.jpg',
    imageAlt: 'Middle school students working attentively in the modern computer laboratory',
    paragraphs: [
      'Middle School (Grades 6 to 8) marks a pivotal transformation in a young student\'s life. As children transition into early adolescence, their cognitive capabilities expand from basic understanding to analytical reasoning, abstract problem-solving, and independent inquiry.',
      'At Bright Way School, our middle school curriculum is carefully structured to challenge young minds, foster intellectual curiosity, and bridge the gap between general primary studies and specialized secondary education. We guide students to understand underlying scientific principles, evaluate historical perspectives, and communicate arguments with clarity and conviction.',
      'Managed by Banashankari Vidya Samsthe, our experienced faculty creates an atmosphere of intellectual enthusiasm balanced with strong ethical values, teamwork, and leadership development, ensuring students emerge confident and well-prepared for high school.',
    ],
    bullets: [
      'Specialized subject teachers for distinct disciplines in Science, Mathematics, and Humanities',
      'Transition to separate disciplines: Physics, Chemistry, Biology, History, Civics, and Geography',
      'Practical science laboratory demonstrations, observations, and experimental verification',
      'Advanced computer laboratory sessions: coding logic, spreadsheet analysis, and digital literacy',
      'Structured language mastery, debate, creative writing, and public speaking development',
      'Inter-house competitions in academics, sports, cultural arts, and science exhibitions',
      'Emphasis on study skills, time management, personal discipline, and social awareness',
    ],
    note: 'Middle school students are encouraged to take initiative in school clubs, house councils, and science exhibitions, cultivating self-discipline and leadership skills.',
    ...ACADEMIC_PAGE_COPY,
    stage: {
      ...ACADEMIC_STAGE_COPY,
      gradesBadge: 'Grades 6 to 8',
      facts: [
        { label: 'Classes Offered', value: 'Class 6 to Class 8', icon: 'book-open' },
        { label: 'Age Group', value: '11 to 13 Years', icon: 'users' },
        { label: 'School Hours', value: '8:30 AM – 3:30 PM (Mon–Fri)', icon: 'clock' },
        { label: 'Laboratories', value: 'Composite Science & Computer Labs', icon: 'flask' },
        { label: 'Evaluation System', value: 'Continuous & Comprehensive (CCE)', icon: 'target' },
        { label: 'Curriculum', value: 'Karnataka State Board Syllabus', icon: 'graduation-cap' },
      ],
    },
    cta: {
      ...ACADEMIC_CTA_COPY,
      title: 'Interested in Enrolling for Middle School?',
    },
    sections: [
      {
        title: 'Academic Structure & Advanced Disciplines',
        paragraphs: [
          'In middle school, broad subjects branch into dedicated disciplines taught by subject specialists:',
          '1. Mathematics: Deepening mastery of algebra, linear equations, geometry theorems, ratio and proportion, commercial arithmetic, and graphical data representations.',
          '2. Sciences: Structured into distinct domains of Physics (motion, energy, light, electricity), Chemistry (matter, chemical reactions, elements), and Biology (cell structure, human physiology, ecology).',
          '3. Social Sciences: Broadening horizons through comprehensive Indian and world history, democratic governance, constitution, world geography, and environmental stewardship.',
          '4. Languages: Advanced literature analysis, formal and informal writing, comprehension of complex texts, and speech delivery in English, Kannada, and Hindi.',
          '5. Information Technology: Introduction to computer architectures, logical reasoning, programming fundamentals, and safe digital citizenship.',
        ],
      },
      {
        title: 'Laboratory Work & Experiential Learning',
        paragraphs: [
          'We believe that true scientific understanding is born from practical experimentation. Middle school students regularly utilize our science laboratories to verify laws of physics, observe microscopic organisms, and conduct safe chemical reactions.',
          'Regular exhibitions, project-based assignments, and model-making competitions encourage students to connect theoretical classroom knowledge with contemporary societal and technological issues.',
        ],
      },
      {
        title: 'Cultivating Critical Thinking & Communication',
        paragraphs: [
          'Middle school classrooms emphasize reasoned discussion, debates, and analytical writing. Students are taught how to formulate hypotheses, gather relevant information, evaluate evidence, and present coherent viewpoints.',
          'Through literary clubs, elocution contests, and inter-house quizzes, students gain the poise and confidence needed for effective public communication.',
        ],
      },
      {
        title: 'Pastoral Care, Values & Adolescent Mentorship',
        paragraphs: [
          'The middle school years involve significant emotional, social, and physical changes. Our dedicated class teachers and mentors provide a compassionate, respectful environment where students can share challenges, resolve conflicts, and cultivate emotional resilience.',
          'Emphasis is placed on peer respect, digital ethics, punctuality, and community service, shaping well-balanced young individuals.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How does the academic transition from Primary to Middle School work?',
        answer: 'The transition is structured with care. While primary school features integrated subjects, middle school introduces distinct subject teachers for Physics, Chemistry, Biology, History, and Advanced Math, supported by orientation sessions.',
      },
      {
        question: 'Do middle school students perform practical experiments in laboratories?',
        answer: 'Yes. Students have scheduled laboratory sessions in our science and computer labs where they conduct hands-on experiments, observe demonstrations, and record scientific findings in practical journals.',
      },
      {
        question: 'How are students evaluated in middle school?',
        answer: 'Evaluation includes periodic unit assessments, term examinations, practical lab assessments, project presentations, and continuous evaluation of classroom participation and notebooks.',
      },
      {
        question: 'What leadership and co-curricular opportunities are available?',
        answer: 'Students participate in our House System (inter-house cultural, sports, and academic contests), student council prefect roles, annual athletic meets, drama, debate, and science clubs.',
      },
      {
        question: 'How does the school support students facing academic difficulties in specific subjects?',
        answer: 'Subject teachers conduct zero-period and remedial study sessions for students needing extra guidance in difficult topics, with personalized problem-solving and progress reviews.',
      },
    ],
  },
  'academics-high': {
    title: 'High School',
    subtitle: 'Academic Rigour, Board Examination Readiness, and Future Pathways (Grades 9 & 10)',
    imageUrl: '/images/facilities/science-lab.jpg',
    imageAlt: 'High school science laboratory with modern apparatus and student workstations',
    paragraphs: [
      'The High School programme at Bright Way School (Grades 9 and 10) represents the culmination of a student\'s foundational schooling, preparing them for the prestigious Secondary School Leaving Certificate (SSLC) examinations recognised by the Government of Karnataka.',
      'These critical years demand a fine balance between focused academic rigor, disciplined preparation, conceptual mastery, and emotional wellbeing. Our high school faculty comprises seasoned, dedicated educators who possess deep expertise in state board curricula and examination methodologies.',
      'Established in 1981 under Banashankari Vidya Samsthe, Bright Way School has maintained a steadfast legacy of academic achievement, ethical leadership, and character formation. We empower high schoolers to achieve outstanding results while discovering their passions and choosing the right streams for pre-university and higher education.',
    ],
    bullets: [
      'Comprehensive curriculum aligned with Karnataka State Secondary Education standards (SSLC)',
      'Intensive conceptual instruction in Mathematics, Science (Physics, Chemistry, Biology), and Social Science',
      'Rigorous language proficiency across First, Second, and Third Language selections',
      'Fully equipped Physics, Chemistry, Biology, and Computer laboratories for all practical syllabi',
      'Structured revision plans, chapter-wise question banks, unit tests, and comprehensive preparatory exams',
      'Dedicated remedial coaching and individual doubt-clearing sessions for every student',
      'Career guidance and stream selection counselling for post-10th educational pathways',
      'Leadership roles through Student Prefect Council, House Captaincy, and community initiatives',
    ],
    note: 'High school students undergo structured preparatory examinations, diagnostic reviews, and personal mentoring to ensure maximum confidence and top results in board examinations.',
    ...ACADEMIC_PAGE_COPY,
    stage: {
      ...ACADEMIC_STAGE_COPY,
      gradesBadge: 'Grades 9 & 10 (SSLC)',
      facts: [
        { label: 'Classes Offered', value: 'Class 9 & Class 10 (SSLC)', icon: 'book-open' },
        { label: 'Age Group', value: '14 to 16 Years', icon: 'users' },
        { label: 'School Hours', value: '8:30 AM – 4:00 PM (Special Batches)', icon: 'clock' },
        { label: 'Board Examination', value: 'KSEAB (Karnataka State Board)', icon: 'graduation-cap' },
        { label: 'Academic Track Record', value: 'Consistent 100% SSLC Pass Results', icon: 'trophy' },
        { label: 'Student Support', value: 'Remedial Coaching & Mock Exams', icon: 'target' },
      ],
    },
    cta: {
      ...ACADEMIC_CTA_COPY,
      title: 'Interested in Enrolling for High School?',
    },
    sections: [
      {
        title: 'Secondary Curriculum & Core Subjects',
        paragraphs: [
          'The high school academic framework adheres strictly to the curriculum formulated by the Karnataka School Examination and Assessment Board (KSEAB):',
          '1. Mathematics: Real numbers, polynomials, linear equations, quadratic equations, arithmetic progressions, coordinate geometry, trigonometry, circles, surface areas and volumes, and statistics and probability.',
          '2. Science: Physics (Light, Electricity, Magnetic Effects, Energy), Chemistry (Chemical Reactions, Acids Bases & Salts, Metals & Non-metals, Carbon Compounds), and Biology (Life Processes, Control & Coordination, Heredity, Environment).',
          '3. Social Science: In-depth study of Modern Indian and World History, Political Science & Public Administration, Sociology, Geography of India & Karnataka, Economics, and Business Studies.',
          '4. Languages: Advanced literature, grammar, essay writing, and comprehension across chosen languages (English, Kannada, Hindi).',
        ],
      },
      {
        title: 'Examination Strategy, Revision & Mock Testing',
        paragraphs: [
          'Excellence in board examinations requires systematic preparation rather than last-minute stress. We complete the syllabus well ahead of time to allow for multiple rounds of comprehensive revision.',
          'Students benefit from chapter-wise test series, analysis of previous years\' board papers, time-management workshops, and full-length preliminary examinations conducted under simulated board conditions. Detailed feedback is provided after each test to pinpoint areas for improvement.',
        ],
      },
      {
        title: 'Practical Laboratory Experience',
        paragraphs: [
          'State-of-the-art laboratory facilities ensure that students do not merely memorize formulas but witness scientific truths firsthand. Students carry out all mandated laboratory experiments in optics, electrical circuits, chemical testing, specimen observation, and computer applications under close teacher supervision.',
        ],
      },
      {
        title: 'Career Guidance & Post-10th Pathway Counselling',
        paragraphs: [
          'Navigating the transition from high school to Pre-University (PUC) and beyond can be daunting. Bright Way School conducts dedicated orientation sessions on post-10th career options across Science (PCMB, PCMC), Commerce (EBAC, SEBA), and Arts.',
          'We guide parents and students in identifying individual aptitudes, professional interests, and academic requirements for future entrance examinations.',
        ],
      },
      {
        title: 'Character, Leadership & Ethics',
        paragraphs: [
          'Even in the midst of intense academic focus, we remain committed to our founding ethos of character building. High school students serve on the Student Prefect Council, organize school events, mentor younger students, and participate in community service.',
          'We prepare our graduates to step into the world as knowledgeable, principled, resilient, and socially conscious citizens.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Which board examination do students appear for at Bright Way School?',
        answer: 'High school students appear for the Karnataka Secondary School Leaving Certificate (SSLC) examinations conducted by the Karnataka School Examination and Assessment Board (KSEAB).',
      },
      {
        question: 'How does the school prepare students for the 10th Standard board exams?',
        answer: 'Preparation begins with timely syllabus completion, followed by intensive subject-wise revision, solved question papers, weekly tests, and multiple preparatory examinations under strict board conditions.',
      },
      {
        question: 'Is remedial support available for students needing additional help?',
        answer: 'Yes. We conduct morning and evening remedial classes where teachers provide individual attention, clear specific doubts, and guide students through simpler problem-solving techniques.',
      },
      {
        question: 'How are laboratory practicals conducted in High School?',
        answer: 'Students have regular weekly practical sessions in our physics, chemistry, biology, and computer labs, maintaining detailed record books as required by the board curriculum.',
      },
      {
        question: 'Does the school assist students in selecting their stream after 10th standard?',
        answer: 'Yes. We conduct career awareness workshops and individual counselling sessions for students and parents to evaluate strengths and choose between Science, Commerce, and Arts streams for Pre-University education.',
      },
    ],
  },
  'school-life-events': {
    ...EVENTS_SEED,
    ...SCHOOL_LIFE_PAGE_COPY,
    stage: {
      ...SCHOOL_LIFE_STAGE_COPY,
      title: 'Events & Celebrations',
      gradesBadge: 'Annual Calendar',
      facts: [
        { label: 'Flagship Celebration', value: 'Annual Day & Cultural Night', icon: 'trophy' },
        { label: 'National Ceremonies', value: 'Independence & Republic Days', icon: 'calendar' },
        { label: 'Cultural Festivals', value: 'Diwali, Dasara, Eid, Rajyotsava', icon: 'heart' },
        { label: 'Student Involvement', value: '100% Student Participation', icon: 'users' },
        { label: 'Parent Engagement', value: 'Parents Invited to Major Events', icon: 'eye' },
        { label: 'Academic Showcases', value: 'Annual Science & Art Exhibition', icon: 'book-open' },
      ],
    },
    cta: SCHOOL_LIFE_CTA_COPY,
  },
  'school-life-student-activities': {
    title: 'Student Activities',
    subtitle: 'Learning Through Participation',
    imageUrl: '/images/gallery/gallery-02.jpg',
    imageAlt: 'Children learning together in a classroom',
    paragraphs: [
      'Education at Bright Way School extends well beyond textbooks. Student activities are carefully designed to develop confidence, communication, teamwork, and leadership — essential life skills that complement academic learning.',
      'From morning assemblies and house competitions to elocution contests and project exhibitions, students at every stage are given meaningful opportunities to participate, present, and grow.',
      'We believe that the qualities that define great individuals — curiosity, resilience, empathy, and the ability to work with others — are built through active participation in school life.',
    ],
    bullets: [
      'Morning assembly — daily prayer, thought for the day, news reading and student presentations',
      'Elocution and debate competitions across all grades',
      'Quiz competitions — classroom, inter-house and inter-school levels',
      'Science and social science project exhibitions',
      'Creative writing, essay and poetry competitions',
      'Group projects and cooperative classroom activities',
      'Leadership roles — class monitors, assembly anchors, house captains',
      'Community awareness and social service initiatives',
    ],
    ...SCHOOL_LIFE_PAGE_COPY,
    stage: {
      ...SCHOOL_LIFE_STAGE_COPY,
      title: 'Student Life & Growth',
      gradesBadge: 'Grades 1 – 10',
      facts: [
        { label: 'Daily Routine', value: 'Morning Assembly & Speeches', icon: 'users' },
        { label: 'House System', value: '4 Competitive Houses', icon: 'trophy' },
        { label: 'Literary Contests', value: 'Debates, Elocution & Quizzes', icon: 'book-open' },
        { label: 'Student Leadership', value: 'Captains, Prefects & Monitors', icon: 'target' },
        { label: 'Project Work', value: 'Hands-on Science & Social Models', icon: 'flask' },
        { label: 'Skill Building', value: 'Communication & Teamwork', icon: 'check' },
      ],
    },
    cta: SCHOOL_LIFE_CTA_COPY,
    sections: [
      {
        title: 'Morning Assembly',
        paragraphs: [
          'Every school day begins with the morning assembly — a 20-minute programme that sets a positive tone for the day. Students lead prayers, recite the school pledge, share the thought for the day, and present news bulletins.',
          'The assembly cultivates public speaking confidence, discipline, and a sense of shared community. Senior students take anchor roles, while junior students participate in group singing and pledge recitation.',
        ],
      },
      {
        title: 'House System & Competitions',
        paragraphs: [
          'Students at Bright Way School are assigned to one of four school houses. The house system fosters healthy competition, team spirit and school pride across academics, sports, and cultural activities.',
          'Inter-house competitions are held in debate, quiz, elocution, creative writing, drawing, sports, and cultural programmes throughout the year. House points accumulate, and the winning house is recognised at year-end.',
        ],
      },
      {
        title: 'Exhibitions & Project Work',
        paragraphs: [
          'Science and arts exhibitions provide students with an opportunity to present their learning creatively to teachers, peers, and parents. Students research topics, build models or charts, and explain their findings to visitors.',
          'Project-based activities develop research skills, independent thinking, and the ability to present ideas clearly — capabilities that are invaluable in higher education and professional life.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What leadership opportunities are available to students?',
        answer: 'Students can take on roles as class monitors, assembly anchors, house captains, and student council representatives. These roles are assigned based on academic performance, conduct, and teacher recommendations.',
      },
      {
        question: 'Are competitions open to all grades?',
        answer: 'Yes. Competitions are planned across different grade bands (junior, middle and senior) so that every student has an age-appropriate opportunity to participate and compete.',
      },
      {
        question: 'How are co-curricular activities scheduled?',
        answer: 'Co-curricular activities are integrated into the weekly timetable with dedicated activity periods, ensuring they do not conflict with core academic learning hours.',
      },
    ],
  },
  'school-life-sports': {
    title: 'Sports & Games',
    subtitle: 'Fitness, Teamwork and Competitive Spirit',
    imageUrl: '/images/facilities/playground.jpg',
    imageAlt: 'Shaded school playground with play equipment',
    paragraphs: [
      'Physical education and sport are central to student life at Bright Way School. Regular participation in sport builds physical fitness, mental resilience, teamwork, and a healthy competitive spirit.',
      'Our spacious playground and sports infrastructure support a wide range of outdoor activities, from team games like football and kho-kho to individual athletic events and yoga.',
      'Sports at Bright Way School are not just about winning — they teach students the values of fair play, discipline, perseverance, and respect for opponents and teammates alike.',
    ],
    bullets: [
      'Dedicated Physical Education periods for all classes (Grades 1 to 10)',
      'Outdoor sports: football, volleyball, kho-kho, kabaddi, and athletics',
      'Track-and-field events: sprints, relays, long jump, and shot put',
      'Inter-house Sports Day with march past and prize ceremony',
      'Morning yoga and stretching sessions for health and mindfulness',
      'School teams representing Bright Way at inter-school tournaments',
      'Swimming awareness and water safety activities',
      'Annual sports awards for outstanding athletes',
    ],
    ...SCHOOL_LIFE_PAGE_COPY,
    stage: {
      ...SCHOOL_LIFE_STAGE_COPY,
      title: 'Physical Education & Games',
      gradesBadge: 'All Classes',
      facts: [
        { label: 'Outdoor Sports', value: 'Football, Volleyball, Kho-Kho', icon: 'trophy' },
        { label: 'Athletics & Track', value: 'Sprints, Relays & Jumps', icon: 'target' },
        { label: 'Curriculum Status', value: 'Structured Weekly PE Periods', icon: 'clock' },
        { label: 'Mind & Wellness', value: 'Morning Yoga & Stretching', icon: 'heart' },
        { label: 'Competitions', value: 'Inter-House & District Meets', icon: 'users' },
        { label: 'Annual Sports Day', value: 'Full-Day Inter-House Meet', icon: 'calendar' },
      ],
    },
    cta: SCHOOL_LIFE_CTA_COPY,
    sections: [
      {
        title: 'Physical Education Programme',
        paragraphs: [
          'Physical Education (PE) is a structured part of the curriculum for all students from Grade 1 to Grade 10. PE periods focus on warm-up routines, skill building, game play, and cool-down stretching.',
          'Students learn the rules and techniques of multiple sports over the academic year, ensuring broad physical exposure. Senior students also receive coaching in fitness, nutrition basics, and sports psychology.',
        ],
      },
      {
        title: 'Team Sports & Games',
        paragraphs: [
          'Football, volleyball, kho-kho and kabaddi are the flagship team sports at Bright Way School. Students are coached in game strategy, teamwork and position-specific skills during structured PE sessions and after-school practice.',
          'School teams are selected through open trials and represent the school in inter-school competitions and district-level tournaments, giving talented students exposure to competitive sport beyond the school campus.',
        ],
      },
      {
        title: 'Athletics & Track Events',
        paragraphs: [
          'The school track supports a full programme of athletics including sprint races (100m, 200m), relay races, long jump, and shot put. Students are introduced to proper running form, jumping technique, and safe throwing practice.',
          'Athletes who demonstrate exceptional potential receive additional coaching and are nominated to represent the school at city-level athletics meets.',
        ],
      },
      {
        title: 'Yoga & Wellness',
        paragraphs: [
          'Yoga sessions are integrated into the weekly schedule for all grades. Students learn breathing exercises, basic asanas, and mindfulness practices that support both physical health and emotional wellbeing.',
          'The school recognises that physical wellness and mental wellness are equally important for academic performance and overall student happiness.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Are sports available for all classes?',
        answer: 'Yes. Physical Education is part of the weekly timetable for all classes from Grade 1 to Grade 10. The activities are age-appropriate and structured for each stage of learning.',
      },
      {
        question: 'How are school sports teams selected?',
        answer: 'Team selection is conducted through open trials observed by the PE teacher and sports coordinator. Criteria include skill level, physical fitness, attendance at practice, and sportsmanship.',
      },
      {
        question: 'Does the school participate in inter-school sports?',
        answer: 'Yes. School teams participate in inter-school tournaments at the city and district level for football, volleyball, kho-kho, kabaddi, and athletics, subject to availability and scheduling.',
      },
      {
        question: 'Is there sports coaching available after school hours?',
        answer: 'Practice sessions for school teams are conducted after regular school hours under the supervision of PE teachers. Parents are informed of practice schedules through the student handbook.',
      },
    ],
  },
  'school-life-arts-culture': {
    title: 'Arts & Culture',
    subtitle: 'Creativity, Expression and Cultural Pride',
    imageUrl: '/images/gallery/gallery-04.jpg',
    imageAlt: 'Science lab with microscopes, reflecting the school\'s creative and academic culture',
    paragraphs: [
      'The arts form an essential dimension of a complete education. At Bright Way School, students are nurtured as creative individuals through a rich arts and culture programme that spans visual arts, music, dance, drama, and cultural studies.',
      'Artistic participation builds confidence, emotional intelligence, attention to detail, and the ability to express ideas in powerful ways. These qualities complement academic skills and equip students for a creative, flexible future.',
      'Through cultural programmes, students also develop an appreciation of India\'s diverse heritage — its languages, traditions, art forms, and festivals — fostering respect, pride, and a broad worldview.',
    ],
    bullets: [
      'Visual arts: drawing, painting, craft, collage, and mixed-media projects',
      'Music education: vocal training, rhythm, and exposure to classical and folk forms',
      'Classical and folk dance: Bharatanatyam, folk styles, and contemporary routines',
      'Drama and theatre: scripted plays, role-play, and improvisational activities',
      'Cultural heritage: understanding Indian traditions, folk art, and regional customs',
      'Inter-house and inter-school competitions in arts, drawing, craft, and dance',
      'Annual Day performances showcasing dance, drama, and music',
      'Art exhibitions for parents and the school community',
    ],
    ...SCHOOL_LIFE_PAGE_COPY,
    stage: {
      ...SCHOOL_LIFE_STAGE_COPY,
      title: 'Creative Arts & Culture',
      gradesBadge: 'Expression & Pride',
      facts: [
        { label: 'Visual Arts', value: 'Drawing, Painting & Crafts', icon: 'image' },
        { label: 'Performing Arts', value: 'Classical, Folk Dance & Drama', icon: 'heart' },
        { label: 'Music Education', value: 'Vocal Training & Group Choirs', icon: 'users' },
        { label: 'Stage Opportunities', value: 'Annual Day Performances', icon: 'trophy' },
        { label: 'Exhibitions', value: 'Student Artwork Showcases', icon: 'eye' },
        { label: 'Weekly Periods', value: 'Integrated in School Timetable', icon: 'clock' },
      ],
    },
    cta: SCHOOL_LIFE_CTA_COPY,
    sections: [
      {
        title: 'Visual Arts Programme',
        paragraphs: [
          'Students across all grades have dedicated art periods in which they explore drawing, painting, and craft techniques suited to their age and development stage.',
          'Junior students (Grades 1 to 5) focus on basic shapes, colour mixing, and free creative expression. Middle and senior students explore more structured techniques, perspective drawing, poster making, and mixed-media projects.',
          'Art exhibitions held during the school year give students the experience of presenting their work professionally and receiving appreciation from peers, parents, and teachers.',
        ],
      },
      {
        title: 'Music & Vocal Training',
        paragraphs: [
          'Music education at Bright Way School includes group vocal practice, lessons in musical notation, and an introduction to classical, devotional, and folk music traditions.',
          'Students perform in morning assembly programmes, Annual Day events, and special cultural programmes. Participation in group singing develops listening skills, cooperation, and appreciation of musical form and discipline.',
        ],
      },
      {
        title: 'Dance & Performance',
        paragraphs: [
          'Dance training is a popular activity at Bright Way School. Students are introduced to classical Indian dance forms, regional folk styles, and choreographed group routines for performances.',
          'Dance develops physical coordination, rhythm, stage presence, and self-expression. Trained student performers present their work at Annual Day and cultural programmes, bringing colour and energy to these celebrations.',
        ],
      },
      {
        title: 'Drama & Theatre',
        paragraphs: [
          'The school\'s drama programme introduces students to scripted performance, voice projection, character portrayal, and stage direction. Drama builds confidence, empathy, and communication skills.',
          'Students participate in class-level plays, inter-house drama competitions, and Annual Day theatrical productions. Junior students enjoy shorter role-play activities and storytelling presentations tailored to their age.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Are art and music part of the regular timetable?',
        answer: 'Yes. Visual arts and music are integrated into the weekly timetable as dedicated activity periods for all classes. They are not optional extras — they are a structured part of every student\'s school experience.',
      },
      {
        question: 'Can students take part in dance even if they have no prior experience?',
        answer: 'Absolutely. Dance training at Bright Way School is open to all students. Routines are taught from scratch, and students are grouped by age and ability so that everyone can participate comfortably.',
      },
      {
        question: 'Are there competitions for arts and cultural activities?',
        answer: 'Yes. Inter-house competitions are held for drawing, craft, rangoli, dance, and drama. Outstanding students are also nominated to represent the school at inter-school cultural competitions.',
      },
    ],
  },
  'school-life-clubs': {
    title: 'Clubs & Activities',
    subtitle: 'Exploring Interests, Building Skills',
    imageUrl: '/images/facilities/science-lab.jpg',
    imageAlt: 'Science laboratory equipment ready for student experiments',
    paragraphs: [
      'Beyond the classroom timetable, Bright Way School offers a range of student clubs and activity groups that allow students to explore specific interests in greater depth.',
      'Clubs provide a supportive, collaborative environment where students with shared passions — whether for science, language, service, or the environment — can explore those interests together under the guidance of a faculty advisor.',
      'Club participation builds specialised skills, fosters lasting friendships, and gives students the experience of managing projects, leading peers, and contributing to the school and wider community.',
    ],
    bullets: [
      'Science Club — experiments, discoveries, and project demonstrations',
      'Nature & Environment Club — sustainability awareness and eco-friendly initiatives',
      'Literary & Reading Club — story sharing, book discussions, and creative writing',
      'Mathematics Club — puzzle-solving, logical challenges, and olympiad preparation',
      'Community Service Club — social awareness and volunteering activities',
      'Technology & Computer Club — programming basics and digital projects',
      'Health & Wellness Club — nutrition awareness and mindful living',
      'Cultural & Heritage Club — exploring India\'s traditions, history, and regional arts',
    ],
    ...SCHOOL_LIFE_PAGE_COPY,
    stage: {
      ...SCHOOL_LIFE_STAGE_COPY,
      title: 'Student Clubs & Societies',
      gradesBadge: 'Classes 5 – 10',
      facts: [
        { label: 'Active Clubs', value: 'Science, Eco, Literary & Math', icon: 'book-open' },
        { label: 'Meeting Cadence', value: 'Weekly Activity Periods', icon: 'clock' },
        { label: 'Faculty Guidance', value: 'Dedicated Teacher Advisors', icon: 'graduation-cap' },
        { label: 'Community Service', value: 'Outreach & Awareness Drives', icon: 'heart' },
        { label: 'Competitions', value: 'Science Fairs & Olympiads', icon: 'flask' },
        { label: 'Participation', value: 'Collaborative Student Projects', icon: 'check' },
      ],
    },
    cta: SCHOOL_LIFE_CTA_COPY,
    sections: [
      {
        title: 'Science Club',
        paragraphs: [
          'The Science Club meets weekly for hands-on experiments and demonstrations beyond the standard syllabus. Students design simple experiments, observe natural phenomena, and present their findings to club members.',
          'Activities include model-making, science quiz preparation, and participation in inter-school science fairs. The club is open to students in Grades 5 to 10 and is supervised by the science faculty.',
        ],
      },
      {
        title: 'Nature & Environment Club',
        paragraphs: [
          'The Environment Club leads the school\'s sustainability initiatives — maintaining the school garden, conducting waste-segregation drives, and organising awareness campaigns on topics such as water conservation and plastic reduction.',
          'Students who join the Environment Club gain a deep appreciation of environmental responsibility and practical experience in community-level action and advocacy.',
        ],
      },
      {
        title: 'Literary & Reading Club',
        paragraphs: [
          'The Literary Club meets regularly to discuss books, share original writing, and explore poetry, short stories, and essays. Members take turns reading aloud, reviewing books, and writing for the school magazine.',
          'The club supports both Kannada and English literature, introducing students to a wide range of authors, genres, and literary traditions.',
        ],
      },
      {
        title: 'Community Service Club',
        paragraphs: [
          'The Community Service Club organises and participates in outreach activities that connect the school to the wider Bengaluru community. Activities include stationery and book donation drives, awareness rallies, and visits to community centres.',
          'Participation in community service develops empathy, leadership, and civic responsibility — values central to the ethos of Bright Way School.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How can a student join a club?',
        answer: 'Club membership is open to students who meet the grade eligibility for each club. Students express interest at the start of each academic term, and the faculty advisor confirms enrolment based on available capacity.',
      },
      {
        question: 'When do clubs meet?',
        answer: 'Most clubs meet once a week during a designated activity period or after school hours. The schedule is confirmed at the start of each term and communicated to members and parents.',
      },
      {
        question: 'Do clubs contribute to school competitions?',
        answer: 'Yes. Many clubs participate in inter-school competitions, fairs, and exhibitions. For example, the Science Club enters school science fairs, and the Literary Club enters essay and poetry competitions.',
      },
      {
        question: 'Are clubs compulsory?',
        answer: 'Club participation is encouraged but not compulsory for all students. The school recommends that every student join at least one club to explore interests beyond the regular syllabus.',
      },
    ],
  },
  'school-life-achievements': {
    title: 'Student Achievements',
    subtitle: 'Celebrating Every Success',
    imageUrl: '/images/gallery/gallery-03.jpg',
    imageAlt: 'Students gathered at the morning assembly receiving recognition',
    paragraphs: [
      'Bright Way School celebrates achievement in every dimension of school life — academic excellence, sporting distinction, artistic talent, community contribution, and personal growth. Every student\'s effort is valued and recognised.',
      'From the classroom toppers of each term to the students who represent the school at city competitions, from the young scientist who wins a fair to the athlete who earns a district medal — their accomplishments bring pride to the school community.',
      'Recognition programmes, honour boards, and award ceremonies are central to Bright Way\'s culture of appreciation. We believe that celebration motivates further effort and reinforces the values of hard work and dedication.',
    ],
    bullets: [
      'Academic Excellence Awards — term toppers and subject merit prizes across all classes',
      'SSLC Board Exam distinctions — recognition of outstanding Class 10 results',
      'Inter-school competition awards — quiz, debate, elocution, drawing, and science fairs',
      'Sports achievements — district, city, and state-level recognition for athletes',
      'Cultural and arts awards — Annual Day and inter-school competition prizes',
      'Character and leadership awards — recognising integrity, service, and responsibility',
      'Science and project exhibition certificates',
      'Perfect attendance recognition at term-end',
    ],
    ...SCHOOL_LIFE_PAGE_COPY,
    stage: {
      ...SCHOOL_LIFE_STAGE_COPY,
      title: 'Student Accolades',
      gradesBadge: 'Excellence Record',
      facts: [
        { label: 'Academic Merit', value: '100% SSLC Board Pass Record', icon: 'graduation-cap' },
        { label: 'Sports Laurels', value: 'District & Interschool Trophies', icon: 'trophy' },
        { label: 'Cultural Honours', value: 'Debate, Art & Dance Medals', icon: 'heart' },
        { label: 'Annual Ceremonies', value: 'Annual Day & Sports Awards', icon: 'calendar' },
        { label: 'Honour Boards', value: 'Class Toppers Displayed', icon: 'book-open' },
        { label: 'Special Honour', value: 'Student of the Year Award', icon: 'target' },
      ],
    },
    cta: SCHOOL_LIFE_CTA_COPY,
    sections: [
      {
        title: 'Academic Recognitions',
        paragraphs: [
          'At the end of each term, students who achieve the top ranks in their class and subject-wise merit in core subjects are recognised through academic awards and merit certificates.',
          'Class 10 (SSLC) students who achieve high distinctions in the Karnataka Board examinations are honoured at a special ceremony attended by teachers, parents, and the school management.',
          'The school\'s honour boards display the names of annual class toppers and SSLC merit holders as a lasting record of academic achievement.',
        ],
      },
      {
        title: 'Sports Achievements',
        paragraphs: [
          'Students who represent Bright Way School at inter-school, city, or district-level sports tournaments and earn placements or medals are honoured at school assembly with certificates and sports trophies.',
          'The annual Sports Day prize distribution ceremony recognises top athletes in track-and-field events, team sports, and the overall sports champion of the year from each school house.',
        ],
      },
      {
        title: 'Arts & Cultural Distinctions',
        paragraphs: [
          'Students who excel in inter-school cultural competitions — including dance, drama, music, elocution, debate, and creative writing — are presented with certificates and trophies at school assemblies.',
          'Outstanding Annual Day performers are recognised by the principal and receive special appreciation at the closing ceremony of each cultural programme.',
        ],
      },
      {
        title: 'Character & Leadership Awards',
        paragraphs: [
          'Beyond marks and medals, Bright Way School recognises the students who embody the school\'s values — honesty, responsibility, kindness, and service to others.',
          'The Best Student Award, given annually, considers academic performance, co-curricular participation, leadership contribution, and character. The recipient represents the best of what Bright Way School nurtures in its students.',
        ],
      },
    ],
    faqs: [
      {
        question: 'When are achievement awards given to students?',
        answer: 'Academic term awards are distributed at the term-end assembly. Sports and cultural awards are presented at Sports Day and Annual Day ceremonies respectively. Special recognitions may be given at regular school assemblies throughout the year.',
      },
      {
        question: 'Are parents invited to achievement ceremonies?',
        answer: 'Yes. Major award events such as Annual Day and Sports Day are attended by parents. For term-end academic awards, parents may be invited based on the event format confirmed by the school office.',
      },
      {
        question: 'Is there a school honour board?',
        answer: 'Yes. The school maintains honour boards displaying the names of class and subject toppers, SSLC merit holders, and sports champions. These are updated at the end of each academic year.',
      },
      {
        question: 'How can parents find out about their child\'s individual achievements?',
        answer: 'Achievement details are shared through the student\'s report card, the student handbook, and direct communication from the class teacher. Parents are encouraged to attend parent-teacher meetings for personalised updates.',
      },
    ],
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
    subtitle: 'Well-Ventilated, Engaging Spaces for Interactive Learning',
    imageUrl: '/images/gallery/gallery-02.jpg',
    imageAlt: 'Students engaged in classroom learning at Bright Way School',
    paragraphs: [
      'The classrooms at Bright Way School are designed to create an environment where children feel alert, engaged, and motivated to learn every single day.',
      'Each room is naturally ventilated with ample daylight, comfortable ergonomic bench seating, wide blackboard surfaces, and dedicated display areas celebrating student charts and project work.',
      'With optimal student-teacher ratios maintained across kindergarten, primary, middle, and high school sections, teachers can give personalised attention and encourage every child to ask questions, debate concepts, and express ideas with confidence.',
    ],
    bullets: [
      'Spacious, well-lit, and airy classrooms with large cross-ventilation windows',
      'Ergonomic desks and seating designed for comfort throughout the school day',
      'Optimal student-teacher ratio ensuring individual academic attention',
      'Classroom display boards featuring student art, scientific charts, and literature',
      'Audio-visual teaching aids and interactive charts supporting visual learning',
      'Dedicated class libraries and reading corners in primary sections',
      'Regular safety inspections, sanitisation, and child-safe infrastructure',
    ],
    ...FACILITIES_PAGE_COPY,
    stage: {
      ...FACILITIES_STAGE_COPY,
      title: 'Classroom Infrastructure',
      gradesBadge: 'K – 10 Sections',
      facts: [
        { label: 'Room Environment', value: 'Natural Light & Cross Ventilation', icon: 'eye' },
        { label: 'Class Size', value: '25 – 30 Students per Section', icon: 'users' },
        { label: 'Furniture', value: 'Ergonomic Desks & Benches', icon: 'check' },
        { label: 'Display Space', value: 'Student Artwork & Charts', icon: 'image' },
        { label: 'Teaching Aids', value: 'Visual & Multimedia Aids', icon: 'monitor' },
        { label: 'Hygiene & Cleanliness', value: 'Daily Campus Sanitisation', icon: 'heart' },
      ],
    },
    cta: FACILITIES_CTA_COPY,
    sections: [
      {
        title: 'Ergonomic & Child-Friendly Design',
        paragraphs: [
          'Desks and benches are proportioned to support healthy posture across all developmental stages, from kindergarteners to high schoolers. Wide aisles allow teachers to move freely between benches during group activities and individual doubt-solving.',
          'Classroom layouts can be swiftly reconfigured for paired reading, group discussions, and team presentations, fostering cooperative learning from an early age.',
        ],
      },
      {
        title: 'Interactive Learning Aids & Visual Displays',
        paragraphs: [
          'Every classroom is equipped with large slate-grade writing boards, bulletin boards, and visual educational charts in Kannada, English, and Science.',
          'Teachers regularly incorporate multimedia resources, educational models, and flashcards to explain abstract concepts in mathematics and science, ensuring learning is vivid and memorable.',
        ],
      },
      {
        title: 'Classroom Culture & Discipline',
        paragraphs: [
          'Our classrooms reflect our ethos of mutual respect, punctuality, and active inquiry. Students take pride in maintaining neat desks and caring for school property.',
          'Class monitors and group leaders rotate periodically, giving every child the opportunity to cultivate responsibility, peer support, and organizational discipline.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the average class size at Bright Way School?',
        answer: 'Classes maintain an optimal strength of 25 to 30 students per section, ensuring our teachers can understand every child\'s strengths and provide individual attention.',
      },
      {
        question: 'Are classrooms naturally ventilated?',
        answer: 'Yes. All classrooms feature large exterior windows providing abundant daylight and constant cross-ventilation, creating a fresh, healthy learning atmosphere.',
      },
      {
        question: 'How are students seated in the classroom?',
        answer: 'Seating arrangements are rotated weekly so every student has an equal view of the board, gets the chance to interact with different classmates, and develops well-rounded social skills.',
      },
      {
        question: 'Are audio-visual teaching tools used in classrooms?',
        answer: 'Yes. Teachers utilize charts, models, and audio-visual presentations during special lessons to make complex concepts in science, history, and geography tangible and exciting.',
      },
    ],
  },
  'facilities-library': {
    title: 'School Library',
    subtitle: 'A Sanctuary of Reading, Knowledge, and Lifelong Discovery',
    imageUrl: '/images/facilities/library.jpg',
    imageAlt: 'Teacher guiding young readers in the peaceful school library',
    paragraphs: [
      'The Bright Way School Library is a quiet, welcoming sanctuary dedicated to fostering a lifelong love for reading, curiosity, and independent research.',
      'Housing a curated collection of over 5,000 volumes — including classic children\'s fiction, non-fiction encyclopedias, Kannada and Hindi literature, biographical accounts, and academic reference guides — the library supports learners from kindergarten to Grade 10.',
      'Regular weekly library periods, guided story circles, and book review activities help young students build deep vocabulary, imaginative thinking, and independent study discipline.',
    ],
    bullets: [
      'Curated collection of 5,000+ books spanning fiction, non-fiction, and reference',
      'Rich multilingual collection in English, Kannada, and Hindi',
      'Dedicated weekly reading and story periods integrated into all grade timetables',
      'Child-friendly reading tables, comfortable chairs, and well-lit study zones',
      'Comprehensive encyclopedias, atlases, science journals, and history chronicles',
      'Lending facility allowing students to borrow books for home reading',
      'Annual Book Week celebrations with storytelling and book review competitions',
    ],
    ...FACILITIES_PAGE_COPY,
    stage: {
      ...FACILITIES_STAGE_COPY,
      title: 'Learning Resource Center',
      gradesBadge: '5,000+ Books',
      facts: [
        { label: 'Total Volumes', value: 'Over 5,000 Curated Titles', icon: 'book-open' },
        { label: 'Languages', value: 'English, Kannada, and Hindi', icon: 'trophy' },
        { label: 'Lending Policy', value: 'Weekly Home Borrowing', icon: 'calendar' },
        { label: 'Timetable Status', value: 'Scheduled Weekly Periods', icon: 'clock' },
        { label: 'Senior Section', value: 'SSLC Reference & Question Banks', icon: 'graduation-cap' },
        { label: 'Junior Programs', value: 'Story Circles & Book Weeks', icon: 'heart' },
      ],
    },
    cta: FACILITIES_CTA_COPY,
    sections: [
      {
        title: 'Diverse & Curated Reading Collection',
        paragraphs: [
          'Our library shelves feature beloved storybooks, folk tales from around the world, historical fiction, poetry anthologies, and illustrated reference volumes suited to every reading level.',
          'Special emphasis is placed on Kannada literary heritage and Indian culture, introducing children to renowned poets, storytellers, and national heroes alongside global literary classics.',
        ],
      },
      {
        title: 'Guided Reading & Research Skills',
        paragraphs: [
          'During scheduled library periods, our librarian guides children in selecting age-appropriate books, learning cataloguing habits, and understanding how to cite reference sources for science and social science projects.',
          'Students are encouraged to maintain reading logs and share book reviews during morning assemblies, inspiring peers to explore new genres.',
        ],
      },
      {
        title: 'Peaceful & Inspiring Ambiance',
        paragraphs: [
          'Designed as a serene sanctuary away from classroom bustle, the library features acoustic comfort, natural breeze, and wide study tables suited for both quiet contemplation and group reference work.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can students borrow books to take home?',
        answer: 'Yes. Students from Grade 1 to 10 are issued library cards allowing them to borrow books on a weekly basis, encouraging regular reading habits at home.',
      },
      {
        question: 'How frequently do students visit the library?',
        answer: 'Every class has at least one scheduled library period per week in the official school timetable, with additional access available during free periods and after-school research hours.',
      },
      {
        question: 'Are reference books available for high school board exams?',
        answer: 'Yes. The library stocks specialized reference guides, previous years\' SSLC examination papers, subject question banks, and science encyclopedias for senior students.',
      },
      {
        question: 'How does the library encourage younger children to read?',
        answer: 'For primary classes, teachers conduct interactive storytelling sessions, picture book readings, and vocabulary-building games to spark curiosity and joy in reading.',
      },
    ],
  },
  'facilities-computer-lab': {
    title: 'Computer Laboratory',
    subtitle: 'Empowering Students with Digital Literacy, Logic, and Computing Skills',
    imageUrl: '/images/facilities/computer-lab.jpg',
    imageAlt: 'Students attentively practicing coding and software applications in the computer lab',
    paragraphs: [
      'In today\'s technology-driven world, digital fluency, computational logic, and responsible technology usage are essential foundations for every child\'s future.',
      'The modern Computer Laboratory at Bright Way School provides students from primary through high school with hands-on, practical access to up-to-date workstations under the guidance of specialized IT faculty.',
      'From foundational keyboarding and office software to introductory programming logic, data handling, and safe internet citizenship, our curriculum equips learners with confidence in navigating the digital realm.',
    ],
    bullets: [
      'Dedicated workstations ensuring 1:1 computer access during practical sessions',
      'High-speed, child-safe, filtered internet connectivity for academic research',
      'Curriculum covering basic computing, typing fluency, and software suites',
      'Introduction to programming fundamentals, algorithms, and logical problem-solving',
      'Comprehensive training in cyber safety, password hygiene, and digital ethics',
      'UPS power backup ensuring uninterrupted practical sessions',
      'Faculty supervision during all laboratory periods to guide and support each learner',
    ],
    ...FACILITIES_PAGE_COPY,
    stage: {
      ...FACILITIES_STAGE_COPY,
      title: 'Digital Learning Center',
      gradesBadge: '1:1 Workstations',
      facts: [
        { label: 'Computer Ratio', value: '1:1 Workstation per Student', icon: 'monitor' },
        { label: 'Curriculum', value: 'Typing, Office Suites & Coding', icon: 'book-open' },
        { label: 'Internet Safety', value: 'Strictly Filtered Educational Web', icon: 'target' },
        { label: 'Power Backup', value: 'Continuous Online UPS Backup', icon: 'check' },
        { label: 'Faculty Guidance', value: 'Specialized IT Instructors', icon: 'users' },
        { label: 'Class Coverage', value: 'Starting from Grade 1', icon: 'graduation-cap' },
      ],
    },
    cta: FACILITIES_CTA_COPY,
    sections: [
      {
        title: 'Age-Calibrated Technology Curriculum',
        paragraphs: [
          'Primary school students (Grades 1–5) start with keyboard familiarity, mouse coordination, basic document editing, and educational creativity tools.',
          'Middle and high school students (Grades 6–10) advance to spreadsheet data analysis, slide presentation creation, flowcharts, fundamental programming constructs, and database concepts.',
        ],
      },
      {
        title: 'Digital Ethics & Internet Safety',
        paragraphs: [
          'We place paramount importance on responsible computing. Students are taught safe internet browsing, identifying online risks, respecting digital intellectual property, and understanding the ethics of technology.',
          'Network filters and administrative safeguards restrict lab systems strictly to educational portals and approved learning resources.',
        ],
      },
      {
        title: 'Practical Project Work',
        paragraphs: [
          'Laboratory sessions are deeply experiential. Students design digital charts, format newsletters, analyze science data in spreadsheets, and create presentations for exhibitions, applying technology directly to their academic subjects.',
        ],
      },
    ],
    faqs: [
      {
        question: 'From which grade do computer classes begin?',
        answer: 'Computer education begins from Grade 1, introducing young children to digital devices gently through interactive typing, drawing tools, and foundational computing concepts.',
      },
      {
        question: 'Does every student get an individual computer during lab sessions?',
        answer: 'Yes. Laboratory batches are scheduled so that each student has dedicated 1:1 access to a workstation during their practical period.',
      },
      {
        question: 'Are lab computers connected to the internet?',
        answer: 'Yes, systems have high-speed internet access that is strictly monitored and filtered to child-safe educational resources under teacher supervision.',
      },
      {
        question: 'What software applications are taught?',
        answer: 'Students learn word processing, spreadsheet modeling, presentation software, paint and graphic tools, and fundamental coding logic aligned with state educational guidelines.',
      },
    ],
  },
  'facilities-sports': {
    title: 'Sports & Play Facilities',
    subtitle: 'Spacious Outdoor Grounds for Physical Vitality, Teamwork, and Play',
    imageUrl: '/images/facilities/playground.jpg',
    imageAlt: 'Expansive school playground surrounded by lush trees with play equipment',
    paragraphs: [
      'Physical vitality, stamina, and team spirit are as essential to child development as academic excellence. Bright Way School is proud of its open, shaded campus grounds that provide ample space for sports, fitness, and energetic play.',
      'Our sports facilities accommodate regular Physical Education classes, inter-house athletic tournaments, team sports like football and volleyball, traditional Indian games including kho-kho and kabaddi, and dedicated playground areas for primary learners.',
      'Under the mentorship of trained PE teachers, students develop physical agility, respect for rules, sportsmanship in victory and defeat, and habits of healthy living that last a lifetime.',
    ],
    bullets: [
      'Spacious outdoor sports grounds for football, volleyball, kho-kho, and kabaddi',
      'Running tracks for sprint races, relay competitions, and athletic coaching',
      'Dedicated primary play zone with child-safe slides, swings, and climbing frames',
      'Comprehensive sports equipment for athletics, team sports, and indoor board games',
      'Scheduled morning yoga, stretching, and physical fitness assemblies',
      'Annual Sports Day arena hosting march-pasts and inter-house competitions',
      'First-aid trained staff and child-safe ground maintenance protocols',
    ],
    ...FACILITIES_PAGE_COPY,
    stage: {
      ...FACILITIES_STAGE_COPY,
      title: 'Outdoor Sports & Athletics',
      gradesBadge: 'Open Campus',
      facts: [
        { label: 'Ground Features', value: 'Multi-Sport Outdoor Arena', icon: 'trophy' },
        { label: 'Field Games', value: 'Football, Kho-Kho, Kabaddi', icon: 'target' },
        { label: 'Track Facilities', value: 'Sprints, Relays & Jump Pit', icon: 'calendar' },
        { label: 'Primary Play', value: 'Child-Safe Slides & Swings', icon: 'heart' },
        { label: 'Morning Fitness', value: 'Structured Yoga & Drills', icon: 'clock' },
        { label: 'First Aid Safety', value: 'Trained Staff on Campus', icon: 'check' },
      ],
    },
    cta: FACILITIES_CTA_COPY,
    sections: [
      {
        title: 'Outdoor Team Sports Courts',
        paragraphs: [
          'Our open grounds feature marked courts for football, volleyball, throwball, kho-kho, and kabaddi. Structured game periods teach students tactical positioning, passing coordination, and the thrill of teamwork.',
          'School team squads conduct regular practice on these grounds, preparing for inter-school competitions and Bengaluru district tournaments.',
        ],
      },
      {
        title: 'Athletics & Track Facilities',
        paragraphs: [
          'Students train in short and medium-distance running, relay races, long jump, and shot put under supervised athletics sessions. Proper warm-up, breathing techniques, and running biomechanics are taught to prevent injuries.',
        ],
      },
      {
        title: 'Primary Play Area & Motor Development',
        paragraphs: [
          'For our younger kindergarten and primary children, our shaded playground area provides age-appropriate play equipment that builds balance, gross motor coordination, and social camaraderie in a joyful, supervised setting.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What sports can students participate in at Bright Way School?',
        answer: 'Students participate in football, volleyball, kho-kho, kabaddi, athletics (sprints, relays, long jump), badminton, and traditional games, alongside chess and carrom.',
      },
      {
        question: 'Is physical education mandatory for all classes?',
        answer: 'Yes. Physical Education is an integral part of the weekly curriculum for all students from Grade 1 to Grade 10 to ensure balanced physical and mental growth.',
      },
      {
        question: 'How does the school ensure student safety on the playground?',
        answer: 'All physical activities are supervised by physical education instructors, playground equipment is checked regularly for safety, and trained first-aid personnel are available on campus.',
      },
      {
        question: 'Are special coaching sessions conducted for school sports teams?',
        answer: 'Yes. Selected school team athletes receive dedicated coaching sessions after regular school hours to prepare for inter-school tournaments.',
      },
    ],
  },
  'facilities-other': {
    title: 'Composite Science Labs & Campus Amenities',
    subtitle: 'Safe, Well-Equipped Spaces Supporting Comprehensive Student Wellbeing',
    imageUrl: '/images/gallery/gallery-04.jpg',
    imageAlt: 'Well-equipped composite science laboratory ready for student practicals',
    paragraphs: [
      'A comprehensive school campus encompasses far more than just standard classrooms and grounds. Bright Way School provides a full suite of supportive facilities that ensure safety, hygiene, scientific curiosity, and cultural expression.',
      'From our fully equipped Composite Science Laboratory where students conduct hands-on physics, chemistry, and biology practicals, to safe drinking water systems, clean sanitation, CCTV campus security, and multipurpose assembly halls — every corner of our campus is designed with student well-being in mind.',
      'Managed by Banashankari Vidya Samsthe and recognized by the Government of Karnataka, our campus meets all safety and regulatory guidelines, providing parents complete peace of mind.',
    ],
    bullets: [
      'Composite Science Laboratory for practical physics, chemistry, and biology experiments',
      'Dedicated multi-purpose assembly area for cultural events, yoga, and gatherings',
      'Pure RO-filtered drinking water stations installed across all floor levels',
      'Clean, separate, hygienic washrooms for boys and girls with dedicated attendants',
      'Campus-wide CCTV surveillance and monitored entry gates for child safety',
      'Well-stocked first-aid and medical care room for immediate health support',
      'Backup power generator supporting uninterrupted classroom and laboratory operations',
      'Environmentally conscious campus with waste segregation and tree-lined walkways',
    ],
    ...FACILITIES_PAGE_COPY,
    stage: {
      ...FACILITIES_STAGE_COPY,
      title: 'Campus Amenities & Safety',
      gradesBadge: 'Safety Certified',
      facts: [
        { label: 'Science Laboratory', value: 'Fully Equipped Composite Lab', icon: 'flask' },
        { label: 'Drinking Water', value: 'Multi-Stage Commercial RO Units', icon: 'heart' },
        { label: 'Campus Security', value: 'CCTV Surveillance & Guard Gates', icon: 'eye' },
        { label: 'Medical Care', value: 'First-Aid Infirmary Room', icon: 'check' },
        { label: 'Multipurpose Hall', value: 'Assemblies & Cultural Staging', icon: 'users' },
        { label: 'Power Infrastructure', value: 'Dedicated Generator Backup', icon: 'monitor' },
      ],
    },
    cta: FACILITIES_CTA_COPY,
    sections: [
      {
        title: 'Composite Science Laboratory',
        paragraphs: [
          'Science comes alive through observation and experiment. Our composite science laboratory is equipped with compound microscopes, test apparatus, chemical reagents, biological specimens, optical benches, and electrical circuit kits.',
          'Under specialized faculty supervision, middle and high school students conduct regular practicals that reinforce classroom textbook theories and develop scientific inquiry.',
        ],
      },
      {
        title: 'Health, Hygiene & Drinking Water',
        paragraphs: [
          'We prioritize student health. Multi-stage RO water purification systems provide clean, potable water throughout the school day. Washroom facilities are cleaned and sanitised continuously by dedicated housekeeping personnel.',
        ],
      },
      {
        title: 'Campus Safety & Security',
        paragraphs: [
          'Student safety is non-negotiable. Monitored entry and exit gates, visitor logbooks, female floor attendants, and comprehensive CCTV camera surveillance ensure a secure and supportive campus environment at all times.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Are science practicals conducted regularly for high school students?',
        answer: 'Yes. Students in Grades 8, 9, and 10 have dedicated weekly laboratory periods where they perform experiments in physics, chemistry, and biology aligned with state board requirements.',
      },
      {
        question: 'What medical and first-aid support is available on campus?',
        answer: 'The school maintains a well-equipped first-aid infirmary with basic medical supplies, and designated staff trained in pediatric first aid to handle any minor injuries or unwellness.',
      },
      {
        question: 'How is campus security maintained?',
        answer: 'The campus features 24/7 security personnel at main gates, strict visitor verification protocols, and CCTV surveillance covering all corridors, grounds, and entry points.',
      },
      {
        question: 'Is safe drinking water provided on campus?',
        answer: 'Yes. Commercial RO water filtration units are installed on every floor, tested regularly to guarantee clean, safe drinking water for all students and staff.',
      },
    ],
  },
};
