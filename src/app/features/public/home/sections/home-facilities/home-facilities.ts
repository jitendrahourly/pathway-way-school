import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FacilitiesService } from '../../../../../core/services/facilities.service';
import { HomeContentService } from '../../../../../core/services/home-content.service';
import { FacilityCard } from '../../../../../shared/components/facility-card/facility-card';
import { UiIcon } from '../../../../../shared/components/ui-icon/ui-icon';
import { ScrollRevealDirective } from '../../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-facilities',
  imports: [RouterLink, FacilityCard, UiIcon, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home-facilities.scss',
  templateUrl: './home-facilities.html',
})
export class HomeFacilities {
  protected readonly content = inject(HomeContentService).content;
  protected readonly facilities = inject(FacilitiesService).preview;
}
