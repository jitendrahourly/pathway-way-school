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
      'As a recognised institution managed by Banashankari Vidya Samsthe and affiliated with the Karnataka State Board, the school combines rigorous classroom learning with practical laboratory experience, co-curricular activities, sport, the arts, and character education.',
    ],
    imageUrl: '/images/gallery/gallery-02.jpg',
    imageAlt: 'Students learning together in a classroom',
  },
  cards: [
    {
      icon: 'users',
      label: 'Classes Offered',
      value: 'Kindergarten to Class 10',
      note: 'Comprehensive education from early childhood through SSLC board completion.',
      status: 'confirmed',
    },
    {
      icon: 'book-open',
      label: 'Curriculum & Board',
      value: 'State Board (Karnataka)',
      note: 'Recognised by the Government of Karnataka following state educational standards.',
      status: 'confirmed',
    },
    {
      icon: 'target',
      label: 'Teaching Approach',
      value: 'Holistic & Experiential',
      note: 'Concept-first learning integrating classroom studies, labs, and co-curriculars.',
      status: 'confirmed',
    },
    {
      icon: 'check',
      label: 'Assessment System',
      value: 'Continuous & Comprehensive',
      note: 'Formative reviews, periodic evaluations, and dedicated remedial support.',
      status: 'confirmed',
    },
  ],
  sections: [
    {
      id: 'classes',
      title: 'Classes & Academic Levels',
      paragraphs: [
        'Bright Way School provides continuous, structured education starting from the joyful exploratory years of Kindergarten all the way to Grade 10 secondary school graduation.',
        'Each educational stage is tailored to the developmental needs of the child, ensuring age-appropriate academic challenge, emotional security, and steady progression.',
      ],
      bullets: [
        'Kindergarten: Pre-KG, LKG, and UKG (Ages 3 to 5.5 years)',
        'Primary School: Grades 1 to 5 (Building core foundations in literacy and numeracy)',
        'Middle School: Grades 6 to 8 (Deepening subject knowledge, laboratory inquiry, and logic)',
        'High School: Grades 9 and 10 (Secondary School Leaving Certificate / SSLC preparation)',
      ],
      status: 'confirmed',
    },
    {
      id: 'curriculum',
      title: 'Curriculum & State Affiliation',
      paragraphs: [
        'The school curriculum adheres to the comprehensive standards prescribed by the Department of School Education, Government of Karnataka.',
        'Our academic framework places strong emphasis on language mastery, analytical mathematics, empirical sciences, and civic consciousness, enriched with modern teaching aids and real-world applications.',
      ],
      bullets: [
        'Syllabus formulated by the Karnataka School Examination and Assessment Board (KSEAB)',
        'Three-language formula ensuring proficiency in English, Kannada, and Hindi',
        'Strong conceptual foundation in Mathematics, General Science, and Social Science',
        'Environmental studies, health education, and digital computer literacy from primary grades',
      ],
      imageUrl: '/images/facilities/library.jpg',
      imageAlt: 'Teacher reading with students in the school library',
      status: 'confirmed',
    },
    {
      id: 'methodology',
      title: 'Teaching Methodology',
      paragraphs: [
        'Teaching at Bright Way School moves beyond passive textbook memorization. Our educators employ interactive, inquiry-based methods that encourage students to observe, question, discuss, and understand the core principles behind every lesson.',
        'Classrooms are equipped to support diverse learning styles through visual charts, digital content, interactive models, and collaborative group exercises.',
      ],
      bullets: [
        'Inquiry-driven lessons that encourage students to ask questions and express ideas',
        'Regular hands-on experiments in dedicated science and computer laboratories',
        'Project-based assignments that connect theoretical concepts to daily life',
        'Calibrated homework designed to reinforce learning without overburdening family time',
      ],
      status: 'confirmed',
    },
    {
      id: 'learning',
      title: 'Holistic Learning Approach',
      paragraphs: [
        'Learning at Bright Way School is planned around the overall development of every student.',
        'Classroom teaching is supported by co-curricular activities, sport, the arts and cultural events, with an emphasis on discipline, ethics and leadership.',
      ],
      bullets: [
        'Holistic learning addressing academic, emotional, and social development',
        'Weekly physical education, sports coaching, athletics, and morning yoga',
        'Value-based education cultivating honesty, respect, empathy, and civic responsibility',
        'Inter-house competitions fostering healthy camaraderie and team spirit',
      ],
      imageUrl: '/images/facilities/computer-lab.jpg',
      imageAlt: 'Students working at computers in the computer laboratory',
      status: 'confirmed',
    },
    {
      id: 'activities',
      title: 'Academic Activities & Enrichment',
      paragraphs: [
        'Throughout the academic year, students participate in a rich calendar of co-curricular and academic enrichment programmes that make learning memorable and dynamic.',
        'These activities provide practical platforms for students to showcase their creativity, critical thinking, elocution skills, and scientific curiosity.',
      ],
      bullets: [
        'Annual Science Exhibition showcasing student-built working models and experiments',
        'Literary club activities including debates, creative writing, and elocution contests',
        'Inter-house mathematics, general knowledge, and environmental quizzes',
        'Special assembly presentations, festival celebrations, and educational field trips',
      ],
      imageUrl: '/images/gallery/gallery-01.jpg',
      imageAlt: 'Students in uniform participating actively in school events',
      status: 'confirmed',
    },
    {
      id: 'assessment',
      title: 'Assessment & Continuous Progress',
      paragraphs: [
        'Our assessment framework is designed to support learning rather than generate examination anxiety. Continuous and comprehensive evaluations allow teachers to monitor every student’s conceptual clarity, diagnostic strengths, and areas requiring additional guidance.',
        'Regular parent-teacher interactions ensure transparent reporting and mutual collaboration between home and school.',
      ],
      bullets: [
        'Periodic formative unit assessments and structured term-end examinations',
        'Detailed diagnostic feedback focusing on concept mastery and problem-solving',
        'Dedicated remedial classes for students needing additional academic support',
        'Structured parent-teacher meetings to celebrate growth and plan next steps',
      ],
      status: 'confirmed',
    },
  ],
};
