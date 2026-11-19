import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { UiIcon, type IconName } from '../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../shared/directives/scroll-reveal.directive';

interface SchoolLifeCard {
  readonly id: string;
  readonly title: string;
  readonly tag: string;
  readonly icon: IconName;
  readonly path: string;
  readonly text: string;
  readonly highlights: readonly string[];
}

@Component({
  selector: 'app-school-life',
  imports: [RouterLink, PageBanner, UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './school-life.html',
  styleUrl: './school-life.scss',
})
export class SchoolLife {
  protected readonly stats = [
    { value: '1981', label: 'Estd. Tradition' },
    { value: '4', label: 'School Houses' },
    { value: '100%', label: 'Student Involvement' },
    { value: '6', label: 'Co-Curricular Streams' },
  ] as const;

  protected readonly sections: readonly SchoolLifeCard[] = [
    {
      id: 'events',
      title: 'Events & Celebrations',
      tag: 'Celebrations & Traditions',
      icon: 'trophy',
      path: '/school-life/events',
      text: 'Annual Day, Sports Meet, festival assemblies, and patriotic ceremonies bringing students, teachers, and families together throughout the academic year.',
      highlights: ['Annual Day', 'Sports Day', 'Festival Assemblies', 'Exhibitions'],
    },
    {
      id: 'activities',
      title: 'Student Activities',
      tag: 'Co-Curricular Life',
      icon: 'users',
      path: '/school-life/student-activities',
      text: 'Morning assemblies, inter-house debates, quizzes, elocution contests, and student leadership roles designed to build confidence, poise, and character.',
      highlights: ['Morning Assembly', 'House Competitions', 'Elocution & Quizzes', 'Leadership Roles'],
    },
    {
      id: 'sports',
      title: 'Sports & Games',
      tag: 'Athletics & Fitness',
      icon: 'target',
      path: '/school-life/sports',
      text: 'Regular Physical Education, track-and-field athletics, team sports like football and kho-kho, morning yoga sessions, and inter-school sports tournaments.',
      highlights: ['Football & Kho-Kho', 'Track & Field', 'Morning Yoga', 'Inter-School Meets'],
    },
    {
      id: 'arts',
      title: 'Arts & Culture',
      tag: 'Creative Expression',
      icon: 'heart',
      path: '/school-life/arts-culture',
      text: 'Visual drawing, painting, classical and folk dance, theatrical drama, and vocal music integrated into the weekly timetable to cultivate creative minds.',
      highlights: ['Drawing & Crafts', 'Classical & Folk Dance', 'Drama & Skits', 'Vocal Music'],
    },
    {
      id: 'clubs',
      title: 'Clubs & Activities',
      tag: 'Student Societies',
      icon: 'book-open',
      path: '/school-life/clubs',
      text: 'Science Club, Eco-Club, Literary Society, and Community Service groups providing students opportunities to explore passions beyond the classroom syllabus.',
      highlights: ['Science Club', 'Eco & Nature Club', 'Literary Society', 'Community Service'],
    },
    {
      id: 'achievements',
      title: 'Student Achievements',
      tag: 'Excellence & Honours',
      icon: 'graduation-cap',
      path: '/school-life/achievements',
      text: 'Celebrating outstanding academic rankings, SSLC board distinctions, district sports medals, and cultural trophies earned by Bright Way students.',
      highlights: ['SSLC Merits', 'Sports Trophies', 'Cultural Medals', 'Honour Boards'],
    },
  ];
}
