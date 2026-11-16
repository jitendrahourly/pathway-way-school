import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../shared/directives/scroll-reveal.directive';

interface SchoolLifeSection {
  readonly id: string;
  readonly title: string;
  readonly text: string;
}

@Component({
  selector: 'app-school-life',
  imports: [PageBanner, UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './school-life.html',
  styleUrl: './school-life.scss',
})
export class SchoolLife {
  protected readonly sections: readonly SchoolLifeSection[] = [
    {
      id: 'events',
      title: 'Events & Celebrations',
      text: 'School events and celebrations are part of the academic year. Confirmed dates, programmes and details will be published here once the school office provides them.',
    },
    {
      id: 'activities',
      title: 'Student Activities',
      text: 'Students take part in classroom and co-curricular activities that support learning and personal growth. Activity details will be published once they are confirmed.',
    },
    {
      id: 'sports',
      title: 'Sports & Games',
      text: 'The school provides open space for sport, fitness and team spirit. Specific sports, fixtures and results will be published once confirmed.',
    },
    {
      id: 'arts',
      title: 'Arts & Culture',
      text: 'Arts and cultural activities form part of school life. Programme details will be published once they are confirmed by the school office.',
    },
    {
      id: 'clubs',
      title: 'Clubs & Activities',
      text: 'Club and activity details will be published here once they are confirmed by the school office.',
    },
    {
      id: 'achievements',
      title: 'Student Achievements',
      text: 'Student achievements will be published here once they are confirmed by the school office.',
    },
  ];
}
