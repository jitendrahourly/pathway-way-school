import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademicsContentService } from '../../../core/services/academics-content.service';
import { MediaFrame } from '../../../shared/components/media-frame/media-frame';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';
import { TiltCardDirective } from '../../../shared/directives/tilt-card.directive';

@Component({
  selector: 'app-academics',
  imports: [PageBanner, MediaFrame, SectionHeading, UiIcon, TiltCardDirective, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './academics.scss',
  templateUrl: './academics.html',
})
export class Academics implements OnInit {
  private readonly service = inject(AcademicsContentService);
  protected readonly content = this.service.content;

  protected readonly stages = [
    {
      title: 'Kindergarten',
      stage: 'Early Years',
      grades: 'Pre-KG · LKG · UKG',
      ages: 'Ages 3 – 5.5',
      path: '/academics/kindergarten',
      icon: 'heart' as const,
      tag: 'Foundation',
      description:
        'A joyful play-way beginning fostering curiosity, foundational phonics, sensory exploration, and emotional confidence.',
      highlights: [
        'Play-Way Methodology',
        'Early Literacy & Phonics',
        'Motor Skills & Rhythm',
        'Secure Learning Spaces',
      ],
      accent: 'orange',
    },
    {
      title: 'Primary School',
      stage: 'Primary Education',
      grades: 'Grades 1 to 5',
      ages: 'Ages 6 – 10',
      path: '/academics/primary-school',
      icon: 'book-open' as const,
      tag: 'Discovery',
      description:
        'Strengthening fundamental reading, mathematical thinking, multilingual fluency, and disciplined learning habits.',
      highlights: [
        'Three-Language Foundation',
        'Experiential Math & Science',
        'Dedicated Library Periods',
        'Co-Curricular Arts',
      ],
      accent: 'purple',
    },
    {
      title: 'Middle School',
      stage: 'Middle School',
      grades: 'Grades 6 to 8',
      ages: 'Ages 11 – 13',
      path: '/academics/middle-school',
      icon: 'flask' as const,
      tag: 'Exploration',
      description:
        'Transitioning into distinct sciences, algebra, geometry, laboratory experiments, debates, and independent thinking.',
      highlights: [
        'Specialized Science Streams',
        'Hands-On Laboratory Practicals',
        'IT & Logic Development',
        'House Competitions',
      ],
      accent: 'blue',
    },
    {
      title: 'High School',
      stage: 'Secondary Education',
      grades: 'Grades 9 & 10',
      ages: 'SSLC Board',
      path: '/academics/high-school',
      icon: 'graduation-cap' as const,
      tag: 'Excellence',
      description:
        'Rigorous state board preparation, diagnostic revisions, mock testing, career counselling, and leadership formation.',
      highlights: [
        'Karnataka KSEAB / SSLC Board',
        'Intensive Revision & Mock Exams',
        'Science & Computer Labs',
        'Stream Selection Guidance',
      ],
      accent: 'green',
    },
  ];

  /** Alternates the photograph side across rows that have one. */
  protected readonly sections = computed(() => {
    let mediaCount = 0;
    return this.content().sections.map((section) => ({
      ...section,
      mediaLeft: section.imageUrl ? mediaCount++ % 2 === 1 : false,
    }));
  });

  ngOnInit(): void {
    void this.service.load();
  }
}
