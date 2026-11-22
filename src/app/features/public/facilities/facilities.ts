import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FacilitiesContentService } from '../../../core/services/facilities-content.service';
import { FacilitiesService } from '../../../core/services/facilities.service';
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
  private readonly facilitiesService = inject(FacilitiesService);

  protected readonly content = this.service.content;
  protected readonly additional = this.service.additional;

  protected readonly facilities = computed(() =>
    this.service.facilities().map((facility, index) => ({
      ...facility,
      reversed: index % 2 === 1,
    })),
  );

  protected subpageUrl(facility: { id: string; subpageUrl?: string }): string {
    const map: Record<string, string> = {
      'classrooms': '/facilities/classrooms',
      'library': '/facilities/library',
      'computer-laboratory': '/facilities/computer-lab',
      'playground': '/facilities/sports',
      'science-laboratory': '/facilities/other',
    };
    return facility.subpageUrl || map[facility.id] || '/facilities';
  }

  ngOnInit(): void {
    void this.service.load();
    void this.facilitiesService.load();
  }
}
