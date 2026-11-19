import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FacilitiesContentService } from '../../../core/services/facilities-content.service';
import { FacilityCard } from '../../../shared/components/facility-card/facility-card';
import { MediaFrame } from '../../../shared/components/media-frame/media-frame';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

@Component({
  selector: 'app-facilities',
  imports: [RouterLink, PageBanner, SectionHeading, FacilityCard, MediaFrame, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './facilities.scss',
  templateUrl: './facilities.html',
})
export class Facilities implements OnInit {
  private readonly service = inject(FacilitiesContentService);

  protected readonly content = this.service.content;
  protected readonly additional = this.service.additional;

  protected readonly stats = [
    { value: 'K – 10', label: 'Spacious Classrooms' },
    { value: '5,000+', label: 'Library Volumes' },
    { value: '1:1', label: 'Computer Workstations' },
    { value: 'Open', label: 'Sports Grounds' },
  ] as const;

  protected readonly facilities = computed(() =>
    this.service.facilities().map((facility, index) => ({
      ...facility,
      label: String(index + 1).padStart(2, '0'),
      reversed: index % 2 === 1,
    })),
  );

  protected subpageUrl(facilityId: string): string {
    const map: Record<string, string> = {
      'classrooms': '/facilities/classrooms',
      'library': '/facilities/library',
      'computer-laboratory': '/facilities/computer-lab',
      'playground': '/facilities/sports',
      'science-laboratory': '/facilities/other',
    };
    return map[facilityId] ?? '/facilities';
  }

  ngOnInit(): void {
    void this.service.load();
  }
}
