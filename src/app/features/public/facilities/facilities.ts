import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { FacilitiesContentService } from '../../../core/services/facilities-content.service';
import { FacilityCard } from '../../../shared/components/facility-card/facility-card';
import { MediaFrame } from '../../../shared/components/media-frame/media-frame';
import { PageBanner } from '../../../shared/components/page-banner/page-banner';
import { SectionHeading } from '../../../shared/components/section-heading/section-heading';
import { UiIcon } from '../../../shared/components/ui-icon/ui-icon';

@Component({
  selector: 'app-facilities',
  imports: [PageBanner, SectionHeading, FacilityCard, MediaFrame, UiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './facilities.scss',
  templateUrl: './facilities.html',
})
export class Facilities implements OnInit {
  private readonly service = inject(FacilitiesContentService);

  protected readonly content = this.service.content;
  protected readonly additional = this.service.additional;
  protected readonly facilities = computed(() =>
    this.service.facilities().map((facility, index) => ({
      ...facility,
      label: String(index + 1).padStart(2, '0'),
      reversed: index % 2 === 1,
    })),
  );

  ngOnInit(): void {
    void this.service.load();
  }
}
