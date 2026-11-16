import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

interface StaffMember {
  readonly name: string;
  readonly role: string;
  readonly subject: string;
  readonly qualification: string;
  readonly experience: string;
  /** Filled once the school office supplies an official photograph. */
  readonly imageUrl?: string;
}

@Component({
  selector: 'app-about-management',
  imports: [PageBanner, SectionHeading, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-management.html',
  styleUrl: './about-management.scss',
})
export class AboutManagement {
  protected readonly principal = {
    name: 'Mrs. Sunita Rao',
    role: 'Principal, Bright Way School',
    message:
      'At Bright Way School we believe every child carries a spark that deserves to be noticed and nurtured. Our teachers work to build strong academic foundations while giving equal attention to character, curiosity and confidence.',
    messageSecondary:
      'We encourage our students to ask questions, take part in sport, the arts and cultural activities, and to treat one another with respect. When families and teachers work together, children thrive — and that partnership is at the heart of everything we do here.',
    imageUrl: '',
  };

  protected readonly managementParagraphs: readonly string[] = [
    'Bright Way School is managed by Banashankari Vidya Samsthe, Bengaluru, Karnataka. The management guides academic planning, campus development and school policy with a focus on student welfare.',
    'The school has been part of the community since 1981 and continues to work towards value based, holistic education for every student who joins us.',
  ];

  protected readonly facts = [
    { icon: 'calendar', label: 'Established', value: '1981' },
    { icon: 'users', label: 'Managed by', value: 'Banashankari Vidya Samsthe' },
    { icon: 'check', label: 'Recognition', value: 'Govt. of Karnataka' },
  ] as const;

  protected readonly faculty: readonly StaffMember[] = [
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
  ];

  protected initials(name: string): string {
    return name
      .replace(/^(Mrs|Mr|Ms|Dr)\.?\s+/i, '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }
}
