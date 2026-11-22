import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { Facility } from '../../../../../core/models/facility.model';
import { HOME_CONTENT } from '../../../../../core/data/site.seed';
import { FacilitiesService } from '../../../../../core/services/facilities.service';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { HomeFacilities } from './home-facilities';

/** Five published facilities, including the Classrooms card the school added. */
const PUBLISHED: readonly Facility[] = [
  { id: 'classrooms', title: 'Classrooms', description: 'Classrooms', imageUrl: '', imageAlt: 'Classrooms', displayOrder: 1, isActive: true },
  { id: 'library', title: 'Library', description: 'Library', imageUrl: '', imageAlt: 'Library', displayOrder: 2, isActive: true },
  { id: 'science-laboratory', title: 'Science Laboratory', description: 'Science lab', imageUrl: '', imageAlt: 'Science lab', displayOrder: 3, isActive: true },
  { id: 'computer-laboratory', title: 'Computer Laboratory', description: 'Computer lab', imageUrl: '', imageAlt: 'Computer lab', displayOrder: 4, isActive: true },
  { id: 'playground', title: 'Playground', description: 'Playground', imageUrl: '', imageAlt: 'Playground', displayOrder: 5, isActive: true },
];

describe('HomeFacilities', () => {
  /** Builds the section with a fixed set of facilities and a chosen card count. */
  function createWithCount(count: number): HomeFacilities {
    const facilitiesMock = { active: () => PUBLISHED, load: () => Promise.resolve() } as unknown as FacilitiesService;
    const homeContentMock = {
      content: () => ({ ...HOME_CONTENT, facilitiesCount: count }),
    } as unknown as HomeContentService;

    TestBed.configureTestingModule({
      imports: [HomeFacilities],
      providers: [
        provideRouter([]),
        { provide: FacilitiesService, useValue: facilitiesMock },
        { provide: HomeContentService, useValue: homeContentMock },
      ],
    });

    // No detectChanges: ngOnInit (and the Supabase load) never run, but the
    // computed reads the mocked services directly.
    return TestBed.createComponent(HomeFacilities).componentInstance;
  }

  it('renders the configured number of facility cards, including the fifth', () => {
    const c = createWithCount(5) as unknown as { facilities: () => readonly unknown[] };
    expect(c.facilities().length).toBe(5);
  });

  it('caps the section at a lower admin limit', () => {
    const c = createWithCount(4) as unknown as { facilities: () => readonly unknown[] };
    expect(c.facilities().length).toBe(4);
  });

  it('shows every published facility when the limit is 0', () => {
    const c = createWithCount(0) as unknown as { facilities: () => readonly unknown[] };
    expect(c.facilities().length).toBe(PUBLISHED.length);
  });

  it('never shows more facilities than are published', () => {
    const c = createWithCount(12) as unknown as { facilities: () => readonly unknown[] };
    expect(c.facilities().length).toBe(PUBLISHED.length);
  });
});
