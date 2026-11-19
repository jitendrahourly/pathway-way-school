import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CONTENT_PAGES, type ContentPageData } from '../../../core/data/content-pages.seed';
import { PageContentsService } from '../../../core/services/page-contents.service';
import { MediaFrame } from '../../../shared/components/media-frame/media-frame';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { UiIcon, type IconName } from '../../../shared/components/ui-icon/ui-icon';

export interface StageFact {
  readonly label: string;
  readonly value: string;
  readonly icon: IconName;
}

export interface StageDetail {
  readonly headline: string;
  readonly ageBadge: string;
  readonly gradesBadge: string;
  readonly facts: readonly StageFact[];
}

@Component({
  selector: 'app-content-page',
  imports: [PageBanner, MediaFrame, UiIcon, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './content-page.html',
  styleUrl: './content-page.scss',
})
export class ContentPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pageContents = inject(PageContentsService);

  protected readonly slug = this.route.snapshot.data['slug'] ?? '';
  protected readonly page = signal<ContentPageData | undefined>(CONTENT_PAGES[this.slug]);

  protected readonly isAcademics = computed(() => this.slug.startsWith('academics-'));
  protected readonly isSchoolLife = computed(() => this.slug.startsWith('school-life-'));
  protected readonly isFacilities = computed(() => this.slug.startsWith('facilities-'));

  protected readonly pageCrumb = computed(() => {
    if (this.isAcademics()) return 'Academics';
    if (this.isSchoolLife()) return 'School Life';
    if (this.isFacilities()) return 'Facilities';
    return undefined;
  });

  protected readonly pageCrumbLink = computed(() => {
    if (this.isAcademics()) return '/academics';
    if (this.isSchoolLife()) return '/events';
    if (this.isFacilities()) return '/facilities';
    return undefined;
  });

  protected readonly academicNav = [
    {
      label: 'Kindergarten',
      sub: 'Pre-KG – UKG',
      slug: 'academics-kindergarten',
      path: '/academics/kindergarten',
    },
    {
      label: 'Primary School',
      sub: 'Grades 1 – 5',
      slug: 'academics-primary',
      path: '/academics/primary-school',
    },
    {
      label: 'Middle School',
      sub: 'Grades 6 – 8',
      slug: 'academics-middle',
      path: '/academics/middle-school',
    },
    {
      label: 'High School',
      sub: 'Grades 9 & 10',
      slug: 'academics-high',
      path: '/academics/high-school',
    },
  ];

  protected readonly schoolLifeNav = [
    { label: 'Events', slug: 'school-life-events', path: '/school-life/events' },
    { label: 'Student Activities', slug: 'school-life-student-activities', path: '/school-life/student-activities' },
    { label: 'Sports & Games', slug: 'school-life-sports', path: '/school-life/sports' },
    { label: 'Arts & Culture', slug: 'school-life-arts-culture', path: '/school-life/arts-culture' },
    { label: 'Clubs', slug: 'school-life-clubs', path: '/school-life/clubs' },
    { label: 'Achievements', slug: 'school-life-achievements', path: '/school-life/achievements' },
  ];

  protected readonly facilitiesNav = [
    { label: 'Classrooms', slug: 'facilities-classrooms', path: '/facilities/classrooms' },
    { label: 'Library', slug: 'facilities-library', path: '/facilities/library' },
    { label: 'Computer Lab', slug: 'facilities-computer-lab', path: '/facilities/computer-lab' },
    { label: 'Sports Facilities', slug: 'facilities-sports', path: '/facilities/sports' },
    { label: 'Campus Amenities', slug: 'facilities-other', path: '/facilities/other' },
  ];

  protected readonly stageDetails = computed<StageDetail | null>(() => {
    const detailsMap: Record<string, StageDetail> = {
      'academics-kindergarten': {
        headline: 'Early Childhood Foundation',
        ageBadge: 'Ages 3 – 5.5',
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
      'academics-primary': {
        headline: 'Primary Education Excellence',
        ageBadge: 'Ages 6 – 10',
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
      'academics-middle': {
        headline: 'Middle School Transition',
        ageBadge: 'Ages 11 – 13',
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
      'academics-high': {
        headline: 'Secondary School & SSLC',
        ageBadge: 'Ages 14 – 16',
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
    };

    return detailsMap[this.slug] ?? null;
  });

  protected readonly schoolLifeDetails = computed<StageDetail | null>(() => {
    const detailsMap: Record<string, StageDetail> = {
      'school-life-events': {
        headline: 'Events & Celebrations',
        ageBadge: 'All Students',
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
      'school-life-student-activities': {
        headline: 'Student Life & Growth',
        ageBadge: 'Co-Curricular',
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
      'school-life-sports': {
        headline: 'Physical Education & Games',
        ageBadge: 'Fitness & Sports',
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
      'school-life-arts-culture': {
        headline: 'Creative Arts & Culture',
        ageBadge: 'Creative Arts',
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
      'school-life-clubs': {
        headline: 'Student Clubs & Societies',
        ageBadge: 'Enrichment',
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
      'school-life-achievements': {
        headline: 'Student Accolades',
        ageBadge: 'Honours & Awards',
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
    };

    return detailsMap[this.slug] ?? null;
  });

  protected readonly facilitiesDetails = computed<StageDetail | null>(() => {
    const detailsMap: Record<string, StageDetail> = {
      'facilities-classrooms': {
        headline: 'Classroom Infrastructure',
        ageBadge: 'All Classes',
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
      'facilities-library': {
        headline: 'Learning Resource Center',
        ageBadge: 'Open to All',
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
      'facilities-computer-lab': {
        headline: 'Digital Learning Center',
        ageBadge: 'Classes 1 – 10',
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
      'facilities-sports': {
        headline: 'Outdoor Sports & Athletics',
        ageBadge: 'All Ages',
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
      'facilities-other': {
        headline: 'Campus Amenities & Safety',
        ageBadge: 'Whole Campus',
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
    };

    return detailsMap[this.slug] ?? null;
  });

  protected readonly openFaq = signal<number | null>(0);

  ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    try {
      const data = await this.pageContents.load<Partial<ContentPageData>>(this.slug);
      const seed = CONTENT_PAGES[this.slug];
      if (!data) {
        if (seed) this.page.set(seed);
        return;
      }

      const hasPlaceholderText = (paragraphs?: readonly string[]) =>
        paragraphs?.some(
          (p) =>
            p.includes('confirmed by the school office') ||
            p.includes('will be updated soon') ||
            p.includes('published once confirmed'),
        ) ?? false;

      const paragraphs =
        !data.paragraphs || data.paragraphs.length === 0 || hasPlaceholderText(data.paragraphs)
          ? seed?.paragraphs ?? data.paragraphs ?? []
          : data.paragraphs;

      const bullets =
        !data.bullets || data.bullets.length === 0 || (seed?.bullets && data.bullets.length < seed.bullets.length)
          ? seed?.bullets ?? data.bullets
          : data.bullets;

      const sections =
        !data.sections || data.sections.length === 0
          ? seed?.sections ?? data.sections
          : data.sections;

      const faqs =
        !data.faqs || data.faqs.length === 0
          ? seed?.faqs ?? data.faqs
          : data.faqs;

      this.page.set({
        title: data.title ?? seed?.title ?? '',
        subtitle: data.subtitle ?? seed?.subtitle ?? '',
        imageUrl: data.imageUrl ?? seed?.imageUrl ?? '',
        imageAlt: data.imageAlt ?? seed?.imageAlt ?? '',
        paragraphs,
        bullets,
        sections,
        note: data.note ?? seed?.note,
        faqs,
      });
    } catch {
      // Keep the seeded page when Supabase content is unavailable.
    }
  }

  protected toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? null : index));
  }
}
