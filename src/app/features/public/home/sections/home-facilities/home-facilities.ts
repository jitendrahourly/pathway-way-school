import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Facility } from '../../../../../core/models/facility.model';
import { FacilitiesService } from '../../../../../core/services/facilities.service';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

const FALLBACK_IMAGES: readonly string[] = [
  '/images/facilities/library.jpg',
  '/images/facilities/science-lab.jpg',
  '/images/facilities/computer-lab.jpg',
  '/images/facilities/playground.jpg',
];

interface FacilityTile extends Facility {
  readonly imageUrl: string;
}

@Component({
  selector: 'app-home-facilities',
  imports: [RouterLink, UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-facilities.scss',
  templateUrl: './home-facilities.html',
})
export class HomeFacilities implements OnInit {
  private readonly facilitiesService = inject(FacilitiesService);

  protected readonly content = inject(HomeContentService).content;
  protected readonly facilities = computed<readonly FacilityTile[]>(() => {
    const limit = this.content().facilitiesCount;
    const list = this.facilitiesService.active();
    const visible = limit > 0 ? list.slice(0, limit) : list;
    return visible.map((facility, index) => ({
      ...facility,
      imageUrl: facility.imageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    }));
  });

  ngOnInit(): void {
    void this.facilitiesService.load();
  }
}
